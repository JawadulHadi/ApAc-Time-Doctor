import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  /**
   * Intercept all incoming HTTP requests and log them.
   *
   * @param context The execution context of the current request.
   * @param next The call handler to call next in the interceptor chain.
   * @returns An observable that emits the next value in the interceptor chain.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const requestId = headers['x-request-id'] || 'N/A';
    this.logger.log(
      `[${requestId}] ${method} ${originalUrl} - ${userAgent} ${ip}: Request started`,
    );
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length') || 0;
        const responseTime = Date.now() - now;
        this.logger.log(
          `[${requestId}] ${method} ${originalUrl} ${statusCode} ${contentLength}b - ${responseTime}ms`,
        );
      }),
      catchError(err => {
        const responseTime = Date.now() - now;
        const statusCode = err?.status || err?.response?.statusCode || 500;
        if (statusCode >= 500) {
          this.logger.error(
            `[${requestId}] ${method} ${originalUrl} - Error: ${err.message} - ${responseTime}ms`,
          );
        } else {
          this.logger.warn(
            `[${requestId}] ${method} ${originalUrl} - Client Error: ${err.message} - ${responseTime}ms`,
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
