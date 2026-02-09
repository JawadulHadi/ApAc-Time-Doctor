import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'data' in data &&
          'statusCode' in data &&
          'timestamp' in data
        ) {
          return data as Response<T>;
        }
        return {
          success: true,
          data,
          statusCode: context.switchToHttp().getResponse().statusCode,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
