import { INestApplication, Logger, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection, STATES } from 'mongoose';
import { AppModule } from '../app.module';
import {
  DatabaseModule,
  databaseModule as getDatabaseModule,
} from '../config/database/database.module';
import { TransformInterceptor } from '../core/interceptors/transform.interceptor';

/** Mock GlobalExceptionFilter since it might not be available in test environment */
class GlobalExceptionFilter {
  catch(exception: unknown, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof Error ? 500 : 400;
    response.status(status).json({
      success: false,
      message: exception instanceof Error ? exception.message : 'Unknown error',
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

/** Mock ExecutionContext for testing filters and guards */
class MockExecutionContext {
  constructor(private args: any[] = []) {}

  switchToHttp(): any {
    return {
      getRequest: () => ({ url: '/test', method: 'GET' }),
      getResponse: () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      }),
    };
  }

  switchToRpc(): any {
    return {
      getContext: () => ({}),
      getData: () => ({}),
    };
  }

  switchToWs(): any {
    return {
      getClient: () => ({}),
      getData: () => ({}),
    };
  }

  getClass<T = any>(): T {
    return {} as T;
  }

  getHandler(): Function {
    return () => {};
  }

  getArgs(): any[] {
    return this.args;
  }

  getArgByIndex<T = any>(index: number): T {
    return this.args[index];
  }

  getParent<T = any>(): T {
    return {} as T;
  }
}

/** Mock ArgumentsHost for exception filters */
class MockArgumentsHost {
  constructor(private type: 'http' | 'rpc' | 'ws' = 'http') {}

  switchToHttp(): any {
    return {
      getRequest: jest.fn().mockReturnValue({ url: '/test', method: 'GET' }),
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      }),
      getNext: jest.fn(),
    };
  }

  switchToRpc(): any {
    return {
      getContext: jest.fn().mockReturnValue({}),
      getData: jest.fn().mockReturnValue({}),
    };
  }

  switchToWs(): any {
    return {
      getClient: jest.fn().mockReturnValue({}),
      getData: jest.fn().mockReturnValue({}),
    };
  }

  getType(): string {
    return this.type;
  }
}

/** Mock JwtService for authentication testing */
class MockJwtService {
  sign(payload: any): string {
    return 'mock-jwt-token';
  }

  verify(token: string): any {
    return { userId: 'test-user', role: 'MEMBER' };
  }

  decode(token: string): any {
    return { userId: 'test-user', role: 'MEMBER', iat: Date.now() / 1000 };
  }
}

/** Mock RedisService for caching tests */
class MockRedisService {
  private cache = new Map<string, any>();

  async get(key: string): Promise<any> {
    return this.cache.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.cache.set(key, value);
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async flushall(): Promise<void> {
    this.cache.clear();
  }
}

/** Mock MailService for email testing */
class MockMailService {
  async sendMail(options: any): Promise<any> {
    return { messageId: 'mock-message-id', response: '250 OK' };
  }
}

/** Mock FileService for file upload testing */
class MockFileService {
  async uploadFile(file: any, path: string): Promise<string> {
    return `'https://storage.googleapis.com/iagility-apac/document_/${path}/${file.originalname}`;
  }

  async deleteFile(path: string): Promise<void> {
    // Mock implementation
  }

  async getFileUrl(path: string): Promise<string> {
    return `https://mock-storage.com/${path}`;
  }
}

/** Mock LoggerService for testing */
class MockLoggerService {
  log(message: string, context?: string): void {
    // Mock implementation - could capture logs for testing
  }

  error(message: string, trace?: string, context?: string): void {
    // Mock implementation
  }

  warn(message: string, context?: string): void {
    // Mock implementation
  }

  debug(message: string, context?: string): void {
    // Mock implementation
  }

