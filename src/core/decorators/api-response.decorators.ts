import { applyDecorators, HttpStatus, SetMetadata } from '@nestjs/common';
import { ApiProperty, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';

import { RequestResponseDto } from '../../modules/request/dto/request-dto';
import {
  LoginResponseDto,
  UsersListResponseDto,
  UserWithAuthResponseDto,
} from '../../modules/user/dto/user.dto';
export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;
  @ApiProperty({
    description: 'Response data payload',
    nullable: true,
  })
  data: T | null;
  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2025-11-16T21:27:08.456Z',
  })
  timestamp: string;
  constructor(
    success: boolean,
    data: T | null,
    message: string = '',
    statusCode: number = HttpStatus.OK,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
  static success<T>(
    data: T,
    message: string = 'Operation completed successfully',
    statusCode: number = HttpStatus.OK,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(true, data, message, statusCode);
  }
  static created<T>(data: T, message: string = 'Resource created successfully'): ApiResponseDto<T> {
    return new ApiResponseDto(true, data, message, HttpStatus.CREATED);
  }
  static accepted<T>(data: T, message: string = 'Request accepted'): ApiResponseDto<T> {
    return new ApiResponseDto(true, data, message, HttpStatus.ACCEPTED);
  }
  static noContent(message: string = 'No content'): ApiResponseDto<null> {
    return new ApiResponseDto(true, null, message, HttpStatus.NO_CONTENT);
  }
  static error<T = any>(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    data: T | null = null,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(false, data, message, statusCode);
  }
  static badRequest<T = any>(message: string = 'Bad request', data?: T): ApiResponseDto<T> {
    return new ApiResponseDto(false, data || null, message, HttpStatus.BAD_REQUEST);
  }
  static unauthorized<T = any>(message: string = 'Unauthorized', data?: T): ApiResponseDto<T> {
    return new ApiResponseDto(false, data || null, message, HttpStatus.UNAUTHORIZED);
  }
  static forbidden<T = any>(message: string = 'Forbidden', data?: T): ApiResponseDto<T> {
    return new ApiResponseDto(false, data || null, message, HttpStatus.FORBIDDEN);
  }
  static notFound<T = any>(message: string = 'Resource not found', data?: T): ApiResponseDto<T> {
    return new ApiResponseDto(false, data || null, message, HttpStatus.NOT_FOUND);
  }
  static conflict<T = any>(message: string = 'Conflict', data?: T): ApiResponseDto<T> {
    return new ApiResponseDto(false, data || null, message, HttpStatus.CONFLICT);
  }
  static payloadTooLarge<T = any>(
    message: string = 'Payload too large',
    data?: T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(false, data || null, message, HttpStatus.PAYLOAD_TOO_LARGE);
  }
  static tooManyRequests<T = any>(
    message: string = 'Too many requests',
    data?: T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(false, data || null, message, HttpStatus.TOO_MANY_REQUESTS);
  }
  static internalServerError<T = any>(
    message: string = 'Internal server error',
    data?: T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(false, data || null, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
export const API_RESPONSE_METADATA = 'api_response_metadata';
export interface ApiResponseMetadata {
  message?: string;
  statusCode?: number;
  transformType?:
    | 'user'
    | 'users'
    | 'request'
    | 'requests'
    | 'login'
    | 'passwordChange'
    | 'profile';
  description?: string;
  isArray?: boolean;
}
export function ApiResponse(metadata: ApiResponseMetadata = {}) {
  return SetMetadata(API_RESPONSE_METADATA, metadata);
}
export function ApiUserResponse(description: string = 'User operation completed successfully') {
  return applyDecorators(
    ApiResponse({
      transformType: 'user',
      description,
      message: description,
    }),
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      type: ApiResponseDto<UserWithAuthResponseDto>,
    }),
  );
}
export function ApiUsersResponse(description: string = 'Users retrieved successfully') {
  return applyDecorators(
    ApiResponse({
      transformType: 'users',
      description,
      message: description,
    }),
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      type: ApiResponseDto<UsersListResponseDto>,
    }),
  );
}
export function ApiLoginResponse(description: string = 'Login successful') {
  return applyDecorators(
    ApiResponse({
      transformType: 'login',
      description,
      message: 'Welcome back!',
    }),
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      type: ApiResponseDto<LoginResponseDto>,
    }),
  );
}
export function ApiRequestResponse(description: string = 'Request operation completed') {
  return applyDecorators(
    ApiResponse({
      transformType: 'request',
      description,
    }),
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      type: ApiResponseDto<RequestResponseDto>,
    }),
  );
}
export function ApiCreatedResponse(description: string = 'Resource created successfully') {
  return applyDecorators(
    ApiResponse({
      statusCode: HttpStatus.CREATED,
      message: description,
    }),
    SwaggerApiResponse({
      status: HttpStatus.CREATED,
      description,
    }),
  );
}
export function ApiNoContentResponse(description: string = 'No content') {
  return applyDecorators(
    ApiResponse({
      statusCode: HttpStatus.NO_CONTENT,
      message: description,
    }),
    SwaggerApiResponse({
      status: HttpStatus.NO_CONTENT,
      description,
    }),
  );
}
export function ApiBadRequestResponse(description: string = 'Bad request') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description,
    }),
  );
}
export function ApiUnauthorizedResponse(description: string = 'Unauthorized') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description,
    }),
  );
}
export function ApiForbiddenResponse(description: string = 'Forbidden') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.FORBIDDEN,
      description,
    }),
  );
}
export function ApiNotFoundResponse(description: string = 'Resource not found') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.NOT_FOUND,
      description,
    }),
  );
}
export function ApiConflictResponse(description: string = 'Conflict') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.CONFLICT,
      description,
    }),
  );
}
export function ApiInternalServerErrorResponse(description: string = 'Internal server error') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description,
    }),
  );
}
export function ApiCandidateCreatedResponse(
  description: string = 'Candidate created successfully',
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.CREATED,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            description: 'Created candidate details',
          },
          message: { type: 'string', example: description },
          statusCode: { type: 'number', example: 201 },
        },
      },
    }),
  );
}
export function ApiCandidatesResponse(description: string = 'Candidates retrieved successfully') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              candidates: {
                type: 'array',
                items: {
                  type: 'object',
                  description: 'Candidate object with details',
                },
              },
            },
          },
          message: { type: 'string', example: description },
          statusCode: { type: 'number', example: 200 },
        },
      },
    }),
  );
}
export function ApiClarificationResponse(
  description: string = 'Clarification URL generated successfully',
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            description: 'Clarification form details',
          },
          message: { type: 'string', example: description },
          statusCode: { type: 'number', example: 200 },
        },
      },
    }),
  );
}
export function ApiPersonalInfoResponse(
  description: string = 'Personal info form URL generated successfully',
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            description: 'Personal info form details',
          },
          message: { type: 'string', example: description },
          statusCode: { type: 'number', example: 200 },
        },
      },
    }),
  );
}
export function ApiOnboardingResponse(description: string = 'Candidate onboarded successfully') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                description: 'Created employee user account',
              },
              authUser: {
                type: 'object',
                description: 'Authenticated user who performed onboarding',
              },
            },
          },
          message: { type: 'string', example: description },
          statusCode: { type: 'number', example: 200 },
        },
      },
    }),
  );
}
export function ApiArchiveResponse(description: string = 'Candidate archived successfully') {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'null', example: null },
          message: { type: 'string', example: description },
          statusCode: { type: 'number', example: 200 },
        },
      },
    }),
  );
}
export function ApiPublicCandidateResponse(
  description: string = 'Candidate retrieved successfully',
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              candidates: {
                type: 'array',
                items: {
                  type: 'object',
                  description: 'Candidate object with basic details',
                },
              },
            },
          },
          message: { type: 'string', example: description },
          statusCode: { type: 'number', example: 200 },
        },
      },
    }),
  );
}
export function ApiClarificationSubmittedResponse(
  description: string = 'Clarification form submitted successfully',
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            description: 'Submitted clarification form details',
          },
          message: { type: 'string', example: 'Clarification Form Submitted Successfully' },
          statusCode: { type: 'number', example: 200 },
        },
      },
    }),
  );
}
export function ApiPersonalInfoSubmittedResponse(
  description: string = 'Personal information and documents submitted successfully',
) {
  return applyDecorators(
    SwaggerApiResponse({
      status: HttpStatus.OK,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            description: 'Submitted personal information and document details',
          },
          message: {
            type: 'string',
            example: 'Personal Information and Documents Submitted Successfully',
          },
          statusCode: { type: 'number', example: 200 },
        },
      },
    }),
  );
}
