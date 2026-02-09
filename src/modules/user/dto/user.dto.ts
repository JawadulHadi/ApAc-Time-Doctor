import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
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
} from 'class-validator';

import { UserStatus } from '../../../types/constants/user-status.constants';
import { Permissions } from '../../../types/enums/permissions.enum';
import { Role } from '../../../types/enums/role.enums';
import * as departmentInterface from '../../../types/interfaces/department.interface';
import * as profileInterface from '../../../types/interfaces/profile.interface';
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'jhadii@mailinator.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;
  @ApiProperty({
    description: 'Username for login',
    example: 'john.doe',
    minLength: 3,
    maxLength: 30,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
  username?: string;
  @ApiPropertyOptional({
    description: 'Password (auto-generated if not provided)',
    example: 'password123',
    minLength: 8,
    maxLength: 128,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password?: string;
  @ApiProperty({
    description: 'User role in the organization',
    enum: Role,
    example: Role.MEMBER,
  })
  @IsNotEmpty({ message: 'User role is required' })
  @IsEnum(Role, { message: 'Please select a valid role from the available options' })
  role: string;
  @ApiPropertyOptional({
    description: 'Contact number in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString({ message: 'Cell number must be a string' })
  @MinLength(10, { message: 'Cell number must be at least 10 characters long' })
  @MaxLength(20, { message: 'Cell number cannot exceed 20 characters' })
  cell?: string | null;
  @ApiPropertyOptional({
    description: 'Department ID',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsOptional()
  @IsMongoId({ message: 'Please provide a valid department ID (MongoDB ObjectId)' })
  department?: string;
  @ApiPropertyOptional({
    description: 'User specific permissions',
    enum: Permissions,
    isArray: true,
    example: [Permissions.CAN_MANAGE_USERS],
  })
  @IsOptional()
  @IsArray({ message: 'Permissions must be an array' })
  @IsEnum(Permissions, {
    each: true,
    message: 'One or more provided permissions are invalid',
  })
  permissions?: string[];
  @ApiPropertyOptional({
    description: 'Current status of the user account',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Please select a valid account status' })
  status?: UserStatus;
}
export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User email address', example: 'jhadii@mailinator.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
  @ApiPropertyOptional({ description: 'Username for login', example: 'john.doe' })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username cannot exceed 30 characters' })
  username?: string;
  @ApiPropertyOptional({
    description: 'Password (optional - will be auto-generated if not provided)',
    example: 'password123',
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password?: string;
  @IsOptional()
  @Transform(({ value }) => value?.toString())
  userId?: string;
  @ApiPropertyOptional({ description: 'User role', enum: Role, example: Role.MEMBER })
  @IsOptional()
  @IsEnum(Role, { message: 'Please select a valid role' })
  role?: string;
  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.INACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Please select a valid status' })
  status?: UserStatus;
  @ApiPropertyOptional({ description: 'Cell/phone number', example: '+1234567890' })
  @IsOptional()
  @IsString({ message: 'Cell number must be a string' })
  @MinLength(10, { message: 'Cell number must be at least 10 characters long' })
  @MaxLength(20, { message: 'Cell number cannot exceed 20 characters' })
  cell?: string | null;
  @ApiPropertyOptional({ description: 'Department ID', example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsMongoId({ message: 'Please provide a valid department ID' })
  department?: string;
  @ApiPropertyOptional({
    description: 'User permissions',
    enum: Object.values(Permissions),
    isArray: true,
    example: [Permissions.CAN_MANAGE_USERS, Permissions.CAN_MANAGE_DEPARTMENTS],
  })
  @IsOptional()
  @IsArray({ message: 'Permissions must be an array' })
  permissions?: string[];
  @ApiPropertyOptional({
    description: 'Password reset code',
    example: 123456,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Reset password code must be a number' })
  @Min(100000, { message: 'Reset password code must be at least 6 digits' })
  @Max(999999, { message: 'Reset password code cannot exceed 6 digits' })
  resetPasswordCode?: number | null;
  @ApiPropertyOptional({
    description: 'Password reset code expiration date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDate({ message: 'Reset password code expiration must be a valid date' })
  @Type(() => Date)
  resetPasswordCodeExpires?: Date;
  @ApiPropertyOptional({
    description: 'Password reset code generation date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDate({ message: 'Reset password code generation date must be a valid date' })
  @Type(() => Date)
  resetPasswordCodeGeneratedAt?: Date;
  @ApiPropertyOptional({
    description: 'Activation code for account verification',
    example: 123456,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Activation code must be a number' })
  @Min(100000, { message: 'Activation code must be at least 6 digits' })
  @Max(999999, { message: 'Activation code cannot exceed 6 digits' })
  activationCode?: number;
  @ApiPropertyOptional({
    description: 'Last logout date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDate({ message: 'Last logout must be a valid date' })
  @Type(() => Date)
  lastLogout?: Date;
  @ApiPropertyOptional({
    description: 'Activation code generation date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDate({ message: 'Activation code generation date must be a valid date' })
  @Type(() => Date)
  activationCodeGeneratedAt?: Date;
  @ApiPropertyOptional({
    description: 'Whether user is verified',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Is verified must be a boolean value' })
  isVerified?: boolean;
  @ApiPropertyOptional({
    description: 'Login count',
    example: 5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Login count must be a number' })
  @Min(0, { message: 'Login count cannot be negative' })
  loginCount?: number;
  @ApiPropertyOptional({
    description: 'Last login date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDate({ message: 'Last login must be a valid date' })
  @Type(() => Date)
  lastLogin?: Date;
  @ApiPropertyOptional({
    description: 'Last activation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDate({ message: 'Last activated at must be a valid date' })
  @Type(() => Date)
  lastActivatedAt?: Date;
  @ApiPropertyOptional({
    description: 'Account lockout expiration date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsOptional()
  @IsDate({ message: 'Lockout expiration must be a valid date' })
  @Type(() => Date)
  lockoutExpires?: Date;
  @ApiPropertyOptional({
    description: 'Number of failed login attempts',
    example: 3,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Failed login attempts must be a number' })
  @Min(0, { message: 'Failed login attempts cannot be negative' })
  failedLoginAttempts?: number;
}
export class CreateUserProfileDto extends CreateUserDto {
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
  @ApiPropertyOptional({
    description: 'Designation/Job title',
    example: 'Senior Software Engineer',
  })
  @IsOptional()
  @IsString({ message: 'Designation must be a string' })
  @MaxLength(100, { message: 'Designation cannot exceed 100 characters' })
  designation?: string;
  @ApiPropertyOptional({ description: 'Contact number', example: '+1234567890' })
  @IsOptional()
  @IsString({ message: 'Contact number must be a string' })
  @MinLength(10, { message: 'Contact number must be at least 10 characters long' })
  @MaxLength(20, { message: 'Contact number cannot exceed 20 characters' })
  contactNumber?: string;
}
export class UpdateUserProfileDto extends UpdateUserDto {
  @ApiPropertyOptional({ description: 'First name', example: 'John' })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName?: string;
  @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName?: string;
  @ApiPropertyOptional({
    description: 'Designation/Job title',
    example: 'Senior Software Engineer',
  })
  @IsOptional()
  @IsString({ message: 'Designation must be a string' })
  @MaxLength(100, { message: 'Designation cannot exceed 100 characters' })
  designation: string;
  @ApiPropertyOptional({ description: 'Contact number', example: '+1234567890' })
  @IsOptional()
  @IsString({ message: 'Contact number must be a string' })
  @MinLength(10, { message: 'Contact number must be at least 10 characters long' })
  @MaxLength(20, { message: 'Contact number cannot exceed 20 characters' })
  contactNumber?: string;
}
export class ChangePasswordDto {
  @ApiProperty({ description: 'New password', example: 'NewPassword123!' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'Password must contain both uppercase and lowercase letters',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one special character',
  })
  newPassword: string;
}
export class UserResponseDto {
  @ApiProperty({ example: '69007fb0b3f6741e42485fb2' })
  _id: string;
  @ApiProperty({ example: 'Jawad Ul Hadi' })
  fullName: string;
  @ApiProperty({ example: 'Lead Backend Developer' })
  designation: string;
  @ApiProperty({ example: 'Member' })
  role: string;
  @ApiProperty({ example: 'Member' })
  displayRole: string;
  @ApiProperty({ example: 'jhadi@apac-dev.agilebrains.com' })
  email: string;
  @ApiProperty({ example: 'Active' })
  status: string;
  @ApiProperty({ example: '+92-311-7248414' })
  cell: string;
  @ApiProperty()
  profile: profileInterface.TransformedProfile;
  @ApiProperty()
  department: departmentInterface.TransformedDepartment;
  @ApiProperty({ type: [String] })
  permissions: string[];
  @ApiProperty({ example: 22 })
  loginCount: number;
}
export class UsersListResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  users: UserResponseDto[];
  @ApiProperty({ type: UserResponseDto })
  authUser: UserResponseDto;
}
export class UserWithAuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
  @ApiProperty({ type: UserResponseDto })
  authUser: UserResponseDto;
}
export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
