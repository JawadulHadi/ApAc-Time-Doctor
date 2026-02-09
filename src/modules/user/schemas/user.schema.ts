import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { Document, Types } from 'mongoose';

import { UserStatus } from '../../../types/constants/user-status.constants';
import { Permissions } from '../../../types/enums/permissions.enum';
import { DisplayRole, Role } from '../../../types/enums/role.enums';
export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {

  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'User email address', example: 'jhadii@mailinator.com' })
  @Prop({ required: true, unique: true, type: String })
  @IsEmail()
  
  email: string;
  @ApiPropertyOptional({ description: 'Username for login', example: 'john.doe' })
  @Prop({ required: false, sparse: true, type: String })
  @IsString()
  @IsOptional()
  username?: string;
  @ApiProperty({ description: 'Password (hashed)', example: 'hashedPassword123' })
  @Prop({ required: true, type: String })
  @IsString()
  password: string;
  @ApiProperty({ description: 'User role', enum: Role })
  @Prop({ type: String, required: true, enum: Role })
  role: string;
  @ApiProperty({ description: 'Base role for filtering', enum: DisplayRole })
  @Prop({
    type: String,
    required: false,
    enum: DisplayRole,
    default: function () {
      return this.displayRole;
    },
  })
  displayRole: string;
  @ApiPropertyOptional({
    description: 'User permissions',
    enum: Permissions,
    isArray: true,
    type: [String],
  })
  @Prop({ type: [String], enum: Permissions, default: [] })
  permissions: string[];
  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    example: 'ACTIVE',
    type: String,
  })
  @Prop({
    enum: UserStatus,
    default: 'ACTIVE',
    type: String,
  })
  @IsOptional()
  @Prop({ required: true, enum: UserStatus, type: String })
  @IsEnum(UserStatus)
  status?: UserStatus;
  @ApiPropertyOptional({ description: 'Cell/phone number', example: '+1234567890' })
  @Prop({ type: String })
  @IsString()
  @IsOptional()
  @Matches(/^\+\d{11}$/, { message: 'Cell must be in format: +XXXXXXXXXXX' })
  cell?: string;
  @ApiPropertyOptional({
    description: 'Department reference',
    example: '507f1f77bcf86cd799439011',
    type: Types.ObjectId,
  })
  @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
  @IsOptional()
  department?: Types.ObjectId | null;
  @ApiPropertyOptional({ description: 'Last login date', example: '2024-01-15T10:30:00Z' })
  @Prop({ type: Date })
  lastLogin?: Date;
  @ApiPropertyOptional({ description: 'Login count', example: 5 })
  @Prop({ default: 0, type: Number })
  loginCount: number;
  @ApiPropertyOptional({ description: 'Created by user ID', example: '507f1f77bcf86cd799439012' })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  @IsOptional()
  createdBy?: Types.ObjectId | null;
  @ApiPropertyOptional({ description: 'Updated by user ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  @IsOptional()
  updatedBy?: Types.ObjectId | null;
  @ApiPropertyOptional({ description: 'Activation code', example: 123456 })
  @Prop({ type: Number })
  activationCode?: number;
  @ApiPropertyOptional({
    description: 'Activation code generation timestamp',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  @Prop({ type: Date, default: null })
  activationCodeGeneratedAt?: Date | null;
  @ApiPropertyOptional({
    description: 'Activation code expiration timestamp (24 hours from generation)',
    example: '2024-01-16T10:30:00Z',
    type: Date,
  })
  @Prop({ type: Date, default: null })
  activationCodeExpiresAt?: Date | null;
  @ApiPropertyOptional({
    description: 'Number of activation attempts',
    example: 2,
    type: Number,
  })
  @Prop({ default: 0, type: Number })
  activationAttempts?: number;
  @ApiPropertyOptional({ description: 'Last logout date', example: '2024-01-15T10:30:00Z' })
  @Prop({ type: Date, default: null })
  lastLogout?: Date;
  @ApiPropertyOptional({ description: 'Password reset code', example: 654321 })
  @Prop({ type: Number })
  resetPasswordCode?: number | null;
  @ApiPropertyOptional({
    description: 'Password reset code generation timestamp',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  @Prop({ type: Date, default: null })
  resetPasswordCodeGeneratedAt?: Date;
  @ApiPropertyOptional({
    description: 'Last activation timestamp',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  @Prop({ type: Date, default: null })
  lastActivatedAt?: Date | null;
  @ApiPropertyOptional({
    description: 'Account lockout expiration date',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  @Prop({ type: Date, default: null })
  lockoutExpires?: Date;
  @ApiPropertyOptional({
    description: 'Number of failed login attempts',
    example: 3,
    type: Number,
  })
  @Prop({ default: 0, type: Number })
  failedLoginAttempts?: number;
  @ApiPropertyOptional({
    description: 'Whether user is verified',
    example: true,
    type: Boolean,
  })
  @Prop({ default: false })
  isVerified?: boolean;
  @ApiProperty({ description: 'Created timestamp', example: '2024-01-15T10:30:00Z' })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @ApiProperty({ description: 'Updated timestamp', example: '2024-01-15T10:30:00Z' })
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ department: 1 });
UserSchema.index({ createdBy: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
