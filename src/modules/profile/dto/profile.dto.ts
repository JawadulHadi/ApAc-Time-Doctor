import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

import { MissionStatementSchema } from '../schemas/profiles.schema';
import { UserStatus } from '@/types/constants/user-status.constants';
import { IndicatorStatus, IStatementStatus } from '@/types/enums/profile.enums';
import { Role } from '@/types/enums/role.enums';

export class SuccessIndicatorDto {
  @ApiProperty({ description: 'Quarter key number', example: 1 })
  @IsInt()
  key: number;
  @ApiProperty({ description: 'Indicator indexing ID', example: 1 })
  @IsInt()
  id: number;
  @ApiProperty({ description: 'Indicator content' })
  @IsString()
  content: string;
  @ApiProperty({ description: 'Indicator status', enum: IndicatorStatus })
  @IsEnum(IndicatorStatus)
  status: IndicatorStatus;
  @ApiProperty({ description: 'Whether indicator is moved', default: false })
  @IsBoolean()
  isMoved: boolean;
  @ApiProperty({ description: 'Whether indicator is transferred', default: false })
  @IsBoolean()
  isTransferred: boolean;
  @ApiPropertyOptional({ description: 'log for moving' })
  @IsOptional()
  @IsString()
  log?: string;
  @ApiPropertyOptional({ description: 'Target quarter where moved to', example: 1 })
  @IsInt()
  @IsOptional()
  to?: number;
  @ApiPropertyOptional({ description: 'Source quarter where moved from', example: 1 })
  @IsInt()
  @IsOptional()
  from?: number;
}
export class SuccessIndicatorQuarterDto {
  @ApiProperty({ description: 'Quarter number (1-4)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(4)
  quarter: number;
  @ApiProperty({ description: 'Is this quarter active for goal tracking', default: false })
  @IsBoolean()
  isActive: boolean;
  @ApiProperty({ description: 'Year for the quarter', example: 2026 })
  @IsInt()
  year: number;
  @ApiProperty({ description: 'Indicators for this quarter', type: [SuccessIndicatorDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SuccessIndicatorDto)
  indicators: SuccessIndicatorDto[];
}
export class SubmissionQuarterDto {
  @ApiProperty({
    description: 'Array of success indicator quarters',
    type: [SuccessIndicatorQuarterDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SuccessIndicatorQuarterDto)
  successIndicators: SuccessIndicatorQuarterDto[];
}
export class CreateStatementDto {
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @IsOptional()
  content?: string;
}
export class ReviewMissionStatementDto {
  @IsEnum(IStatementStatus)
  status: IStatementStatus;
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  changesRequired?: string;
}
export class AddMissionStatementDto {
  @ApiProperty({
    description: 'Mission statement content',
    example: 'To deliver innovative solutions...',
  })
  @IsString()
  statement: string;
}
export class CreateProfileDto {
  @ApiProperty({ description: 'User ID reference', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  userId: Types.ObjectId;
  @ApiProperty({ description: 'User email address', example: 'jhadii@mailinator.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  firstName: string;
  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  lastName: string;
  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @IsString()
  fullName: string;
  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    example: 'ACTIVE',
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;
  @ApiPropertyOptional({
    description: 'User salary',
    example: '50000',
  })
  @IsString()
  @IsOptional()
  salary?: string;
  @ApiPropertyOptional({
    description: 'Profile picture URL from GCS',
    example: 'https://storage.googleapis.com/iagility-apac-user/profile-pics/user123.jpg',
  })
  @IsOptional()
  profilePicture?: any;
  @ApiPropertyOptional({ description: 'Resume document' })
  @IsOptional()
  resume?: any;
  @ApiPropertyOptional({ description: 'ID Proof document' })
  @IsOptional()
  idProof?: any;
  @ApiPropertyOptional({ description: 'Other documents' })
  @IsArray()
  @IsOptional()
  documents?: any[];
  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-05-15' })
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;
  @ApiPropertyOptional({
    description: 'Designation/Job title',
    example: 'Senior Software Engineer',
  })
  @IsString()
  @IsOptional()
  designation?: string;
  @ApiProperty({ description: 'User role', enum: Role, example: 'MEMBER' })
  @IsEnum(Role)
  role: Role;
  @ApiPropertyOptional({ description: 'Employee ID', example: 'EMP-12345' })
  @IsString()
  @IsOptional()
  employeeId?: string;
  @ApiPropertyOptional({ description: 'Contact number', example: '+1234567890' })
  @IsString()
  @IsOptional()
  @Matches(/^\+\d{11}$/, { message: 'Contact number must be in format: +XXXXXXXXXXX' })
  contactNumber?: string;
  @ApiPropertyOptional({ description: 'Emergency contact', example: '+0987654321' })
  @IsString()
  @IsOptional()
  @Matches(/^\+\d{11}$/, { message: 'Emergency contact must be in format: +XXXXXXXXXXX' })
  emergencyContact?: string;
  @ApiPropertyOptional({ description: 'Current address', example: '123 Main St, City, Country' })
  @IsString()
  @IsOptional()
  currentAddress?: string;
  @ApiPropertyOptional({ description: 'Permanent address', example: '456 Main St, City, Country' })
  @IsString()
  @IsOptional()
  permanentAddress?: string;
  @ApiPropertyOptional({ description: 'Date of joining', example: '2023-01-15' })
  @IsDate()
  @IsOptional()
  dateOfJoining?: Date;
  @ApiPropertyOptional({ description: 'Date of leaving', example: '2023-12-15' })
  @IsDate()
  @IsOptional()
  leftUs?: Date;
  @ApiPropertyOptional({ description: 'Date of re-joining', example: '2024-01-15' })
  @IsDate()
  @IsOptional()
  rejoinUs?: Date;
  @ApiPropertyOptional({
    description: 'Skills array',
    example: ['JavaScript', 'Node', 'MongoDB'],
  })
  @IsArray()
  @IsOptional()
  skills?: string[];
  @ApiPropertyOptional({
    description: 'Achievement array',
    example: ['certification', 'AI', 'courses'],
  })
  @IsArray()
  @IsOptional()
  achievements?: string[];
  @ApiPropertyOptional({
    description: 'Mission statement/About me',
    type: MissionStatementSchema,
  })
  @IsOptional()
  missionStatement?: MissionStatementSchema;
  @ApiPropertyOptional({ description: 'Created by user ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  @IsOptional()
  createdBy?: Types.ObjectId | null;
  @ApiPropertyOptional({ description: 'Updated by user ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  @IsOptional()
  updatedBy?: Types.ObjectId | null;
}
export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'User email address', example: 'jhadii@mailinator.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;
  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;
  @ApiPropertyOptional({ description: 'Full name', example: 'John Doe' })
  @IsString()
  @IsOptional()
  fullName?: string;
  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    example: 'ACTIVE',
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
  @ApiPropertyOptional({
    description: 'User salary',
    example: '50000',
  })
  @IsString()
  @IsOptional()
  salary?: string;
  @ApiPropertyOptional({
    description: 'Profile picture URL from GCS',
    example: 'https://storage.googleapis.com/iagility-apac-user/profile-pics/user123.jpg',
  })
  @IsOptional()
  profilePicture?: any;
  @ApiPropertyOptional({ description: 'Resume document' })
  @IsOptional()
  resume?: any;
  @ApiPropertyOptional({ description: 'ID Proof document' })
  @IsOptional()
  idProof?: any;
  @ApiPropertyOptional({ description: 'Other documents' })
  @IsArray()
  @IsOptional()
  documents?: any[];
  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-05-15' })
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;
  @ApiPropertyOptional({
    description: 'Designation/Job title',
    example: 'Senior Software Engineer',
  })
  @IsString()
  @IsOptional()
  designation?: string;
  @ApiPropertyOptional({ description: 'User role', enum: Role, example: 'MEMBER' })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
  @ApiPropertyOptional({ description: 'Employee ID', example: 'EMP-12345' })
  @IsString()
  @IsOptional()
  employeeId?: string;
  @ApiPropertyOptional({ description: 'Contact number', example: '+1234567890' })
  @IsString()
  @IsOptional()
  @Matches(/^\+\d{11}$/, { message: 'Contact number must be in format: +XXXXXXXXXXX' })
  contactNumber?: string;
  @ApiPropertyOptional({ description: 'Emergency contact', example: '+0987654321' })
  @IsString()
  @IsOptional()
  @Matches(/^\+\d{11}$/, { message: 'Emergency contact must be in format: +XXXXXXXXXXX' })
  emergencyContact?: string;
  @ApiPropertyOptional({ description: 'Current address', example: '123 Main St, City, Country' })
  @IsString()
  @IsOptional()
  currentAddress?: string;
  @ApiPropertyOptional({ description: 'Permanent address', example: '456 Main St, City, Country' })
  @IsString()
  @IsOptional()
  permanentAddress?: string;
  @ApiPropertyOptional({ description: 'Date of joining', example: '2023-01-15' })
  @IsDate()
  @IsOptional()
  dateOfJoining?: Date;
  @ApiPropertyOptional({ description: 'Date of leaving', example: '2023-12-15' })
  @IsDate()
  @IsOptional()
  leftUs?: Date;
  @ApiPropertyOptional({ description: 'Date of re-joining', example: '2024-01-15' })
  @IsDate()
  @IsOptional()
  rejoinUs?: Date;
  @ApiPropertyOptional({
    description: 'Skills array',
    example: ['JavaScript', 'Node', 'MongoDB'],
  })
  @IsArray()
  @IsOptional()
  skills?: string[];
  @ApiPropertyOptional({
    description: 'Achievement array',
    example: ['certification', 'AI', 'courses'],
  })
  @IsArray()
  @IsOptional()
  achievements?: string[];
  @ApiPropertyOptional({
    description: 'Mission statement/About me',
    type: MissionStatementSchema,
  })
  @IsOptional()
  missionStatement?: MissionStatementSchema;
  @ApiPropertyOptional({ description: 'Updated by user ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  @IsOptional()
  updatedBy?: Types.ObjectId | null;
}
