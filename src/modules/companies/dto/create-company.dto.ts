import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  domain: string;

  @ApiProperty()
  @IsString()
  subdomain: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['holding', 'subsidiary', 'client', 'partner'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  branding?: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    favicon: string;
    customDomain: string;
    customEmail: string;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  subscription?: {
    plan: 'free' | 'starter' | 'professional' | 'enterprise';
    status: 'active' | 'trial' | 'past_due' | 'canceled';
    startsAt: Date;
    renewsAt: Date;
    users: number;
    jobSlots: number;
    features: string[];
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  settings?: {
    careersPage: {
      enabled: boolean;
      customUrl: string;
      theme: 'modern' | 'classic' | 'minimal';
    };
    applicationForm: {
      fields: string[];
      requireResume: boolean;
      allowQuickApply: boolean;
    };
    notifications: {
      newApplication: string[];
      interviewScheduled: string[];
      offerSent: string[];
    };
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  administrators?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
