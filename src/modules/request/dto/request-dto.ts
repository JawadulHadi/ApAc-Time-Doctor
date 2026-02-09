import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import {
  ActionType,
  RequestStage,
  RequestStatus,
  RequestType,
} from '../../../types/enums/request.enums';
export class CreateRequestDto {
  @ApiProperty({
    enum: RequestType,
    example: RequestType.WORK_FROM_HOME,
    description: 'Type of request being made',
  })
  @IsEnum(RequestType, {
    message: `Request type must be one of: ${Object.values(RequestType).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Request type is required' })
  requestType: RequestType;
  @ApiProperty({
    type: [String],
    description: 'Array of requested dates in YYYY-MM-DD format',
    example: ['2024-01-15', '2024-01-16', '2024-01-17'],
    minItems: 1,
    maxItems: 30,
  })
  @IsArray({ message: 'Requested dates must be an array' })
  @ArrayMinSize(1, { message: 'At least one date must be selected' })
  @ArrayMaxSize(30, { message: 'Cannot request more than 30 dates at once' })
  @IsDateString(
    { strict: true },
    {
      each: true,
      message: 'Each date must be in YYYY-MM-DD format',
    },
  )
  @IsNotEmpty({ each: true, message: 'Each date value should not be empty' })
  requestedDates: string[];
  @ApiProperty({
    required: false,
    description: 'Reason for the request',
    example: 'Personal work from home',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  @MaxLength(500, { message: 'Reason cannot exceed 500 characters' })
  @Transform(({ value }) => value?.trim())
  reason?: string;
}
export class ProcessActionDto {
  @ApiProperty({
    enum: ActionType,
    description: 'Action to be taken on the request',
    example: ActionType.APPROVED,
  })
  @IsEnum(ActionType, {
    message: `Action must be one of: ${Object.values(ActionType).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Action is required' })
  action: ActionType;
  @ApiProperty({
    required: false,
    description: 'Remarks for the action taken',
    example: 'Approved due to valid business requirement',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Remarks must be a string' })
  @MaxLength(1000, { message: 'Remarks cannot exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  remarks?: string;
}
export class AddRemarksDto {
  @ApiProperty({
    description: 'The remark to add to the request',
    example: 'This request needs additional documentation',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString({ message: 'Remark must be a string' })
  @IsNotEmpty({ message: 'Remark is required' })
  @MinLength(1, { message: 'Remark must be at least 1 character long' })
  @MaxLength(1000, { message: 'Remark cannot exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  remark: string;
}
export class RequestResponseDto {
  @ApiProperty({ description: 'Request ID' })
  _id: string;
  @ApiProperty({ description: 'User ID who created the request' })
  user: string;
  @ApiProperty({
    enum: RequestType,
    description: 'Type of request',
  })
  requestType: RequestType;
  @ApiProperty({
    type: [String],
    description: 'Array of requested dates',
  })
  requestedDates: string[];
  @ApiProperty({ description: 'Start date of the request period' })
  from: Date;
  @ApiProperty({ description: 'End date of the request period' })
  to: Date;
  @ApiProperty({ description: 'Number of days requested' })
  days: number;
  @ApiProperty({
    required: false,
    description: 'Reason for the request',
  })
  reason?: string;
  @ApiProperty({
    enum: RequestStatus,
    description: 'Current status of the request',
  })
  status: RequestStatus;
  @ApiProperty({
    enum: RequestStage,
    description: 'Current approval stage',
  })
  currentStage: RequestStage;
  @ApiProperty({
    required: false,
    description: 'User ID who approved the request',
  })
  approvedBy?: string;
  @ApiProperty({
    required: false,
    description: 'Date when request was approved',
  })
  approvedAt?: Date;
  @ApiProperty({
    required: false,
    description: 'User ID who rejected the request',
  })
  rejectedBy?: string;
  @ApiProperty({
    required: false,
    description: 'Date when request was rejected',
  })
  rejectedAt?: Date;
  @ApiProperty({
    type: 'array',
    description: 'Array of remarks added to the request',
    items: {
      type: 'object',
      properties: {
        by: { type: 'string', description: 'User who added the remark' },
        role: { type: 'string', description: 'Role of the user' },
        remark: { type: 'string', description: 'The remark text' },
        date: { type: 'string', format: 'date-time', description: 'Date when remark was added' },
      },
    },
  })
  remarks: Array<{
    by: string;
    role: string;
    remark: string;
    date: Date;
  }>;
  @ApiProperty({ description: 'User ID who created the request' })
  createdBy: string;
  @ApiProperty({
    required: false,
    description: 'User ID who last updated the request',
  })
  updatedBy?: string;
  @ApiProperty({ description: 'Date when request was created' })
  createdAt: Date;
  @ApiProperty({ description: 'Date when request was last updated' })
  updatedAt: Date;
  @ApiProperty({
    required: false,
    description: 'Department ID associated with the request',
  })
  department?: string;
}
