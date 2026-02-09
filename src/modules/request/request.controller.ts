import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { ApiResponseDto } from '../../core/decorators/api-response.decorators';
import { GetUser } from '../../core/decorators/get-user.decorators';
import { USER } from '../../types/constants/error-messages.constants';
import { ActionType, RequestStatus } from '../../types/enums/request.enums';
import * as jwtInterface from '../../types/interfaces/jwt.interface';
import {
  PaginatedRequestListResponse,
  RequestListResponse,
  TransformedRequest,
} from '../../types/interfaces/request.interface';
import { AddRemarksDto, CreateRequestDto, ProcessActionDto } from './dto/request-dto';
import { RequestService } from './request.service';
@ApiTags('requests')
@ApiBearerAuth('jwt-auth')
@Controller('requests')
@UseGuards(AuthGuard('jwt'))
export class RequestController {
  constructor(private readonly requestService: RequestService) {}
  @Post()
  @ApiOperation({
    summary: 'Create a new request',
    description: 'Create a new request for the authenticated user',
  })
  @ApiBody({ type: CreateRequestDto })
  async createRequest(
    @Body() createLeaveRequestDto: CreateRequestDto,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<TransformedRequest>> {
    if (!user?._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    const newRequest = await this.requestService.createRequest(
      createLeaveRequestDto,
      new Types.ObjectId(user._id),
      user,
    );
    return ApiResponseDto.success(newRequest, 'Shared Successfully', HttpStatus.CREATED);
  }
  @Get('all')
  @ApiOperation({
    summary: 'Get all requests',
    description: 'Retrieve all requests with complete user details and optional pagination',
  })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10, max: 100)',
  })
  async getAllRequest(
    @GetUser() user: jwtInterface.UserPayload,
    @Query() query: any,
  ): Promise<ApiResponseDto<RequestListResponse | PaginatedRequestListResponse>> {
    const authUser = user;
    const filter: Record<string, any> = {};
    if (query.status) {
      filter.status = query.status;
    }
    const hasPaginationParams = query.page !== undefined || query.limit !== undefined;
    const paginationDto = hasPaginationParams
      ? {
          page: query.page ? parseInt(query.page) : 1,
          limit: query.limit ? parseInt(query.limit) : 10,
        }
      : undefined;
    const result = await this.requestService.getAllRequests(authUser, filter, paginationDto);
    return ApiResponseDto.success(result, 'Requests retrieved successfully');
  }
  @Put(':id/remarks')
  @ApiOperation({
    summary: 'Add remarks to request',
    description: 'Add remarks to a specific request',
  })
  @ApiParam({
    name: 'id',
    description: 'Request ID',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
  })
  @ApiBody({ type: AddRemarksDto, description: 'Remarks data' })
  async addRemarks(
    @Param('id') id: string,
    @Body() addRemarksDto: AddRemarksDto,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<TransformedRequest>> {
    const result = await this.requestService.addRemarks(id, addRemarksDto, user);
    return ApiResponseDto.success(result, 'Remarks added successfully');
  }
  @Put(':id/action')
  @ApiOperation({
    summary: 'Approve or reject request',
    description: 'Process a request (approve or reject) based on current stage',
  })
  @ApiParam({
    name: 'id',
    description: 'Request ID',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
  })
  @ApiBody({
    type: Object,
    description: 'Action data',
    examples: {
      approve: {
        summary: 'Approve request',
        value: { action: 'APPROVED', comment: 'Looks good, approved!' },
      },
      reject: {
        summary: 'Reject request',
        value: { action: 'DISAPPROVED', comment: 'Need more information' },
      },
    },
  })
  async processRequest(
    @Param('id') id: string,
    @Body() processDto: ProcessActionDto,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<TransformedRequest>> {
    const result = await this.requestService.processRequest(id, processDto, user);
    const actionMessage =
      processDto.action === ActionType.APPROVED
        ? 'Approved successfully'
        : 'Disapproved successfully';
    return ApiResponseDto.success(result, actionMessage);
  }
  @Put(':id/withdraw')
  @ApiOperation({
    summary: 'Withdraw a pending request',
    description: 'Allow the request owner to withdraw their pending request',
  })
  @ApiParam({
    name: 'id',
    description: 'Request ID',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
  })
  async withdrawRequest(
    @Param('id') id: string,
    @GetUser() authUser: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<TransformedRequest>> {
    const result = await this.requestService.withdrawRequest(id, authUser);
    return ApiResponseDto.success(result, 'Withdrawn successfully');
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Get one request by its ID with user details',
    description: 'Retrieve a specific request and the profile of the user who requested it',
  })
  @ApiParam({
    name: 'id',
    description: 'Request ID',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
  })
  async getOneRequest(
    @Param('id') id: string,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<TransformedRequest>> {
    const authUser = user;
    const result = await this.requestService.getOneRequest(id, authUser);
    return ApiResponseDto.success(result, 'request and user details retrieved successfully');
  }
  @Get('my/request')
  @ApiOperation({
    summary: 'Get all requests for the authenticated user',
    description:
      'Retrieve all requests and profile details for the currently logged-in user with optional pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10, max: 100)',
  })
  /**
   * Retrieves all requests and profile details for the currently logged-in user with optional pagination
   * @param user - Currently authenticated user
   * @param query - Query object containing pagination parameters
   * @returns A promise that resolves to an ApiResponseDto object containing either a RequestListResponse or a PaginatedRequestListResponse
   * @throws UnauthorizedException if the user is not authenticated
   */
  async getUserRequests(
    @GetUser() user: jwtInterface.UserPayload,
    @Query() query: any,
  ): Promise<ApiResponseDto<RequestListResponse | PaginatedRequestListResponse>> {
    const hasPaginationParams = query.page !== undefined || query.limit !== undefined;
    const paginationDto = hasPaginationParams
      ? {
          page: query.page ? parseInt(query.page) : 1,
          limit: query.limit ? parseInt(query.limit) : 10,
        }
      : undefined;
    const result = await this.requestService.getAllRequests(
      user,
      {
        user: new Types.ObjectId(user._id),
      },
      paginationDto,
    );
    const messageCount = Array.isArray(result)
      ? result.length
      : (result as any).data?.length || (result as any).requests?.length || 0;
    return ApiResponseDto.success(result, `Found ${messageCount} request(s) for the user`);
  }
}
