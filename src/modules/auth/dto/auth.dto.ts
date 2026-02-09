import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class LoginDto {
  @ApiProperty({ description: 'Username or email address', example: 'user@apac-dev.agilebrains.com' })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;
  @ApiProperty({ description: 'User password', example: 'Password123!' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
export class ResetPasswordDto {
  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId({ message: 'Invalid user ID format' })
  id: string;
  @ApiProperty({ description: 'Password reset code', example: '123456' })
  @IsString({ message: 'Reset code must be a string' })
  @MinLength(6, { message: 'Reset code must be at least 6 characters' })
  code: string;
  @ApiProperty({ description: 'New password', example: 'NewPassword123!' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
export class ForgotPasswordDto {
  @ApiProperty({ description: 'Registered email address', example: 'jhadii@mailinator.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
export class LogoutDto {
  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsMongoId({ message: 'Invalid user ID format' })
  userId: string;
}
export class ReActivationDto {
  @ApiProperty({ description: 'Email address', example: 'user@mailinator.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
export class ActivateUserDto {
  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  @IsMongoId({ message: 'Invalid user ID format' })
  id: string;
  @ApiProperty({ description: 'Activation code', example: '123456' })
  @IsString({ message: 'Activation code must be a string' })
  @IsNotEmpty({ message: 'Activation code is required' })
  @MinLength(6, { message: 'Activation code must be at least 6 characters' })
  code: string;
  @ApiProperty({ description: 'New Password', example: 'Password123!' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
export class SetPasswordDto extends ActivateUserDto {}
