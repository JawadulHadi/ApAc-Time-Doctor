import { INestApplication, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import { json, NextFunction, Request, Response, urlencoded } from 'express';
import rateLimit from 'express-rate-limit';
import handlebars from 'handlebars';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';

import { AppModule } from './app.module';
import { configureSwagger } from './config/swagger/swagger.config';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';
import { AUTH, SYSTEM_ERROR } from './types/constants/error-messages.constants';
const logger = new Logger('Bootstrap');
const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
  next();
};
/**
 * Configure Swagger documentation using the centralized configuration
 *
 * This function sets up Swagger/OpenAPI documentation with all schemas,
 * authentication, and UI customization using the new modular approach.
 *
 * @param app - NestJS application instance
 */
function setupSwagger(app: INestApplication): void {
  configureSwagger(app);
}
handlebars.registerHelper('eq', function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('ne', function (a, b, options) {
  return a !== b ? options.fn(this) : options.inverse(this);
});
function getCorsOrigins(): (string | RegExp)[] {
  if (process.env.FRONTEND_URL) {
    if (!process.env.FRONTEND_URLS)
      return [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://localhost:3400',
        'https://apacbe-dev.agilebrains.com',
        /\.agilebrains\.com$/,
      ];
    else return process.env.FRONTEND_URLS.split(',').map(url => url.trim());
  } else
    return !process.env.FRONTEND_URLS
      ? [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'http://localhost:3400',
          'https://apacbe-dev.agilebrains.com',
          /\.agilebrains\.com$/,
        ]
      : process.env.FRONTEND_URLS.split(',').map(url => url.trim());
}
let bootstrap: () => Promise<any>;
bootstrap = async (): Promise<void> => {
  try {
    if (process.env.FAST_STARTUP === 'true') {
      logger.log('🟢 ApAc Management System - Starting');
    } else {
      logger.error('💀 ApAc Management System - Starting Failed');
    }
    const app = await NestFactory.create(AppModule, {
      bodyParser: true,
      rawBody: false,
      logger:
        process.env.FAST_STARTUP === 'true'
          ? ['error', 'warn', 'log']
          : ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.use(helmet());
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        skip: req => req.method === 'OPTIONS',
      }),
    );
    app.use(requestIdMiddleware);
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    const passport = require('passport');
    app.use(passport.initialize());
    if (process.env.NODE_ENV === 'production') {
      app.use('trust proxy', 1);
    }
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        exceptionFactory: errors => {
          const errorMessages = errors.map(error => ({
            property: error.property,
            constraints: error.constraints,
          }));
          logger.error('💀 Validation failed', JSON.stringify(errorMessages, null, 2));
          return new ValidationPipe().createExceptionFactory()(errors);
        },
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('default')) {
        logger.error(AUTH.INVALID_JWT_PRODUCTION);
        process.exit(1);
      }
      if (!process.env.DATABASE_URL) {
        logger.error(SYSTEM_ERROR.CPU_OVERLOAD);
        process.exit(1);
      }
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('default')) {
      logger.error(AUTH.INVALID_JWT_PRODUCTION);
      process.exit(1);
    }
    if (process.env.NODE_ENV !== 'production') {
      configureSwagger(app);
    }
    const corsOrigins = getCorsOrigins();
    app.enableCors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Origin',
      ],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
    const port = process.env.PORT ?? 3400;
    await app.listen(port);
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    logger.log('=========================================');
    logger.log('🖥️  APAC Management System module initialized');
    logger.log('⚡ APAC Management System Started Successfully');
    logger.log(`🌐 Server running on: http://localhost:${port}`);
    logger.log(`🍃 MongoDB Database: ${process.env.MONGO_DB}`);
    logger.log(`📤 GCS Bucket: ${process.env.GCS_BUCKET_NAME}`);
    logger.log(`🌿 Environment: ${process.env.NODE_ENV}`);
    logger.log(`⚙️  Process ID: ${process.pid}`);
    if (process.env.NODE_ENV !== 'production') {
      let swaggerUrl: string;
      swaggerUrl =
        process.env.NODE_ENV === 'staging'
          ? 'https://apacbe-dev.agilebrains.com/api-docs'
          : `http://localhost:${port}/api-docs`;
      logger.log(`📘 Swagger Documentation: ${swaggerUrl}`);
      logger.log('=========================================');
    }
  } catch (error) {
    logger.error('💀 Failed to start application:', error);
    if (error instanceof Error) {
      logger.error('💀 Stack trace:', error.stack);
    }
    process.exit(1);
  }
};
process.on('SIGTERM', () => {
  logger.log('🛑 APAC Management System Shutting Down...');
  process.exit(0);
});
process.on('SIGINT', () => {
  logger.log('🔚 APAC Management System Stopped Successfully');
  process.exit(0);
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('💀 Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', error => {
  logger.error('💀 Uncaught Exception thrown:', error);
  process.exit(1);
});
bootstrap().catch(error => {
  logger.error('💀 Bootstrap failed:', error);
  process.exit(1);
});
