/**
 * Swagger configuration utilities for APAC Management System
 *
 * This module provides centralized Swagger configuration management,
 * including document setup, schema registration, and UI customization.
 *
 * @author APAC Development Team
 * @version 1.0.0
 * @since 1.0.0
 */
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { JWT_SECURITY_SCHEME, SWAGGER_SCHEMAS } from './schemas';
/**
 * Swagger configuration interface
 */
interface SwaggerConfig {
  summary: string;
  description: string;
  version: string;
  contact?: {
    name: string;
    url: string;
    email: string;
  };
  license?: {
    name: string;
    url: string;
  };
  servers?: Array<{
    url: string;
    description: string;
  }>;
}
/**
 * Default Swagger configuration
 */
const DEFAULT_SWAGGER_CONFIG: SwaggerConfig = {
  summary: 'APAC Management System API',
  description: `# Overview

## Employee Management System with leave tracking, attendance management, and document handling capabilities.

### Core Features

### Authentication & Security
- JWT-based authentication with role-based access control
- Secure session management with token refresh
- Permission-based authorization system
- Password reset and account recovery

### User Management
- Complete user profiles with personal & professional details
- Role-based access control (Member, Team Lead, HR, COO)
- User creation and profile management
- Department assignments and team hierarchies

### Leave Bank & Attendance
- Monthly attendance tracking (working days, leaves, short hours, extra hours)
- Excel/XLSX bulk data import
- Comprehensive leave analytics (CL, SL, Absent tracking)
- Holiday management (US & Canada configurations)
- Year-round attendance records

### Leave Request Management
- 15+ request types (Casual Leave, Sick Leave, Work From Home, etc.)
- Multi-level approval workflows (Team Lead → HR → COO)
- Real-time status tracking with remarks history
- Automated notifications

### Department Management
- Department CRUD operations
- Team structure and reporting hierarchies
- Team lead assignments
- Department-specific configurations

### Profile & Document Management
- Employee profile documents (Resume, ID Proof, Certificates)
- Profile picture management
- Document upload and version control
- Company resource management with access control
- Secure file storage with Google Cloud integration

### Recruitment Management
- Candidate recruitment, hiring, and onboarding management
- Candidate profile management
- Candidate document management
- Candidate interview scheduling and tracking
- Candidate feedback and evaluation

### Request Management
- Request management
- Request approval workflows
- Request status tracking
- Request history tracking

### Security & Data
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- MongoDB with Mongoose ODM
- Google Cloud Storage integration

---
*For support, contact: jhadi@apac-dev.agilebrains.com*`,
  version: '1.0.0',
  contact: {
    name: 'APAC Support Team',
    url: 'https://apac-dev.agilebrains.com/support',
    email: 'jhadi@apac-dev.agilebrains.com',
  },
  license: {
    name: 'Enterprise License',
    url: 'https://apac-dev.agilebrains.com/license',
  },
};
/**
 * Get server URLs based on environment
 *
 * @returns Array of server configurations
 */
function getServers(): Array<{ url: string; description: string }> {
  const servers: Array<{ url: string; description: string }> = [];
  // Production server
  if (process.env.NODE_ENV === 'production') {
    servers.push({
      url: 'https://apacbe.agilebrains.com',
      description: 'Production Server',
    });
  }
  // Staging server
  if (process.env.NODE_ENV === 'staging') {
    servers.push({
      url: 'https://apacbe.agilebrains.com',
      description: 'Staging Server',
    });
  }
  // Local development server
  const localPort = process.env.PORT || 3400;
  servers.push({
    url: `http://localhost:${localPort}`,
    description: 'Local Development Server',
  });
  // Always include development server for testing
  servers.push({
    url: 'https://apacbe.agilebrains.com',
    description: 'Development Server',
  });
  servers.push({
    url: 'http://localhost:3400',
    description: 'Localhost Server',
  });
  return servers;
}
/**
 * Configure Swagger document builder
 *
 * @param config - Optional custom configuration
 * @returns Configured DocumentBuilder instance
 */
