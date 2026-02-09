import { Injectable } from '@nestjs/common';

import {
  DEFAULT_CL_QUOTA,
  DEFAULT_SL_QUOTA,
  HOURS_PER_DAY,
  Months,
} from '../../../../types/constants/leave-bank.constants';
import { MonthField, Values } from '../../../../types/enums/leave-bank.enums';
import { IMonthData, ISummaryData } from '../../../../types/interfaces/leave-bank.interface';
import { BankHelper } from '../utils/bank-helper';
import { LeaveBank } from '@/modules/leave-bank/schemas/leave-bank.schema';
@Injectable()
export class BankCalculator {
  /**
   * Calculates summary data for leave bank records with optional month filtering
   * @param months - Object containing month data with leave information
   * @param monthFilter - Optional month name to calculate cumulative data up to that month
   * @param monthField - Optional field to filter by within month data
   * @param monthMinValue - Optional minimum value for month field filtering
   * @param storedQuotas - Optional stored CL and SL quota values
   * @returns Summary data object with calculated leave statistics
   */
  static calculateSummary(
    months: { [key: string]: IMonthData },
    monthFilter?: string,
    monthField?: MonthField,
    monthMinValue?: string,
    storedQuotas?: { totalCL: number; totalSL: number },
  ): ISummaryData {
    if (!monthFilter) {
      return this.calculateMonthlySummary(months, storedQuotas);
    }
    return this.calculateCumulativeSummary(months, monthFilter, storedQuotas);
  }
  /**
   * Calculates summary data for all months in the provided data
   * @param months - Object containing month data with leave information
   * @param storedQuotas - Optional stored CL and SL quota values
   * @returns Summary data object with total leave statistics for all months
   */
  static calculateMonthlySummary(
    months?: { [key: string]: IMonthData },
    storedQuotas?: { totalCL: number; totalSL: number },
  ): ISummaryData {
    const totals = {
      casualLeave: 0,
      sickLeave: 0,
      shortHours: 0,
      extraHours: 0,
      absent: 0,
    };
    Object.values(months || {}).forEach(data => {
      totals.casualLeave += data.casualLeave || 0;
      totals.sickLeave += data.sickLeave || 0;
      totals.shortHours += data.shortHours || 0;
      totals.extraHours += data.extraHours || 0;
      totals.absent += data.absent || 0;
    });
    return this.buildSummary(totals, storedQuotas);
  }
  /**
   * Calculates cumulative summary data up to a specific target month
   * @param months - Object containing month data with leave information
   * @param targetMonth - Target month name to calculate cumulative data up to (inclusive)
   * @param storedQuotas - Optional stored CL and SL quota values
   * @returns Summary data object with cumulative leave statistics up to target month
   */
  static calculateCumulativeSummary(
    months: { [key: string]: IMonthData },
    targetMonth: string,
    storedQuotas?: { totalCL: number; totalSL: number },
  ): ISummaryData {
    const totals = {
      casualLeave: 0,
      sickLeave: 0,
      shortHours: 0,
      extraHours: 0,
      absent: 0,
    };
    const monthOrder = Months;
    const targetMonthIndex = monthOrder.indexOf(targetMonth.toLowerCase());
    if (targetMonthIndex === -1) {
      return this.calculateMonthlySummary(months, storedQuotas);
    }
    for (let i = 0; i <= targetMonthIndex; i++) {
      const month = monthOrder[i];
      const data = months[month];
      if (data) {
        totals.casualLeave += data.casualLeave || 0;
        totals.sickLeave += data.sickLeave || 0;
        totals.shortHours += data.shortHours || 0;
        totals.extraHours += data.extraHours || 0;
        totals.absent += data.absent || 0;
      }
    }
    return this.buildSummary(totals, storedQuotas);
  }
  /**
   * Calculates yearly summary data for a leave bank record with update data
   * @param record - Leave bank record containing existing data
   * @param updateData - New data to update/merge with existing record data
   * @returns Summary data object with calculated yearly leave statistics
   */
  static calculateYearlySummary(record: LeaveBank | any, updateData: any): ISummaryData {
    const totals = {
      casualLeave: 0,
      sickLeave: 0,
      shortHours: 0,
      extraHours: 0,
      absent: 0,
    };
    const months = Months;
    months.forEach(month => {
      const data = updateData[month] || record[month] || {};
      totals.casualLeave += data.casualLeave || 0;
      totals.sickLeave += data.sickLeave || 0;
      totals.shortHours += data.shortHours || 0;
      totals.extraHours += data.extraHours || 0;
      totals.absent += data.absent || 0;
    });
    const recordYear = record?.year || new Date().getFullYear();
    const yearStr = recordYear.toString();
    let storedQuotas;
    if (record?.monthlyData?.[yearStr]?.summary) {
      storedQuotas = {
        totalCL: record.monthlyData[yearStr].summary.totalCL,
        totalSL: record.monthlyData[yearStr].summary.totalSL,
      };
    }
    return this.buildSummary(totals, storedQuotas);
  }
  /**
   * Builds summary data object from calculated leave values
   * @param values - Object containing calculated leave totals (casual, sick, short hours, extra hours, absent)
   * @param storedQuotas - Optional stored CL and SL quota values
   * @returns Complete summary data object with all leave statistics and calculations
   */
  static buildSummary(
    values: {
      casualLeave: number;
      sickLeave: number;
      shortHours: number;
      extraHours: number;
      absent: number;
    },
    storedQuotas?: { totalCL: number; totalSL: number },
  ): ISummaryData {
    const totalCLQuota = storedQuotas?.totalCL || DEFAULT_CL_QUOTA;
    const totalSLQuota = storedQuotas?.totalSL || DEFAULT_SL_QUOTA;
    const totalCLAvailedInDays = (values.casualLeave || 0) / HOURS_PER_DAY;
    const totalSLAvailedInDays = (values.sickLeave || 0) / HOURS_PER_DAY;
    const totalAbsentInDays = (values.absent || 0) / HOURS_PER_DAY;
    const shortHoursInDays = (values.shortHours || 0) / HOURS_PER_DAY;
    const totalshortHours = values.shortHours || 0;
    const totalExtraHours = values.extraHours || 0;
    const remainingCL = totalCLQuota - totalCLAvailedInDays;
    const remainingSL = totalSLQuota - totalSLAvailedInDays;
    const netLeavesInDays =
      remainingCL + remainingSL + totalExtraHours / HOURS_PER_DAY - totalshortHours / HOURS_PER_DAY;
    return {
      totalCL: totalCLQuota,
      totalSL: totalSLQuota,
      totalAbsent: 0,
      totalCLAvailed: BankHelper.roundToTwo(totalCLAvailedInDays),
      totalSLAvailed: BankHelper.roundToTwo(totalSLAvailedInDays),
      totalAbsentAvailed: BankHelper.roundToTwo(totalAbsentInDays),
      totalShortHours: BankHelper.roundToTwo(totalshortHours),
      totalExtraHours: BankHelper.roundToTwo(totalExtraHours),
      remainingCL: BankHelper.roundToTwo(remainingCL),
      remainingSL: BankHelper.roundToTwo(remainingSL),
      netLeavesInDays: BankHelper.roundToTwo(netLeavesInDays),
      shortHoursInDays: BankHelper.roundToTwo(shortHoursInDays),
      totalAvailed: BankHelper.roundToTwo(totalCLAvailedInDays + totalSLAvailedInDays),
    };
  }
  /**
   * Updates existing summary data with new month changes and recalculates totals
   * @param existing - Existing summary data to update
   * @param changes - New month data changes to apply to the existing summary
   * @returns Updated summary data object with recalculated totals and remaining leave
   */
  static updateRunningTotals(existing: ISummaryData, changes: IMonthData): ISummaryData {
    const newTotalCLAvailed = existing.totalCLAvailed + (changes.casualLeave || 0);
    const newTotalSLAvailed = existing.totalSLAvailed + (changes.sickLeave || 0);
    const newTotalShortHours = existing.totalShortHours + (changes.shortHours || 0);
    const newTotalExtraHours = existing.totalExtraHours + (changes.extraHours || 0);
    const newTotalAbsent = existing.totalAbsent + (changes.absent || 0);
    return {
      ...existing,
      totalCLAvailed: newTotalCLAvailed,
      totalSLAvailed: newTotalSLAvailed,
      totalShortHours: newTotalShortHours,
      totalExtraHours: newTotalExtraHours,
      totalAbsent: newTotalAbsent,
      remainingCL: Math.max(0, existing.totalCL - newTotalCLAvailed),
      remainingSL: Math.max(0, existing.totalSL - newTotalSLAvailed),
      netLeavesInDays: Math.round((newTotalExtraHours / 8 - newTotalShortHours / 8) * 100) / 100,
      shortHoursInDays: Math.round((newTotalShortHours / 8) * 100) / 100,
      totalAvailed: newTotalCLAvailed + newTotalSLAvailed,
    };
  }
  /**
   * Calculates leave utilization rates as percentages based on summary data
   * @param summary - Summary data object containing leave statistics
   * @returns Object with casual, sick, and total leave utilization percentages
   */
  static calculateLeaveUtilizationRate(summary: ISummaryData): {
    casualLeaveUtilization: number;
    sickLeaveUtilization: number;
    totalLeaveUtilization: number;
  } {
    const casualLeaveUtilization = BankHelper.roundToTwo(
      (summary.totalCLAvailed / Values.ANNUAL_CL) * 100,
    );
    const sickLeaveUtilization = BankHelper.roundToTwo(
      (summary.totalSLAvailed / Values.ANNUAL_CL) * 100,
    );
    const totalLeaveUtilization = BankHelper.roundToTwo(
      ((summary.totalCLAvailed + summary.totalSLAvailed) / (Values.ANNUAL_CL * 2)) * 100,
    );
    return {
      casualLeaveUtilization,
      sickLeaveUtilization,
      totalLeaveUtilization,
    };
  }
}
