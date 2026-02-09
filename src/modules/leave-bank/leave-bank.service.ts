import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { ATTENDANCE, VALIDATION } from '../../types/constants/error-messages.constants';
import { UserFilter } from '../../types/interfaces/filters.interface';
import {
  IBatchUserProfilesResult,
  ILeaveBankFilter,
  ILeaveBankRecord,
  ILeaveBankSort,
  IMonthlyBank,
  ISummaryData,
} from '../../types/interfaces/leave-bank.interface';
import { UserService } from '../user/user.service';
import { BankCalculator } from './core/utils/bank-Calculator';
import { BankHelper } from './core/utils/bank-helper';
import { BankTransformer } from './core/utils/bank-transformer';
import { BankValidator } from './core/validators/leave-bank.validator';
import { LeaveBankActionHelper } from './helpers/leave-bank-action.helper';
import { LeaveBankRepository } from './leave-bank.repository';
@Injectable()
export class LeaveBankService implements OnModuleInit {
  private userService: UserService;
  private readonly logger = new Logger(LeaveBankService.name);
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly leaveBankRepository: LeaveBankRepository,
    private readonly ActionHelper: LeaveBankActionHelper,
  ) {}
  /**
   * Initializes the service by resolving UserService dependency
   * @throws Error if UserService cannot be resolved
   */
  async onModuleInit(): Promise<void> {
    try {
      this.userService = await this.moduleRef.resolve(UserService, undefined, { strict: false });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Creates a new leave bank record for a user
   * @param userFilter - User filter containing employeeId to identify the user
   * @returns Created leave bank record
   */
  async createRecord(userFilter: UserFilter): Promise<ILeaveBankRecord | any> {
    const userDetails = await this.userService.getUser(userFilter);
    const createDto = BankTransformer.transformDefaultRecords(userDetails);
    createDto.employeeId = userFilter.employeeId;
    return await this.leaveBankRepository.create(createDto);
  }
  /**
   * Fetches leave bank records with optional filtering and month/year targeting
   * @param filters - Optional filters to apply to the records search
   * @param sort - Sort configuration for the results (default: year desc, createdAt desc)
   * @param month - Optional month filter for cumulative calculations
   * @param year - Optional year to target for calculations
   * @returns Object containing transformed records and original records
   */
  async fetchRecords(
    filters: ILeaveBankFilter = {},
    sort: ILeaveBankSort = { year: -1, createdAt: -1 },
    month?: string,
    year?: number,
  ): Promise<IBatchUserProfilesResult> {
    try {
      const records = await this.leaveBankRepository.findAllRecords(filters, sort);
      if (records.length === 0) {
        return {
          records: [],
          originalRecords: [],
        };
      }
      const transformedRecords = records.map(record => {
        const targetYear = year || record.year || new Date().getFullYear();
        const targetYearStr = targetYear.toString();
        const monthlyData = record.monthlyData || {};
        if (!monthlyData[targetYearStr]) {
          monthlyData[targetYearStr] = {
            months: {},
            summary: BankHelper.emptySummary(),
          };
        }
        const yearData = monthlyData[targetYearStr];
        if (yearData.months) {
          Object.keys(yearData.months).forEach(monthKey => {
            yearData.months[monthKey] = BankHelper.roundMonth(yearData.months[monthKey]);
          });
        } else {
          yearData.months = {};
        }
        const storedSummary = yearData.summary || BankHelper.emptySummary();
        const storedQuotas = {
          totalCL: storedSummary.totalCL,
          totalSL: storedSummary.totalSL,
        };
        let calculatedSummary: ISummaryData;
        const displayMonths = { ...yearData.months };
        if (month) {
          const monthLower = month.toLowerCase();
          calculatedSummary = BankCalculator.calculateCumulativeSummary(
            yearData.months,
            monthLower,
            storedQuotas,
          );
        } else {
          calculatedSummary = BankCalculator.calculateMonthlySummary(yearData.months, storedQuotas);
        }
        yearData.summary = {
          totalCL: storedSummary.totalCL,
          totalSL: storedSummary.totalSL,
          totalAbsent: storedSummary.totalAbsent || 0,
          totalCLAvailed: calculatedSummary.totalCLAvailed,
          totalSLAvailed: calculatedSummary.totalSLAvailed,
          totalAbsentAvailed: calculatedSummary.totalAbsentAvailed,
          totalShortHours: calculatedSummary.totalShortHours,
          totalExtraHours: calculatedSummary.totalExtraHours,
          remainingCL: calculatedSummary.remainingCL,
          remainingSL: calculatedSummary.remainingSL,
          netLeavesInDays: calculatedSummary.netLeavesInDays,
          shortHoursInDays: calculatedSummary.shortHoursInDays,
          totalAvailed: calculatedSummary.totalAvailed,
        };
        yearData.summary = BankHelper.roundSummary(yearData.summary);
        const transformed = BankTransformer.transformedUserRecord(record);
        transformed.monthlyData = monthlyData;
        transformed.year = targetYear;
        if (month) {
          transformed.monthFilter = month;
          transformed.cumulativeUpTo = month;
        }
        return transformed;
      });
      return {
        records: transformedRecords,
        originalRecords: records,
      };
    } catch (error) {
      this.logger.error('Error fetching records:', error);
      throw error;
    }
  }
  /**
   * Counts all leave bank records in the database
   * @returns Total count of leave bank records
   */
  async countAll(): Promise<number> {
    return this.leaveBankRepository.countAll();
  }
  /**
   * Counts leave bank records for a specific user by userId
   * @param userId - User ID to count records for
   * @returns Number of leave bank records for the user
   * @throws HttpException with BAD_REQUEST status if userId is invalid
   */
  async countByUser(userId: string): Promise<number> {
    try {
      BankValidator.validateId(userId);
    } catch (error) {
      throw new HttpException(VALIDATION.INVALID_OBJECT_ID, HttpStatus.OK);
    }
    return this.leaveBankRepository.countByUserId(userId);
  }
  /**
   * Upserts (updates or creates) monthly data for an employee's leave bank record
   * @param employeeId - Employee ID to update/create data for
   * @param monthlyData - Array of monthly bank data to upsert
   * @returns Updated leave bank record
   * @throws HttpException if validation fails or update fails
   */
  async upsertMonthlyData(
    employeeId: string,
    monthlyData: IMonthlyBank[],
  ): Promise<ILeaveBankRecord | any> {
    BankValidator.validateEmployeeId(employeeId);
    BankValidator.validateBankMonthly(monthlyData);
    try {
      let record: any = await this.leaveBankRepository.findByEmployeeId(employeeId);
      if (!record) {
        record = await this.createRecord({ employeeId });
      }
      const updateData = BankTransformer.transformMonthlyDataForUpdate(monthlyData, record);
      updateData.summary = BankCalculator.calculateYearlySummary(record, updateData);
      if (monthlyData.length > 0 && monthlyData[0].year) {
        const targetYear = monthlyData[0].year.toString();
        if (!record.monthlyData) {
          record.monthlyData = {};
        }
        if (!record.monthlyData[targetYear]) {
          record.monthlyData[targetYear] = {
            months: {},
            summary: record.summary || BankHelper.emptySummary(),
          };
        }
        monthlyData.forEach(data => {
          const yearKey = (data.year || new Date().getFullYear()).toString();
          if (!record.monthlyData[yearKey]) {
            record.monthlyData[yearKey] = {
              months: {},
              summary: BankHelper.emptySummary(),
            };
          }
          record.monthlyData[yearKey].months[data.month] = {
            workingDays: data.workingDays || 0,
            shortHours: data.shortHours || 0,
            casualLeave: data.casualLeave || 0,
            sickLeave: data.sickLeave || 0,
            absent: data.absent || 0,
            extraHours: data.extraHours || 0,
            netHoursWorked: data.netHoursWorked || 0,
          };
        });
        const yearData = record.monthlyData[targetYear];
        const yearSummary = BankCalculator.calculateMonthlySummary(yearData.months);
        record.monthlyData[targetYear].summary = yearSummary;
        updateData.summary = yearSummary;
      }
      return await this.leaveBankRepository.updateById(record._id.toString(), updateData);
    } catch (error) {
      throw new HttpException(error.message || ATTENDANCE.UPDATE_FAILED, HttpStatus.OK);
    }
  }
  /**
   * Notifies about resolved discrepancy for an employee's leave bank record
   * @param employeeId - Employee ID whose discrepancy was resolved
   * @param sendEmail - Whether to send email notification
   * @param baseUrl - Base URL for email links (optional)
   * @param month - Month for which discrepancy was resolved (optional)
   * @param year - Year for which discrepancy was resolved (optional)
   * @returns Object containing success status, message, and optional data
   * @throws HttpException if record not found or notification fails
   */
  async notifyDiscrepancyResolved(
    employeeId: string,
    sendEmail: boolean,
    baseUrl?: string,
    month?: string,
    year?: number,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      let record: any;
      if (month) {
        const currentYear = year || record?.year;
        record = await this.leaveBankRepository.findByEmployeeIdAndYear(employeeId, currentYear);
      } else {
        record = await this.leaveBankRepository.findByEmployeeId(employeeId);
      }
      if (!record) {
        throw new HttpException(
          `${ATTENDANCE.NOT_FOUND}: No record found for employee ${employeeId}`,
          HttpStatus.OK,
        );
      }
      let result: any;
      if (sendEmail) {
        result = await this.ActionHelper.processAction(
          record,
          this.fetchRecords.bind(this),
          baseUrl,
          month,
          year?.toString(),
        );
      } else {
        result = await this.ActionHelper.processCancelAction(
          record,
          this.fetchRecords.bind(this),
          month,
        );
      }
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof HttpException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new HttpException(
        `${ATTENDANCE.UPDATE_FAILED}: ${error.message || 'Unknown error occurred'}`,
        HttpStatus.OK,
      );
    }
  }
  async deleteAllRecords(): Promise<{ deletedCount: number; message: string }> {
    try {
      this.logger.log('Service: Deleting all leave bank records');
      const deletedCount = await this.leaveBankRepository.deleteAllRecords();
      return {
        deletedCount,
        message: `Successfully deleted ${deletedCount} leave bank records`,
      };
    } catch (error) {
      this.logger.error('Service: Error deleting all leave bank records:', error);
      throw new HttpException(
        `Failed to delete all records: ${error.message || 'Unknown error occurred'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