  verbose(message: string, context?: string): void {
    // Mock implementation
  }
}

const testLogger = new Logger('TestSetup');

jest.mock('@/shared/utils/gcs.utils', () => {
  return {
    initializeGCS: jest.fn(),
    ensureGcsInitialized: jest.fn(),
    getGcsConfig: jest.fn(),
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
    getFileUrl: jest.fn(),
    listFiles: jest.fn(),
  };
});

jest.mock('@/shared/helpers/email.helper', () => ({
  sendSubmissionNotifications: jest.fn(),
  sendStatusUpdateNotifications: jest.fn(),
}));

let inputValidation: typeof jest;

inputValidation = jest.mock('@/shared/validators/input.validation', () => ({
  validateEmail: jest.fn(),
  validatePhone: jest.fn(),
}));

let dataValidation: typeof jest;

dataValidation = jest.mock('@/shared/validators/user-data.validation', () => ({
  validateUserData: jest.fn(),
}));

const responeUtils = jest.mock('@/shared/utils/response.utils', () => ({
  ApiResponseDto: {
    success: jest.fn((data: unknown, message: string) => ({
      success: true,
      data,
      message,
    })),
    error: jest.fn((message: string, statusCode: number) => ({
      success: false,
      message,
      statusCode,
    })),
  },
  userResponse: jest.fn(),
  profileResponse: jest.fn(),
  CamelCase: jest.fn(),
  transformRole: jest.fn(),
  PaginationHelper: {
    createPaginatedResponse: jest.fn(),
    calculateSkip: jest.fn(),
    normalizePagination: jest.fn(),
    isPaginatedResponse: jest.fn(),
  },
}));

const RoleDisplay = jest.mock('@/shared/utils/role-display.utils', () => ({
  RoleDisplay: {
    normalizeRole: jest.fn(),
    applyRoleDisplay: jest.fn(),
  },
}));

const index = jest.mock('@/index', () => ({
  ApiResponseDto: {
    success: jest.fn((data: unknown, message: string) => ({
      success: true,
      data,
      message,
    })),
    error: jest.fn((message: string, statusCode: number) => ({
      success: false,
      message,
      statusCode,
    })),
  },
  PaginationDto: jest.fn().mockImplementation(() => ({
    page: 1,
    limit: 10,
  })),
  PaginationHelper: {
    createPaginatedResponse: jest.fn((data: any, total: number, page: number, limit: number) => ({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      skip: (page - 1) * limit,
    })),
    calculateSkip: jest.fn((page: number, limit: number) => (page - 1) * limit),
    normalizePagination: jest.fn((page: number, limit: number) => ({
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
      skip: (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit)),
    })),
    isPaginatedResponse: jest.fn(() => true),
  },
  RoleDisplay: {
    normalizeRole: jest.fn(),
    applyRoleDisplay: jest.fn(),
  },
  CamelCase: jest.fn(),
  transformRole: jest.fn(),
  USER: {
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists',
  },
  PROFILE: {
    NOT_FOUND: 'Profile not found',
    ALREADY_EXISTS: 'Profile already exists',
  },
  IndicatorStatus: {
    IN_PROGRESS: 'IN_PROGRESS',
    PARTIALLY_MET: 'PARTIALLY_MET',
    UNMET: 'UNMET',
    MET: 'MET',
  },
  IStatementStatus: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    SUGGEST_CHANGES: 'SUGGEST_CHANGES',
  },
  RequestStatus: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    WITHDRAWN: 'WITHDRAWN',
  },
  UserStatus: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
  },
  Role: {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER',
    TEAM_LEAD: 'TEAM_LEAD',
    COO: 'COO',
    HR: 'HR',
    SUPER_ADMIN: 'SUPER_ADMIN',
    L_AND_D: 'L_AND_D',
  },
  Permissions: {
    // Authentication permissions
    CAN_LOGIN: 'can_login',
    CAN_LOGOUT: 'can_logout',
    CAN_RESET_PASSWORD: 'can_reset_password',
    // User profile permissions
    CAN_VIEW_PROFILE: 'can_view_profile',
    CAN_EDIT_PROFILE: 'can_edit_profile',
    CAN_UPLOAD_PROFILE_PICTURE: 'can_upload_profile_picture',
    // Request management permissions
    CAN_SUBMIT_REQUEST: 'can_submit_request',
    CAN_MANAGE_MY_REQUEST: 'can_manage_my_request',
    CAN_SUBMIT_WFH_REQUEST: 'can_submit_wfh_request',
    CAN_MANAGE_MY_WFH_REQUEST: 'can_manage_my_wfh_request',
    // Team lead permissions
    CAN_APPROVE_TEAM_REQUESTS: 'can_approve_team_requests',
    CAN_VIEW_TEAM_REQUESTS: 'can_view_team_requests',
    CAN_VIEW_TEAM_LEAVE_BANK: 'can_view_team_leave_bank',
    CAN_MANAGE_TEAM_MEMBERS: 'can_manage_team_members',
    // HR permissions
    CAN_APPROVE_ALL_REQUESTS: 'can_approve_all_requests',
    CAN_VIEW_ALL_REQUESTS: 'can_view_all_requests',
    CAN_VIEW_ALL_LEAVE_BANK: 'can_view_all_leave_bank',
    CAN_MANAGE_USERS: 'can_manage_users',
    CAN_MANAGE_DEPARTMENTS: 'can_manage_departments',
    CAN_VIEW_ALL_PROFILES: 'can_view_all_profiles',
    CAN_MANAGE_ANNOUNCEMENTS: 'can_manage_announcements',
    CAN_VIEW_SYSTEM_ANALYTICS: 'can_view_system_analytics',
    CAN_MANAGE_SYSTEM_SETTINGS: 'can_manage_system_settings',
    CAN_VIEW_ALL_DATA: 'can_view_all_data',
    CAN_EXPORT_DATA: 'can_export_data',
    CAN_VIEW_COMPANY_RESOURCE: 'can_view_company_resource',
    CAN_UPLOAD_COMPANY_RESOURCE: 'can_upload_company_resource',
    CAN_MANAGE_COMPANY_RESOURCE: 'can_manage_company_resource',
    CAN_VIEW_LEAVE_BANK: 'can_view_leave_bank',
    CAN_EDIT_LEAVE_BANK: 'can_edit_leave_bank',
    CAN_IMPORT_LEAVE_BANK: 'can_import_leave_bank',
    CAN_MANAGE_RECRUITMENT: 'can_manage_recruitment',
    CAN_VIEW_CANDIDATES: 'can_view_candidates',
    CAN_SCHEDULE_INTERVIEWS: 'can_schedule_interviews',
    CAN_USE_AI_FEATURES: 'can_use_ai_features',
    CAN_VIEW_AI_ANALYTICS: 'can_view_ai_analytics',
  },
  SYSTEM_ERROR: {
    DATABASE_CONNECTION_FAILED: 'Database connection failed',
  },
  AnnouncementEmailService: jest.fn().mockImplementation(() => ({
    sendAnnouncementToAllUsers: jest.fn(),
  })),
}));

