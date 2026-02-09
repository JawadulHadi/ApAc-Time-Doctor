import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { Document, Types } from 'mongoose';

import { UserStatus } from '@/types/constants/user-status.constants';
import { DocumentCategory } from '@/types/enums/doc.enums';
import { IndicatorStatus, IStatementStatus } from '@/types/enums/profile.enums';
import { Role } from '@/types/enums/role.enums';
export type ProfilesDocument = Profiles & Document;
@Schema({ _id: false, timestamps: true })
export class DocumentFile {
  @ApiProperty({ description: 'Document ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  @IsMongoId()
  _id: Types.ObjectId;
  @ApiProperty({
    description: 'Document URL',
    example: 'https://storage.googleapis.com/iagility-apac-user/documents/certificate123.pdf',
  })
  @Prop({ required: true })
  @IsUrl()
  url: string;
  @ApiPropertyOptional({ description: 'Document name', example: 'AWS Certification' })
  @Prop()
  @IsString()
  @IsOptional()
  name?: string;
  @ApiPropertyOptional({
    description: 'Document category',
    enum: DocumentCategory,
    example: DocumentCategory.CERTIFICATION,
  })
  @Prop({ type: String, enum: DocumentCategory, required: false })
  @IsEnum(DocumentCategory)
  @IsOptional()
  category?: DocumentCategory;
  @ApiPropertyOptional({ description: 'Upload date', example: '2024-01-15T10:30:00Z' })
  @Prop({ default: Date.now })
  @IsDate()
  @IsOptional()
  uploadedAt: Date;
}
@Schema({ _id: false })
export class ProfileUser implements ProfileUser {
  @ApiProperty({ description: 'Reviewer user ID' })
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;
  @ApiProperty({ description: 'Reviewer full name' })
  @Prop({ type: String, required: true })
  fullName: string;
  @ApiProperty({ description: 'Reviewer email' })
  @Prop({ type: String, required: true })
  email: string;
  @ApiProperty({ description: 'Reviewer role' })
  @Prop({ type: String, required: true })
  role: string;
}
@Schema({ _id: false })
export class SuccessIndicatorMetric {
  @ApiProperty({ description: 'Key (Quarter number)', example: 1 })
  @Prop({ type: Number, required: true })
  key: number;
  @ApiProperty({ description: 'Indicator ID (index within quarter)', example: 1 })
  @Prop({ type: Number, required: true })
  id: number;
  @ApiProperty({ description: 'Indicator content' })
  @Prop({ required: true })
  @IsString()
  content: string;
  @ApiProperty({
    description: 'Metric status',
    example: IndicatorStatus.IN_PROGRESS,
    enum: IndicatorStatus,
  })
  @Prop({
    type: String,
    default: IndicatorStatus.IN_PROGRESS,
  })
  @IsString()
  status: string;
  @ApiPropertyOptional({ description: 'Is indicator moved to different quarter' })
  @Prop({ type: Boolean, default: false })
  @IsOptional()
  isMoved?: boolean;
  @ApiPropertyOptional({ description: 'Is indicator transferred (when false, isMoved = true)' })
  @Prop({ type: Boolean, default: true })
  @IsOptional()
  isTransferred?: boolean;
  @ApiPropertyOptional({ description: 'log for moving' })
  @Prop({ type: String, required: false })
  @IsOptional()
  @IsString()
  log?: string;
  @ApiPropertyOptional({ description: 'Target quarter where indicator is moved to' })
  @Prop({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  to?: number;
  @ApiPropertyOptional({ description: 'Source quarter where indicator came from' })
  @Prop({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  from?: number;
}
@Schema({ _id: false })
export class SuccessIndicatorQuarter {
  @ApiProperty({ description: 'Quarter number (1-4)' })
  @Prop({ required: true, min: 1, max: 4 })
  quarter: number;
  @ApiProperty({ description: 'Is this quarter active for goal tracking' })
  @Prop({ type: Boolean, default: false })
  isActive: boolean;
  @ApiProperty({ description: 'Year for the quarter', example: 2026 })
  @Prop({ type: Number, required: true })
  @IsInt()
  year: number;
  @ApiProperty({ description: 'Indicators for this quarter' })
  @Prop({ type: [SuccessIndicatorMetric], default: [] })
  indicators: SuccessIndicatorMetric[];
}
@Schema({ _id: false })
export class StatementSchema {
  @ApiProperty({ description: 'Statement ID' })
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  id: Types.ObjectId;
  @ApiProperty({ description: 'Statement content' })
  @Prop({ required: true })
  content: string;
  @ApiProperty({ description: 'Statement status', enum: IStatementStatus })
  @Prop({ type: String, enum: IStatementStatus, default: IStatementStatus.PENDING })
  status: IStatementStatus;
  @ApiPropertyOptional({ description: 'Changes required feedback' })
  @Prop({ type: String })
  changesRequired?: string;
  @ApiProperty({ description: 'Creator information' })
  @Prop({ type: ProfileUser, required: true })
  createdBy: ProfileUser;
  @ApiProperty({ description: 'Reviewer information' })
  @Prop({ type: ProfileUser, required: true })
  reviewer: ProfileUser;
  @ApiProperty({ description: 'Creation date' })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @ApiPropertyOptional({ description: 'Review date' })
  @Prop({ type: Date })
  reviewedAt?: Date;
}
@Schema({ _id: false })
export class MissionStatementSchema {
  @ApiProperty({ description: 'Array of statement contents' })
  @Prop({ type: [StatementSchema], default: [] })
  statements: StatementSchema[];
  @ApiProperty({ description: 'Creation date' })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @ApiPropertyOptional({ description: 'Review date' })
  @Prop({ type: Date })
  reviewedAt?: Date;
}
@Schema({
  timestamps: true,
  collection: 'profiles',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Profiles {
  @ApiProperty({ description: 'Profile ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  @IsMongoId()
  _id: Types.ObjectId;
  @ApiProperty({ description: 'User ID reference', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  @IsMongoId()
  userId: Types.ObjectId;
  @ApiProperty({ description: 'User email address', example: 'jhadii@mailinator.com' })
  @Prop({ required: true })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'First name', example: 'John' })
  @Prop({ required: true })
  @IsString()
  firstName: string;
  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @Prop({ required: true })
  @IsString()
  lastName: string;
  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @Prop({ required: true })
  @IsString()
  fullName: string;
  @ApiProperty({
    description: 'User status',
    enum: UserStatus,
  })
  @Prop({
    required: true,
    enum: UserStatus,
    type: String,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
  @ApiPropertyOptional({
    description: 'User salary',
    example: '50000',
  })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  salary?: string;
  @ApiPropertyOptional({
    description: 'Profile picture URL from GCS',
    type: DocumentFile,
  })
  @Prop({ type: DocumentFile, required: false })
  @IsOptional()
  profilePicture?: DocumentFile;
  @ApiPropertyOptional({ description: 'Resume document', type: DocumentFile })
  @Prop({ type: DocumentFile, required: false })
  @IsOptional()
  resume?: DocumentFile;
  @ApiPropertyOptional({ description: 'ID Proof document', type: DocumentFile })
  @Prop({ type: DocumentFile, required: false })
  @IsOptional()
  idProof?: DocumentFile;
  @ApiPropertyOptional({ description: 'Other documents', type: [DocumentFile] })
  @Prop({ type: [DocumentFile], default: [] })
  @IsOptional()
  @IsArray()
  documents?: DocumentFile[];
  @ApiPropertyOptional({ description: 'Date of birth', example: '1990-05-15' })
  @Prop({ required: false })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;
  @ApiPropertyOptional({
    description: 'Designation/Job title',
    example: 'Senior Software Engineer',
  })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  designation?: string;
  @ApiProperty({ description: 'User role', enum: Role, example: Role.MEMBER })
  @Prop({ required: true, enum: Role, type: String })
  @IsEnum(Role)
  role: Role;
  @ApiPropertyOptional({ description: 'Department' })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  department?: string;
  @ApiPropertyOptional({ description: 'Employee ID', example: 'EMP-12345' })
  @Prop({ required: false, unique: true, sparse: true })
  @IsOptional()
  @IsString()
  employeeId?: string;
  @ApiPropertyOptional({ description: 'Contact number', example: '+1234567890' })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+\d{11}$/, { message: 'Contact number must be in format: +XXXXXXXXXXX' })
  contactNumber?: string;
  @ApiPropertyOptional({ description: 'Emergency contact', example: '+0987654321' })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\+\d{11}$/, { message: 'Emergency contact must be in format: +XXXXXXXXXXX' })
  emergencyContact?: string;
  @ApiPropertyOptional({ description: 'Current address', example: '123 Main St, City, Country' })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  currentAddress?: string;
  @ApiPropertyOptional({ description: 'Permanent address', example: '456 Main St, City, Country' })
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  permanentAddress?: string;
  @ApiPropertyOptional({ description: 'Date of joining', example: '2023-01-15' })
  @Prop({ required: false })
  @IsOptional()
  @IsDate()
  dateOfJoining?: Date;
  @ApiPropertyOptional({ description: 'Date of leaving', example: '2023-12-15' })
  @Prop({ required: false })
  @IsOptional()
  @IsDate()
  leftUs?: Date;
  @ApiPropertyOptional({ description: 'Date of re-joining', example: '2024-01-15' })
  @Prop({ required: false })
  @IsOptional()
  @IsDate()
  rejoinUs?: Date;
  @ApiPropertyOptional({
    description: 'Skills array',
    example: ['JavaScript', 'Node', 'MongoDB'],
  })
  @Prop([String])
  @IsOptional()
  @IsArray()
  skills?: string[];
  @ApiPropertyOptional({
    description: 'Achievement array',
    example: ['certification', 'AI', 'courses'],
  })
  @Prop([String])
  @IsOptional()
  @IsArray()
  achievements?: string[];
  @ApiPropertyOptional({
    description: 'Mission statement',
    type: MissionStatementSchema,
  })
  @Prop({ type: MissionStatementSchema })
  @IsOptional()
  missionStatement?: MissionStatementSchema;
  @ApiPropertyOptional({
    description: 'Success indicators for quarters',
    type: [SuccessIndicatorQuarter],
  })
  @Prop({ type: [SuccessIndicatorQuarter], default: [] })
  @IsOptional()
  @IsArray()
  successIndicators?: SuccessIndicatorQuarter[];
  @ApiPropertyOptional({ description: 'Created by user ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  @IsOptional()
  @IsMongoId()
  createdBy?: Types.ObjectId | null;
  @ApiPropertyOptional({ description: 'Updated by user ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  @IsOptional()
  @IsMongoId()
  updatedBy?: Types.ObjectId | null;
  @ApiProperty({ description: 'Created timestamp', example: '2024-01-15T10:30:00Z' })
  createdAt?: Date;
  @ApiProperty({ description: 'Updated timestamp', example: '2024-01-15T10:30:00Z' })
  updatedAt?: Date;
}
export const ProfilesSchema = SchemaFactory.createForClass(Profiles);
ProfilesSchema.pre('save', function (this: ProfilesDocument) {
  if (!this.fullName || this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
  }
});
ProfilesSchema.index({ createdBy: 1 });
ProfilesSchema.index({ createdAt: -1 });
