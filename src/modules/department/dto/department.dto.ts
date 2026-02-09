import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
export class TeamLeadDetailDto {
  @ApiProperty({
    description: 'User ID',
    example: '68fa4a9b3a50f116c7311796',
  })
  @IsMongoId()
  userId: Types.ObjectId;
  @ApiProperty({
    description: 'Username',
    example: 'samrullahnazir',
  })
  @IsString()
  username: string;
  @ApiProperty({
    description: 'Email address',
    example: 'ron@mailinator.com',
  })
  @IsString()
  email: string;
  @ApiProperty({
    description: 'User role',
    example: 'TEAM_LEAD',
  })
  @IsString()
  role: string;
  @ApiProperty({
    description: 'Designation',
    example: 'Team Lead - Business Development',
  })
  @IsString()
  designation: string;
  @ApiProperty({
    description: 'First name',
    example: 'Samrullah',
  })
  @IsString()
  firstName: string;
  @ApiProperty({
    description: 'Last name',
    example: 'Nazir',
  })
  @IsString()
  lastName: string;
}
export class DepartmentBaseDto {
  @ApiProperty({
    description: 'Department ID',
    example: '68d087eb52b91a26b1bf858b',
  })
  @IsMongoId()
  _id: Types.ObjectId;
  @ApiProperty({
    description: 'Department name',
    example: 'BD Canada',
  })
  @IsString()
  name: string;
  @ApiPropertyOptional({
    description: 'Department description',
    example:
      'Focuses on business development, client relationships, and market expansion strategies across Canada.',
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    description: 'Department active status',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;
}
export class DepartmentResponseDto extends DepartmentBaseDto {
  @ApiPropertyOptional({
    description: 'Team Lead ID',
    example: '68fa4a9b3a50f116c7311796',
  })
  @IsOptional()
  @IsMongoId()
  teamLead?: Types.ObjectId;
  @ApiPropertyOptional({
    description: 'Team lead details',
    type: TeamLeadDetailDto,
  })
  @IsOptional()
  @Type(() => TeamLeadDetailDto)
  teamLeadDetail?: TeamLeadDetailDto;
  @ApiProperty({
    description: 'Creation date',
    example: '2025-09-21T23:19:07.961Z',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
  @ApiProperty({
    description: 'Last update date',
    example: '2025-09-21T23:19:07.961Z',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
  @ApiPropertyOptional({
    description: 'Version key',
    example: 0,
  })
  @IsOptional()
  __v?: number;
}
export class DepartmentResponseWithIdDto {
  @ApiProperty({
    description: 'Department ID',
    example: '68d087eb52b91a26b1bf858b',
  })
  @IsString()
  id: string;
  @ApiProperty({
    description: 'Department name',
    example: 'BD Canada',
  })
  @IsString()
  name: string;
  @ApiPropertyOptional({
    description: 'Department description',
    example:
      'Focuses on business development, client relationships, and market expansion strategies across Canada.',
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    description: 'Department active status',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;
  @ApiPropertyOptional({
    description: 'Team Lead ID',
    example: '68fa4a9b3a50f116c7311796',
  })
  @IsOptional()
  @IsMongoId()
  teamLead?: Types.ObjectId;
  @ApiPropertyOptional({
    description: 'Team lead details',
    type: TeamLeadDetailDto,
  })
  @IsOptional()
  @Type(() => TeamLeadDetailDto)
  teamLeadDetail?: TeamLeadDetailDto;
  @ApiProperty({
    description: 'Creation date',
    example: '2025-09-21T23:19:07.961Z',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
  @ApiProperty({
    description: 'Last update date',
    example: '2025-09-21T23:19:07.961Z',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    example: 'BD Canada',
    required: true,
  })
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(2, { message: 'name must be at least 2 characters' })
  @MaxLength(80, { message: 'name must be at most 80 characters' })
  name: string;
  @ApiPropertyOptional({
    description: 'Department description',
    example:
      'Focuses on business development, client relationships, and market expansion strategies across Canada.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MinLength(2, { message: 'description must be at least 2 characters' })
  @MaxLength(300, { message: 'description must be at most 300 characters' })
  description?: string;
  @ApiPropertyOptional({
    description: 'Team Lead ID (MongoDB ObjectId)',
    example: '68fa4a9b3a50f116c7311796',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'teamLead must be a valid MongoDB ObjectId' })
  teamLead?: Types.ObjectId;
  @ApiPropertyOptional({
    description: 'Department active status',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean = true;
}
export class UpdateDepartmentDto {
  @ApiPropertyOptional({
    description: 'Department name',
    example: 'BD Canada - Updated',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name cannot be empty' })
  @MinLength(2, { message: 'name must be at least 2 characters' })
  @MaxLength(80, { message: 'name must be at most 80 characters' })
  name?: string;
  @ApiPropertyOptional({
    description: 'Department description',
    example: 'Updated description for business development department.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MinLength(2, { message: 'description must be at least 2 characters' })
  @MaxLength(300, { message: 'description must be at most 300 characters' })
  description?: string;
  @ApiPropertyOptional({
    description: 'Department active status',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;
  @ApiPropertyOptional({
    description: 'Team lead ID (MongoDB ObjectId)',
    example: '68fa4a9b3a50f116c7311796',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'teamLead must be a valid MongoDB ObjectId' })
  teamLead?: Types.ObjectId;
}
