import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { fileCategory } from '../../../types/enums/doc.enums';
export class UploadDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Profile Picture',
    minLength: 1,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Document title is required' })
  @IsString({ message: 'Document title must be a string' })
  @MinLength(1, { message: 'Document title must be at least 1 character long' })
  @MaxLength(255, { message: 'Document title cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  title: string;
  @ApiProperty({
    description: 'Document category',
    enum: fileCategory,
    example: fileCategory.PUBLIC,
    required: false,
  })
  @IsOptional()
  @IsEnum(fileCategory, {
    message: `Category must be one of: ${Object.values(fileCategory).join(', ')}`,
  })
  category?: fileCategory;
  @ApiProperty({
    description: 'Is document public',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublic must be a boolean value' })
  isPublic?: boolean;
  @IsOptional()
  @IsDate({ message: 'createdAt must be a valid date' })
  @Type(() => Date)
  createdAt?: Date;
  @IsOptional()
  @IsDate({ message: 'updatedAt must be a valid date' })
  @Type(() => Date)
  updatedAt?: Date;
}
export class UpdateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Updated Profile Picture',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Document title must be a string' })
  @MinLength(1, { message: 'Document title must be at least 1 character long' })
  @MaxLength(255, { message: 'Document title cannot exceed 255 characters' })
  @Transform(({ value }) => value?.trim())
  title?: string;
  @ApiProperty({
    description: 'Document category',
    enum: fileCategory,
    example: fileCategory.NON_PUBLIC,
    required: false,
  })
  @IsOptional()
  @IsEnum(fileCategory, {
    message: `Category must be one of: ${Object.values(fileCategory).join(', ')}`,
  })
  category?: fileCategory;
  @ApiProperty({
    description: 'Is document public',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublic must be a boolean value' })
  isPublic?: boolean;
  @IsOptional()
  @IsDate({ message: 'createdAt must be a valid date' })
  @Type(() => Date)
  createdAt?: Date;
  @IsOptional()
  @IsDate({ message: 'updatedAt must be a valid date' })
  @Type(() => Date)
  updatedAt?: Date;
}
