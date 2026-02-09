import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
/**
 * Root application controller
 *
 * Handles basic application endpoints including health checks and system status.
 * This controller serves as the entry point for the APAC Management System API.
 *
 * @author APAC Development Team
 * @version 1.0.0
 * @since 1.0.0
 */
@ApiTags('Application')
@Controller()
export class AppController {
  /**
   * Default application endpoint
   *
   * Returns a welcome message indicating the API is running.
   * This endpoint can be used for basic connectivity testing.
   *
   * @example
   * ```typescript
   * // Example response
   * "APAC Management System API is running!"
   * ```
   *
   * @returns {string} Welcome message
   */
  @Get()
  @ApiOperation({
    summary: 'Get API status',
    description: 'Returns a welcome message indicating the API is operational',
  })
  @ApiResponse({
    status: 200,
    description: 'API is running successfully',
    schema: {
      type: 'string',
      example: 'APAC Management System API is running!',
    },
  })
  getHello(): string {
    return 'APAC Management System API is running!';
  }
  /**
   * Health check endpoint
   *
   * Provides detailed health information about the application including
   * status, uptime, environment, and timestamp. This endpoint is useful for
   * monitoring and load balancer health checks.
   *
   * @example
   * ```typescript
   * // Example response
   * {
   *   "status": "OK",
   *   "timestamp": "2023-12-25T10:30:00.000Z",
   *   "uptime": 3600.5,
   *   "environment": "development"
   * }
   * ```
   *
   * @returns {object} Health check information
   * @returns {string} returns.status - Health status (always "OK")
   * @returns {string} returns.timestamp - Current timestamp in ISO format
   * @returns {number} returns.uptime - Application uptime in seconds
   * @returns {string} returns.environment - Current environment (development/staging/production)
   */
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns application health status and system information',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'OK' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number', example: 3600.5 },
        environment: { type: 'string', example: 'development' },
      },
    },
  })
  healthCheck(): {
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
  } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
