import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
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

import { BloodGroup, Gender, MaritalStatus } from '../../../types/enums/personal-info.enums';
import { HiringStage } from '../../../types/enums/recruitment.enums';
export class AddCandidateDto {
  @ApiProperty({ description: 'Candidate email address', example: 'candidate@mailinator.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName: string;
  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName: string;
  @ApiProperty({ description: 'Job title', example: 'Software Engineer' })
  @IsString({ message: 'Job title must be a string' })
  @IsNotEmpty({ message: 'Job title is required' })
  @MinLength(2, { message: 'Job title must be at least 2 characters long' })
  @MaxLength(100, { message: 'Job title cannot exceed 100 characters' })
  jobTitle: string;
  @ApiProperty({ description: 'Department ID' })
  @IsMongoId({ message: 'Please provide a valid department ID' })
  @IsNotEmpty({ message: 'Department is required' })
  department: Types.ObjectId;
  @ApiProperty({ description: 'Work timing start', example: '09:00 AM' })
  @IsString({ message: 'Timing start must be a string' })
  @IsNotEmpty({ message: 'Work timing start is required' })
  @MaxLength(20, { message: 'Timing start cannot exceed 20 characters' })
  @Matches(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/, {
    message: 'Timing start must be in the format HH:MM AM/PM (e.g., 09:00 AM)',
  })
  timingStart: string;
  @ApiProperty({ description: 'Work timing end', example: '06:00 PM' })
  @IsString({ message: 'Timing end must be a string' })
  @IsNotEmpty({ message: 'Work timing end is required' })
  @MaxLength(20, { message: 'Timing end cannot exceed 20 characters' })
  @Matches(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/, {
    message: 'Timing end must be in the format HH:MM AM/PM (e.g., 06:00 PM)',
  })
  timingEnd: string;
}
class OrganizationDto {
  @ApiProperty({ description: 'Organization name', example: 'Tech Corp' })
  @IsString({ message: 'Organization name must be a string' })
  @IsNotEmpty({ message: 'Organization name is required' })
  @MinLength(2, { message: 'Organization name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Organization name cannot exceed 100 characters' })
  name: string;
  @ApiProperty({ description: 'Point of contact name', example: 'John Smith' })
  @IsString({ message: 'Point of contact must be a string' })
  @IsNotEmpty({ message: 'Point of contact is required' })
  @MinLength(2, { message: 'Point of contact must be at least 2 characters long' })
  @MaxLength(100, { message: 'Point of contact cannot exceed 100 characters' })
  pointOfContact: string;
  @ApiProperty({ description: 'Contact cell number', example: '+1234567890' })
  @IsString({ message: 'Contact cell must be a string' })
  @IsNotEmpty({ message: 'Contact cell is required' })
  @MinLength(10, { message: 'Contact cell must be at least 10 characters long' })
  @MaxLength(20, { message: 'Contact cell cannot exceed 20 characters' })
  contactCell: string;
  @ApiProperty({ description: 'Business email', example: 'contact@techcorp.com' })
  @IsEmail({}, { message: 'Please provide a valid business email address' })
  @IsNotEmpty({ message: 'Business email is required' })
  businessEmail: string;
}
export class ClarificationFormDto {
  @ApiProperty({ description: 'First name' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName: string;
  @ApiProperty({ description: 'Last name' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName: string;
  @ApiProperty({ description: 'CNIC number', example: '12345-1234567-1' })
  @IsString({ message: 'CNIC number must be a string' })
  @IsNotEmpty({ message: 'CNIC number is required' })
  @MinLength(13, { message: 'CNIC number must be at least 13 characters long' })
  @MaxLength(15, { message: 'CNIC number cannot exceed 15 characters' })
  @Matches(/^\d{5}-\d{7}-\d{1}$/, { message: 'CNIC must be in format: 12345-1234567-1' })
  cnicNo: string;
  @ApiProperty({ description: 'Long-term commitment explanation' })
  @IsString({ message: 'Long-term commitment must be a string' })
  @IsNotEmpty({ message: 'Long-term commitment explanation is required' })
  @MaxLength(1000, { message: 'Long-term commitment cannot exceed 1000 characters' })
  longTermCommitment: string;
  @ApiProperty({ description: 'One year commitment agreement' })
  @IsString({ message: 'One year commitment must be a string' })
  @IsNotEmpty({ message: 'One year commitment agreement is required' })
  @MaxLength(1000, { message: 'One year commitment cannot exceed 1000 characters' })
  oneYearCommitment: string;
  @ApiProperty({ description: 'Reference check allowed' })
  @IsString({ message: 'Reference check allowed must be a string' })
  @IsNotEmpty({ message: 'Reference check permission is required' })
  @MaxLength(500, { message: 'Reference check response cannot exceed 500 characters' })
  referenceCheckAllowed: string;
  @ApiPropertyOptional({ type: OrganizationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrganizationDto)
  currentOrganization?: OrganizationDto;
  @ApiPropertyOptional({ type: OrganizationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrganizationDto)
  previousOrganization?: OrganizationDto;
  @ApiProperty({ description: 'Current gross salary' })
  @IsString({ message: 'Current gross salary must be a string' })
  @IsNotEmpty({ message: 'Current gross salary is required' })
  @MaxLength(50, { message: 'Current gross salary cannot exceed 50 characters' })
  currentGrossSalary: string;
  @ApiPropertyOptional({ description: 'Monthly commissions' })
  @IsOptional()
  @IsString({ message: 'Monthly commissions must be a string' })
  @MaxLength(50, { message: 'Monthly commissions cannot exceed 50 characters' })
  monthlyCommissions?: string;
  @ApiPropertyOptional({ description: 'Perks and benefits' })
  @IsOptional()
  @IsString({ message: 'Perks and benefits must be a string' })
  @MaxLength(500, { message: 'Perks and benefits cannot exceed 500 characters' })
  perksAndBenefits?: string;
  @ApiPropertyOptional({ description: 'Health insurance' })
  @IsOptional()
  @IsString({ message: 'Health insurance must be a string' })
  @MaxLength(200, { message: 'Health insurance cannot exceed 200 characters' })
  healthInsurance?: string;
  @ApiPropertyOptional({ description: 'Life insurance' })
  @IsOptional()
  @IsString({ message: 'Life insurance must be a string' })
  @MaxLength(200, { message: 'Life insurance cannot exceed 200 characters' })
  lifeInsurance?: string;
  @ApiPropertyOptional({ description: 'EOBI' })
  @IsOptional()
  @IsString({ message: 'EOBI must be a string' })
  @MaxLength(200, { message: 'EOBI cannot exceed 200 characters' })
  eobi?: string;
  @ApiPropertyOptional({ description: 'Increments' })
  @IsOptional()
  @IsString({ message: 'Increments must be a string' })
  @MaxLength(200, { message: 'Increments cannot exceed 200 characters' })
  increments?: string;
  @ApiProperty({ description: 'Expected gross salary' })
  @IsString({ message: 'Expected gross salary must be a string' })
  @IsNotEmpty({ message: 'Expected gross salary is required' })
  @MaxLength(50, { message: 'Expected gross salary cannot exceed 50 characters' })
  expectedGrossSalary: string;
  @ApiProperty({ description: 'Notice period in days' })
  @IsNumber({}, { message: 'Notice period must be a number' })
  @IsNotEmpty({ message: 'Notice period is required' })
  @Min(0, { message: 'Notice period cannot be negative' })
  @Max(365, { message: 'Notice period cannot exceed 365 days' })
  noticePeriod: number;
  @ApiProperty({ description: 'Office timing comfort (05:00 PM - 02:00 AM)' })
  @IsString({ message: 'Office timing comfort must be a string' })
  @IsNotEmpty({ message: 'Office timing comfort is required' })
  @MaxLength(500, { message: 'Office timing comfort cannot exceed 500 characters' })
  officeTimingComfort: string;
  @ApiProperty({ description: 'Digital signature or full name' })
  @IsString({ message: 'Signature must be a string' })
  @IsNotEmpty({ message: 'Signature is required' })
  @MinLength(1, { message: 'Signature must be at least 1 character long' })
  @MaxLength(100, { message: 'Signature cannot exceed 100 characters' })
  signature: string;
  @ApiPropertyOptional({ description: 'Submission timestamp' })
  @IsOptional()
  @IsDate({ message: 'Submitted at must be a valid date' })
  submittedAt?: Date;
}
class EmergencyContactDto {
  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString({ message: 'Emergency contact name must be a string' })
  @MinLength(2, { message: 'Emergency contact name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Emergency contact name cannot exceed 100 characters' })
  name?: string;
  @ApiPropertyOptional({ description: 'Relationship to candidate' })
  @IsOptional()
  @IsString({ message: 'Relationship must be a string' })
  @MaxLength(50, { message: 'Relationship cannot exceed 50 characters' })
  relationship?: string;
  @ApiPropertyOptional({ description: 'Telephone number' })
  @IsOptional()
  @IsString({ message: 'Telephone must be a string' })
  @MinLength(10, { message: 'Telephone must be at least 10 characters long' })
  @MaxLength(20, { message: 'Telephone cannot exceed 20 characters' })
  telephone?: string;
  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(200, { message: 'Address cannot exceed 200 characters' })
  address?: string;
  @ApiPropertyOptional({ description: 'Mobile number' })
  @IsOptional()
  @IsString({ message: 'Mobile must be a string' })
  @MinLength(10, { message: 'Mobile must be at least 10 characters long' })
  @MaxLength(20, { message: 'Mobile cannot exceed 20 characters' })
  mobile?: string;
}
class NextOfKinDto {
  @ApiPropertyOptional({ description: 'Next of kin name' })
  @IsOptional()
  @IsString({ message: 'Next of kin name must be a string' })
  @MinLength(2, { message: 'Next of kin name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Next of kin name cannot exceed 100 characters' })
  name?: string;
  @ApiPropertyOptional({ description: 'Relationship to candidate' })
  @IsOptional()
  @IsString({ message: 'Relationship must be a string' })
  @MaxLength(50, { message: 'Relationship cannot exceed 50 characters' })
  relationship?: string;
  @ApiPropertyOptional({ description: 'Mobile number' })
  @IsOptional()
  @IsString({ message: 'Mobile must be a string' })
  @MinLength(10, { message: 'Mobile must be at least 10 characters long' })
  @MaxLength(20, { message: 'Mobile cannot exceed 20 characters' })
  mobile?: string;
  @ApiPropertyOptional({ description: 'Same as emergency contact' })
  @IsOptional()
  @IsString({ message: 'Same as emergency must be a string' })
  @MaxLength(10, { message: 'Same as emergency cannot exceed 10 characters' })
  sameAsEmergency?: string;
}
class EducationEntryDto {
  @ApiPropertyOptional({ description: 'Degree/Qualification' })
  @IsOptional()
  @IsString({ message: 'Degree must be a string' })
  @MaxLength(100, { message: 'Degree cannot exceed 100 characters' })
  degree?: string;
  @ApiPropertyOptional({ description: 'Educational institution' })
  @IsOptional()
  @IsString({ message: 'Institution must be a string' })
  @MaxLength(200, { message: 'Institution cannot exceed 200 characters' })
  institution?: string;
  @ApiPropertyOptional({ description: 'Year of completion' })
  @IsOptional()
  @IsString({ message: 'Year must be a string' })
  @MaxLength(10, { message: 'Year cannot exceed 10 characters' })
  year?: string;
}
class EmploymentEntryDto {
  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString({ message: 'Company name must be a string' })
  @MaxLength(200, { message: 'Company name cannot exceed 200 characters' })
  companyName?: string;
  @ApiPropertyOptional({ description: 'Job designation' })
  @IsOptional()
  @IsString({ message: 'Designation must be a string' })
  @MaxLength(100, { message: 'Designation cannot exceed 100 characters' })
  designation?: string;
  @ApiPropertyOptional({ description: 'Employment duration' })
  @IsOptional()
  @IsString({ message: 'Duration must be a string' })
  @MaxLength(50, { message: 'Duration cannot exceed 50 characters' })
  duration?: string;
  @ApiPropertyOptional({ description: 'Reason for leaving' })
  @IsOptional()
  @IsString({ message: 'Reason for leaving must be a string' })
  @MaxLength(500, { message: 'Reason for leaving cannot exceed 500 characters' })
  reasonForLeaving?: string;
}
class TotalExperienceDto {
  @ApiPropertyOptional({ description: 'Years of experience' })
  @IsOptional()
  @IsString({ message: 'Years must be a string' })
  @MaxLength(5, { message: 'Years cannot exceed 5 characters' })
  years?: string;
  @ApiPropertyOptional({ description: 'Months of experience' })
  @IsOptional()
  @IsString({ message: 'Months must be a string' })
  @MaxLength(5, { message: 'Months cannot exceed 5 characters' })
  months?: string;
}
export class PersonalInfoDto {
  @ApiPropertyOptional({ enum: Gender, description: 'Gender' })
  @IsOptional()
  @IsEnum(Gender, { message: 'Please select a valid gender' })
  gender?: Gender;
  @ApiPropertyOptional({ enum: MaritalStatus, description: 'Marital status' })
  @IsOptional()
  @IsEnum(MaritalStatus, { message: 'Please select a valid marital status' })
  maritalStatus?: string;
  @ApiPropertyOptional({ description: 'Mobile number' })
  @IsOptional()
  @IsString({ message: 'Mobile must be a string' })
  @MinLength(10, { message: 'Mobile must be at least 10 characters long' })
  @MaxLength(20, { message: 'Mobile cannot exceed 20 characters' })
  mobile?: string;
  @ApiPropertyOptional({ description: 'Telephone number' })
  @IsOptional()
  @IsString({ message: 'Telephone must be a string' })
  @MinLength(10, { message: 'Telephone must be at least 10 characters long' })
  @MaxLength(20, { message: 'Telephone cannot exceed 20 characters' })
  telephone?: string;
  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(300, { message: 'Address cannot exceed 300 characters' })
  address?: string;
  @ApiPropertyOptional({ description: 'Nationality' })
  @IsOptional()
  @IsString({ message: 'Nationality must be a string' })
  @MaxLength(50, { message: 'Nationality cannot exceed 50 characters' })
  nationality?: string;
  @ApiPropertyOptional({ description: 'Date of birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid date string (YYYY-MM-DD)' })
  dateOfBirth?: string;
  @ApiPropertyOptional({ enum: BloodGroup, description: 'Blood group' })
  @IsOptional()
  @IsEnum(BloodGroup, { message: 'Please select a valid blood group' })
  bloodGroup?: string;
  @ApiPropertyOptional({ description: 'Father name' })
  @IsOptional()
  @IsString({ message: 'Father name must be a string' })
  @MinLength(2, { message: 'Father name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Father name cannot exceed 100 characters' })
  fatherName?: string;
  @ApiPropertyOptional({ description: 'Mother name' })
  @IsOptional()
  @IsString({ message: 'Mother name must be a string' })
  @MinLength(2, { message: 'Mother name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Mother name cannot exceed 100 characters' })
  motherName?: string;
  @ApiPropertyOptional({ type: EmergencyContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
  @ApiPropertyOptional({ type: NextOfKinDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => NextOfKinDto)
  nextOfKin?: NextOfKinDto;
  @ApiPropertyOptional({ type: TotalExperienceDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TotalExperienceDto)
  totalExperience?: TotalExperienceDto;
  @ApiPropertyOptional({ type: [EducationEntryDto] })
  @IsOptional()
  @IsArray({ message: 'Education must be an array' })
  @ValidateNested({ each: true })
  @Type(() => EducationEntryDto)
  education?: EducationEntryDto[];
  @ApiPropertyOptional({ type: [EmploymentEntryDto] })
  @IsOptional()
  @IsArray({ message: 'Employment history must be an array' })
  @ValidateNested({ each: true })
  @Type(() => EmploymentEntryDto)
  employmentHistory?: EmploymentEntryDto[];
  @ApiPropertyOptional({ description: 'Submission timestamp' })
  @IsOptional()
  @IsDate({ message: 'Submitted at must be a valid date' })
  submittedAt?: Date;
}
export class PersonalInfoWithDocumentsDto extends PersonalInfoDto {}
export class CandidateFilterDto {
  @ApiPropertyOptional({ description: 'Filter by candidate ID' })
  @IsOptional()
  @IsString({ message: 'Candidate ID must be a string' })
  @MaxLength(50, { message: 'Candidate ID cannot exceed 50 characters' })
  id?: string;
  @ApiPropertyOptional({
    description: 'Candidate email address',
    example: 'candidate@mailinator.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
  @ApiPropertyOptional({ description: 'Job title' })
  @IsOptional()
  @IsString({ message: 'Job title must be a string' })
  @MaxLength(100, { message: 'Job title cannot exceed 100 characters' })
  jobTitle?: string;
  @ApiPropertyOptional({ enum: HiringStage, description: 'Hiring stage' })
  @IsOptional()
  @IsEnum(HiringStage, { message: 'Please select a valid hiring stage' })
  hiringStage?: HiringStage;
  @ApiPropertyOptional({ description: 'Department' })
  @IsOptional()
  @IsString({ message: 'Department must be a string' })
  @MaxLength(100, { message: 'Department cannot exceed 100 characters' })
  department?: string;
  @ApiPropertyOptional({ description: 'Created by user' })
  @IsOptional()
  @IsString({ message: 'Created by must be a string' })
  @MaxLength(50, { message: 'Created by cannot exceed 50 characters' })
  createdBy?: string;
  @ApiPropertyOptional({ description: 'Access token' })
  @IsOptional()
  @IsString({ message: 'Token must be a string' })
  @MaxLength(200, { message: 'Token cannot exceed 200 characters' })
  token?: string;
  @ApiPropertyOptional({
    description: 'Search query for name, email, or job title',
    example: 'john software',
  })
  @IsOptional()
  @IsString({ message: 'Search query must be a string' })
  @MaxLength(200, { message: 'Search query cannot exceed 200 characters' })
  search?: string;
  @ApiPropertyOptional({ description: 'Filter by hiring status/stage', example: 'onboarded' })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @MaxLength(50, { message: 'Status cannot exceed 50 characters' })
  status?: string;
  @ApiPropertyOptional({
    description: 'Filter by date range start (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date from must be a valid date string (YYYY-MM-DD)' })
  dateFrom?: string;
  @ApiPropertyOptional({
    description: 'Filter by date range end (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date to must be a valid date string (YYYY-MM-DD)' })
  dateTo?: string;
  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;
  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number;
}
export class UpdateCandidateDto {
  @ApiPropertyOptional({ description: 'Job title' })
  @IsOptional()
  @IsString({ message: 'Job title must be a string' })
  @MinLength(2, { message: 'Job title must be at least 2 characters long' })
  @MaxLength(100, { message: 'Job title cannot exceed 100 characters' })
  jobTitle?: string;
  @ApiPropertyOptional({ description: 'Department ID' })
  @IsOptional()
  @IsMongoId({ message: 'Please provide a valid department ID' })
  department?: Types.ObjectId;
  @ApiPropertyOptional({ description: 'Work timing start' })
  @IsOptional()
  @IsString({ message: 'Timing start must be a string' })
  @MaxLength(20, { message: 'Timing start cannot exceed 20 characters' })
  @Matches(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/, {
    message: 'Timing start must be in the format HH:MM AM/PM (e.g., 09:00 AM)',
  })
  timingStart?: string;
  @ApiPropertyOptional({ description: 'Work timing end' })
  @IsOptional()
  @IsString({ message: 'Timing end must be a string' })
  @MaxLength(20, { message: 'Timing end cannot exceed 20 characters' })
  @Matches(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/, {
    message: 'Timing end must be in the format HH:MM AM/PM (e.g., 06:00 PM)',
  })
  timingEnd?: string;
  @ApiPropertyOptional({ enum: HiringStage, description: 'Hiring stage' })
  @IsOptional()
  @IsEnum(HiringStage, { message: 'Please select a valid hiring stage' })
  hiringStage?: HiringStage;
  @ApiPropertyOptional({ description: 'Review requested flag' })
  @IsOptional()
  @IsBoolean({ message: 'Review requested must be a boolean value' })
  reviewRequested?: boolean;
}
export class RequestFormDto {
  @ApiProperty({ description: 'Candidate ID' })
  @IsString({ message: 'Candidate ID must be a string' })
  @IsNotEmpty({ message: 'Candidate ID is required' })
  @MaxLength(50, { message: 'Candidate ID cannot exceed 50 characters' })
  id: string;
  @ApiProperty({ description: 'Full name' })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name cannot exceed 100 characters' })
  fullName: string;
  @ApiProperty({ description: 'Email address' })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
  @ApiProperty({ description: 'Job title' })
  @IsString({ message: 'Job title must be a string' })
  @IsNotEmpty({ message: 'Job title is required' })
  @MinLength(2, { message: 'Job title must be at least 2 characters long' })
  @MaxLength(100, { message: 'Job title cannot exceed 100 characters' })
  jobTitle: string;
  @ApiProperty({ description: 'Work timing start' })
  @IsString({ message: 'Timing start must be a string' })
  @IsNotEmpty({ message: 'Timing start is required' })
  @MaxLength(20, { message: 'Timing start cannot exceed 20 characters' })
  @Matches(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/, {
    message: 'Timing start must be in the format HH:MM AM/PM (e.g., 09:00 AM)',
  })
  timingStart: string;
  @ApiProperty({ description: 'Work timing end' })
  @IsString({ message: 'Timing end must be a string' })
  @IsNotEmpty({ message: 'Timing end is required' })
  @MaxLength(20, { message: 'Timing end cannot exceed 20 characters' })
  @Matches(/^((1[0-2]|0?[1-9]):([0-5][0-9]) ?([AaPp][Mm]))$/, {
    message: 'Timing end must be in the format HH:MM AM/PM (e.g., 06:00 PM)',
  })
  timingEnd: string;
  @ApiProperty({ description: 'Last updated timestamp' })
  @IsDate({ message: 'Updated at must be a valid date' })
  @IsNotEmpty({ message: 'Updated at is required' })
  updatedAt: Date;
  @ApiProperty({ description: 'Copy link URL' })
  @IsString({ message: 'Copy link must be a string' })
  @IsNotEmpty({ message: 'Copy link is required' })
  @MaxLength(500, { message: 'Copy link cannot exceed 500 characters' })
  copyLink: string;
  @ApiProperty({ description: 'Current hiring stage' })
  @IsString({ message: 'Hiring stage must be a string' })
  @IsNotEmpty({ message: 'Hiring stage is required' })
  @MaxLength(50, { message: 'Hiring stage cannot exceed 50 characters' })
  hiringStage: string;
  @ApiProperty({ description: 'Access token' })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token is required' })
  @MaxLength(200, { message: 'Token cannot exceed 200 characters' })
  token: string;
}
