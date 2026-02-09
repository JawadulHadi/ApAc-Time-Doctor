import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponseDto,
  ApiUsersResponse,
} from '../../core/decorators/api-response.decorators';
import { GetUser } from '../../core/decorators/get-user.decorators';
import { Permission } from '../../core/decorators/permission.decorators';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { LeaveBankEmailService } from '../../services/email/leave-bank/leave-bank-email.service';
import { FILE } from '../../types/constants/error-messages.constants';
import { IBaseUrl } from '../../types/constants/url-tags.constants';
import { maxFileSize } from '../../types/enums/doc.enums';
import { Month, MonthField } from '../../types/enums/leave-bank.enums';
import { Permissions } from '../../types/enums/permissions.enum';
import { EmailResult } from '../../types/interfaces/email.interface';
import * as jwtInterface from '../../types/interfaces/jwt.interface';
import { IProcessResult } from '../../types/interfaces/leave-bank.interface';
import { BankAnalytics } from './core/utils/bank-analytics';
import { BankBuilder } from './core/utils/bank-builder';
import { BankMapper } from './core/utils/bank-mapper';
import { EmployeeNotificationDto } from './dto/leave-bank.dto';
import { LeaveBankService } from './leave-bank.service';
import { BankRecordService } from './process/leave-bank-processor.service';
@ApiBearerAuth('jwt-auth')
@ApiTags('Leave Bank')
@Controller('leavebank')
@UseGuards(AuthGuard('jwt'))
export class LeaveBankController {
  private readonly logger = new Logger(LeaveBankController.name);
  constructor(
    private readonly leaveBankEmailService: LeaveBankEmailService,
    private readonly leaveBankService: LeaveBankService,
    private readonly leaveBankProcessorService: BankRecordService,
  ) {}
  @Get()
  @ApiOperation({
    summary: 'Get all leave bank records with optional filters data',
    description:
      'Admins and Super Admins can view all records. Others can only view their own records. Includes holiday information.',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Filter by year',
    example: 2025,
  })
  @ApiQuery({
    name: 'month',
    required: false,
    enum: Month,
    description: 'Filter by month - returns only the specified month data',
  })
  @ApiQuery({
    name: 'monthField',
    required: false,
    enum: MonthField,
    description: 'Specific month field to check for data',
  })
  @ApiQuery({
    name: 'monthMinValue',
    required: false,
    type: Number,
    description: 'Minimum value for the month field',
    example: 0,
  })
  @ApiQuery({
    name: 'department',
    required: false,
    type: String,
    description: 'Filter by department',
    example: 'Solutions Delivery Team',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    description: 'Filter by role',
    example: 'TEAM_LEAD',
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    type: String,
    description: 'Filter by employee ID',
    example: 'MAS-CAN-4136',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filter by email',
    example: 'someone@microagility.com',
  })
  @ApiQuery({
    name: 'hasRemainingLeaves',
    required: false,
    type: Boolean,
    description: 'Filter by remaining leaves (true/false)',
    example: true,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort by field (prefix with - for descending)',
    example: '-year',
  })
  @ApiResponse({ status: 200, description: 'Leave bank records retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized (missing/invalid JWT token)' })
  @ApiResponse({ status: 403, description: 'Forbidden (insufficient permissions)' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiUsersResponse('All leave bank records retrieved successfully with holiday data')
  @ApiForbiddenResponse('Insufficient permissions to access leave bank data')
  @ApiInternalServerErrorResponse('Internal server error while fetching leave bank records')
  async fetchAllRecords(
    @GetUser() user: jwtInterface.UserPayload,
    @Query('year') year?: string,
    @Query('month') month?: Month,
    @Query('monthField') monthField?: MonthField,
    @Query('monthMinValue') monthMinValue?: string,
    @Query('department') department?: string,
    @Query('employeeId') employeeId?: string,
    @Query('email') email?: string,
    @Query('hasRemainingLeaves') hasRemainingLeaves?: string,
    @Query('sort') sort?: string,
    @Query('role') role?: string,
  ): Promise<ApiResponseDto<any>> {
    const filters = BankBuilder.buildQuery(
      user,
      year,
      department,
      employeeId,
      email,
      hasRemainingLeaves,
      month,
      monthField,
      monthMinValue,
      role,
    );
    const sortCriteria = BankBuilder.buildSort(sort);
    const result = await this.leaveBankService.fetchRecords(
      filters,
      sortCriteria,
      month,
      year ? parseInt(year) : undefined,
    );
    const { records, myRecords } = BankMapper.permissionsMapping(user, result.records);
    const response = {
      records: [...records],
      myRecords: myRecords,
      analytics: BankAnalytics.buildAnalytics(
        [...records, ...myRecords],
        result.originalRecords,
        month,
      ),
    };
    const hasNoRecords = records.length === 0 && myRecords.length === 0;
    const message = hasNoRecords
      ? 'Were committed to keeping your records accurate and up-to - date. Try Later Currently Updating Your recrods'
      : 'All users leave bank records with user details retrieved successfully';
    return ApiResponseDto.success(response, message, HttpStatus.OK);
  }
  @Post('upload')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_MANAGE_LEAVE_BANK)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: maxFileSize.maxFile,
      },
      fileFilter: (_req, file, callback) => {
        const allowedMimes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ];
        if (!allowedMimes.includes(file.mimetype) || !file.originalname.match(/\.(xlsx|xls)$/)) {
          return callback(new Error(FILE.INVALID_TYPE), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Upload XLSX leave bank file',
    description: 'Upload and process Excel file containing leave bank data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'month',
    required: false,
    type: String,
    description: 'Optional month filter for the response data',
    example: 'january',
  })
  @ApiBody({
    description: 'Excel file containing leave bank data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'XLSX or XLS file',
        },
        month: {
          type: 'string',
          description: 'Month being uploaded/processed (from form-data body)',
          example: 'january',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Leave bank file processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request (invalid file type/format)' })
  @ApiResponse({ status: 401, description: 'Unauthorized (missing/invalid JWT token)' })
  @ApiResponse({ status: 403, description: 'Forbidden (missing CAN_MANAGE_LEAVE_BANK permission)' })
  @ApiCreatedResponse('Leave bank file processed successfully')
  @ApiBadRequestResponse('Invalid file type or format')
  @ApiForbiddenResponse('Insufficient permissions to upload leave bank data')
  @SetMetadata('timeout', 120000)
  async uploadLeaveBankFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: jwtInterface.UserPayload,
    @Body() body: any,
    @Query('month') month?: string,
  ): Promise<ApiResponseDto<IProcessResult>> {
    const currentMonth = body.month;
    const processResult = await this.leaveBankProcessorService.processBank(
      file.buffer,
      currentMonth,
      file.originalname,
    );
    const filters = BankBuilder.buildQuery(user);
    const sortCriteria = BankBuilder.buildSort();
    const latestResult = await this.leaveBankService.fetchRecords(filters, sortCriteria, month);
    const { records, myRecords } = BankMapper.permissionsMapping(user, latestResult.records);
    const allRecords = [...records, ...myRecords];
    const analytics = BankAnalytics.buildAnalytics(allRecords, latestResult.originalRecords, month);
    const uploadResponse = {
      totalRecords: processResult.processed + (processResult.errors || 0),
      processed: processResult.processed,
      errors: processResult.errors || 0,
      createdCount: processResult.createdCount || 0,
      updatedCount: processResult.updatedCount || 0,
      newMonthCount: processResult.newMonthCount || 0,
      processedUser:
        processResult.processedUserDetails?.map((detail: any) => ({
          employeeId: detail.employeeId,
          name: detail.name,
          year: detail.year,
          status: detail.status,
          dataChanged: detail.dataChanged || false,
        })) || [],
      records,
      authUser: user,
      analytics: analytics,
    };
    return ApiResponseDto.success(uploadResponse, 'Leave bank file processed successfully');
  }
  @Post('emails/bulk')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_MANAGE_LEAVE_BANK)
  @ApiOperation({
    summary: 'Send leave bank emails to multiple employees or all users',
    description:
      'Send emails to specific employees by IDs or to all users in the system. Supports optional year/month/department filters.',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: String,
    example: '2025',
    description: 'Year filter',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    type: String,
    example: 'january',
    description: 'Month filter',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    type: String,
    example: 'Solutions Delivery Team',
    description: 'Department filter',
  })
  @ApiBody({
    description:
      'Request payload. If employeeIds is provided, sends to those users; otherwise sends to all users.',
    schema: {
      type: 'object',
      properties: {
        employeeIds: {
          type: 'array',
          items: { type: 'string', example: 'MAS-CAN-4136' },
          description: 'Optional list of employee IDs to email',
        },
        baseUrl: {
          type: 'string',
          example: 'https://your-frontend-domain.com/leavebank',
          description: 'Optional base URL used inside email links',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Bulk emails sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized (missing/invalid JWT token)' })
  @ApiResponse({ status: 403, description: 'Forbidden (missing CAN_MANAGE_LEAVE_BANK permission)' })
  @ApiCreatedResponse('Bulk emails sent successfully')
  @ApiForbiddenResponse('Insufficient permissions to send bulk emails')
  async notifyAllUsers(
    @GetUser() user: jwtInterface.UserPayload,
    @Body() request: any,
    @Query('year') year?: number,
    @Query('month') month?: string,
    @Query('department') department?: string,
  ): Promise<ApiResponseDto<any>> {
    const batchSize = Math.max(90, Math.min(100, 90));
    const filters = BankBuilder.buildQuery(user);
    const sortCriteria = BankBuilder.buildSort();
    const result = await this.leaveBankService.fetchRecords(filters, sortCriteria, month, year);
    let emailResult: EmailResult;
    if (request.employeeIds && request.employeeIds.length > 0) {
      this.logger.log(`Sending emails to ${request.employeeIds.length} specific employees`);
      emailResult = await this.leaveBankEmailService.emailsToEmployees(
        request.employeeIds,
        result.records,
        request.baseUrl,
        batchSize,
        month?.toString(),
        year?.toString(),
      );
    } else {
      emailResult = await this.leaveBankEmailService.EmailsToAllUsers(
        result.records,
        request.baseUrl || IBaseUrl,
        batchSize,
        month?.toString(),
        year?.toString(),
      );
    }
    return ApiResponseDto.success(emailResult, 'All Users should have received your message.');
  }
  @Post('emails/single/:employeeId')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_MANAGE_LEAVE_BANK)
  @ApiOperation({
    summary: 'Send leave bank email to single employee',
    description: 'Send leave bank notification email to a specific employee',
  })
  @ApiParam({
    name: 'employeeId',
    description: 'Employee ID',
    example: 'MAS-MIS-5062',
    required: true,
  })
  @ApiQuery({
    name: 'month',
    required: false,
    type: String,
    description: 'Month for the email',
    example: 'december',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: 'Year for the email',
    example: 2025,
  })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized (missing/invalid JWT token)' })
  @ApiResponse({ status: 403, description: 'Forbidden (missing CAN_MANAGE_LEAVE_BANK permission)' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 200, description: 'Email sent successfully to employee' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions to send email' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async sendSingleUserEmail(
    @Param('employeeId') employeeId: string,
    @Body() body: any,
    @Query('month') month?: string,
    @Query('year') year?: number,
  ): Promise<ApiResponseDto<any>> {
    const filters = BankBuilder.buildQuery();
    const sortCriteria = BankBuilder.buildSort();
    const result = await this.leaveBankService.fetchRecords(filters, sortCriteria, month, year);
    const userRecord = result.records.find(record => record.employeeId === employeeId);
    if (!userRecord) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }
    const emailSent = await this.leaveBankEmailService.EmailToUser(
      userRecord,
      (body && body.baseUrl) || IBaseUrl,
      month?.toString(),
      year?.toString(),
    );
    return ApiResponseDto.success(
      { emailSent },
      emailSent ? 'Email sent successfully' : 'Failed to send email',
      HttpStatus.OK,
    );
  }
  @Post('emails/:employeeId')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_MANAGE_LEAVE_BANK)
  @ApiOperation({
    summary: 'Handle employee notification actions (Send Email or Cancel)',
    description: 'Process send update email or cancel action for employee leave data discrepancies',
  })
  @ApiParam({
    name: 'employeeId',
    description: 'Employee ID',
    example: 'MAS-MIS-5062',
    required: true,
  })
  @ApiBody({
    type: EmployeeNotificationDto,
    description: 'Employee notification action payload',
  })
  @ApiResponse({ status: 201, description: 'Employee notification action processed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized (missing/invalid JWT token)' })
  @ApiResponse({ status: 403, description: 'Forbidden (missing CAN_MANAGE_LEAVE_BANK permission)' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiCreatedResponse('Employee notification action processed successfully')
  @ApiForbiddenResponse('Insufficient permissions for employee notification actions')
  @ApiNotFoundResponse('Employee not found')
  async notifyDiscrepancyResolved(
    @Param('employeeId') employeeId: string,
    @Body() body: EmployeeNotificationDto,
  ): Promise<ApiResponseDto<any>> {
    const year = body.year;
    const result = await this.leaveBankService.notifyDiscrepancyResolved(
      employeeId,
      body.sendEmail,
      (body && body.baseUrl) || IBaseUrl,
      body.month,
      year,
    );
    return ApiResponseDto.success(result.data, result.message);
  }
  @Delete('all')
  @UseGuards(PermissionsGuard)
  @Permission(Permissions.CAN_MANAGE_LEAVE_BANK)
  @ApiOperation({
    summary: 'Delete all leave bank records',
    description:
      'Hard delete all leave bank records from the database. This action cannot be undone.',
  })
  @ApiResponse({ status: 200, description: 'All leave bank records deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized (missing/invalid JWT token)' })
  @ApiResponse({ status: 403, description: 'Forbidden (missing CAN_MANAGE_LEAVE_BANK permission)' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiForbiddenResponse('Insufficient permissions to delete leave bank records')
  @ApiInternalServerErrorResponse('Internal server error while deleting leave bank records')
  async deleteAllRecords(@GetUser() user: jwtInterface.UserPayload): Promise<ApiResponseDto<any>> {
    this.logger.log(
      `User ${user.employeeId} (${user.fullName}) is deleting all leave bank records`,
    );
    const result = await this.leaveBankService.deleteAllRecords();
    this.logger.log(
      `Successfully deleted ${result.deletedCount} leave bank records by user ${user.employeeId}`,
    );
    return ApiResponseDto.success(
      { deletedCount: result.deletedCount },
      result.message,
      HttpStatus.OK,
    );
  }
}
