import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

import * as leaveBankEnums from '../../../types/enums/leave-bank.enums';
export class EmployeeNotificationDto {
  @ApiProperty({
    description: 'True to send email, false to cancel action',
    example: true,
  })
  @IsBoolean()
  sendEmail: boolean;
  @ApiProperty({
    description: 'Base URL for email links',
    required: false,
  })
  @IsOptional()
  @IsString()
  baseUrl?: string;
  @ApiProperty({
    description: 'Specific month for action',
    required: false,
    example: '2024-01',
  })
  @IsOptional()
  @IsString()
  month?: string;
  @ApiProperty({
    description: 'Specific year for action',
    required: false,
    example: '2024',
  })
  @IsOptional()
  @IsNumber()
  year?: number;
}
export class AttendanceRecordsDto {
  @ApiProperty({ description: 'Total casual leave quota', example: 8 })
  @IsNumber()
  @IsOptional()
  totalCL?: number;
  @ApiProperty({ description: 'Total sick leave quota', example: 8 })
  @IsNumber()
  @IsOptional()
  totalSL?: number;
  @ApiProperty({ description: 'Total absent days', example: 0 })
  @IsNumber()
  @IsOptional()
  totalAbsent?: number;
  @ApiProperty({ description: 'Total casual leave availed', example: 4 })
  @IsNumber()
  @IsOptional()
  totalCLAvailed?: number;
  @ApiProperty({ description: 'Total sick leave availed', example: 2 })
  @IsNumber()
  @IsOptional()
  totalSLAvailed?: number;
  @ApiProperty({ description: 'Total Absent Availed', example: 2 })
  @IsNumber()
  @IsOptional()
  totalAbsentAvailed?: number;
  @ApiProperty({ description: 'Total short hours', example: 24.5 })
  @IsNumber()
  @IsOptional()
  totalShortHours?: number;
  @ApiProperty({ description: 'Total extra hours', example: 15.5 })
  @IsNumber()
  @IsOptional()
  totalExtraHours?: number;
  @ApiProperty({ description: 'Remaining casual leave', example: 4 })
  @IsNumber()
  @IsOptional()
  remainingCL?: number;
  @ApiProperty({ description: 'Remaining sick leave', example: 6 })
  @IsNumber()
  @IsOptional()
  remainingSL?: number;
  @ApiProperty({ description: 'Net leaves in days', example: 5.78 })
  @IsNumber()
  @IsOptional()
  netLeavesInDays?: number;
  @ApiProperty({ description: 'Short hours in days', example: 3.06 })
  @IsNumber()
  @IsOptional()
  shortHoursInDays?: number;
}
export class YearlyMonthlyDataDto {
  @ApiProperty({ description: 'Monthly data for each month in the year' })
  @IsObject()
  @IsOptional()
  months?: { [key: string]: MonthlyBankDto };
  @ApiProperty({ description: 'Yearly summary data' })
  @ValidateNested()
  @Type(() => AttendanceRecordsDto)
  @IsOptional()
  summary?: AttendanceRecordsDto;
}
class MonthlyBankDto {
  @ApiProperty({ description: 'Working days in month', example: 22 })
  @IsNumber()
  @IsOptional()
  workingDays?: number;
  @ApiProperty({ description: 'Short hours', example: 4.5 })
  @IsNumber()
  @IsOptional()
  shortHours?: number;
  @ApiProperty({ description: 'Casual leave days', example: 2 })
  @IsNumber()
  @IsOptional()
  casualLeave?: number;
  @ApiProperty({ description: 'Sick leave days', example: 1 })
  @IsNumber()
  @IsOptional()
  sickLeave?: number;
  @ApiProperty({ description: 'Absent days', example: 0 })
  @IsNumber()
  @IsOptional()
  absent?: number;
  @ApiProperty({ description: 'Extra hours', example: 5.5 })
  @IsNumber()
  @IsOptional()
  extraHours?: number;
  @ApiProperty({ description: 'Net hours worked', example: 176.5 })
  @IsNumber()
  @IsOptional()
  netHoursWorked?: number;
}
class MonthlyBankUpdateDto {
  @ApiPropertyOptional({ description: 'Working days in month', example: 22 })
  @IsNumber()
  @IsOptional()
  workingDays?: number;
  @ApiPropertyOptional({ description: 'Short hours', example: 4.5 })
  @IsNumber()
  @IsOptional()
  shortHours?: number;
  @ApiPropertyOptional({ description: 'Casual leave days', example: 2 })
  @IsNumber()
  @IsOptional()
  casualLeave?: number;
  @ApiPropertyOptional({ description: 'Sick leave days', example: 1 })
  @IsNumber()
  @IsOptional()
  sickLeave?: number;
  @ApiPropertyOptional({ description: 'Absent days', example: 0 })
  @IsNumber()
  @IsOptional()
  absent?: number;
  @ApiPropertyOptional({ description: 'Extra hours', example: 5.5 })
  @IsNumber()
  @IsOptional()
  extraHours?: number;
  @ApiPropertyOptional({ description: 'Net hours worked', example: 176.5 })
  @IsNumber()
  @IsOptional()
  netHoursWorked?: number;
}
export class AttendanceRecordsUpdateDto {
  @ApiPropertyOptional({ description: 'Total casual leave quota', example: 8 })
  @IsNumber()
  @IsOptional()
  totalCL?: number;
  @ApiPropertyOptional({ description: 'Total sick leave quota', example: 8 })
  @IsNumber()
  @IsOptional()
  totalSL?: number;
  @ApiPropertyOptional({ description: 'Total absent days', example: 0 })
  @IsNumber()
  @IsOptional()
  totalAbsent?: number;
  @ApiPropertyOptional({ description: 'Total casual leave availed', example: 4 })
  @IsNumber()
  @IsOptional()
  totalCLAvailed?: number;
  @ApiPropertyOptional({ description: 'Total sick leave availed', example: 2 })
  @IsNumber()
  @IsOptional()
  totalSLAvailed?: number;
  @ApiPropertyOptional({ description: 'Total Absent Availed', example: 2 })
  @IsNumber()
  @IsOptional()
  totalAbsentAvailed?: number;
  @ApiPropertyOptional({ description: 'Total short hours', example: 24.5 })
  @IsNumber()
  @IsOptional()
  totalShortHours?: number;
  @ApiPropertyOptional({ description: 'Total extra hours', example: 15.5 })
  @IsNumber()
  @IsOptional()
  totalExtraHours?: number;
  @ApiPropertyOptional({ description: 'Remaining casual leave', example: 4 })
  @IsNumber()
  @IsOptional()
  remainingCL?: number;
  @ApiPropertyOptional({ description: 'Remaining sick leave', example: 6 })
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  remainingSL?: number;
  @ApiPropertyOptional({ description: 'Net leaves in days', example: 5.78 })
  @IsNumber()
  @IsOptional()
  netLeavesInDays?: number;
  @ApiPropertyOptional({ description: 'Short hours in days', example: 3.06 })
  @IsNumber()
  @IsOptional()
  shortHoursInDays?: number;
}
export class YearlyMonthlyDataUpdateDto {
  @ApiPropertyOptional({ description: 'Monthly data for each month in the year' })
  @IsObject()
  @IsOptional()
  months?: { [key: string]: MonthlyBankUpdateDto };
  @ApiPropertyOptional({ description: 'Yearly summary data' })
  @ValidateNested()
  @Type(() => AttendanceRecordsUpdateDto)
  @IsOptional()
  summary?: AttendanceRecordsUpdateDto;
}
class FederalHolidayUpdateDto {
  @ApiPropertyOptional({ description: 'US Off date 1', example: '2025-01-20T00:00:00.000Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  usOff1?: Date | null;
  @ApiPropertyOptional({ description: 'US Off date 2', example: '2025-05-26T00:00:00.000Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  usOff2?: Date | null;
  @ApiPropertyOptional({ description: 'US Off date 3', example: '2025-07-04T00:00:00.000Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  usOff3?: Date | null;
  @ApiPropertyOptional({ description: 'US Off date 4', example: '2025-11-27T00:00:00.000Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  usOff4?: Date | null;
  @ApiPropertyOptional({ description: 'CAD Off date 1', example: '2025-04-18T00:00:00.000Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  cadOff1?: Date | null;
  @ApiPropertyOptional({ description: 'CAD Off date 2', example: '2025-05-19T00:00:00.000Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  cadOff2?: Date | null;
  @ApiPropertyOptional({ description: 'CAD Off date 3', example: '2025-07-01T00:00:00.000Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  cadOff3?: Date | null;
  @ApiPropertyOptional({ description: 'CAD Off date 4', example: '2025-10-13T00:00:00.000Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  cadOff4?: Date | null;
  @ApiPropertyOptional({ description: 'US Off 1 Status', enum: leaveBankEnums.HolidayStatusEnum })
  @IsEnum(leaveBankEnums.HolidayStatusEnum)
  @IsOptional()
  usOff1Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({ description: 'US Off 2 Status', enum: leaveBankEnums.HolidayStatusEnum })
  @IsEnum(leaveBankEnums.HolidayStatusEnum)
  @IsOptional()
  usOff2Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({ description: 'US Off 3 Status', enum: leaveBankEnums.HolidayStatusEnum })
  @IsEnum(leaveBankEnums.HolidayStatusEnum)
  @IsOptional()
  usOff3Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({ description: 'US Off 4 Status', enum: leaveBankEnums.HolidayStatusEnum })
  @IsEnum(leaveBankEnums.HolidayStatusEnum)
  @IsOptional()
  usOff4Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({ description: 'CAD Off 1 Status', enum: leaveBankEnums.HolidayStatusEnum })
  @IsEnum(leaveBankEnums.HolidayStatusEnum)
  @IsOptional()
  cadOff1Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({ description: 'CAD Off 2 Status', enum: leaveBankEnums.HolidayStatusEnum })
  @IsEnum(leaveBankEnums.HolidayStatusEnum)
  @IsOptional()
  cadOff2Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({ description: 'CAD Off 3 Status', enum: leaveBankEnums.HolidayStatusEnum })
  @IsEnum(leaveBankEnums.HolidayStatusEnum)
  @IsOptional()
  cadOff3Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({ description: 'CAD Off 4 Status', enum: leaveBankEnums.HolidayStatusEnum })
  @IsEnum(leaveBankEnums.HolidayStatusEnum)
  @IsOptional()
  cadOff4Status?: leaveBankEnums.HolidayStatus | null;
}
export class UpdateLeaveBankDto {
  @ApiPropertyOptional({ description: 'User ID reference', example: '507f1f77bcf86cd799439012' })
  @IsMongoId()
  @IsOptional()
  userId?: Types.ObjectId;
  @ApiPropertyOptional({ description: 'Profile ID reference', example: '507f1f77bcf86cd799439013' })
  @IsMongoId()
  @IsOptional()
  profileId?: Types.ObjectId;
  @ApiPropertyOptional({ description: 'Year for the record', example: 2025 })
  @IsNumber()
  @IsOptional()
  year?: number;
  @ApiPropertyOptional({ description: 'Employee ID', example: 'MAS-CAN-4136' })
  @IsString()
  @IsOptional()
  employeeId?: string;
  @ApiPropertyOptional({ description: 'Employee name', example: 'Aashan Bilawal' })
  @IsString()
  @IsOptional()
  name?: string;
  @ApiPropertyOptional({ description: 'Employee name', example: 'Aashan Bilawal' })
  @IsString()
  @IsOptional()
  newlyAddedMonth?: string;
  @ApiPropertyOptional({ description: 'Employee email', example: 'aashan@microagility.com' })
  @IsString()
  @IsOptional()
  email?: string;
  @ApiPropertyOptional({ description: 'Department', example: 'Canadian BD' })
  @IsString()
  @IsOptional()
  department?: string;
  @ApiPropertyOptional({
    description: 'Flag indicating if this record was updated in the last upload',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isUpdatedRecord?: boolean;
  @ApiPropertyOptional({
    description: 'Flag indicating if this record was notified',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  notified?: boolean;
  @ApiPropertyOptional({
    description: 'Timestamp of the last notification',
    example: '2025-01-15T10:30:00Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastNotifiedDate?: Date;
  @ApiPropertyOptional({
    description: 'Flag indicating if discrepancy was resolved',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  discrepancyResolved?: boolean;
  @ApiPropertyOptional({
    description: 'Timestamp of cancellation',
    example: '2025-01-15T10:30:00Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  cancellationDate?: Date;
  @ApiPropertyOptional({
    description: 'Flag indicating if this is a new record',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isNewRecord?: boolean;
  @ApiPropertyOptional({
    description: 'Timestamp of the last upload',
    example: '2025-01-15T10:30:00Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastUploadDate?: Date;
  @ApiPropertyOptional({
    description: 'Upload batch ID',
    example: '507f1f77bcf86cd799439014',
  })
  @IsString()
  @IsOptional()
  uploadBatchId?: string;
  @ApiPropertyOptional({ description: 'Multi-year monthly data structure' })
  @IsObject()
  @IsOptional()
  monthlyData?: { [year: string]: YearlyMonthlyDataDto };
  @ApiPropertyOptional({ description: 'January attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  january?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'February attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  february?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'March attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  march?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'April attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  april?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'May attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  may?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'June attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  june?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'July attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  july?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'August attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  august?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'September attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  september?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'October attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  october?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'November attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  november?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'December attendance data (legacy)' })
  @ValidateNested()
  @Type(() => MonthlyBankUpdateDto)
  @IsOptional()
  december?: MonthlyBankUpdateDto;
  @ApiPropertyOptional({ description: 'Current year summary (legacy)' })
  @ValidateNested()
  @Type(() => AttendanceRecordsUpdateDto)
  @IsOptional()
  summary?: AttendanceRecordsUpdateDto;
  @ApiPropertyOptional({ description: 'Federal holiday data' })
  @ValidateNested()
  @Type(() => FederalHolidayUpdateDto)
  @IsOptional()
  federalHolidays?: FederalHolidayUpdateDto;
}
export class FederalHolidayDto {
  @ApiPropertyOptional({ description: 'US Off date 1', example: '2025-01-20T00:00:00.000Z' })
  @IsOptional()
  usOff1?: Date | null;
  @ApiPropertyOptional({ description: 'US Off date 2', example: '2025-05-26T00:00:00.000Z' })
  @IsOptional()
  usOff2?: Date | null;
  @ApiPropertyOptional({ description: 'US Off date 3', example: '2025-07-04T00:00:00.000Z' })
  @IsOptional()
  usOff3?: Date | null;
  @ApiPropertyOptional({ description: 'US Off date 4', example: '2025-11-27T00:00:00.000Z' })
  @IsOptional()
  usOff4?: Date | null;
  @ApiPropertyOptional({ description: 'CAD Off date 1', example: '2025-04-18T00:00:00.000Z' })
  @IsOptional()
  cadOff1?: Date | null;
  @ApiPropertyOptional({ description: 'CAD Off date 2', example: '2025-05-19T00:00:00.000Z' })
  @IsOptional()
  cadOff2?: Date | null;
  @ApiPropertyOptional({ description: 'CAD Off date 3', example: '2025-07-01T00:00:00.000Z' })
  @IsOptional()
  cadOff3?: Date | null;
  @ApiPropertyOptional({ description: 'CAD Off date 4', example: '2025-10-13T00:00:00.000Z' })
  @IsOptional()
  cadOff4?: Date | null;
  @ApiPropertyOptional({
    description: 'US Off 1 Status',
    enum: ['Off', 'No Off', 'No Off but added', 'N/a'],
  })
  @IsEnum(['Off', 'No Off', 'No Off but added', 'N/a'])
  @IsOptional()
  usOff1Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({
    description: 'US Off 2 Status',
    enum: ['Off', 'No Off', 'No Off but added', 'N/a'],
  })
  @IsEnum(['Off', 'No Off', 'No Off but added', 'N/a'])
  @IsOptional()
  usOff2Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({
    description: 'US Off 3 Status',
    enum: ['Off', 'No Off', 'No Off but added', 'N/a'],
  })
  @IsEnum(['Off', 'No Off', 'No Off but added', 'N/a'])
  @IsOptional()
  usOff3Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({
    description: 'US Off 4 Status',
    enum: ['Off', 'No Off', 'No Off but added', 'N/a'],
  })
  @IsEnum(['Off', 'No Off', 'No Off but added', 'N/a'])
  @IsOptional()
  usOff4Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({
    description: 'CAD Off 1 Status',
    enum: ['Off', 'No Off', 'No Off but added', 'N/a'],
  })
  @IsEnum(['Off', 'No Off', 'No Off but added', 'N/a'])
  @IsOptional()
  cadOff1Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({
    description: 'CAD Off 2 Status',
    enum: ['Off', 'No Off', 'No Off but added', 'N/a'],
  })
  @IsEnum(['Off', 'No Off', 'No Off but added', 'N/a'])
  @IsOptional()
  cadOff2Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({
    description: 'CAD Off 3 Status',
    enum: ['Off', 'No Off', 'No Off but added', 'N/a'],
  })
  @IsEnum(['Off', 'No Off', 'No Off but added', 'N/a'])
  @IsOptional()
  cadOff3Status?: leaveBankEnums.HolidayStatus | null;
  @ApiPropertyOptional({
    description: 'CAD Off 4 Status',
    enum: ['Off', 'No Off', 'No Off but added', 'N/a'],
  })
  @IsEnum(['Off', 'No Off', 'No Off but added', 'N/a'])
  @IsOptional()
  cadOff4Status?: leaveBankEnums.HolidayStatus | null;
}
export class CreateLeaveBankDto {
  @ApiProperty({ description: 'User ID reference', example: '507f1f77bcf86cd799439012' })
  @IsMongoId()
  @IsOptional()
  userId?: string;
  @ApiProperty({ description: 'Profile ID reference', example: '507f1f77bcf86cd799439013' })
  @IsMongoId()
  @IsOptional()
  profileId?: string;
  @ApiProperty({ description: 'Year for the record', example: 2025 })
  @IsNumber()
  @IsOptional()
  year?: number;
  @ApiProperty({ description: 'Employee ID', example: 'MAS-CAN-4136' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;
  @ApiProperty({ description: 'Employee name', example: 'Aashan Bilawal' })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'Employee email', example: 'aashan@microagility.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiProperty({ description: 'Department', example: 'Canadian BD' })
  @IsString()
  @IsOptional()
  department?: string;
  @ApiProperty({ description: 'New Added Month', example: 'January' })
  @IsString()
  @IsOptional()
  newlyAddedMonth?: string;
  @IsBoolean()
  @IsOptional()
  isUpdatedRecord?: boolean;
  @IsBoolean()
  @IsOptional()
  isNewRecord?: boolean;
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastUploadDate?: Date;
  @IsString()
  @IsOptional()
  uploadBatchId?: string;
  @ApiPropertyOptional({ description: 'Multi-year monthly data structure' })
  @IsObject()
  @IsOptional()
  monthlyData?: { [year: string]: YearlyMonthlyDataDto };
  @ApiPropertyOptional({ description: 'January attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  january?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'February attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  february?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'March attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  march?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'April attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  april?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'May attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  may?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'June attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  june?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'July attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  july?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'August attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  august?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'September attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  september?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'October attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  october?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'November attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  november?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'December attendance data (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => MonthlyBankDto)
  december?: MonthlyBankDto;
  @ApiPropertyOptional({ description: 'Current year summary (legacy)' })
  @IsObject()
  @IsOptional()
  @Type(() => AttendanceRecordsDto)
  summary?: AttendanceRecordsDto;
  @ApiPropertyOptional({ description: 'Holiday data for US and CAD off days' })
  @IsObject()
  @IsOptional()
  @Type(() => FederalHolidayDto)
  federalHolidays?: FederalHolidayDto;
}
