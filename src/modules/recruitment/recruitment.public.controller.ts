import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  SetMetadata,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  ApiBadRequestResponse,
  ApiClarificationSubmittedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiPersonalInfoSubmittedResponse,
  ApiPublicCandidateResponse,
  ApiResponseDto,
} from '../../core/decorators/api-response.decorators';
import { Public } from '../../core/decorators/public.decorators';
import { RECRUITER } from '../../types/constants/error-messages.constants';
import {
  CandidateFilterDto,
  ClarificationFormDto,
  PersonalInfoWithDocumentsDto,
} from './dto/recruitment.dto';
import { RecruitmentService } from './recruitment.service';
@ApiTags('recruitment-public')
@Controller('recruitment-public')
export class RecruitmentPublicController {
  constructor(private readonly recruitmentService: RecruitmentService) {}
  @Get('candidate')
  @Public()
  @ApiOperation({
    summary: 'Get candidate by filter',
    description:
      'Public endpoint to retrieve candidate information based on filter criteria with search and pagination support (typically used with token)',
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
    name: 'token',
    required: false,
    description: 'Candidate access token',
    type: 'string',
    example: 'abc123token',
  })
  @ApiPublicCandidateResponse('Candidates retrieved successfully')
  @ApiBadRequestResponse('Invalid filter parameters')
  @ApiNotFoundResponse('Candidate not found')
  @ApiInternalServerErrorResponse('Internal server error')
  /**
   * Get candidates with filters, search, and pagination
   * @param {CandidateFilterDto} query - Filter parameters including search and pagination
   * @returns {Promise<ApiResponse>} - API response with candidates and optional pagination
   * @memberof RecruitmentPublicController
   */
  async getCandidate(@Query() query: CandidateFilterDto) {
    const result = await this.recruitmentService.fetchAllCandidates(query);
    return ApiResponseDto.success(result, RECRUITER.FOUND);
  }
  @Post('clarification/:token')
  @Public()
  @ApiOperation({
    summary: 'Submit clarification form',
    description:
      'Public endpoint for candidates to submit clarification form using their unique token',
  })
  @ApiParam({
    name: 'token',
    description: 'Unique access token provided to candidate',
    type: 'string',
    example: 'abc123def456ghi789',
  })
  @ApiBody({
    description: 'Clarification form data with candidate information and commitments',
    type: ClarificationFormDto,
  })
  @ApiClarificationSubmittedResponse('Clarification form submitted successfully')
  @ApiBadRequestResponse('Invalid form data')
  @ApiNotFoundResponse('Invalid token or candidate not found')
  @ApiInternalServerErrorResponse('Internal server error')
  /**
   * Public endpoint for candidates to submit clarification form using their unique token
   * @param {string} token - Unique access token provided to candidate
   * @param {ClarificationFormDto} dto - Clarification form data with candidate information and commitments
   * @returns {Promise<ApiResponse<any>>} - API response
   * @memberof RecruitmentPublicController
   */
  async submitClarificationForm(
    @Param('token') token: string,
    @Body() dto: ClarificationFormDto,
  ): Promise<ApiResponseDto<any>> {
    const result = await this.recruitmentService.submitClarificationForm(token, dto);
    return ApiResponseDto.success(result, 'Clarification Form Submitted Successfully');
  }
  @Post('personal/:token')
  @Public()
  @SetMetadata('timeout', 180000)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cnic', maxCount: 2 },
        { name: 'photograph', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
        { name: 'educationalDocs', maxCount: 5 },
        { name: 'experienceLetter', maxCount: 2 },
        { name: 'salarySlip', maxCount: 3 },
      ],
      {
        limits: {
          fileSize: 50 * 1024 * 1024,
        },
      },
    ),
  )
  @ApiOperation({
    summary: 'Submit personal information and documents',
    description:
      'Public endpoint for candidates to submit personal information and required documents using their unique token',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'token',
    description: 'Unique access token provided to candidate',
    type: 'string',
    example: 'abc123def456ghi789',
  })
  @ApiBody({
    description: 'Personal information (as JSON string) and document files',
    schema: {
      type: 'object',
      properties: {
        personalInfo: {
          type: 'string',
          description:
            'JSON string containing personal information data (PersonalInfoDto). Optional if only uploading documents.',
          example: '{"firstName":"John","lastName":"Doe","mobile":"+1234567890"}',
        },
        cnic: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'CNIC document files (Maximum 2 files)',
        },
        photograph: {
          type: 'string',
          format: 'binary',
          description: 'Candidate photograph (Maximum 1 file)',
        },
        resume: {
          type: 'string',
          format: 'binary',
          description: 'Resume/CV document (Maximum 1 file)',
        },
        educationalDocs: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Educational certificates and documents (Maximum 5 files)',
        },
        experienceLetter: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Experience letters from previous employers (Maximum 2 files)',
        },
        salarySlip: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Salary slips from previous employment (Maximum 3 files)',
        },
      },
    },
  })
  @ApiPersonalInfoSubmittedResponse('Personal information and documents submitted successfully')
  @ApiBadRequestResponse('Invalid form data, files, or token expired')
  @ApiNotFoundResponse('Invalid token or candidate not found')
  @ApiInternalServerErrorResponse('Internal server error during submission')
  /**
   * Submits personal information and documents for a candidate.
   * @param {string} token - The candidate's token.
   * @param {string} [personalInfoJson] - The candidate's personal information in JSON format.
   * @param {Object} [files] - The candidate's documents.
   * @returns {Promise<ApiResponse>} - The API response containing the result of the submission.
   */
  async submitCompleteProfile(
    @Param('token') token: string,
    @Body('personalInfo') personalInfoJson?: string,
    @UploadedFiles()
    files?: {
      cnic?: Express.Multer.File[];
      photograph?: Express.Multer.File[];
      resume?: Express.Multer.File[];
      educationalDocs?: Express.Multer.File[];
      experienceLetter?: Express.Multer.File[];
      salarySlip?: Express.Multer.File[];
    },
  ): Promise<ApiResponseDto<any>> {
    let personalData: PersonalInfoWithDocumentsDto = {} as PersonalInfoWithDocumentsDto;
    if (personalInfoJson && personalInfoJson.trim() !== '') {
      try {
        personalData = JSON.parse(personalInfoJson);
      } catch (error) {
        throw new HttpException('Invalid personal info JSON format', HttpStatus.OK);
      }
    }
    const hasPersonalInfo =
      personalInfoJson && personalInfoJson.trim() !== '' && Object.keys(personalData).length > 0;
    const hasFiles = files && Object.values(files).some(arr => arr && arr.length > 0);
    if (!hasPersonalInfo && !hasFiles) {
      throw new HttpException(
        'At least personal information or documents must be provided',
        HttpStatus.OK,
      );
    }
    const result = await this.recruitmentService.submitPersonalInfoWithDocuments(
      token,
      personalData,
      files || {},
    );
    return ApiResponseDto.success(
      result,
      'Personal Information and Documents Submitted Successfully',
    );
  }
}