let {
  mongoServer,
  testConnection,
}: { mongoServer: MongoMemoryServer; testConnection: mongoose.Connection } = getDatabaseModule();

beforeAll(async () => {
  testLogger.log('Starting test environment setup...');

  try {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        port: 27018,
        dbName: 'test_apac_management',
      },
    });

    const mongoUri = mongoServer.getUri();
    testLogger.log(`MongoDB Memory Server URI: ${mongoUri}`);

    testConnection = mongoose.connection;
    await mongoose.connect(mongoUri);

    testConnection.on('connected', () => {
      testLogger.log('MongoDB connected successfully');
    });

    testConnection.on('error', (error: Error) => {
      testLogger.error('MongoDB connection error:', error);
    });

    testConnection.on('disconnected', () => {
      testLogger.warn('MongoDB disconnected');
    });

    if (testConnection.readyState === STATES.connected) {
      testLogger.log('MongoDB Memory Server started successfully');
    } else {
      testLogger.warn('MongoDB connection not ready, but proceeding...');
    }
  } catch (error: unknown) {
    testLogger.error('Failed to start MongoDB Memory Server:', error);
    testLogger.warn('Falling back to in-memory testing without MongoDB');
    testLogger.warn(
      'Install VC++ Redistributable: https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist',
    );

    if (mongoServer) {
      try {
        await mongoServer.stop();
        mongoServer = null;
      } catch (stopError: unknown) {
        testLogger.error('Error stopping failed MongoDB server:', stopError);
      }
    }
  }
});

afterAll(async () => {
  testLogger.log('Cleaning up test environment...');

  try {
    if (testConnection && testConnection.readyState !== STATES.disconnected) {
      await testConnection.close();
      testLogger.log('MongoDB connection closed successfully');
    }

    if (mongoServer) {
      await mongoServer.stop();
      testLogger.log('MongoDB Memory Server stopped successfully');
    }

    testLogger.log('Test environment cleanup completed');
  } catch (error: unknown) {
    testLogger.error('Error during cleanup:', error);
  } finally {
    testConnection = null;
    mongoServer = null;
  }
});

