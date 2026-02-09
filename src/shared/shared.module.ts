import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { LoggingInterceptor } from '../core/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '../core/interceptors/timeout.interceptor';
@Global()
@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new TimeoutInterceptor(40000),
    },
  ],
  exports: [ConfigModule, ThrottlerModule],
})
export class SharedModule {}
