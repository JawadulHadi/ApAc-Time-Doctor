import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express/multer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/departments.module';
import { DocumentsModule } from './modules/document/document.module';
import { HealthModule } from './modules/health/health.module';
import { LeaveBankModule } from './modules/leave-bank/leave-bank.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RecruitmentModule } from './modules/recruitment/recruitment.module';
import { RequestModule } from './modules/request/request.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared/shared.module';
import { maxFileSize } from './types/enums/doc.enums';
/**
 * Root application module
 *
 * This is the main module that bootstraps the entire APAC Management System.
 * It imports and configures all feature modules, shared modules, and core
 * functionality including authentication, database, and API documentation.
 *
 * The module is responsible for:
 * - Configuring global application settings
 * - Setting up file upload handling with Multer
 * - Registering global exception filters
 * - Initializing all feature modules
 *
 * @author APAC Development Team
 * @version 1.0.0
 * @since 1.0.0
 */
@Module({
  imports: [
    /**
     * Global configuration module
     * Loads environment variables and makes them available throughout the application
     */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    /**
     * File upload configuration
     * Sets up Multer for handling file uploads with size limits
     */
    MulterModule.register({
      limits: {
        fileSize: maxFileSize.maxFile,
      },
    }),
    /**
     * Feature modules
     * Each module handles a specific domain of the application
     */
    AuthModule,
    UserModule,
    ProfileModule,
    DepartmentModule,
    SharedModule,
    RequestModule,
    DocumentsModule,
    LeaveBankModule,
    RecruitmentModule,
    DatabaseModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
/**
 * Feature modules
 * Each module handles a specific domain of the application
 */
export class AppModule implements OnModuleInit, Extracted, Extracted {
  /**
   * Module initialization hook
   *
   * This method is called when the module is being initialized.
   * Currently empty but can be used for setup tasks that need to run
   * when the application starts.
   */
  onModuleInit() {}
}
interface Extracted {
  /* TODO: add the missing return type */
  onModuleInit(): any;
}
