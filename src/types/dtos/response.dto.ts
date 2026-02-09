import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import * as statementInterface from '../interfaces/statement.interface';
export class SuccessIndicatorResponseDto implements statementInterface.IQuarter {
  @ApiProperty({ description: 'Quarter number', example: 1 })
  quarter: number;
  @ApiProperty({ description: 'Is quarter active', example: true })
  isActive: boolean;
  @ApiProperty({ description: 'Year', example: 2026 })
  year: number;
  @ApiProperty({ description: 'Indicators for this quarter' })
  indicators: any[];
}
export class ProfileResponseDto implements statementInterface.IProfileResponse {
  @ApiProperty({ description: 'User ID' })
  userId: string;
  @ApiProperty({ description: 'Full name' })
  fullName: string;
  @ApiProperty({ description: 'Role' })
  role: string;
  @ApiProperty({ description: 'Employee ID' })
  employeeId: string;
  @ApiProperty({ description: 'Designation' })
  designation: string;
  @ApiProperty({ description: 'Email' })
  email: string;
  @ApiProperty({ description: 'Department' })
  department: string;
  @ApiProperty({ description: 'Profile picture URL' })
  pictureUrl: string;
  @ApiProperty({ description: 'Mission statement' })
  missionStatement: statementInterface.IMission;
  @ApiProperty({ description: 'Success indicators by quarter' })
  successIndicators: SuccessIndicatorResponseDto[];
}
export class ProfileListResponseDto {
  @ApiProperty({ description: 'List of profiles', type: [ProfileResponseDto] })
  records: ProfileResponseDto[];
  @ApiPropertyOptional({ description: 'Current user profile' })
  myRecords?: ProfileResponseDto;
  @ApiProperty({ description: 'Response filters' })
  filters: {
    userRole: string;
    totalRecords: number;
    date: string;
  };
}
