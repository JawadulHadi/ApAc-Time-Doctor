import { Injectable } from '@nestjs/common';
/**
 * Application service
 *
 * Provides core application-level services and information.
 * This service handles application metadata and basic system information.
 *
 * @author APAC Development Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Injectable()
export class AppService {
  /**
   * Get application information
   *
   * Returns basic application metadata including name, version, and timestamp.
   * This method can be used to identify the application and its current state.
   *
   * @example
   * ```typescript
   * // Example response
   * {
   *   "message": "APAC Management System",
   *   "version": "1.0.0",
   *   "timestamp": "2023-12-25T10:30:00.000Z"
   * }
   * ```
   *
   * @returns {object} Application information
   * @returns {string} returns.message - Application name
   * @returns {string} returns.version - Application version
   * @returns {string} returns.timestamp - Current timestamp in ISO format
   */
  getHello(): {
    message: string;
    version: string;
    timestamp: string;
  } {
    return {
      message: 'APAC Management System',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
