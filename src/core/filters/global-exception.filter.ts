import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { SYSTEM_ERROR } from '../../types/constants/error-messages.constants';
import { ApiResponseDto } from '../decorators/api-response.decorators';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorResponse = this.transformException(exception);
    this.logErrorWithContext(errorResponse, exception, request);
    response.status(errorResponse.statusCode).json(errorResponse);
  }
  private transformException(exception: any): ApiResponseDto<any> {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      let message: string;
      let validationErrors: any = null;
      if (typeof response === 'object') {
        const responseObj = response as any;
        message = responseObj.message || exception.message;
        validationErrors = responseObj.errors || null;
      } else {
        message = response;
      }
      const responseData = validationErrors ? { errors: validationErrors } : null;
      return new ApiResponseDto(false, responseData, message, status);
    }
    if (this.isMongoError(exception)) {
      return this.handleMongoError(exception);
    }
    if (exception instanceof Error) {
      const errorMessage = exception.message;
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      if (
        errorMessage.includes('not verified') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('inactive') ||
        errorMessage.includes('suspended') ||
        errorMessage.includes('deleted')
      ) {
        statusCode = HttpStatus.UNAUTHORIZED;
      }
      return new ApiResponseDto(
        false,
        null,
        errorMessage || SYSTEM_ERROR.MAINTENANCE_MODE,
        statusCode,
      );
    }
    return new ApiResponseDto(
      false,
      null,
      'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  private isMongoError(error: any): boolean {
    return (
      error &&
      typeof error === 'object' &&
      error.name &&
      (error.name === 'MongoError' || error.name === 'MongoServerError')
    );
  }
  private handleMongoError(error: any): ApiResponseDto<any> {
    switch (error.code) {
      case 11000: {
        const match = error.message.match(/index: (\w+)_\d+ dup key: { (\w+): "([^"]+)" }/);
        const fieldName = match ? match[2] : 'field';
        const fieldValue = match ? match[3] : 'value';
        const message = `A user with this ${fieldName} (${fieldValue}) already exists`;
        return new ApiResponseDto(false, null, message, HttpStatus.CONFLICT);
      }
      case 121: {
        return new ApiResponseDto(
          false,
          null,
          'Document validation failed',
          HttpStatus.BAD_REQUEST,
        );
      }
      default:
        return new ApiResponseDto(
          false,
          null,
          error.message || SYSTEM_ERROR.CPU_OVERLOAD,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
  private logErrorWithContext(
    errorResponse: ApiResponseDto<any>,
    exception: any,
    request: Request,
  ): void {
    const requestId = request.headers['x-request-id'] || 'any';
    const userId = (request as any).user?._id || 'anonymous';
    const maskedBody = this.maskSensitiveData(request.body);
    const logContext = {
      requestId,
      userId,
      method: request.method,
      url: request.url,
      statusCode: errorResponse.statusCode,
      body: maskedBody,
      query: request.query,
      userAgent: request.headers['user-agent'],
    };
    if (errorResponse.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Internal Server Error: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : undefined,
        logContext,
      );
    } else {
      this.logger.warn(`⚠ Client Error: ${errorResponse.message}`, logContext);
    }
  }
  private maskSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') return data;
    const masked = { ...data };
    const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'refreshToken'];
    sensitiveFields.forEach(field => {
      if (masked[field]) masked[field] = '***MASKED***';
    });
    return masked;
  }
}
