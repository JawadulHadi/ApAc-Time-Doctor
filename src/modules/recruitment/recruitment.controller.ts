import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import {
  ApiArchiveResponse,
  ApiBadRequestResponse,
  ApiCandidateCreatedResponse,
  ApiCandidatesResponse,
  ApiClarificationResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOnboardingResponse,
  ApiPersonalInfoResponse,
  ApiResponseDto,
  ApiUnauthorizedResponse,
} from '../../core/decorators/api-response.decorators';
import { GetUser } from '../../core/decorators/get-user.decorators';
import { Permission } from '../../core/decorators/permission.decorators';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { responseTransform } from '../../shared/utils/unified-transform.utils';
import { RECRUITER, USER } from '../../types/constants/error-messages.constants';
import { Permissions } from '../../types/enums/permissions.enum';
import * as jwtInterface from '../../types/interfaces/jwt.interface';
import { TransformedUser } from '../../types/interfaces/transform.interface';
import { CreateUserProfileDto } from '../user/dto/user.dto';
import { AddCandidateDto, CandidateFilterDto, RequestFormDto } from './dto/recruitment.dto';
import { RecruitmentService } from './recruitment.service';
import { Candidates } from './schemas/candidate.schema';
@ApiTags('recruitment')
@ApiBearerAuth('jwt-auth')
@Controller('recruitment')
@UseGuards(AuthGuard('jwt'))
export class RecruitmentController {
  private readonly logger = new Logger(RecruitmentController.name);
  constructor(private readonly recruitmentService: RecruitmentService) {}
  @Get('candidate')
  @Permission(Permissions.CAN_MANAGE_CANDIDATES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Get all candidates',
    description:
      'Retrieve all recruitment candidates with search, filtering, and optional pagination capabilities',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search candidates by name, email, or job title (case-insensitive)',
    type: 'string',
    example: 'john software',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    description: 'Filter by department ID or name',
    type: 'string',
    example: 'Engineering',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by hiring status (added, clarification, personal_info, onboarded)',
    type: 'string',
    example: 'onboarded',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description: 'Filter by creation date from (YYYY-MM-DD)',
    type: 'string',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'Filter by creation date to (YYYY-MM-DD)',
    type: 'string',
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination (optional)',
    type: 'number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (optional, max 100)',
    type: 'number',
    example: 20,
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'Filter by candidate ID',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter by candidate email address',
    type: 'string',
    example: 'candidate@mailinator.com',
  })
  @ApiQuery({
    name: 'jobTitle',
    required: false,
    description: 'Filter by job title',
    type: 'string',
    example: 'Software Engineer',
  })
  @ApiQuery({
    name: 'hiringStage',
    required: false,
    description: 'Filter by current hiring stage',
    type: 'string',
    example: 'INTERVIEW',
  })
  @ApiCandidatesResponse('Candidates retrieved successfully')
  @ApiUnauthorizedResponse('Valid JWT token required')
  @ApiForbiddenResponse('Insufficient permissions')
  @ApiInternalServerErrorResponse('Internal server error')
  async getAllCandidates(
    @Query() query: CandidateFilterDto,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<{ candidates: Candidates[] | null; pagination?: any }>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    this.logger.log(`Query: ${JSON.stringify(query)}`);
    this.logger.log(`Getting all candidates for user ${user.email}`);
    const result = await this.recruitmentService.fetchAllCandidates(query);
    return ApiResponseDto.success(result, RECRUITER.FOUND);
  }
  @Post('candidate')
  @Permission(Permissions.CAN_MANAGE_CANDIDATES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Create a new candidate',
    description: 'Create a new recruitment candidate with personal details and job requirements',
  })
  @ApiBody({
    description: 'Candidate information including personal details and job requirements',
    type: AddCandidateDto,
  })
  @ApiCandidateCreatedResponse('Candidate created successfully')
  @ApiBadRequestResponse('Invalid input data or candidate already exists')
  @ApiUnauthorizedResponse('Valid JWT token required')
  @ApiForbiddenResponse('Insufficient permissions')
  @ApiNotFoundResponse('Department not found')
  @ApiInternalServerErrorResponse('Internal server error')
  async addCandidate(
    @Body() dto: AddCandidateDto,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<Candidates>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    this.logger.log(`Creating candidate by user ${user.email}`);
    const result = await this.recruitmentService.addCandidate(
      dto,
      new Types.ObjectId(user._id as string),
    );
    return ApiResponseDto.success(result, RECRUITER.CREATED);
  }
  @Post('clarification/:id')
  @Permission(Permissions.CAN_MANAGE_CANDIDATES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Request clarification from candidate',
    description: 'Generate and send clarification form URL to candidate for additional information',
  })
  @ApiParam({
    name: 'id',
    description: 'Candidate unique identifier',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiClarificationResponse('Clarification URL generated successfully')
  @ApiUnauthorizedResponse('Valid JWT token required')
  @ApiForbiddenResponse('Insufficient permissions')
  @ApiNotFoundResponse('Candidate not found')
  @ApiInternalServerErrorResponse('Internal server error')
  async requestClarification(
    @Param('id') id: Types.ObjectId,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<RequestFormDto>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    this.logger.log(
      `Requesting clarification for candidate ${id.toString()} by user ${user.email}`,
    );
    const result = await this.recruitmentService.requestClarification(
      id,
      new Types.ObjectId(user._id as string),
    );
    return ApiResponseDto.success(result, RECRUITER.LINK);
  }
  @Post('personal-info/:id')
  @Permission(Permissions.CAN_MANAGE_CANDIDATES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Generate personal info form URL',
    description: 'Generate personal information and required documents form URL for candidate',
  })
  @ApiParam({
    name: 'id',
    description: 'Candidate unique identifier',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiPersonalInfoResponse('Personal info form URL generated successfully')
  @ApiUnauthorizedResponse('Valid JWT token required')
  @ApiForbiddenResponse('Insufficient permissions')
  @ApiNotFoundResponse('Candidate not found')
  @ApiInternalServerErrorResponse('Internal server error')
  async requestPersonalInfoWithDocuments(
    @Param('id') id: Types.ObjectId,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<RequestFormDto>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    this.logger.log(
      `Requesting personal info for candidate ${id.toString()} by user ${user.email}`,
    );
    const result = await this.recruitmentService.requestPersonalInfoWithDocuments(
      id.toString(),
      new Types.ObjectId(user._id as string),
    );
    return ApiResponseDto.success(result, RECRUITER.LINK);
  }
  @Post('complete-info/:id')
  @Permission(Permissions.CAN_MANAGE_CANDIDATES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Complete personal info collection',
    description: 'Mark personal information and documents collection as complete for candidate',
  })
  @ApiParam({
    name: 'id',
    description: 'Candidate unique identifier',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiPersonalInfoResponse('Personal info collection completed successfully')
  @ApiUnauthorizedResponse('Valid JWT token required')
  @ApiForbiddenResponse('Insufficient permissions')
  @ApiNotFoundResponse('Candidate not found')
  @ApiInternalServerErrorResponse('Internal server error')
  async requestCompletePersonalInfo(
    @Param('id') id: Types.ObjectId,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<Candidates>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    const result = await this.recruitmentService.requestCompletePersonalInfo(
      id.toString(),
      new Types.ObjectId(user._id as string),
    );
    return ApiResponseDto.success(result, RECRUITER.LINK_COMPLETED);
  }
  @Post('onboard/:id')
  @Permission(Permissions.CAN_MANAGE_CANDIDATES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Move candidate to onboarding',
    description: 'Transition candidate to onboarding stage and create employee user account',
  })
  @ApiParam({
    name: 'id',
    description: 'Candidate unique identifier',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    description: 'User profile data for creating the employee account',
    type: CreateUserProfileDto,
  })
  @ApiOnboardingResponse('Candidate onboarded successfully')
  @ApiBadRequestResponse('Cannot onboard candidate at current stage')
  @ApiUnauthorizedResponse('Valid JWT token required')
  @ApiForbiddenResponse('Insufficient permissions')
  @ApiNotFoundResponse('Candidate not found')
  @ApiInternalServerErrorResponse('Internal server error')
  async moveToOnboarding(
    @Param('id') id: Types.ObjectId,
    @GetUser() user: jwtInterface.UserPayload,
    @Body() createUserDto: CreateUserProfileDto,
  ): Promise<
    ApiResponseDto<{
      user: TransformedUser;
      authUser: TransformedUser;
    }>
  > {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    this.logger.log(`Moving candidate ${id.toString()} to onboarding by user ${user.email}`);
    const result = await this.recruitmentService.moveToOnboarding(
      id.toString(),
      new Types.ObjectId(user._id as string),
      createUserDto,
    );
    const response = {
      user: responseTransform({ data: result.user }) as TransformedUser,
      authUser: responseTransform({ data: result.authUser }) as TransformedUser,
    };
    return ApiResponseDto.success(response, RECRUITER.ONBOARD);
  }
  @Delete('archive/:id')
  @Permission(Permissions.CAN_MANAGE_CANDIDATES)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Archive candidate',
    description: 'Archive a candidate record (soft delete) - cannot be undone',
  })
  @ApiParam({
    name: 'id',
    description: 'Candidate unique identifier',
    type: 'string',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiArchiveResponse('Candidate archived successfully')
  @ApiBadRequestResponse('Cannot delete onboarded candidate')
  @ApiUnauthorizedResponse('Valid JWT token required')
  @ApiForbiddenResponse('Insufficient permissions')
  @ApiNotFoundResponse('Candidate not found')
  @ApiInternalServerErrorResponse('Internal server error')
  async archiveCandidate(
    @Param('id') id: Types.ObjectId,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<void>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    this.logger.log(`Archiving candidate ${id.toString()} by user ${user.email}`);
    await this.recruitmentService.archiveCandidate(id.toString());
    return ApiResponseDto.success(null, RECRUITER.ARCHIVED);
  }
}
