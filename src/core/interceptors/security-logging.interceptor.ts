import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor for security audit logging
 * Logs authentication-related requests for security monitoring
 */
@Injectable()
export class SecurityLoggingInterceptor implements NestInterceptor {
  private readonly sensitiveEndpoints = [
    '/auth/login',
    '/auth/logout',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/activate',
    '/auth/re-activation',
  ];

  /**
   * Intercepts HTTP requests for security audit logging
   * @param context - Execution context
   * @param next - Next call handler
   * @returns Observable with response
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, headers } = request;

    if (this.shouldLogRequest(url)) {
      this.logSecurityEvent(request, 'REQUEST_START');
    }

    return next.handle().pipe(
      tap({
        next: response => {
          if (this.shouldLogRequest(url)) {
            this.logSecurityEvent(request, 'REQUEST_SUCCESS', response);
          }
        },
        error: error => {
          if (this.shouldLogRequest(url)) {
            this.logSecurityEvent(request, 'REQUEST_ERROR', { error: error.message });
          }
        },
      }),
    );
  }

  /**
   * Determines if a request should be logged for security purposes
   * @param url - Request URL
   * @returns True if request should be logged
   */
  private shouldLogRequest(url: string): boolean {
    return this.sensitiveEndpoints.some(endpoint => url.includes(endpoint));
  }

  /**
   * Logs security events with relevant context
   * @param request - Express request object
   * @param eventType - Type of security event
   * @param additionalData - Additional data to log
   */
  private logSecurityEvent(request: Request, eventType: string, additionalData?: any): void {
    const logData = {
      timestamp: new Date().toISOString(),
      eventType,
      method: request.method,
      url: request.url,
      ip: this.getClientIP(request),
      userAgent: request.headers['user-agent'],
      userId: this.extractUserIdFromRequest(request),
      sessionId: this.extractSessionId(request),
      ...additionalData,
    };

    if (eventType === 'REQUEST_ERROR') {
      console.warn('SECURITY_AUDIT:', JSON.stringify(logData));
    } else {
      console.log('SECURITY_AUDIT:', JSON.stringify(logData));
    }
  }

  /**
   * Extracts client IP address from request
   * @param request - Express request object
   * @returns Client IP address
   */
  private getClientIP(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Extracts user ID from request if available
   * @param request - Express request object
   * @returns User ID or null
   */
  private extractUserIdFromRequest(request: Request): string | null {
    const user = (request as any).user;
    return user?._id || user?.sub || null;
  }

  /**
   * Extracts session ID from request if available
   * @param request - Express request object
   * @returns Session ID or null
   */
  private extractSessionId(request: Request): string | null {
    return (request as any).sessionId || null;
  }
}
