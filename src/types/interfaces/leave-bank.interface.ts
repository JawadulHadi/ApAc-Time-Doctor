import { Month, RecordStatus } from '../enums/leave-bank.enums';
import { UserPayload } from './jwt.interface';
export interface IProcessResult {
  totalRecords: number;
  processed: number;
  errors: number;
  createdCount: number;
  updatedCount: number;
  newMonthCount: number;
  newlyAddedMonth?: string;
  processedUserDetails?: IProcessedUserDetail[];
  hasExistingRecords?: boolean;
}
export interface IProcessedUserDetail {
  employeeId: string;
  name: string;
  year: string;
  status: RecordStatus;
  dataChanged: boolean;
}
export interface IYearlyMonthlyData {
  months: { [key: string]: IMonthData };
  summary: ISummaryData;
}
export interface IEmployeeData {
  department: string;
  name: string;
  employeeId: string;
  email: string;
  role: string;
  designation: string;
  pictureUrl: string;
  teamLeadDetail: {
    userId: string;
    email: string;
    role: string;
    designation: string;
    name: string;
  };
  monthlyData: {
    [key in Month]: IMonthData;
  };
  summary: ISummaryData;
  rowNumber: number;
}
export interface IMonthData {
  workingDays: number;
  shortHours: number;
  casualLeave: number;
  sickLeave: number;
  absent: number;
  extraHours: number;
  netHoursWorked: number;
}
export interface ISummaryData {
  totalCL: number;
  totalSL: number;
  totalAbsent: number;
  totalCLAvailed: number;
  totalSLAvailed: number;
  totalAvailed: number;
  totalAbsentAvailed: number;
  totalShortHours: number;
  totalExtraHours: number;
  remainingCL: number;
  remainingSL: number;
  netLeavesInDays: number;
  shortHoursInDays: number;
}
export interface lead {
  userId: string;
  email: string;
  role: string;
  designation: string;
  name: string;
}
export interface ILeaveBankRecord {
  id: string;
  userId: string;
  profileId: string;
  year: number;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: string;
  designation?: string;
  pictureUrl?: string;
  teamLeadDetail?: {
    userId: string;
    email: string;
    role: string;
    designation?: string;
    name: string;
  };
  monthlyData: Record<string, IYearlyData>;
  isNewRecord: boolean;
  isUpdatedRecord: boolean;
  isNewMonthData: boolean;
  newlyAddedMonth?: string;
  discrepancyResolved: boolean;
  notified: boolean;
  lastNotifiedDate?: Date;
  cancellationDate?: Date;
  uploadBatchId?: string;
  lastUploadDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface IFetchResult {
  records: ITransformedRecord[];
  analytics: IAnalyticsResult;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface IAnalyticsResult {
  activeDepartments: string[];
  activeYears: number[];
  filterYears: Record<string, string[]>;
  filterMonths: string[];
  summary?: {
    totalRecords: number;
    totalWithRemainingCL: number;
    totalWithRemainingSL: number;
    averageRemainingCL: number;
    averageRemainingSL: number;
  };
}
export interface ITransformedRecord {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: string;
  year: number;
  monthlyData: Record<string, unknown>;
  summary: ISummaryData;
  isNewRecord: boolean;
  isUpdatedRecord: boolean;
  isNewMonthData: boolean;
  newlyAddedMonth?: string;
  monthFilter?: string;
  cumulativeUpTo?: string;
  monthSummary?: {
    month: string;
    hasData: boolean;
    totalLeaves: number;
    workingDays: number;
    shortHours: number;
    extraHours: number;
    netHoursWorked: number;
  };
}
export interface ILeaveBankFilter {
  year?: number;
  department?: string;
  employeeId?: string;
  email?: string;
  userId?: string;
  hasRemainingLeaves?: boolean;
  month?: string;
  monthField?: string;
  monthMinValue?: number;
}
export interface ISortOptions {
  field: string;
  order: 'asc' | 'desc';
}
export interface IQueryOptions {
  user: UserPayload;
  year?: string;
  month?: string;
  monthField?: string;
  monthMinValue?: string;
  department?: string;
  employeeId?: string;
  email?: string;
  hasRemainingLeaves?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
export interface IMonthlyData {
  workingDays: number;
  shortHours: number;
  casualLeave: number;
  sickLeave: number;
  absent: number;
  extraHours: number;
  netHoursWorked: number;
}
export interface IYearlyData {
  months: Record<string, IMonthlyData>;
  summary: ISummaryData;
}
export interface IMonthlyBank {
  year: number;
  month: string;
  workingDays?: number;
  shortHours?: number;
  casualLeave?: number;
  sickLeave?: number;
  absent?: number;
  extraHours?: number;
  netHoursWorked?: number;
}
export interface IBankFilter {
  year?: number;
  department?: string;
  employeeId?: string;
  userId?: string;
  email?: string;
  hasRemainingLeaves?: string;
  [key: string]: unknown;
}
export interface ILeaveBankSort {
  [key: string]: 1 | -1;
}
export interface IBatchUserProfilesResult {
  records: ILeaveBankRecord[];
  originalRecords?: ILeaveBankRecord[];
}
