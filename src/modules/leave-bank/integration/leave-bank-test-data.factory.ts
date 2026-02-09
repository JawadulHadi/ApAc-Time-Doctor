import { Types } from 'mongoose';

import { Month } from '../../../types/enums/leave-bank.enums';
import {
  IEmployeeData,
  ILeaveBankFilter,
  ILeaveBankRecord,
  ILeaveBankSort,
  IMonthData,
  IProcessResult,
  ISummaryData,
} from '../../../types/interfaces/leave-bank.interface';
export class LeaveBankTestDataFactory {
  static createEmployeeRecord(overrides?: Partial<IEmployeeData>): IEmployeeData {
    const defaultData: IEmployeeData = {
      employeeId: 'MAS-CAN-4136',
      name: 'John Doe',
      email: 'john.doe@mailinator.com',
      role: 'TEAM_MEMBER',
      designation: 'Senior Software Engineer',
      pictureUrl: 'https://apac-dev.agilebrains.com/profiles/aashan-bilawal.jpg',
      department: 'Canadian BD',
      teamLeadDetail: {
        userId: '68fa4b0c3a50f116c73117a0',
        email: 'ron@mailinator.com',
        role: 'TEAM_LEAD',
        designation: 'Team Lead - Business Development',
        name: 'Samrullah',
      },
      monthlyData: this.createMonthlyData(),
      summary: this.createSummaryData(),
      rowNumber: 4,
    };
    return { ...defaultData, ...overrides };
  }
  static createEmployeeRecords(count: number, overrides?: Partial<IEmployeeData>): IEmployeeData[] {
    return Array.from({ length: count }, (_, index) =>
      this.createEmployeeRecord({
        ...overrides,
        employeeId: `MAS-CAN-${4136 + index}`,
        email: `employee${index}@mailinator.com`,
        name: `Employee ${index + 1}`,
        rowNumber: 4 + index,
      }),
    );
  }
  static createMonthlyData(overrides?: Partial<{ [key in Month]: IMonthData }>): {
    [key in Month]: IMonthData;
  } {
    const defaultMonthlyData: { [key in Month]: IMonthData } = {
      january: {
        workingDays: 22,
        shortHours: 0,
        casualLeave: 1,
        sickLeave: 0,
        absent: 0,
        extraHours: 2,
        netHoursWorked: 176,
      },
      february: {
        workingDays: 20,
        shortHours: 1,
        casualLeave: 0,
        sickLeave: 1,
        absent: 0,
        extraHours: 0,
        netHoursWorked: 159,
      },
      march: {
        workingDays: 23,
        shortHours: 0,
        casualLeave: 2,
        sickLeave: 0,
        absent: 1,
        extraHours: 4,
        netHoursWorked: 184,
      },
      april: {
        workingDays: 21,
        shortHours: 2,
        casualLeave: 0,
        sickLeave: 2,
        absent: 0,
        extraHours: 1,
        netHoursWorked: 167,
      },
      may: {
        workingDays: 22,
        shortHours: 0,
        casualLeave: 1,
        sickLeave: 1,
        absent: 0,
        extraHours: 3,
        netHoursWorked: 176,
      },
      june: {
        workingDays: 21,
        shortHours: 1,
        casualLeave: 0,
        sickLeave: 0,
        absent: 2,
        extraHours: 0,
        netHoursWorked: 167,
      },
      july: {
        workingDays: 22,
        shortHours: 0,
        casualLeave: 3,
        sickLeave: 0,
        absent: 0,
        extraHours: 2,
        netHoursWorked: 176,
      },
      august: {
        workingDays: 23,
        shortHours: 1,
        casualLeave: 0,
        sickLeave: 1,
        absent: 0,
        extraHours: 1,
        netHoursWorked: 183,
      },
      september: {
        workingDays: 21,
        shortHours: 0,
        casualLeave: 1,
        sickLeave: 2,
        absent: 1,
        extraHours: 0,
        netHoursWorked: 167,
      },
      october: {
        workingDays: 22,
        shortHours: 2,
        casualLeave: 0,
        sickLeave: 0,
        absent: 0,
        extraHours: 3,
        netHoursWorked: 176,
      },
      november: {
        workingDays: 21,
        shortHours: 0,
        casualLeave: 2,
        sickLeave: 1,
        absent: 0,
        extraHours: 1,
        netHoursWorked: 167,
      },
      december: {
        workingDays: 20,
        shortHours: 1,
        casualLeave: 1,
        sickLeave: 0,
        absent: 1,
        extraHours: 2,
        netHoursWorked: 159,
      },
    };
    if (overrides) {
      Object.keys(overrides).forEach(month => {
        if (month in defaultMonthlyData) {
          defaultMonthlyData[month as Month] = {
            ...defaultMonthlyData[month as Month],
            ...overrides[month as Month],
          };
        }
      });
    }
    return defaultMonthlyData;
  }
  static createSummaryData(overrides?: Partial<ISummaryData>): ISummaryData {
    const defaultsummary: ISummaryData = {
      totalCL: 8,
      totalSL: 8,
      totalAbsent: 0,
      totalCLAvailed: 12,
      totalSLAvailed: 8,
      totalAbsentAvailed: 0,
      totalShortHours: 8,
      totalExtraHours: 18,
      remainingCL: -4,
      remainingSL: 0,
      netLeavesInDays: 1.25,
      shortHoursInDays: 1,
      totalAvailed: 20,
    };
    return { ...defaultsummary, ...overrides };
  }
  static createLeaveBankRecord(overrides?: Partial<ILeaveBankRecord>): ILeaveBankRecord {
    const userId = new Types.ObjectId();
    const profileId = new Types.ObjectId();
    const defaultRecord: ILeaveBankRecord = {
      id: new Types.ObjectId().toString(),
      userId: userId.toString(),
      profileId: profileId.toString(),
      employeeId: 'MAS-CAN-4136',
      name: 'John Doe',
      email: 'john.doe@mailinator.com',
      department: 'Engineering',
      role: 'TEAM_MEMBER',
      designation: 'Senior Software Engineer',
      pictureUrl: 'https://apac-dev.agilebrains.com/profiles/aashan-bilawal.jpg',
      teamLeadDetail: {
        userId: '68fa4b0c3a50f116c73117a0',
        email: 'ron@mailinator.com',
        role: 'TEAM_LEAD',
        designation: 'Team Lead - Business Development',
        name: 'Samrullah',
      },
      year: 2025,
      monthlyData: {
        '2025': {
          months: this.createMonthlyDataUpdate(),
          summary: this.createSummaryData(),
        },
      },
      isUpdatedRecord: false,
      notified: false,
      lastNotifiedDate: null,
      isNewMonthData: false,
      newlyAddedMonth: null,
      discrepancyResolved: false,
      cancellationDate: null,
      isNewRecord: true,
      lastUploadDate: new Date(),
      uploadBatchId: new Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return { ...defaultRecord, ...overrides };
  }
  static createProcessResult(overrides?: Partial<IProcessResult>): IProcessResult {
    const defaultResult: IProcessResult = {
      totalRecords: 100,
      processed: 95,
      errors: 5,
      createdCount: 20,
      updatedCount: 75,
      newMonthCount: 30,
      hasExistingRecords: true,
    };
    return { ...defaultResult, ...overrides };
  }
  static createExcelWorkbookData(overrides?: any): any {
    const defaultWorkbookData = {
      worksheets: [
        {
          name: 'Data',
          data: [
            [
              'Employee ID',
              'Name',
              'Email',
              'Department',
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
            [
              'MAS-CAN-4136',
              'John Doe',
              'john.doe@mailinator.com',
              'Engineering',
              22,
              20,
              23,
              21,
              22,
              21,
              22,
              23,
              21,
              22,
              21,
              20,
            ],
            [
              'MAS-CAN-4137',
              'Jane Smith',
              'jane.smith@mailinator.com',
              'HR',
              21,
              22,
              20,
              23,
              21,
              22,
              21,
              22,
              20,
              23,
              21,
              22,
            ],
          ],
        },
        {
          name: 'Holidays',
          data: [
            ['Date', 'Holiday Name'],
            ['2025-01-01', 'New Year'],
            ['2025-12-25', 'Christmas'],
          ],
        },
      ],
    };
    return { ...defaultWorkbookData, ...overrides };
  }
  static createUserProfile(overrides?: Partial<any>): any {
    const defaultProfile = {
      _id: new Types.ObjectId(),
      userId: new Types.ObjectId().toString(),
      employeeId: 'MAS-CAN-4136',
      name: 'John Doe',
      email: 'john.doe@mailinator.com',
      department: 'Engineering',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return { ...defaultProfile, ...overrides };
  }
  static createMonthlyDataUpdate(overrides?: Partial<any>): any {
    const defaultUpdate: any = {
      month: 'january',
      year: 2025,
      workingDays: 22,
      shortHours: 0,
      casualLeave: 1,
      sickLeave: 0,
      absent: 0,
      extraHours: 2,
      netHoursWorked: 176,
    };
    return { ...defaultUpdate, ...overrides };
  }
  static createFilters(overrides?: Partial<ILeaveBankFilter>): ILeaveBankFilter {
    const defaultFilters: ILeaveBankFilter = {
      year: 2025,
      department: 'Engineering',
      employeeId: 'MAS-CAN-4136',
      email: 'john.doe@mailinator.com',
    };
    return { ...defaultFilters, ...overrides };
  }
  static createSortOptions(overrides?: Partial<ILeaveBankSort>): ILeaveBankSort {
    const defaultSort: ILeaveBankSort = {
      year: -1,
      createdAt: -1,
      employeeId: 1,
    };
    return { ...defaultSort, ...overrides };
  }
  static createErrorScenario(errorType: 'validation' | 'processing' | 'database'): any {
    switch (errorType) {
      case 'validation':
        return {
          employeeData: this.createEmployeeRecord({ employeeId: '' }),
          expectedError: 'Invalid employee ID',
        };
      case 'processing':
        return {
          excelData: null,
          expectedError: 'Invalid file format',
        };
      case 'database':
        return {
          record: this.createLeaveBankRecord(),
          expectedError: 'Database connection failed',
        };
      default:
        return {};
    }
  }
  static createBulkOperationData(count: number = 10): {
    records: IEmployeeData[];
    operations: any[];
  } {
    const records = this.createEmployeeRecords(count);
    const operations = records.map(record => ({
      updateOne: {
        filter: { employeeId: record.employeeId },
        update: { $set: record },
        upsert: true,
      },
    }));
    return { records, operations };
  }
}
