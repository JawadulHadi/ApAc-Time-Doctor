export const HolidayStatusEnum = ['Off', 'No Off', 'No Off but added', 'N/a'] as const;
export type HolidayStatus = (typeof HolidayStatusEnum)[number];
export enum Month {
  JANUARY = 'january',
  FEBRUARY = 'february',
  MARCH = 'march',
  APRIL = 'april',
  MAY = 'may',
  JUNE = 'june',
  JULY = 'july',
  AUGUST = 'august',
  SEPTEMBER = 'september',
  OCTOBER = 'october',
  NOVEMBER = 'november',
  DECEMBER = 'december',
}
export enum MonthField {
  WORKING_DAYS = 'workingDays',
  SHORT_HOURS = 'shortHours',
  CASUAL_LEAVE = 'casualLeave',
  SICK_LEAVE = 'sickLeave',
  ABSENT = 'absent',
  EXTRA_HOURS = 'extraHours',
  NET_HOURS_WORKED = 'netHoursWorked',
}
export enum RecordStatus {
  NEW = 'new_month',
  UPDATED = 'updated',
  UNCHANGED = 'unchanged',
  CREATED = 'created',
  NOT_FOUND = 'not_found',
}
export enum Values {
  EPSILON = 0.0001,
  ANNUAL_CL = 8,
  ANNUAL_SL = 8,
  HOURS = 9,
}
export enum LeaveBankError {
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  MISSING_DATA_SHEET = 'MISSING_DATA_SHEET',
  INVALID_EMPLOYEE_DATA = 'INVALID_EMPLOYEE_DATA',
  PROCESSING_FAILED = 'PROCESSING_FAILED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INVALID_EMPLOYEE_ID = 'INVALID_EMPLOYEE_ID',
  INVALID_YEAR = 'INVALID_YEAR',
  INVALID_MONTH = 'INVALID_MONTH',
  INVALID_OBJECT_ID = 'INVALID_OBJECT_ID',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
}
export enum DAYS {
  DATA_START_ROW = 4,
  HOLIDAY_ROW = 3,
  HEADER_ROW = 4,
  SAMPLE_ROWS_FOR_DETECTION = 10,
  MONTH_DATA_FIELDS_COUNT = 7,
}
export enum COLUMNS {
  DEPARTMENT = 'B',
  NAME = 'C',
  EMPLOYEE_ID = 'D',
  EMAIL = 'E',
  TOTAL_CL = 'CL',
  TOTAL_SL = 'CM',
  TOTAL_ABSENT = 'CN',
  TOTAL_CL_AVAILED = 'CO',
  TOTAL_SL_AVAILED = 'CP',
  TOTAL_ABSENT_AVAILED = 'CQ',
  TOTAL_SHORT_HOURS = 'CR',
  TOTAL_EXTRA_HOURS = 'CS',
  REMAINING_CL = 'CT',
  REMAINING_SL = 'CU',
  NET_LEAVES_IN_DAYS = 'CV',
  SHORT_HOURS_IN_DAYS = 'CW',
  US_OFF_1 = 'CX',
  US_OFF_2 = 'CY',
  US_OFF_3 = 'CZ',
  US_OFF_4 = 'DA',
  CAD_OFF_1 = 'DB',
  CAD_OFF_2 = 'DC',
  CAD_OFF_3 = 'DD',
  CAD_OFF_4 = 'DE',
}
