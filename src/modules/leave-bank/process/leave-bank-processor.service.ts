import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import ExcelJS, { Worksheet } from 'exceljs';
import { Types } from 'mongoose';

import { transformRole } from '../../../shared/utils/unified-transform.utils';
import { ATTENDANCE, FILE } from '../../../types/constants/error-messages.constants';
import { Months } from '../../../types/constants/leave-bank.constants';
import { COLUMNS, DAYS, RecordStatus } from '../../../types/enums/leave-bank.enums';
import { IEmployeeData, IProcessResult } from '../../../types/interfaces/leave-bank.interface';
import { UserService } from '../../user/user.service';
import { BankValidator } from '../core/validators/leave-bank.validator';
import { ExcelHelper } from '../helpers/excel-parsing.helper';
import { ProcessResultBuilder } from '../helpers/process-result.builder';
import { LeaveBankRepository } from '../leave-bank.repository';
import { ProfileService } from '@/modules/profile/profile.service';
@Injectable()
export class BankRecordService implements OnModuleInit {
  private readonly logger = new Logger(BankRecordService.name);
  private profileService: ProfileService;
  private userService: UserService;
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly leaveBankRepository: LeaveBankRepository,
  ) {}
  async onModuleInit(): Promise<void> {
    try {
      this.profileService = await this.moduleRef.resolve(ProfileService, undefined, {
        strict: false,
      });
      this.userService = await this.moduleRef.resolve(UserService, undefined, {
        strict: false,
      });
    } catch (error) {
      this.logger.error('Failed to resolve ProfileService', error);
      throw new HttpException('Failed to initialize processor service', HttpStatus.OK);
    }
  }
  async processBank(
    fileBuffer: Buffer,
    targetMonth?: string,
    filename?: string,
  ): Promise<IProcessResult> {
    try {
      const processingMonth = targetMonth || (await this.detectBankData(fileBuffer));
      const workbook = new ExcelJS.Workbook();
      const buffer: any = ExcelHelper.bankBuffer(fileBuffer);
      await workbook.xlsx.load(buffer);
      const dataSheet = workbook.getWorksheet('Data');
      if (!dataSheet) {
        throw new HttpException(
          `${FILE.PROCESSING_FAILED}: Data sheet not found in Excel file`,
          HttpStatus.OK,
        );
      }
      const federalHolidays = ExcelHelper.extractHolidays(dataSheet);
      const detectedYear =
        this.detectYearFromData(federalHolidays, filename) || new Date().getFullYear();
      this.logger.log(`Year detection - Filename: ${filename}, Detected year: ${detectedYear}`);
      const baseResult = ProcessResultBuilder.createEmpty();
      const existingCount = await this.leaveBankRepository.countByYear(detectedYear);
      baseResult.hasExistingRecords = existingCount > 0;
      const processResult = await this.processBankData(
        dataSheet,
        baseResult,
        federalHolidays,
        processingMonth,
        detectedYear,
      );
      return ProcessResultBuilder.merge(baseResult, processResult);
    } catch (error) {
      if (error instanceof HttpException || error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to process Excel file', error);
      throw new HttpException(`${FILE.PROCESSING_FAILED}: ${error.message}`, HttpStatus.OK);
    }
  }
  private async processBankData(
    worksheet: Worksheet,
    baseResult: IProcessResult,
    holidays: any,
    currentMonth: string,
    detectedYear: number,
  ): Promise<any> {
    try {
      const employeeData = await this.extractBankEmployee(
        worksheet,
        holidays,
        baseResult,
        detectedYear,
      );
      if (employeeData.length === 0) {
        this.logger.warn('No valid employee data found in worksheet');
        return ProcessResultBuilder.createEmpty();
      }
      const profileMap = await this.fetchUserProfiles(employeeData);
      const recordsToProcess = await this.prepareBankRecords(
        employeeData,
        profileMap,
        baseResult,
        detectedYear,
      );
      if (recordsToProcess.length > 0) {
        const uploadBatchId = new Types.ObjectId().toString();
        return await this.bulkBankUpsert(
          recordsToProcess,
          uploadBatchId,
          currentMonth,
          detectedYear,
        );
      }
      return ProcessResultBuilder.createEmpty();
    } catch (error) {
      this.logger.error('Failed to process sheet data', error);
      throw error;
    }
  }
  private async bulkBankUpsert(
    records: any[],
    uploadBatchId: string,
    currentMonth: string,
    detectedYear: number,
  ): Promise<any> {
    try {
      const existingRecordMap = await this.fetchBankEmployee(records);
      const counts = ProcessResultBuilder.initializeCounts();
      const processedUserDetails: any[] = [];
      const bulkOperations: any[] = [];
      for (const record of records) {
        try {
          const key = record.employeeId;
          const existing = existingRecordMap.get(key);
          this.logger.log(
            `Processing record - Key: ${key}, Has existing: ${!!existing}, Detected year: ${record.year}`,
          );
          if (existing) {
            this.logger.log(
              `Updating existing record for ${record.employeeId}, existing year: ${existing.year}, new detected year: ${record.year}`,
            );
            this.handleExistingBank(
              record,
              existing,
              currentMonth,
              uploadBatchId,
              bulkOperations,
              processedUserDetails,
              counts,
            );
          } else {
            const anyExistingRecord = await this.leaveBankRepository.findAll({
              employeeId: record.employeeId,
            });
            if (anyExistingRecord.length > 0) {
              this.logger.log(
                `Found existing record for ${record.employeeId} during double-check, updating instead of creating new`,
              );
              const mostRecentRecord = anyExistingRecord.reduce((prev, current) =>
                current.year > prev.year ? current : prev,
              );
              this.handleExistingBank(
                record,
                mostRecentRecord,
                currentMonth,
                uploadBatchId,
                bulkOperations,
                processedUserDetails,
                counts,
              );
            } else {
              this.logger.log(`Creating new record for ${record.employeeId}, year ${record.year}`);
              this.handleNewRecord(
                record,
                uploadBatchId,
                bulkOperations,
                processedUserDetails,
                counts,
              );
            }
          }
        } catch (error) {
          this.logger.error(`Failed to process record for ${record.employeeId}`, error);
          counts.errors++;
          processedUserDetails.push(this.createBankError(record, error, detectedYear));
        }
      }
      if (bulkOperations.length > 0) {
        try {
          await this.leaveBankRepository.bulkUpsert(bulkOperations);
          this.logger.log(`Bulk upsert completed: ${bulkOperations.length} operations`);
        } catch (error: any) {
          if (error.code === 11000 && error.message.includes('userId_1_year_1')) {
            this.logger.error('Duplicate key error detected, attempting to handle gracefully...');
            const failedOperations = this.extractFailedOperations(error, bulkOperations);
            if (failedOperations.length > 0) {
              await this.retryFailedOperationsAsUpdates(
                failedOperations,
                records,
                uploadBatchId,
                currentMonth,
                counts,
                processedUserDetails,
              );
            }
          } else {
            throw error;
          }
        }
      }
      return ProcessResultBuilder.createBulkResult(records.length, counts, processedUserDetails);
    } catch (error) {
      this.logger.error('Bulk upsert failed', error);
      throw new HttpException(`${ATTENDANCE.UPDATE_FAILED}: ${error.message}`, HttpStatus.OK);
    }
  }
  private handleExistingBank(
    record: any,
    existing: any,
    currentMonth: string,
    uploadBatchId: string,
    bulkOperations: any[],
    processedUserDetails: any[],
    counts: any,
  ): void {
    const currentYearStr = record.year.toString();
    const hasNewYearData = this.hasNewYearData(existing, currentYearStr);
    const hasNewMonth = this.hasNewMonthDataNested(existing, currentMonth, record, currentYearStr);
    const hasChangedData = this.hasDataChangesNested(
      existing,
      record,
      currentMonth,
      currentYearStr,
    );
    const mergedMonthlyData = {
      ...existing.monthlyData,
    };
    mergedMonthlyData[currentYearStr] = record.monthlyData[currentYearStr];
    const updatedRecord = {
      ...record,
      monthlyData: mergedMonthlyData,
      year: record.year,
      role: record.role,
      designation: record.designation,
      pictureUrl: record.pictureUrl,
      teamLeadDetail: record.teamLeadDetail,
    };
    let operationConfig: {
      status: string;
      isNewRecord: boolean;
      isUpdatedRecord: boolean;
      isNewMonthData: boolean;
      newlyAddedMonth: string;
    };
    if (hasNewYearData) {
      operationConfig = {
        status: RecordStatus.UPDATED,
        isNewRecord: false,
        isUpdatedRecord: true,
        isNewMonthData: false,
        newlyAddedMonth: 'null',
      };
      counts.updated++;
    } else if (hasNewMonth) {
      operationConfig = {
        status: RecordStatus.NEW,
        isNewRecord: false,
        isUpdatedRecord: false,
        isNewMonthData: true,
        newlyAddedMonth: currentMonth,
      };
      counts.newMonth++;
    } else if (hasChangedData) {
      operationConfig = {
        status: RecordStatus.UPDATED,
        isNewRecord: false,
        isUpdatedRecord: true,
        isNewMonthData: false,
        newlyAddedMonth: 'null',
      };
      counts.updated++;
    } else {
      operationConfig = {
        status: RecordStatus.UNCHANGED,
        isNewRecord: false,
        isUpdatedRecord: false,
        isNewMonthData: false,
        newlyAddedMonth: 'null',
      };
      counts.unchanged++;
    }
    bulkOperations.push({
      updateOne: {
        filter: { _id: existing._id },
        update: {
          $set: {
            ...updatedRecord,
            ...operationConfig,
            lastUploadDate: new Date(),
            uploadBatchId,
            updatedAt: new Date(),
          },
        },
      },
    });
    processedUserDetails.push({
      employeeId: record.employeeId,
      name: record.name,
      year: updatedRecord.year.toString(),
      status: operationConfig.status,
      isNewRecord: operationConfig.isNewRecord,
      isUpdatedRecord: operationConfig.isUpdatedRecord,
      isNewMonthData: operationConfig.isNewMonthData,
      newlyAddedMonth: operationConfig.newlyAddedMonth,
      dataChanged: hasChangedData || hasNewMonth || hasNewYearData,
    });
  }
  private handleNewRecord(
    record: any,
    uploadBatchId: string,
    bulkOperations: any[],
    processedUserDetails: any[],
    counts: any,
  ): void {
    bulkOperations.push({
      insertOne: {
        document: {
          ...record,
          _id: new Types.ObjectId(),
          isNewRecord: true,
          isUpdatedRecord: false,
          isNewMonthData: false,
          newlyAddedMonth: 'null',
          lastUploadDate: new Date(),
          uploadBatchId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    });
    counts.created++;
    processedUserDetails.push({
      employeeId: record.employeeId,
      name: record.name,
      year: record.year,
      status: 'created',
      isNewRecord: true,
      isUpdatedRecord: false,
      isNewMonthData: false,
      newlyAddedMonth: 'null',
      dataChanged: true,
    });
  }
  private async fetchBankEmployee(records: any[]): Promise<Map<string, any>> {
    const employeeIds = records.map(r => r.employeeId);
    const detectedYear = records[0]?.year || new Date().getFullYear();
    this.logger.log(
      `Fetching existing records - EmployeeIds: ${employeeIds.join(', ')}, Year: ${detectedYear}`,
    );
    const existingRecords = await this.leaveBankRepository.findAll({
      employeeId: { $in: employeeIds },
    });
    this.logger.log(`Found ${existingRecords.length} existing records across all years`);
    const existingRecordMap = new Map();
    existingRecords.forEach(record => {
      const key = record.employeeId;
      const existing = existingRecordMap.get(key);
      if (!existing || record.year > existing.year) {
        existingRecordMap.set(key, record);
        this.logger.log(`Set record for EmployeeID: ${key}, Record year: ${record.year}`);
      }
    });
    return existingRecordMap;
  }
  private async extractBankEmployee(
    worksheet: Worksheet,
    holidays: any,
    result: IProcessResult,
    detectedYear: number,
  ): Promise<IEmployeeData[]> {
    const employeeData: IEmployeeData[] = [];
    for (let rowNum = DAYS.DATA_START_ROW; rowNum <= worksheet.rowCount; rowNum++) {
      const row = worksheet.getRow(rowNum);
      if (!BankValidator.isValidDataRow(row)) continue;
      try {
        const data = this.parseEmployeeRow(row, holidays, rowNum);
        if (data?.employeeId && data.employeeId !== 'Error') {
          employeeData.push(data);
        } else {
          this.handleInvalidRow(rowNum, data, result, detectedYear);
        }
      } catch (error) {
        this.logger.error(`Error parsing row ${rowNum}`, error);
        this.handleRowError(result);
      }
    }
    this.logger.log(`Extracted ${employeeData.length} employee records from Excel`);
    return employeeData;
  }
  private parseEmployeeRow(row: ExcelJS.Row, holidays: any, rowNum: number): IEmployeeData | null {
    const department = ExcelHelper.getCellValue(row.getCell(COLUMNS.DEPARTMENT));
    const name = ExcelHelper.getCellValue(row.getCell(COLUMNS.NAME));
    const employeeId = ExcelHelper.getCellValue(row.getCell(COLUMNS.EMPLOYEE_ID));
    const email = ExcelHelper.getCellValue(row.getCell(COLUMNS.EMAIL));
    if (!name || !employeeId || name === 'Error' || employeeId === 'Error') {
      return null;
    }
    const monthlyData = ExcelHelper.extractAllMonthlyData(row);
    BankValidator.validateMonthlyData(monthlyData, employeeId, rowNum);
    return {
      department,
      name,
      employeeId,
      email,
      role: '',
      designation: '',
      pictureUrl: '',
      teamLeadDetail: {
        userId: '',
        email: '',
        role: '',
        designation: '',
        name: '',
      },
      monthlyData: monthlyData as any,
      summary: ExcelHelper.extractSummaryData(row),
      rowNumber: rowNum,
    };
  }
  private async fetchUserProfiles(employeeDataList: IEmployeeData[]): Promise<Map<string, any>> {
    const profileMap = new Map();
    const employeeIds = employeeDataList
      .map(ed => ed.employeeId)
      .filter((id): id is string => !!id && id !== 'Error');
    try {
      if (employeeIds.length > 0) {
        const profilesById = await this.profileService.findProfilesByEmployeeIds(employeeIds);
        profilesById.forEach(profile => {
          if (profile?.employeeId) {
            profileMap.set(profile.employeeId, profile);
          }
        });
      }
      const remainingData = employeeDataList.filter(
        ed => !profileMap.has(ed.employeeId) && ed.email,
      );
      if (remainingData.length > 0) {
        const remainingEmails = remainingData.map(ed => ed.email).filter(Boolean);
        const profilesByEmail = await this.profileService.findProfilesByEmails(remainingEmails);
        profilesByEmail.forEach(profile => {
          if (profile?.email) {
            profileMap.set(profile.email, profile);
          }
        });
      }
      this.logger.log(`Fetched ${profileMap.size} user profiles`);
      this.logger.log(`Remaining data: ${remainingData.length}`);
      return profileMap;
    } catch (error) {
      this.logger.error('Failed to fetch user profiles', error);
      return profileMap;
    }
  }
  private async prepareBankRecords(
    employeeData: IEmployeeData[],
    profileMap: Map<string, any>,
    result: IProcessResult,
    detectedYear: number,
  ): Promise<IEmployeeData[]> {
    const records: any[] = [];
    const userIds = employeeData
      .map(empData => {
        const userProfile = profileMap.get(empData.employeeId) || profileMap.get(empData.email);
        return userProfile?.userId || userProfile?._id;
      })
      .filter(Boolean);
    const userDetailsMap = new Map();
    if (userIds.length > 0) {
      try {
        const userDetailsList = await Promise.all(
          userIds.map(userId =>
            this.userService.getUser({ _id: userId }).catch(error => {
              this.logger.warn(`Failed to fetch user details for ${userId}`, error);
              return null;
            }),
          ),
        );
        userDetailsList.forEach(userDetails => {
          if (userDetails?._id) {
            userDetailsMap.set(userDetails._id.toString(), userDetails);
          }
        });
      } catch (error) {
        this.logger.error('Failed to batch fetch user details', error);
      }
    }
    for (const empData of employeeData) {
      try {
        const userProfile = profileMap.get(empData.employeeId) || profileMap.get(empData.email);
        if (!userProfile) {
          this.handleMissingProfile(empData, result, detectedYear);
          continue;
        }
        let teamLeadDetail = null;
        const userId = userProfile.userId || userProfile._id;
        if (userId) {
          const userDetails = userDetailsMap.get(userId.toString());
          if (userDetails?.department?.teamLeadDetail) {
            teamLeadDetail = {
              userId: userDetails.department?.teamLeadDetail?.userId,
              email: userDetails.department?.teamLeadDetail?.email,
              role: transformRole(userDetails.department?.teamLeadDetail?.role),
              designation: userDetails.department?.teamLeadDetail?.designation,
              name:
                userDetails.department?.teamLeadDetail?.fullName ||
                userDetails.department?.teamLeadDetail?.firstName,
            };
          }
        }
        const currentYearStr = detectedYear.toString();
        const monthlyData = {
          january: empData.monthlyData.january,
          february: empData.monthlyData.february,
          march: empData.monthlyData.march,
          april: empData.monthlyData.april,
          may: empData.monthlyData.may,
          june: empData.monthlyData.june,
          july: empData.monthlyData.july,
          august: empData.monthlyData.august,
          september: empData.monthlyData.september,
          october: empData.monthlyData.october,
          november: empData.monthlyData.november,
          december: empData.monthlyData.december,
        };
        const multiYearMonthlyData = {
          [currentYearStr]: {
            months: monthlyData,
            summary: empData.summary,
          },
        };
        const record = {
          userId: userProfile.userId || userProfile._id || ' ',
          profileId: userProfile.profile?._id || userProfile._id,
          year: detectedYear,
          employeeId: userProfile.employeeId,
          name: userProfile.fullName,
          email: userProfile.email || userProfile.profile?.email,
          department: this.getDepartmentName({ employeeData: empData, userProfile }),
          role: userProfile.role || userProfile.profile?.role,
          designation: userProfile.designation || userProfile.profile?.designation,
          pictureUrl:
            userProfile.profilePicture?.url || userProfile.profile?.profilePicture?.url || '',
          teamLeadDetail: teamLeadDetail,
          monthlyData: multiYearMonthlyData,
          summary: empData.summary,
        };
        records.push(record);
      } catch (error) {
        this.logger.error(`Failed to prepare record for ${empData.employeeId}`, error);
        this.handleRowError(result);
      }
    }
    this.logger.log(`Prepared ${records.length} records for processing`);
    return records;
  }
  private detectYearFromData(holidays: any, filename?: string): number | null {
    if (filename) {
      const yearFromFilename = this.extractYearFromFilename(filename);
      if (yearFromFilename) {
        this.logger.log(`Detected year ${yearFromFilename} from filename: ${filename}`);
        return yearFromFilename;
      }
    }
    const yearFromHolidays = this.detectYearFromHolidays(holidays);
    if (yearFromHolidays) {
      this.logger.log(`Detected year ${yearFromHolidays} from holiday data`);
      return yearFromHolidays;
    }
    const currentYear = new Date().getFullYear();
    this.logger.log(`Using current year ${currentYear} as fallback`);
    return currentYear;
  }
  private extractYearFromFilename(filename: string): number | null {
    const yearMatch = filename.match(/(20\d{2})/i);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      if (year >= 2000 && year <= 2030) {
        return year;
      }
    }
    return null;
  }
  private detectYearFromHolidays(holidays: any): number | null {
    const usHolidays = [holidays.usOff1, holidays.usOff2, holidays.usOff3, holidays.usOff4];
    const cadHolidays = [holidays.cadOff1, holidays.cadOff2, holidays.cadOff3, holidays.cadOff4];
    const allHolidays = [...usHolidays, ...cadHolidays];
    for (const holiday of allHolidays) {
      if (holiday && holiday instanceof Date && !isNaN(holiday.getTime())) {
        return holiday.getFullYear();
      }
    }
    return null;
  }
  private async detectBankData(fileBuffer: Buffer): Promise<string> {
    try {
      const workbook = new ExcelJS.Workbook();
      const buffer: any = ExcelHelper.bankBuffer(fileBuffer);
      await workbook.xlsx.load(buffer);
      const dataSheet = workbook.getWorksheet('Data');
      if (!dataSheet) {
        throw new HttpException('Data sheet not found in Excel file', HttpStatus.OK);
      }
      let latestMonthWithData = 'january';
      const sampleRowCount = Math.min(DAYS.SAMPLE_ROWS_FOR_DETECTION, dataSheet.rowCount);
      for (let rowNum = DAYS.DATA_START_ROW; rowNum <= sampleRowCount; rowNum++) {
        const row = dataSheet.getRow(rowNum);
        for (let i = Months.length - 1; i >= 0; i--) {
          const month = Months[i];
          const monthData = ExcelHelper.extractMonthData(row, month);
          if (monthData) {
            BankValidator.hasMonthData(monthData);
            latestMonthWithData = month;
            break;
          }
        }
      }
      this.logger.log(`Detected latest month with data: ${latestMonthWithData}`);
      return latestMonthWithData;
    } catch (error) {
      this.logger.error('Failed to detect latest month', error);
      return '';
    }
  }
  private getDepartmentName({
    employeeData,
    userProfile,
  }: {
    employeeData: IEmployeeData;
    userProfile: any;
  }): string {
    return (
      employeeData.department ||
      userProfile.department?.name ||
      userProfile.profile?.department ||
      'Unknown Department'
    );
  }
  private createBankError(record: any, error: any, detectedYear?: number): any {
    return {
      employeeId: record.employeeId || 'Error',
      name: record.name || 'Error',
      year: record.year || detectedYear.toString(),
      status: RecordStatus.NOT_FOUND,
      error: error.message,
      dataChanged: false,
    };
  }
  private handleInvalidRow(
    rowNum: number,
    employeeData: IEmployeeData | null,
    result: IProcessResult | any,
    detectedYear?: number,
  ): void {
    result.errors++;
    result.processedUserDetails.push({
      employeeId: employeeData?.employeeId || 'Unknown',
      name: employeeData?.name || 'Unknown',
      email: employeeData?.email || 'Unknown',
      status: RecordStatus.NOT_FOUND,
      year: detectedYear.toString(),
      dataChanged: false,
    });
  }
  private handleRowError(result: IProcessResult | any, detectedYear?: number): void {
    result.errors++;
    result.processedUserDetails.push({
      employeeId: 'Error',
      name: 'Error',
      email: 'Error',
      status: RecordStatus.NOT_FOUND,
      year: detectedYear.toString(),
      dataChanged: false,
    });
  }
  private handleMissingProfile(
    employeeData: IEmployeeData,
    result: IProcessResult | any,
    detectedYear?: number,
  ): void {
    result.errors++;
    result.processedUserDetails.push({
      employeeId: employeeData.employeeId,
      name: employeeData.name,
      email: employeeData.email,
      status: RecordStatus.NOT_FOUND,
      year: detectedYear.toString(),
      dataChanged: false,
    });
  }
  private hasNewYearData(existingRecord: any, currentYearStr: string): boolean {
    if (!existingRecord.monthlyData || !currentYearStr) {
      return false;
    }
    return !existingRecord.monthlyData[currentYearStr];
  }
  private hasNewMonthDataNested(
    existingRecord: any,
    currentMonth: string,
    newRecord: any,
    currentYearStr: string,
  ): boolean {
    if (!existingRecord.monthlyData || !existingRecord.monthlyData[currentYearStr]) {
      return false;
    }
    const existingYearData = existingRecord.monthlyData[currentYearStr];
    const existingMonthData = existingYearData.months?.[currentMonth.toLowerCase()];
    const newMonthData =
      newRecord.monthlyData[currentYearStr]?.months?.[currentMonth.toLowerCase()];
    if (!existingMonthData || this.isMonthDataEmptyNested(existingMonthData)) {
      return newMonthData && !this.isMonthDataEmptyNested(newMonthData);
    }
    return false;
  }
  private hasDataChangesNested(
    existingRecord: any,
    newRecord: any,
    currentMonth: string,
    currentYearStr: string,
  ): boolean {
    if (!existingRecord.monthlyData || !existingRecord.monthlyData[currentYearStr]) {
      return false;
    }
    const existingYearData = existingRecord.monthlyData[currentYearStr];
    const newYearData = newRecord.monthlyData[currentYearStr];
    if (!existingYearData.months || !newYearData.months) {
      return false;
    }
    const currentMonthIndex = Months.indexOf(currentMonth.toLowerCase() as any);
    for (let i = 0; i <= currentMonthIndex; i++) {
      const month = Months[i];
      if (this.hasMonthChangedNested(existingYearData.months[month], newYearData.months[month])) {
        return true;
      }
    }
    return false;
  }
  private hasMonthChangedNested(existingMonth: any, newMonth: any): boolean {
    if (!existingMonth && !newMonth) return false;
    if (!existingMonth || !newMonth) return true;
    const comparisonFields = [
      'workingDays',
      'shortHours',
      'casualLeave',
      'sickLeave',
      'absent',
      'extraHours',
      'netHoursWorked',
    ];
    const EPSILON = 0.001;
    return comparisonFields.some(
      field => Math.abs((existingMonth[field] || 0) - (newMonth[field] || 0)) > EPSILON,
    );
  }
  private isMonthDataEmptyNested(monthData: any): boolean {
    if (!monthData) return true;
    const fields = [
      'workingDays',
      'shortHours',
      'casualLeave',
      'sickLeave',
      'absent',
      'extraHours',
      'netHoursWorked',
    ];
    return fields.every(
      field =>
        monthData[field] === undefined || monthData[field] === null || monthData[field] === 0,
    );
  }
  private extractFailedOperations(error: any, bulkOperations: any[]): any[] {
    const failedIndexes: number[] = [];
    if (error.result && error.result.writeErrors) {
      error.result.writeErrors.forEach((writeError: any) => {
        failedIndexes.push(writeError.index);
      });
    }
    return failedIndexes.map(index => bulkOperations[index]).filter(Boolean);
  }
  private async retryFailedOperationsAsUpdates(
    failedOperations: any[],
    records: any[],
    uploadBatchId: string,
    currentMonth: string,
    counts: any,
    processedUserDetails: any[],
  ): Promise<void> {
    this.logger.log(`Retrying ${failedOperations.length} failed operations as updates`);
    const updateOperations: any[] = [];
    for (const failedOp of failedOperations) {
      if (failedOp.insertOne) {
        const document = failedOp.insertOne.document;
        const employeeId = document.employeeId;
        const year = document.year;
        // Find existing record by userId and year
        const existingRecord = await this.leaveBankRepository.findAll({
          userId: document.userId,
          year: year,
        });
        if (existingRecord.length > 0) {
          // Convert to update operation
          updateOperations.push({
            updateOne: {
              filter: { _id: existingRecord[0]._id },
              update: {
                $set: {
                  ...document,
                  lastUploadDate: new Date(),
                  uploadBatchId,
                  updatedAt: new Date(),
                },
              },
            },
          });
          counts.updated++;
          counts.created--;
          const existingDetailIndex = processedUserDetails.findIndex(
            detail => detail.employeeId === employeeId && detail.year === year.toString(),
          );
          if (existingDetailIndex >= 0) {
            processedUserDetails[existingDetailIndex] = {
              ...processedUserDetails[existingDetailIndex],
              status: RecordStatus.UPDATED,
              isNewRecord: false,
              isUpdatedRecord: true,
            };
          }
        } else {
          this.logger.error(
            `Cannot find existing record for userId: ${document.userId}, year: ${year}`,
          );
          counts.errors++;
        }
      }
    }
    if (updateOperations.length > 0) {
      try {
        await this.leaveBankRepository.bulkUpsert(updateOperations);
        this.logger.log(`Successfully retried ${updateOperations.length} operations as updates`);
      } catch (retryError) {
        this.logger.error('Failed to retry operations as updates', retryError);
        throw retryError;
      }
    }
  }
}
