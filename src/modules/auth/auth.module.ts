import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../../config/database/database.module';
import { AuthGuard } from '../../core/guards/auth.guard';
import { JwtStrategy } from '../../core/guards/jwt.strategy';
import { SecurityLoggingInterceptor } from '../../core/interceptors/security-logging.interceptor';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
@Module({
  imports: [
    forwardRef(() => UserModule),
    DatabaseModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      /**
       * A factory function that returns an object to configure the jwt module.
       * The function takes a ConfigService as a parameter and returns an object with a secret and signOptions.
       * The secret is obtained from the environment variable JWT_SECRET and the signOptions object is set to expire the jwt token in 1 day.
       */
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    SecurityLoggingInterceptor,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
