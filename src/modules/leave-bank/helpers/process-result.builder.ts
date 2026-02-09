import { IProcessResult } from '../../../types/interfaces/leave-bank.interface';
export class ProcessResultBuilder {
  static createEmpty(): IProcessResult {
    return {
      totalRecords: 0,
      processed: 0,
      errors: 0,
      createdCount: 0,
      updatedCount: 0,
      newMonthCount: 0,
      hasExistingRecords: false,
      processedUserDetails: [],
    };
  }
  static createBulkResult(
    totalRecords: number,
    counts: {
      created: number;
      updated: number;
      newMonth: number;
      unchanged: number;
      errors: number;
    },
    userDetails: any[],
  ): any {
    return {
      totalRecords,
      processed: totalRecords,
      createdCount: counts.created,
      updatedCount: counts.updated,
      newMonthCount: counts.newMonth,
      failedRecords: counts.errors,
      newRecords: counts.created,
      updatedRecords: counts.updated,
      newMonthRecords: counts.newMonth,
      errors: counts.errors,
      processedUserDetails: userDetails,
    };
  }
  static merge(base: IProcessResult, additional: any): IProcessResult {
    return {
      ...base,
      totalRecords: additional.totalRecords,
      processed: additional.processed,
      createdCount: additional.createdCount,
      updatedCount: additional.updatedCount,
      newMonthCount: additional.newMonthCount,
      errors: additional.errors,
      processedUserDetails: additional.processedUserDetails,
    };
  }
  static initializeCounts(): {
    created: number;
    updated: number;
    newMonth: number;
    unchanged: number;
    errors: number;
  } {
    return {
      created: 0,
      updated: 0,
      newMonth: 0,
      unchanged: 0,
      errors: 0,
    };
  }
}
