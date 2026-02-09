import { Injectable } from '@nestjs/common';

import { MonthFields, Months } from '../../../../types/constants/leave-bank.constants';
import { Month, Values } from '../../../../types/enums/leave-bank.enums';
import { Role } from '../../../../types/enums/role.enums';
import { UserPayload } from '../../../../types/interfaces/jwt.interface';
import { IMonthData, ISummaryData } from '../../../../types/interfaces/leave-bank.interface';
@Injectable()
export class BankHelper {
  static validateMonth(monthData: IMonthData): boolean {
    const requiredFields = MonthFields;
    return requiredFields.every(
      field =>
        monthData[field] !== undefined &&
        monthData[field] !== null &&
        typeof monthData[field] === 'number' &&
        monthData[field] >= 0,
    );
  }
  static initializeTotals() {
    return {
      casualLeave: 0,
      sickLeave: 0,
      shortHours: 0,
      extraHours: 0,
      absent: 0,
    };
  }
  static emptyMonth(): IMonthData {
    return {
      workingDays: 0,
      shortHours: 0,
      casualLeave: 0,
      sickLeave: 0,
      absent: 0,
      extraHours: 0,
      netHoursWorked: 0,
    };
  }
  static emptySummary(): ISummaryData {
    return {
      totalCL: 0,
      totalSL: 0,
      totalAbsent: 0,
      totalCLAvailed: 0,
      totalSLAvailed: 0,
      totalAbsentAvailed: 0,
      totalShortHours: 0,
      totalExtraHours: 0,
      remainingCL: 0,
      remainingSL: 0,
      netLeavesInDays: 0,
      shortHoursInDays: 0,
      totalAvailed: 0,
    };
  }
  static validMonths(): string[] {
    return Object.values(Month);
  }
  static isAdminOrSuperAdmin(user: UserPayload): boolean {
    return (
      user.role === Role.ADMIN ||
      user.role === Role.SUPER_ADMIN ||
      user.role === 'Super_Admin' ||
      user.role === 'Admin'
    );
  }
  static roundToTwo(num: number): number {
    if (!Number.isFinite(num)) return 0;
    if (Math.abs(num) < Values.EPSILON) return 0;
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
  static roundMonth(monthData: any): IMonthData {
    if (!monthData) return this.emptyMonth();
    return {
      workingDays: this.roundToTwo(monthData.workingDays || 0),
      shortHours: this.roundToTwo(monthData.shortHours || 0),
      casualLeave: this.roundToTwo(monthData.casualLeave || 0),
      sickLeave: this.roundToTwo(monthData.sickLeave || 0),
      absent: this.roundToTwo(monthData.absent || 0),
      extraHours: this.roundToTwo(monthData.extraHours || 0),
      netHoursWorked: this.roundToTwo(monthData.netHoursWorked || 0),
    };
  }
  static roundSummary(summary: any): ISummaryData {
    const safeSummary = summary || {};
    const rounded: any = {};
    Object.keys(safeSummary).forEach(key => {
      rounded[key] = this.roundToTwo(safeSummary[key] || 0);
    });
    return rounded;
  }
  static defaultMonth(records: any[]): string {
    if (!records || records.length === 0) {
      return this.getCurrentMonthFallback();
    }
    let latestMonthWithData = 'january';
    let latestMonthIndex = -1;
    records.forEach(record => {
      if (record.monthlyData && typeof record.monthlyData === 'object') {
        Object.keys(record.monthlyData).forEach(month => {
          const monthLower = month.toLowerCase();
          const monthIndex = Months.indexOf(monthLower);
          if (monthIndex !== -1) {
            const monthData = record.monthlyData[month];
            if (monthData && this.hasSubstantialData(monthData)) {
              if (monthIndex > latestMonthIndex) {
                latestMonthIndex = monthIndex;
                latestMonthWithData = monthLower;
              }
            }
          }
        });
      }
      Months.forEach((month, index) => {
        const monthData = record[month];
        if (monthData && this.hasSubstantialData(monthData)) {
          if (index > latestMonthIndex) {
            latestMonthIndex = index;
            latestMonthWithData = month;
          }
        }
      });
    });
    if (latestMonthIndex !== -1) {
      return latestMonthWithData;
    }
    const lastMonthWithAnyData = this.findLastMonthWithAnyData(records);
    if (lastMonthWithAnyData) {
      return lastMonthWithAnyData;
    }
    return this.getCurrentMonthFallback();
  }
  static hasSubstantialData(monthData: any): boolean {
    if (!monthData) return false;
    return (
      monthData.workingDays > 0 ||
      monthData.casualLeave > 0 ||
      monthData.sickLeave > 0 ||
      monthData.absent > 0
    );
  }
  static findLastMonthWithAnyData(records: any[]): string | null {
    for (let i = Months.length - 1; i >= 0; i--) {
      const month = Months[i];
      const hasData = records.some(record => {
        const monthData = record.monthlyData?.[month] || record[month];
        return monthData && this.hasAnyData(monthData);
      });
      if (hasData) {
        return month;
      }
    }
    return null;
  }
  static hasAnyData(monthData: any): boolean {
    if (!monthData) return false;
    return (
      monthData.workingDays !== undefined ||
      monthData.casualLeave !== undefined ||
      monthData.sickLeave !== undefined ||
      monthData.shortHours !== undefined ||
      monthData.extraHours !== undefined ||
      monthData.absent !== undefined ||
      monthData.netHoursWorked !== undefined
    );
  }
  static getCurrentMonthFallback(): string {
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentDay = now.getDate();
    let targetMonthIndex = currentMonthIndex;
    if (currentDay < 10) {
      targetMonthIndex = currentMonthIndex - 1;
      if (targetMonthIndex < 0) {
        targetMonthIndex = 11;
      }
    }
    if (targetMonthIndex >= 0 && targetMonthIndex < Months.length) {
      return Months[targetMonthIndex];
    }
    return Months[Months.length - 1] || 'december';
  }
}
