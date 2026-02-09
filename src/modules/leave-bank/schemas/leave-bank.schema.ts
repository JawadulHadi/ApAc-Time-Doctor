import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

import { Role } from '../../../types/enums/role.enums';
import * as leaveBankInterface from '../../../types/interfaces/leave-bank.interface';
export class TeamLeadDetail {
  @ApiProperty({
    description: 'User ID',
    example: '68fa4a9b3a50f116c7311796',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
  @ApiProperty({
    description: 'Email address',
    example: 'ron@mailinator.com',
  })
  @Prop({ type: String })
  email: string;
  @ApiProperty({
    description: 'User role',
    example: 'TEAM_LEAD',
  })
  @Prop({ type: String })
  role: string;
  @ApiPropertyOptional({
    description: 'Designation',
    example: 'Team Lead - Business Development',
  })
  @Prop({ type: String })
  designation?: string;
  @ApiProperty({
    description: 'Full name',
    example: 'Samrullah',
  })
  @Prop({ type: String })
  name: string;
}
export type LeaveBankDocument = LeaveBank & Document;
@Schema({
  timestamps: true,
  collection: 'leavebank',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class LeaveBank {
  @ApiProperty({ description: 'Attendance record ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @ApiProperty({ description: 'User ID reference', example: '507f1f77bcf86cd799439012' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @IsMongoId()
  userId: Types.ObjectId;
  @ApiProperty({ description: 'Profile ID reference', example: '507f1f77bcf86cd799439013' })
  @Prop({ type: Types.ObjectId, ref: 'Profiles', required: true })
  @IsMongoId()
  profileId: Types.ObjectId;
  @ApiProperty({ description: 'Year for the record', example: 2025 })
  @Prop({ required: true, type: Number })
  @IsNumber()
  year: number;
  @ApiProperty({ description: 'Employee ID', example: 'MAS-CAN-4136' })
  @Prop({ required: true, type: String })
  @IsString()
  employeeId: string;
  @ApiProperty({ description: 'Employee name', example: 'Aashan Bilawal' })
  @Prop({ required: true, type: String })
  @IsString()
  name: string;
  @ApiProperty({ description: 'Employee email', example: 'aashan@microagility.com' })
  @Prop({ required: true, type: String })
  @IsString()
  email: string;
  @ApiProperty({ description: 'User role', enum: Role })
  @Prop({ type: String, required: true, enum: Role })
  role: string;
  @ApiPropertyOptional({
    description: 'Designation/Job title',
    example: 'Senior Software Engineer',
  })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  designation: string;
  @ApiPropertyOptional({
    description: 'Designation/Job title',
    example: 'Senior Software Engineer',
  })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  pictureUrl: string;
  @ApiProperty({ description: 'Department', example: 'Canadian BD' })
  @Prop({ required: true, type: String })
  @IsString()
  department: string;
  @ApiPropertyOptional({
    description: 'Team lead details embedded object',
    type: TeamLeadDetail,
  })
  @Prop({
    type: {
      userId: { type: Types.ObjectId, ref: 'User', required: true },
      email: { type: String, trim: true, lowercase: true },
      role: { type: String, trim: true },
      designation: { type: String, trim: true },
      name: { type: String, trim: true },
    },
    default: null,
    _id: false,
  })
  teamLeadDetail: leaveBankInterface.lead | null;
  @ApiProperty({
    description: 'Flag indicating if this record was updated in the last upload',
    example: true,
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  isUpdatedRecord: boolean;
  @ApiProperty({
    description: 'Flag indicating if this record was updated in the last upload',
    example: true,
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  notified: boolean;
  @ApiProperty({
    description: 'Timestamp of the last upload that affected this record',
    example: '2025-01-15T10:30:00Z',
  })
  @Prop({ type: Date, default: null })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastNotifiedDate: Date;
  @ApiProperty({
    description: 'Flag indicating if this record contains data for a new month',
    example: true,
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  isNewMonthData: boolean;
  @ApiProperty({
    description: 'Flag indicating if this record contains data for a new month',
    example: true,
  })
  @Prop({ type: String, default: null })
  @IsString()
  @IsOptional()
  newlyAddedMonth: string;
  @ApiProperty({
    description: 'Flag indicating if this record was updated in the last upload',
    example: true,
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  discrepancyResolved: boolean;
  @ApiProperty({
    description: 'Timestamp of the last upload that affected this record',
    example: '2025-01-15T10:30:00Z',
  })
  @Prop({ type: Date, default: null })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  cancellationDate: Date;
  @ApiProperty({
    description: 'Flag indicating if this is a new record created in the last upload',
    example: false,
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  isNewRecord: boolean;
  @ApiProperty({
    description: 'Timestamp of the last upload that affected this record',
    example: '2025-01-15T10:30:00Z',
  })
  @Prop({ type: Date, default: null })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastUploadDate: Date;
  @ApiProperty({
    description: 'Unique identifier for the upload batch that processed this record',
    example: '507f1f77bcf86cd799439014',
  })
  @Prop({ type: String, default: null })
  @IsString()
  @IsOptional()
  uploadBatchId: string;
  @ApiProperty({ description: 'Multi-year monthly data structure' })
  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  monthlyData: { [year: string]: any };
  @ApiPropertyOptional({ description: 'Created timestamp', example: '2024-01-15T10:30:00Z' })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @ApiPropertyOptional({ description: 'Updated timestamp', example: '2024-01-15T10:30:00Z' })
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
export const LeaveBankSchema = SchemaFactory.createForClass(LeaveBank);
LeaveBankSchema.index({ userId: 1, year: 1 }, { unique: true });
LeaveBankSchema.index({ employeeId: 1, year: 1 });
LeaveBankSchema.index({ email: 1, year: 1 });