afterEach(async () => {
  try {
    if (testConnection && testConnection.readyState === STATES.connected) {
      const collections = testConnection.collections;
      const collectionNames = Object.keys(collections);

      if (collectionNames.length > 0) {
        testLogger.log(`Cleaning ${collectionNames.length} collections...`);

        await Promise.all(
          collectionNames.map(async collectionName => {
            try {
              await collections[collectionName].deleteMany({});
            } catch (collectionError: unknown) {
              testLogger.warn(`Error cleaning collection ${collectionName}:`, collectionError);
            }
          }),
        );

        testLogger.log('All collections cleaned successfully');
      }
    }
  } catch (error: unknown) {
    testLogger.warn('Error cleaning collections:', error);
  }
});

export const createTestingModule = async function (): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
  mongod: MongoMemoryReplSet | null;
}> {
  let mongod: MongoMemoryReplSet | null = null;
  let uri = 'mongodb://localhost:27017/test';

  testLogger.log('Creating test module...');

  try {
    mongod = await MongoMemoryReplSet.create({
      replSet: {
        count: 1,
        storageEngine: 'wiredTiger',
        name: 'test-replset',
      },
      instanceOpts: [
        {
          launchTimeout: 100000,
          port: 27019,
        },
      ],
      binary: {
        downloadDir: './node_modules/.cache/mongodb-memory-server',
      },
    });

    uri = mongod.getUri();
    testLogger.log(`Using MongoDB Memory Replica Set: ${uri}`);
  } catch (error: unknown) {
    testLogger.warn('MongoDB Memory Replica Set failed to start, using fallback');
    testLogger.warn(
      'Install VC++ Redistributable: https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist',
    );
  }

  try {
    @Module({
      imports: [MongooseModule.forRoot(uri)],
      exports: [],
    })
    class TestDatabaseModule {}

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
          load: [],
        }),
        AppModule,
      ],
    })
      .overrideModule(DatabaseModule)
      .useModule(TestDatabaseModule)
      .compile();

    const app = moduleFixture.createNestApplication();

    try {
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
      );
      testLogger.log('ValidationPipe configured');
    } catch (pipeError: unknown) {
      testLogger.error('Error configuring ValidationPipe:', pipeError);
    }

    try {
      app.useGlobalFilters(new GlobalExceptionFilter());
      testLogger.log('GlobalExceptionFilter configured');
    } catch (filterError: unknown) {
      testLogger.error('Error configuring GlobalExceptionFilter:', filterError);
    }

    try {
      app.useGlobalInterceptors(new TransformInterceptor());
      testLogger.log('TransformInterceptor configured');
    } catch (interceptorError: unknown) {
      testLogger.error('Error configuring TransformInterceptor:', interceptorError);
    }

    await app.init();
    testLogger.log('Test module created successfully');

    return { app, moduleFixture, mongod };
  } catch (error: unknown) {
    testLogger.error('Error creating test module:', error);

    if (mongod) {
      try {
        await mongod.stop();
      } catch (stopError: unknown) {
        testLogger.error('Error stopping MongoDB replica set:', stopError);
      }
    }

    throw error;
  }
};

function databaseModule() {
  const mongoServer: MongoMemoryServer | null = null;
  const testConnection: Connection | null = null;
  return { mongoServer, testConnection };
}

export async function closeTestingModule({
  app,
  mongod,
}: {
  app: INestApplication | null;
  mongod?: MongoMemoryReplSet | null;
}): Promise<void> {
  testLogger.log('Closing test module...');

  try {
    if (app) {
      await app.close();
      testLogger.log('NestJS application closed');
    }

    if (mongoose.connection.readyState !== STATES.disconnected) {
      await mongoose.disconnect();
      testLogger.log('MongoDB connection closed');
    }

    if (mongod) {
      await mongod.stop();
      testLogger.log('MongoDB replica set stopped');
    }

    testLogger.log('Test module closed successfully');
  } catch (error: unknown) {
    testLogger.error('Error closing test module:', error);
  }
}

export { STATES };
