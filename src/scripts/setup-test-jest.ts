import { Logger } from '@nestjs/common';

const testLogger = new Logger('TestSetup');

jest.mock('@/index', () => ({
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
    CAN_SUBMIT_REQUEST: 'can_submit_request',
    CAN_SUBMIT_WFH_REQUEST: 'can_submit_wfh_request',
    CAN_MANAGE_MY_REQUEST: 'can_manage_my_request',
    CAN_MANAGE_MY_WFH_REQUEST: 'can_manage_my_wfh_request',
    CAN_MANAGE_APAC_REQUESTS: 'can_manage_apac_requests',
    CAN_MANAGE_APAC_WFH_REQUEST: 'can_manage_apac_wfh_request',
    CAN_APPROVE_APAC_REQUEST: 'can_apac_approve_request',
    CAN_APPROVE_APAC_WFH_REQUEST: 'can_approve_apac_wfh_request',
    CAN_DISAPPROVE_APAC_REQUEST: 'can_apac_disapprove_request',
    CAN_DISAPPROVE_APAC_WFH_REQUEST: 'can_disapprove_apac_wfh_request',
    CAN_COMMENT_APAC_REQUEST: 'can_apac_comment_request',
    CAN_COMMENT_APAC_WFH_REQUEST: 'can_comment_apac_wfh_request',
    CAN_MANAGE_USERS: 'can_manage_users',
    CAN_ADD_USER: 'can_add_user',
    CAN_UPDATE_USER: 'can_update_user',
    CAN_DELETE_USER: 'can_delete_user',
    CAN_VIEW_LEAVE_BANK: 'can_view_leave_bank',
    CAN_MANAGE_LEAVE_BANK: 'can_manage_leave_bank',
    CAN_MANAGE_CANDIDATES: 'can_manage_candidates',
    CAN_VIEW_COMPANY_RESOURCE: 'can_view_company_resource',
    CAN_ADD_COMPANY_RESOURCE: 'can_add_company_resource',
    CAN_UPDATE_COMPANY_RESOURCE: 'can_update_company_resource',
    CAN_DELETE_COMPANY_RESOURCE: 'can_delete_company_resource',
    CAN_MANAGE_DEPARTMENTS: 'can_manage_departments',
    CAN_MANAGE_IT_REQUEST: 'can_manage_it_requests',
    CAN_MANAGE_LD_REQUEST: 'can_manage_ld_requests',
  },
  SYSTEM_ERROR: {
    DATABASE_CONNECTION_FAILED: 'Database connection failed',
  },
  AnnouncementEmailService: jest.fn().mockImplementation(() => ({
    sendAnnouncementToAllUsers: jest.fn(),
  })),
  GetUser: jest.fn(() => ({})),
  GetUserBasic: jest.fn(() => ({})),
  ApiUserResponse: jest.fn(() => ({})),
  ApiOperation: jest.fn(() => ({})),
  ApiResponse: jest.fn(() => ({})),
  Permission: jest.fn(() => ({})),
  Roles: jest.fn(() => ({})),
  Public: jest.fn(() => ({})),
  UseGuards: jest.fn(() => ({})),
  ApiProperty: jest.fn(() => ({})),
  ApiPropertyOptional: jest.fn(() => ({})),
  ApiTags: jest.fn(() => ({})),
  TimeoutInterceptor: jest.fn().mockImplementation(() => ({
    intercept: jest.fn(),
  })),
  uploadingValidator: {
    ensureGcsInitialized: jest.fn(),
    validationOptions: jest.fn(),
    validateFile: jest.fn(),
    uploadFile: jest.fn(),
    deleteFileFromGcsByUrl: jest.fn(),
    createProfileFile: jest.fn(),
    createFile: jest.fn(),
  },
  ResponseTransformer: {
    transformUserProfile: jest.fn(),
    transformIndicators: jest.fn(),
  },
  EmailIndicatorsProcessService: {
    notifySuccessIndicatorsAdded: jest.fn(),
    notifySuccessIndicatorsMoved: jest.fn(),
  },
  EmailstatementService: {
    notifyStatement: jest.fn(),
    notifyReviewDecision: jest.fn(),
  },
  UserHelper: {
    getTeam: jest.fn(),
  },
  ProfileHelper: {
    validateIndicatorAuthorization: jest.fn(),
    validateLAndDForTarget: jest.fn(),
    handleIsMoved: jest.fn(),
    cleanUpdateData: jest.fn(),
  },
  HolidayStatusEnum: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING: 'PENDING',
  },
  PermissionsGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn(() => true),
  })),
  ThrottlerGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn(() => true),
  })),
  APP_INTERCEPTOR: jest.fn(),
  ThrottlerModule: jest.fn().mockImplementation(() => ({
    forRoot: jest.fn(() => ({
      module: jest.fn(),
      providers: [],
      exports: [],
    })),
  })),
}));