function createDocumentBuilder(config?: Partial<SwaggerConfig>): DocumentBuilder {
  const finalConfig = { ...DEFAULT_SWAGGER_CONFIG, ...config };
  const builder = new DocumentBuilder();
  builder
    .setTitle(finalConfig.summary)
    .setDescription(finalConfig.description)
    .setVersion(finalConfig.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token in format: Bearer <token>',
      },
      'jwt-auth',
    )
    .addSecurityRequirements('jwt-auth');
  // Add API tags aligned with current app modules
  builder
    .addTag('auth', '🔐 User authentication, login, password reset, and account activation')
    .addTag('user', '👤 User management, profiles, permissions, and team hierarchy')
    .addTag(
      'profiles',
      '📇 Employee profile documents, pictures, resumes, and personal information',
    )
    .addTag('mission-statement', '📝 Mission statement management and operations')
    .addTag('success-indicators', '📊 Success tracking and performance indicators')
    .addTag(
      'departments',
      '🏢 Department management, team structures, and organizational hierarchy',
    )
    .addTag('requests', '📬 Leave requests, approvals, and multi-level workflow management')
    .addTag('recruitment', '🧑‍💼 Candidate recruitment, hiring, and onboarding management')
    .addTag('leavebank', '🏖️ Attendance tracking, leave bank management, and monthly analytics')
    .addTag('emails', '✉️ Email notification system and communication management')
    .addTag('documents', '📄 Company resource document management and file storage')
    .addTag('health', '❤️‍🔥 API health status and system monitoring');
  // Add contact information
  if (finalConfig.contact) {
    builder.setContact(
      finalConfig.contact.name,
      finalConfig.contact.url,
      finalConfig.contact.email,
    );
  }
  // Add license information
  if (finalConfig.license) {
    builder.setLicense(finalConfig.license.name, finalConfig.license.url);
  }
  // Add servers
  const servers = getServers();
  servers.forEach(server => {
    builder.addServer(server.url, server.description);
  });
  return builder;
}
/**
 * Register custom schemas to Swagger document
 *
 * @param document - Swagger document to enhance
 */
function registerCustomSchemas(document: any): void {
  if (!document.components) {
    document.components = {};
  }
  if (!document.components.schemas) {
    document.components.schemas = {};
  }
  if (!document.components.securitySchemes) {
    document.components.securitySchemes = {};
  }
  // Register all schemas from the schemas file
  Object.entries(SWAGGER_SCHEMAS).forEach(([schemaName, schema]) => {
    document.components.schemas[schemaName] = schema;
  });
  // Register JWT security scheme
  document.components.securitySchemes['jwt-auth'] = JWT_SECURITY_SCHEME;
  // Register additional schemas that were in the original main.ts
  document.components.schemas.FederalHoliday = {
    type: 'object',
    properties: {
      usOff1: { type: 'string', format: 'date-time', nullable: true },
      usOff2: { type: 'string', format: 'date-time', nullable: true },
      usOff3: { type: 'string', format: 'date-time', nullable: true },
      usOff4: { type: 'string', format: 'date-time', nullable: true },
      cadOff1: { type: 'string', format: 'date-time', nullable: true },
      cadOff2: { type: 'string', format: 'date-time', nullable: true },
      cadOff3: { type: 'string', format: 'date-time', nullable: true },
      cadOff4: { type: 'string', format: 'date-time', nullable: true },
    },
  };
  document.components.schemas.OverallSummary = {
    type: 'object',
    properties: {
      hasData: { type: 'boolean', example: true },
      totalMonthsWithData: { type: 'number', example: 12 },
      totalWorkingDays: { type: 'number', example: 240 },
      totalLeaves: { type: 'number', example: 15 },
    },
  };
  document.components.schemas.LeaveBankResponse = {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          records: {
            type: 'array',
            description: 'Leave bank records based on user role access',
            items: { $ref: '#/components/schemas/LeaveBankRecord' },
          },
          myRecords: {
            type: 'array',
            description: "Current user's own leave bank records",
            items: { $ref: '#/components/schemas/LeaveBankRecord' },
          },
          authUser: { $ref: '#/components/schemas/UserWithProfile' },
          total: { type: 'number', example: 1 },
          userAccess: {
            type: 'object',
            properties: {
              role: { type: 'string', example: 'MEMBER' },
              canViewAll: { type: 'boolean', example: false },
              userId: { type: 'string', example: '68fa610c3a50f116c7311d73' },
              name: { type: 'string', example: 'John Doe' },
            },
          },
          filters: {
            type: 'object',
            properties: {
              year: { type: 'string', example: 'all' },
              month: { type: 'string', example: 'all' },
              department: { type: 'string', example: 'all' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      message: {
        type: 'string',
        example: 'Leave bank records retrieved successfully with user profiles',
      },
      statusCode: { type: 'number', example: 200 },
      timestamp: { type: 'string', format: 'date-time' },
    },
  };
  document.components.schemas.Candidate = {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '68fa610c3a50f116c7311d73' },
      email: { type: 'string', example: 'candidate@mailinator.com' },
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
      jobTitle: { type: 'string', example: 'Software Engineer' },
      hiringStage: { type: 'string', example: 'Added' },
      reviewRequested: { type: 'boolean', example: false },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  };
  document.components.schemas.Request = {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '68fa610c3a50f116c7311d73' },
      user: { type: 'string', example: '68fa610c3a50f116c7311d73' },
      requestType: { type: 'string', example: 'CASUAL_LEAVE' },
      requestedDates: { type: 'array', items: { type: 'string', example: '2023-12-25' } },
      days: { type: 'number', example: 1 },
      status: { type: 'string', example: 'PENDING' },
      currentStage: { type: 'string', example: 'HR' },
      remarks: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            by: { type: 'string' },
            role: { type: 'string' },
            remark: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
          },
        },
      },
      createdAt: { type: 'string', format: 'date-time' },
    },
  };
  document.components.schemas.CompanyDocument = {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '68fa610c3a50f116c7311d73' },
      summary: { type: 'string', example: 'Company Policy' },
      originalName: { type: 'string', example: 'policy.pdf' },
      fileUrl: { type: 'string', example: 'https://storage.googleapis.com/...' },
      mimeType: { type: 'string', example: 'application/pdf' },
      category: { type: 'string', example: 'PUBLIC' },
      isPublic: { type: 'boolean', example: true },
      uploadedBy: { type: 'string', example: '68fa610c3a50f116c7311d73' },
      createdAt: { type: 'string', format: 'date-time' },
    },
  };
}
/**
 * Custom CSS for Swagger UI
 */
