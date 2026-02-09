import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

import { HiringStage, TokenType } from '../../../types/enums/recruitment.enums';
@Schema({ _id: false })
export class CandidateDocumentaries {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @ApiProperty()
  @Prop({ type: String })
  url: string;
  @ApiProperty()
  @Prop({ type: String })
  name: string;
  @ApiProperty()
  @Prop({ type: String })
  fileName: string;
  @ApiProperty()
  @Prop({ type: String })
  fileExtension: string;
  @ApiProperty()
  @Prop({ type: String })
  fileType: string;
  @ApiProperty()
  @Prop({ type: String })
  mimeType: string;
  @ApiProperty()
  @Prop({ type: String })
  size: number;
  @ApiProperty()
  @Prop({ type: String })
  category: string;
  @ApiProperty()
  @Prop({ default: Date.now })
  @IsDateString()
  uploadedAt: Date;
}
@Schema({ _id: false })
export class ClarificationFormData {
  @ApiProperty()
  @Prop({ required: true, type: String })
  firstName: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  lastName: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  cnicNo: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  longTermCommitment: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  oneYearCommitment: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  referenceCheckAllowed: string;
  @ApiPropertyOptional()
  @Prop({ type: Object })
  currentOrganization: {
    name: string;
    pointOfContact: string;
    contactCell: string;
    businessEmail: string;
  };
  @ApiPropertyOptional()
  @Prop({ type: Object })
  previousOrganization: {
    name: string;
    pointOfContact: string;
    contactCell: string;
    businessEmail: string;
  };
  @ApiProperty()
  @Prop({ required: true, type: String })
  currentGrossSalary: string;
  @ApiPropertyOptional()
  @Prop({ type: String })
  monthlyCommissions: string;
  @ApiPropertyOptional()
  @Prop({ type: String })
  perksAndBenefits: string;
  @ApiPropertyOptional()
  @Prop({ type: String })
  healthInsurance: string;
  @ApiPropertyOptional()
  @Prop({ type: String })
  lifeInsurance: string;
  @ApiPropertyOptional()
  @Prop({ type: String })
  eobi: string;
  @ApiPropertyOptional()
  @Prop({ type: String })
  increments: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  expectedGrossSalary: string;
  @ApiProperty()
  @Prop({ required: true, type: Number })
  noticePeriod: number;
  @ApiProperty()
  @Prop({ required: true, type: String })
  officeTimingComfort: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  signature: string;
  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  @IsDateString()
  submittedAt: Date;
}
@Schema({ _id: false })
export class PersonalInfoData {
  @ApiProperty()
  @Prop({ required: true, type: String })
  gender: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  maritalStatus: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  mobile: string;
  @ApiPropertyOptional()
  @Prop({ type: String })
  telephone: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  address: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  nationality: string;
  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  @IsDateString()
  dateOfBirth: Date;
  @ApiPropertyOptional()
  @Prop({ type: String })
  bloodGroup: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  fatherName: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  motherName: string;
  @ApiProperty()
  @Prop({ type: Object, required: true })
  emergencyContact: {
    name: string;
    relationship: string;
    telephone: string;
    address: string;
    mobile: string;
  };
  @ApiPropertyOptional()
  @Prop({ type: Object })
  nextOfKin: {
    name: string;
    relationship: string;
    mobile: string;
    sameAsEmergency: string;
  };
  @ApiPropertyOptional()
  @Prop({ type: Object, required: true })
  totalExperience: {
    years: string;
    months: string;
  };
  @ApiPropertyOptional()
  @Prop({ type: [Object], default: [] })
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  @ApiPropertyOptional()
  @Prop({ type: [Object], default: [] })
  employmentHistory: Array<{
    companyName: string;
    designation: string;
    duration: string;
    reasonForLeaving: string;
  }>;
  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  @IsDateString()
  submittedAt: Date;
}
@Schema({ timestamps: true })
export class Candidates {
  @ApiProperty()
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @ApiProperty()
  @Prop({ required: true, unique: true, lowercase: true, trim: true, type: String })
  email: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  firstName: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  lastName: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  jobTitle: string;
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;
  @ApiProperty()
  @Prop({ required: true, type: String })
  timingStart: string;
  @ApiProperty()
  @Prop({ required: true, type: String })
  timingEnd: string;
  @ApiProperty({ enum: HiringStage })
  @Prop({ type: String, enum: HiringStage, default: HiringStage.ADDED })
  hiringStage: HiringStage;
  @ApiPropertyOptional()
  @Prop({ type: String })
  token: string;
  @ApiPropertyOptional()
  @Prop({ type: String })
  copyLink: string;
  @ApiProperty()
  @IsBoolean()
  @Prop({ default: false, type: Boolean })
  reviewRequested: boolean;
  @ApiPropertyOptional({ enum: TokenType })
  @Prop({ type: String, enum: Object.values(TokenType) })
  tokenType: string;
  @ApiPropertyOptional()
  @Prop({ default: false, type: Boolean })
  tokenUsed: boolean;
  @ApiPropertyOptional()
  @Prop({ default: 0, type: Number })
  tokenUsageCount: number;
  @ApiPropertyOptional()
  @Prop({ type: Date })
  @IsDateString()
  tokenExpiresAt: Date;
  @ApiPropertyOptional()
  @Prop({ type: ClarificationFormData })
  clarificationForm: ClarificationFormData;
  @ApiPropertyOptional()
  @Prop({ type: PersonalInfoData })
  personalInfo: PersonalInfoData;
  @ApiPropertyOptional()
  @Prop({ type: [CandidateDocumentaries], default: [] })
  documents: CandidateDocumentaries[];
  @ApiPropertyOptional()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  onboardedUserId: Types.ObjectId;
  @ApiPropertyOptional()
  @Prop({ type: Types.ObjectId, ref: 'Profiles' })
  onboardedProfileId: Types.ObjectId;
  @ApiPropertyOptional()
  @Prop({ type: Date })
  @IsDateString()
  onboardedAt: Date;
  @ApiPropertyOptional()
  @Prop({ type: Date })
  @IsDateString()
  archivedAt: Date;
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
  @ApiPropertyOptional()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  @IsDateString()
  createdAt: Date;
  @ApiPropertyOptional()
  @Prop({ type: String })
  officialEmail: string;
  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  @IsDateString()
  updatedAt: Date;
}
export const CandidateSchema = SchemaFactory.createForClass(Candidates);
