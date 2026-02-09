import { HttpException, HttpStatus } from '@nestjs/common';
import ExcelJS from 'exceljs';

import { MonthColumns, Months } from '../../../types/constants/leave-bank.constants';
import { COLUMNS, DAYS } from '../../../types/enums/leave-bank.enums';
export class ExcelHelper {
  static getCellValue(cell: ExcelJS.Cell): string {
    if (!cell || cell.value === null || cell.value === undefined) {
      return '';
    }
    if (cell.result !== null && cell.result !== undefined) {
      return cell.result.toString().trim();
    }
    if (cell.value !== null && cell.value !== undefined) {
      return cell.value.toString().trim();
    }
    return '';
  }
  static parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const cleaned = value.toString().replace(/[^\d.-]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  static parseDate(value: any): Date | null {
    if (!value) return null;
    try {
      const dateStr = value.toString().trim();
      if (
        !dateStr ||
        dateStr === 'N/A' ||
        dateStr === 'Off' ||
        dateStr === 'No Off' ||
        dateStr === 'No Off but added' ||
        dateStr === ''
      ) {
        return null;
      }
      if (/^\d+$/.test(dateStr)) {
        const excelDate = parseInt(dateStr, 10);
        const date = new Date((excelDate - 25569) * 86400 * 1000);
        return isNaN(date.getTime()) ? null : date;
      }
      let date = new Date(dateStr);
      if (isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        const datePart = dateStr.split(' ')[0];
        date = new Date(datePart);
      }
      return isNaN(date.getTime()) ? null : date;
    } catch (error) {
      return null;
    }
  }
  static columnLetterToNumber(column: string): number {
    let result = 0;
    for (let i = 0; i < column.length; i++) {
      result *= 26;
      result += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }
    return result;
  }
  static bankBuffer(fileBuffer: any): Buffer {
    try {
      if (Buffer.isBuffer(fileBuffer)) {
        return fileBuffer;
      }
      if (fileBuffer instanceof ArrayBuffer) {
        return Buffer.from(new Uint8Array(fileBuffer));
      }
      if (fileBuffer instanceof Uint8Array) {
        return Buffer.from(fileBuffer);
      }
      if (fileBuffer?.constructor?.name === 'Buffer') {
        return Buffer.from(fileBuffer);
      }
      return Buffer.from(fileBuffer);
    } catch (error) {
      throw new HttpException('Invalid file buffer format', HttpStatus.OK);
    }
  }
  static extractMonthData(row: ExcelJS.Row, month: string): any {
    const columns = MonthColumns[month];
    if (!columns) {
      return null;
    }
    const [startCol, endCol] = columns;
    try {
      return ExcelHelper.extractMonthsData(row, startCol, endCol);
    } catch {
      return null;
    }
  }
  static extractMonthsData(row: ExcelJS.Row, startCol: string, endCol: string): any {
    const startNum = ExcelHelper.columnLetterToNumber(startCol);
    const endNum = ExcelHelper.columnLetterToNumber(endCol);
    const values: any[] = [];
    for (let i = startNum; i <= endNum; i++) {
      values.push(ExcelHelper.parseNumber(ExcelHelper.getCellValue(row.getCell(i))));
    }
    while (values.length < DAYS.MONTH_DATA_FIELDS_COUNT) {
      values.push(0);
    }
    return {
      workingDays: values[0] || 0,
      shortHours: values[1] || 0,
      casualLeave: values[2] || 0,
      sickLeave: values[3] || 0,
      absent: values[4] || 0,
      extraHours: values[5] || 0,
      netHoursWorked: values[6] || 0,
    };
  }
  static extractAllMonthlyData(row: ExcelJS.Row): Record<string, any> {
    const monthlyData: Record<string, any> = {};
    for (const month of Months) {
      const columns = MonthColumns[month];
      if (columns) {
        monthlyData[month] = ExcelHelper.extractMonthsData(row, columns[0], columns[1]);
      }
    }
    return monthlyData;
  }
  static extractSummaryData(row: ExcelJS.Row): any {
    const totalCLAvailed = ExcelHelper.parseNumber(
      ExcelHelper.getCellValue(row.getCell(COLUMNS.TOTAL_CL_AVAILED)),
    );
    const totalSLAvailed = ExcelHelper.parseNumber(
      ExcelHelper.getCellValue(row.getCell(COLUMNS.TOTAL_SL_AVAILED)),
    );
    return {
      totalCL: ExcelHelper.parseNumber(ExcelHelper.getCellValue(row.getCell(COLUMNS.TOTAL_CL))),
      totalSL: ExcelHelper.parseNumber(ExcelHelper.getCellValue(row.getCell(COLUMNS.TOTAL_SL))),
      totalAbsent: ExcelHelper.parseNumber(
        ExcelHelper.getCellValue(row.getCell(COLUMNS.TOTAL_ABSENT)),
      ),
      totalCLAvailed,
      totalSLAvailed,
      totalAbsentAvailed: ExcelHelper.parseNumber(
        ExcelHelper.getCellValue(row.getCell(COLUMNS.TOTAL_ABSENT_AVAILED)),
      ),
      totalShortHours: ExcelHelper.parseNumber(
        ExcelHelper.getCellValue(row.getCell(COLUMNS.TOTAL_SHORT_HOURS)),
      ),
      totalExtraHours: ExcelHelper.parseNumber(
        ExcelHelper.getCellValue(row.getCell(COLUMNS.TOTAL_EXTRA_HOURS)),
      ),
      remainingCL: ExcelHelper.parseNumber(
        ExcelHelper.getCellValue(row.getCell(COLUMNS.REMAINING_CL)),
      ),
      remainingSL: ExcelHelper.parseNumber(
        ExcelHelper.getCellValue(row.getCell(COLUMNS.REMAINING_SL)),
      ),
      netLeavesInDays: ExcelHelper.parseNumber(
        ExcelHelper.getCellValue(row.getCell(COLUMNS.NET_LEAVES_IN_DAYS)),
      ),
      shortHoursInDays: ExcelHelper.parseNumber(
        ExcelHelper.getCellValue(row.getCell(COLUMNS.SHORT_HOURS_IN_DAYS)),
      ),
      totalAvailed: totalCLAvailed + totalSLAvailed,
    };
  }
  static extractHolidays(worksheet: ExcelJS.Worksheet): any {
    const holidayRow = worksheet.getRow(DAYS.HOLIDAY_ROW);
    return {
      usOff1: ExcelHelper.parseDate(ExcelHelper.getCellValue(holidayRow.getCell(COLUMNS.US_OFF_1))),
      usOff2: ExcelHelper.parseDate(ExcelHelper.getCellValue(holidayRow.getCell(COLUMNS.US_OFF_2))),
      usOff3: ExcelHelper.parseDate(ExcelHelper.getCellValue(holidayRow.getCell(COLUMNS.US_OFF_3))),
      usOff4: ExcelHelper.parseDate(ExcelHelper.getCellValue(holidayRow.getCell(COLUMNS.US_OFF_4))),
      cadOff1: ExcelHelper.parseDate(
        ExcelHelper.getCellValue(holidayRow.getCell(COLUMNS.CAD_OFF_1)),
      ),
      cadOff2: ExcelHelper.parseDate(
        ExcelHelper.getCellValue(holidayRow.getCell(COLUMNS.CAD_OFF_2)),
      ),
      cadOff3: ExcelHelper.parseDate(
        ExcelHelper.getCellValue(holidayRow.getCell(COLUMNS.CAD_OFF_3)),
      ),
      cadOff4: ExcelHelper.parseDate(
        ExcelHelper.getCellValue(holidayRow.getCell(COLUMNS.CAD_OFF_4)),
      ),
    };
  }
}