const CUSTOM_SWAGGER_CSS = `
  .swagger-ui .topbar { display: none; }
  .swagger-ui .info h2 { display: none; }
  .swagger-ui .info .title { font-size: 28px; font-weight: bold; color: #1a365d; }
  .swagger-ui .info .description { font-size: 14px; line-height: 1.5; }
  .swagger-ui .opblock-tag { font-size: 16px; font-weight: bold; padding: 10px 0; }
  .swagger-ui .opblock-tag:hover { background-color: #f7fafc; }
  .swagger-ui .authorization__btn { display: none; }
  .version { color: #718096; font-size: 12px; }
`;
/**
 * Configure and setup Swagger documentation
 *
 * @param app - NestJS application instance
 * @param config - Optional custom configuration
 */
export function configureSwagger(app: INestApplication, config?: Partial<SwaggerConfig>): void {
  const builder = createDocumentBuilder(config);
  const documentConfig = builder.build();
  const document = SwaggerModule.createDocument(app, documentConfig, {
    ignoreGlobalPrefix: false,
    deepScanRoutes: true,
    extraModels: [],
  });
  // Register custom schemas
  registerCustomSchemas(document);
  // Setup Swagger UI
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: (
        a: { get: (arg0: string) => string },
        b: { get: (arg0: string) => string },
      ) => {
        const methodsOrder = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
        const result =
          methodsOrder.indexOf(a.get('method')) - methodsOrder.indexOf(b.get('method'));
        return result === 0 ? a.get('path').localeCompare(b.get('path')) : result;
      },
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
      displayOperationId: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      validatorUrl: null,
      auth: {
        'jwt-auth': {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    customCss: CUSTOM_SWAGGER_CSS,
    customSiteTitle: 'APAC Management System - API Documentation v2.0.0',
    customfavIcon: '/favicon.ico',
  });
}
/**
 * Get Swagger documentation URL based on environment
 *
 * @returns Swagger documentation URL
 */
export function getSwaggerUrl(): string {
  const port = process.env.PORT || 3400;
  if (process.env.NODE_ENV === 'staging') {
    return 'https://apacbe-dev.agilebrains.com/api-docs';
  }
  return `http://localhost:${port}/api-docs`;
}
