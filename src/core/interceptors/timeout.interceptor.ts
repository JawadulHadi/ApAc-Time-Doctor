import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { SYSTEM_ERROR } from '../../types/constants/error-messages.constants';
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly defaultTimeout: number = 40000,
    private readonly reflector?: Reflector,
  ) {}
  /**
   * Intercept the request and wrap it in a timeout observable.
   * If the request doesn't complete within the specified timeout,
   * it will throw a RequestTimeoutException.
   * Supports custom timeout via @SetMetadata('timeout', milliseconds).
   *
   * @param {ExecutionContext} context - The execution context of the incoming request.
   * @param {CallHandler} next - The next handler in the interceptor chain.
   * @return {Observable<any>} - The observable that wraps the request with a timeout.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const customTimeout = this.reflector?.get<number>('timeout', context.getHandler());
    const timeoutValue = customTimeout || this.defaultTimeout;
    return next.handle().pipe(
      timeout(timeoutValue),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException(SYSTEM_ERROR.SERVICE_UNAVAILABLE));
        }
        return throwError(() => err);
      }),
    );
  }
}
