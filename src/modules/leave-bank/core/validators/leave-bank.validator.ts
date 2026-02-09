import { HttpException, HttpStatus } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { Types } from 'mongoose';

import { Months } from '../../../../types/constants/leave-bank.constants';
import { DAYS, LeaveBankError, Month } from '../../../../types/enums/leave-bank.enums';
import { UserPayload } from '../../../../types/interfaces/jwt.interface';
import {
  IEmployeeData,
  ILeaveBankFilter,
  IMonthlyBank,
} from '../../../../types/interfaces/leave-bank.interface';
import { ExcelHelper } from '../../helpers/excel-parsing.helper';
export class BankValidator {
  static validateEmployeeId(employeeId: string): void {
    if (!employeeId || typeof employeeId !== 'string' || employeeId.trim().length === 0) {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_ID}: Employee ID is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateYear(year: number): void {
    if (!year || typeof year !== 'number' || year < 2000 || year > 2100) {
      throw new HttpException(
        `${LeaveBankError.INVALID_YEAR}: Year must be between 2000 and 2100`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateMonth(month: string): void {
    if (!month || typeof month !== 'string' || !Months.includes(month.toLowerCase() as Month)) {
      throw new HttpException(
        `${LeaveBankError.INVALID_MONTH}: Invalid month: ${month}. Valid months are: ${Months.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(
        `${LeaveBankError.INVALID_OBJECT_ID}: Invalid ObjectId format`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Valid email is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateNumericField(value: any, fieldName: string): number {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: ${fieldName} must be a non-negative number`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return num;
  }
  static validateFileBuffer(buffer: Buffer): void {
    if (!buffer || buffer.length === 0) {
      throw new HttpException(
        `${LeaveBankError.INVALID_FILE_FORMAT}: File buffer is empty`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (buffer.length < 1000) {
      throw new HttpException(
        `${LeaveBankError.INVALID_FILE_FORMAT}: File too small to be a valid Excel file`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateLeaveBankRecord(record: any): void {
    if (!record) {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Record is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.validateEmployeeId(record.employeeId);
    if (!record.name || typeof record.name !== 'string') {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Employee name is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.validateEmail(record.email);
    if (record.monthData) {
      this.validateMonthData(record.monthData);
    }
  }
  static isValidMonthData(monthlyData: any): boolean {
    try {
      this.validateMonthData(monthlyData);
      return true;
    } catch {
      return false;
    }
  }
  static validateMonthData(monthData: any): void {
    if (!monthData || typeof monthData !== 'object') {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Month data must be an object`,
        HttpStatus.BAD_REQUEST,
      );
    }
    for (const [year, data] of Object.entries(monthData)) {
      if (!/^\d{4}$/.test(year)) {
        throw new HttpException(
          `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Invalid year format in month data: ${year}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (data && typeof data === 'object') {
        this.validateYearlyData(data as any);
      }
    }
  }
  static validateYearlyData(yearData: any): void {
    if (yearData.months && typeof yearData.months === 'object') {
      for (const [month, monthData] of Object.entries(yearData.months)) {
        if (!Months.includes(month.toLowerCase() as Month)) {
          throw new HttpException(
            `${LeaveBankError.INVALID_MONTH}: Invalid month in yearly data: ${month}`,
            HttpStatus.BAD_REQUEST,
          );
        }
        if (monthData && typeof monthData === 'object') {
          this.validateMonthFields(monthData as any);
        }
      }
    }
  }
  static validateMonthFields(monthData: any): void {
    const numericFields = [
      'workingDays',
      'shortHours',
      'casualLeave',
      'sickLeave',
      'absent',
      'extraHours',
      'netHoursWorked',
    ];
    for (const field of numericFields) {
      if (monthData[field] !== undefined && monthData[field] !== null) {
        this.validateNumericField(monthData[field], field);
      }
    }
  }
  static validateLeaveBankFilters(filters: ILeaveBankFilter) {
    if (filters.year && typeof filters.year !== 'number') {
      throw new HttpException(
        `${LeaveBankError.VALIDATION_FAILED}: Year filter must be a number`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (filters.employeeId) {
      this.validateEmployeeId(filters.employeeId);
    }
    if (filters.email && typeof filters.email !== 'string') {
      throw new HttpException(
        `${LeaveBankError.VALIDATION_FAILED}: Email filter must be a string`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateBankMonthly(monthlyData: IMonthlyBank[]): void {
    if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
      throw new HttpException(
        `${LeaveBankError.VALIDATION_FAILED}: Monthly data must be a non-empty array`,
        HttpStatus.BAD_REQUEST,
      );
    }
    monthlyData.forEach((data, index) => {
      if (!data.month) {
        throw new HttpException(
          `${LeaveBankError.VALIDATION_FAILED}: Month is required at index ${index}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      this.validateMonth(data.month);
      const numericFields = [
        'workingDays',
        'shortHours',
        'casualLeave',
        'sickLeave',
        'absent',
        'extraHours',
      ];
      for (const field of numericFields) {
        if (data[field] !== undefined) {
          this.validateNumericField(data[field], `${field} at index ${index}`);
        }
      }
    });
  }
  static validateExcelFileFormat(workbook: any): void {
    if (!workbook) {
      throw new HttpException(
        `${LeaveBankError.INVALID_FILE_FORMAT}: Invalid Excel file format`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const dataSheet = workbook.getWorksheet('Data');
    if (!dataSheet) {
      throw new HttpException(
        `${LeaveBankError.MISSING_DATA_SHEET}: Data sheet not found in Excel file`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateEmployeeData(employeeData: IEmployeeData): void {
    if (!employeeData) {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Employee data is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.validateEmployeeId(employeeData.employeeId);
    if (!employeeData.name || typeof employeeData.name !== 'string') {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Employee name is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.validateEmail(employeeData.email);
    if (!employeeData.department || typeof employeeData.department !== 'string') {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Employee department is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!employeeData.monthlyData) {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Monthly data is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!employeeData.summary) {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Summary data is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateCreateLeaveBankDto(createDto: any): void {
    if (!createDto) {
      throw new HttpException(
        `${LeaveBankError.VALIDATION_FAILED}: Create DTO is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.validateEmployeeId(createDto.employeeId);
    this.validateYear(createDto.year);
    if (!createDto.userId || !Types.ObjectId.isValid(createDto.userId)) {
      throw new HttpException(
        `${LeaveBankError.INVALID_OBJECT_ID}: Valid userId is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!createDto.name || typeof createDto.name !== 'string') {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Name is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.validateEmail(createDto.email);
    if (!createDto.department || typeof createDto.department !== 'string') {
      throw new HttpException(
        `${LeaveBankError.INVALID_EMPLOYEE_DATA}: Department is required`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  static validateUserPermissions(user: UserPayload, requiredPermission?: string): void {
    if (!user) {
      throw new HttpException(
        `${LeaveBankError.VALIDATION_FAILED}: User is required`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
      throw new HttpException(
        `${LeaveBankError.VALIDATION_FAILED}: Insufficient permissions`,
        HttpStatus.FORBIDDEN,
      );
    }
  }
  static isValidDataRow(row: ExcelJS.Row): boolean {
    if (!row.getCell('C').value && !row.getCell('D').value) {
      return false;
    }
    if (row.number === DAYS.DATA_START_ROW) {
      const firstCellValue = ExcelHelper.getCellValue(row.getCell('B'));
      if (firstCellValue === 'Department') {
        return false;
      }
    }
    return true;
  }
  static validateMonthlyData(monthlyData: any, employeeId: string, rowNum: number): void {
    const requiredFields = [
      'workingDays',
      'shortHours',
      'casualLeave',
      'sickLeave',
      'absent',
      'extraHours',
      'netHoursWorked',
    ];
    for (const month of Months) {
      if (!monthlyData[month]) {
        throw new Error(`Missing monthly data for ${month} for employee ${employeeId}`);
      }
      const monthData = monthlyData[month];
      requiredFields.forEach(field => {
        if (monthData[field] === undefined || monthData[field] === null) {
          monthData[field] = 0;
        } else {
          BankValidator.validateNumericField(monthData[field], `${field} for ${month}`);
        }
      });
    }
  }
  static isMonthDataEmpty(monthData: any): boolean {
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
  static hasMonthData(monthData: any): boolean {
    return (
      monthData &&
      (monthData.workingDays > 0 ||
        monthData.casualLeave > 0 ||
        monthData.sickLeave > 0 ||
        monthData.absent > 0 ||
        monthData.shortHours > 0 ||
        monthData.extraHours > 0)
    );
  }
  static hasNewMonthData(existingRecord: any, currentMonth: string, newRecord: any): boolean {
    const monthField = currentMonth.toLowerCase();
    const existingData = existingRecord[monthField];
    const newData = newRecord[monthField];
    if (!existingData || this.isMonthDataEmpty(existingData)) {
      return newData && !this.isMonthDataEmpty(newData);
    }
    return false;
  }
  static hasDataChanges(existingRecord: any, newRecord: any, currentMonth: string): boolean {
    const currentMonthIndex = Months.indexOf(currentMonth.toLowerCase() as any);
    for (let i = 0; i <= currentMonthIndex; i++) {
      const month = Months[i];
      if (this.hasMonthChanged(existingRecord[month], newRecord[month])) {
        return true;
      }
    }
    return false;
  }
  static hasMonthChanged(existingMonth: any, newMonth: any): boolean {
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
}