jest.mock('@nestjs/throttler', () => ({
  ThrottlerModule: {
    forRoot: jest.fn(() => ({
      module: jest.fn(),
      providers: [],
      exports: [],
    })),
  },
  ThrottlerGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn(() => true),
  })),
}));

jest.mock('@nestjs/swagger', () => ({
  ApiOperation: jest.fn(() => ({})),
  ApiResponse: jest.fn(() => ({})),
  ApiTags: jest.fn(() => ({})),
  ApiProperty: jest.fn(() => ({})),
  ApiPropertyOptional: jest.fn(() => ({})),
  ApiBearerAuth: jest.fn(() => ({})),
  ApiConsumes: jest.fn(() => ({})),
  ApiProduces: jest.fn(() => ({})),
}));

jest.mock('@/core/decorators/api-response.decorators', () => ({
  ApiUserResponse: jest.fn(() => ({})),
}));

jest.mock('@/core/decorators/permission.decorators', () => ({
  Permission: jest.fn(() => ({})),
}));

jest.mock('@/core/decorators/roles.decorators', () => ({
  Roles: jest.fn(() => ({})),
}));

jest.mock('@/core/decorators/public.decorators', () => ({
  Public: jest.fn(() => ({})),
}));

jest.mock('@/core/decorators/get-user.decorators', () => ({
  GetUser: jest.fn(() => ({})),
  GetUserBasic: jest.fn(() => ({})),
}));

jest.mock('@/core/guards/permissions.guard', () => ({
  PermissionsGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn(() => true),
  })),
}));

jest.mock('@/core/interceptors/timeout.interceptor', () => ({
  TimeoutInterceptor: jest.fn().mockImplementation(() => ({
    intercept: jest.fn(),
  })),
}));

jest.mock('@/shared/utils/gcs.utils', () => ({
  initializeGCS: jest.fn(),
  ensureGcsInitialized: jest.fn(),
  getGcsConfig: jest.fn(),
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
  getFileUrl: jest.fn(),
  listFiles: jest.fn(),
}));

jest.mock('@/shared/helpers/email.helper', () => ({
  sendSubmissionNotifications: jest.fn(),
  sendStatusUpdateNotifications: jest.fn(),
}));

jest.mock('@/shared/validators/input.validation', () => ({
  validateEmail: jest.fn(),
  validatePhone: jest.fn(),
}));

jest.mock('@/shared/validators/user-data.validation', () => ({
  validateUserData: jest.fn(),
}));

jest.mock('@/shared/utils/response.utils', () => ({
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

jest.mock('@/shared/utils/role-display.utils', () => ({
  RoleDisplay: {
    normalizeRole: jest.fn(),
    applyRoleDisplay: jest.fn(),
  },
}));

jest.mock('@/types/enums/leave-bank.enums', () => ({
  HolidayStatusEnum: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
  },
  LeaveStatus: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
  },
}));

jest.setTimeout(30000);

global.testUtils = {
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    role: 'MEMBER',
    ...overrides,
  }),

  createMockRequest: (overrides = {}) => ({
    user: { id: 'test-user-id', role: 'MEMBER' },
    body: {},
    params: {},
    query: {},
    ...overrides,
  }),
};
