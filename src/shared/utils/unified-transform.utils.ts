/**
 * Unified Transformation Utilities
 *
 * This consolidated utility provides consistent transformation functions for all enums
 * and data objects across the APAC Management System to ensure uniform display formats.
 */
import { Logger } from '@nestjs/common';

import { UserStatus } from '../../types/constants/user-status.constants';
import { Gender, MaritalStatus } from '../../types/enums/personal-info.enums';
import { IndicatorStatus, IStatementStatus } from '../../types/enums/profile.enums';
import { HiringStage } from '../../types/enums/recruitment.enums';
import { RequestStage, RequestStatus } from '../../types/enums/request.enums';
import { Role } from '../../types/enums/role.enums';
import { TransformedDepartment } from '../../types/interfaces/department.interface';
import { LoginResponse, UserPayload } from '../../types/interfaces/jwt.interface';
import { TransformedProfile } from '../../types/interfaces/profile.interface';
import {
  TransformedRemark,
  TransformedRequest,
  TransformedUserForRequest,
} from '../../types/interfaces/request.interface';
import { IMission, IProfileResponse } from '../../types/interfaces/statement.interface';
import {
  SafeObjectOptions,
  TransformedCandidate,
  TransformedUser,
  TransformedUserBasic,
} from '../../types/interfaces/transform.interface';
import { RoleDisplay } from './role-display.utils';

// ============================================
// Type Definitions
// ============================================
export type TransformationContext =
  | 'login'
  | 'request'
  | 'user'
  | 'profile'
  | 'department'
  | 'candidate'
  | 'default';

export interface TransformationOptions {
  context?: TransformationContext;
  authUserProfile?: UserPayload | any;
  preserveOriginal?: boolean;
  customTransformers?: {
    [key in TransformationContext]?: (data: any, options?: TransformationOptions) => any;
  };
}
// ============================================
// Special Case Mappings
// ============================================
/**
 * Roles that should remain in uppercase format
 */
const UPPERCASE_ROLES = new Set(['COO', 'HR', 'CEO', 'CTO', 'CFO', 'IT', 'QA', 'R&D']);
/**
 * Status values that have special display requirements
 */
const SPECIAL_STATUS_MAPPINGS: Record<string, string> = {
  SUGGEST_CHANGES: 'Suggest Changes',
  IN_PROGRESS: 'In Progress',
  PARTIALLY_MET: 'Partially Met',
  WORK_FROM_HOME: 'Work From Home',
  CLARIFICATION_REQUESTED: 'Clarification Requested',
  CLARIFICATION_SUBMITTED: 'Clarification Submitted',
  PERSONAL_INFO_DOCUMENTS: 'Personal Info Documents',
};
// ============================================
// Core Utility Functions
// ============================================
function safeToObject<T>(
  document: T,
  options: SafeObjectOptions = { virtual: true, getters: true },
): T {
  if (
    document &&
    typeof document === 'object' &&
    'toObject' in document &&
    typeof (document as any).toObject === 'function'
  ) {
    return (document as any).toObject(options);
  }
  return document;
}
function safeGet<T>(obj: any, key: string, defaultValue: T): T {
  return obj && typeof obj === 'object' && key in obj ? obj[key] : defaultValue;
}
// ============================================
// String Transformation Functions
// ============================================
/**
 * Unified CamelCase transformation for all enum values
 * Handles different enum formats consistently across the application
 */
export function CamelCase(value: string): string {
  if (!value) return '';
  // Check for special mappings first
  if (SPECIAL_STATUS_MAPPINGS[value]) {
    return SPECIAL_STATUS_MAPPINGS[value];
  }
  // Handle special cases that should remain unchanged
  if (UPPERCASE_ROLES.has(value.toUpperCase())) {
    return value.toUpperCase();
  }
  // Handle different separators: underscore, space, hyphen
  return value
    .split(/[_\s\-]+/)
    .map(word => {
      if (!word) return '';
      // Handle acronyms and special patterns
      if (word.length === 2 && word === word.toUpperCase()) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
/**
 * Unified role transformation with consistent handling
 */
export function transformRole(role: string): string {
  if (!role) return '';
  // Handle special roles that should remain in original format
  if (UPPERCASE_ROLES.has(role.toUpperCase())) {
    return role.toUpperCase();
  }
  // Normalize role names with consistent formatting
  return role
    .split(/[_\s\-]+/)
    .map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
// ============================================
// Enum-Specific Transformers
// ============================================
/**
 * Transform UserStatus enum values
 */
export function transformUserStatus(status: UserStatus): string {
  const statusMap: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: 'Active',
    [UserStatus.INACTIVE]: 'Inactive',
    [UserStatus.SUSPENDED]: 'Suspended',
    [UserStatus.DISABLED]: 'Deleted',
    [UserStatus.LOCKED]: 'Locked',
  };
  return statusMap[status] || CamelCase(status);
}
/**
 * Transform Role enum values
 */
export function transformRoleEnum(role: Role): string {
  const roleMap: Record<Role, string> = {
    [Role.SUPER_ADMIN]: 'Super Admin',
    [Role.COO]: 'COO',
    [Role.ADMIN]: 'Admin',
    [Role.HR]: 'HR',
    [Role.TRAINER]: 'Trainer',
    [Role.RECRUITER]: 'Recruiter',
    [Role.TEAM_LEAD]: 'Team Lead',
    [Role.MEMBER]: 'Member',
    [Role.REPORTING_LINE]: 'Reporting Line',
  };
  return roleMap[role] || transformRole(role);
}
/**
 * Transform RequestStatus enum values
 */
export function transformRequestStatus(status: RequestStatus): string {
  const statusMap: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'Pending',
    [RequestStatus.APPROVED]: 'Approved',
    [RequestStatus.DISAPPROVED]: 'Disapproved',
    [RequestStatus.WITHDRAWN]: 'Withdrawn',
    [RequestStatus.COMPLETED]: 'Completed',
    [RequestStatus.IN_PROCESS]: 'In Process',
    [RequestStatus.REJECTED]: 'Rejected',
  };
  return statusMap[status] || CamelCase(status);
}
/**
 * Transform RequestStage enum values
 */
export function transformRequestStage(stage: RequestStage): string {
  const stageMap: Record<RequestStage, string> = {
    [RequestStage.HR]: 'HR',
    [RequestStage.TEAM_LEAD]: 'Team Lead',
    [RequestStage.COO]: 'COO',
    [RequestStage.COMPLETED]: 'Completed',
    [RequestStage.SUPER_ADMIN]: 'Super Admin',
  };
  return stageMap[stage] || CamelCase(stage);
}
/**
 * Transform IStatementStatus enum values
 */
export function transformStatementStatus(status: IStatementStatus): string {
  const statusMap: Record<IStatementStatus, string> = {
    [IStatementStatus.PENDING]: 'Pending',
    [IStatementStatus.APPROVED]: 'Approved',
    [IStatementStatus.SUGGEST_CHANGES]: 'Suggest Changes',
  };
  return statusMap[status] || CamelCase(status);
}
/**
 * Transform IndicatorStatus enum values
 */
export function transformIndicatorStatus(status: IndicatorStatus): string {
  const statusMap: Record<IndicatorStatus, string> = {
    [IndicatorStatus.IN_PROGRESS]: 'In Progress',
    [IndicatorStatus.PARTIALLY_MET]: 'Partially Met',
    [IndicatorStatus.UNMET]: 'Unmet',
    [IndicatorStatus.MET]: 'Met',
  };
  return statusMap[status] || CamelCase(status);
}
/**
 * Transform HiringStage enum values
 */
export function transformHiringStage(stage: HiringStage): string {
  const stageMap: Record<HiringStage, string> = {
    [HiringStage.ADDED]: 'Added',
    [HiringStage.CLARIFICATION_REQUESTED]: 'Clarification Requested',
    [HiringStage.CLARIFICATION_SUBMITTED]: 'Clarification Submitted',
    [HiringStage.INTERVIEW_SCHEDULED]: 'Interview Scheduled',
    [HiringStage.INTERVIEW_COMPLETED]: 'Interview Completed',
    [HiringStage.OFFER_EXTENDED]: 'Offer Extended',
    [HiringStage.ARCHIVED]: 'Archived',
    [HiringStage.PERSONAL_INFO_AND_DOCUMENTS_REQUESTED]: 'Personal Info and Documents Requested',
    [HiringStage.PERSONAL_INFO_AND_DOCUMENTS_SUBMITTED]: 'Personal Info and Documents Submitted',
    [HiringStage.ONBOARDED]: 'Onboarded',
  };
  return stageMap[stage] || CamelCase(stage);
}
/**
 * Transform Gender enum values
 */
export function transformGender(gender: Gender): string {
  const genderMap: Record<Gender, string> = {
    [Gender.MALE]: 'Male',
    [Gender.FEMALE]: 'Female',
    [Gender.OTHER]: 'Other',
  };
  return genderMap[gender] || CamelCase(gender);
}
/**
 * Transform MaritalStatus enum values
 */
export function transformMaritalStatus(status: MaritalStatus): string {
  const statusMap: Record<MaritalStatus, string> = {
    [MaritalStatus.SINGLE]: 'Single',
    [MaritalStatus.MARRIED]: 'Married',
  };
  return statusMap[status] || CamelCase(status);
}
// ============================================
// Main Transformer Service
// ============================================
export class UnifiedTransformer {
  private static instance: UnifiedTransformer;
  private customTransformers: Map<string, (data: any, options?: TransformationOptions) => any>;
  private logger = new Logger(UnifiedTransformer.name);
  private constructor() {
    this.customTransformers = new Map();
    this.registerDefaultTransformers();
  }
  static getInstance(): UnifiedTransformer {
    if (!UnifiedTransformer.instance) {
      UnifiedTransformer.instance = new UnifiedTransformer();
    }
    return UnifiedTransformer.instance;
  }
  /**
   * Main transformation method
   */
  transform(data: any, options: TransformationOptions = {}): any {
    if (!data) {
      return null;
    }
    try {
      const context = options.context || this.autoDetectContext(data);
      const transformer = this.customTransformers.get(context) || this.transformDefault;
      if (this.logger) {
        this.logger.debug(`Transforming data with context: ${context}`);
      }
      return transformer(data, options);
    } catch (error) {
      this.logger.error(`Transformation failed for context: ${options.context || 'auto'}`, error);
      return null;
    }
  }
  /**
   * Auto-detect transformation context based on data structure
   */
  private autoDetectContext(data: any): TransformationContext {
    const dataObj = data as Record<string, any>;
    if (dataObj.access_token) return 'login';
    if (dataObj.requestType) return 'request';
    if (Array.isArray(data) && data[0]?.requestType) return 'request';
    if (dataObj.email && dataObj.role) return 'user';
    if (dataObj.userId && dataObj.designation) return 'profile';
    if (dataObj.department && dataObj.teamLead) return 'department';
    if (dataObj.jobTitle && dataObj.hiringStage) return 'candidate';
    return 'default';
  }
  /**
   * Register default transformers
   */
  private registerDefaultTransformers(): void {
    this.customTransformers.set('login', this.transformLogin.bind(this));
    this.customTransformers.set('request', this.transformRequest.bind(this));
    this.customTransformers.set('user', this.transformUser.bind(this));
    this.customTransformers.set('profile', this.transformProfile.bind(this));
    this.customTransformers.set('department', this.transformDepartment.bind(this));
    this.customTransformers.set('candidate', this.transformCandidate.bind(this));
    this.customTransformers.set('default', this.transformDefault.bind(this));
  }
  // ============================================
  // Individual Transformers
  // ============================================
  private transformLogin(data: any, options?: TransformationOptions): LoginResponse {
    const dataObj = safeToObject(data) as Record<string, any>;
    return {
      access_token: dataObj.access_token,
      user: this.transformUser(dataObj.user, options),
    };
  }
  private transformRequest(data: any, options?: TransformationOptions): any {
    if (Array.isArray(data)) {
      if (options?.authUserProfile) {
        return {
          requests: data.map(req => this.transformSingleRequest(req)),
          authUserProfile: this.transformUser(options.authUserProfile, options),
        };
      }
      return data.map(req => this.transformSingleRequest(req));
    }
    const transformedRequest = this.transformSingleRequest(data);
    if (options?.authUserProfile) {
      return {
        request: transformedRequest,
        authUserProfile: this.transformUser(options.authUserProfile, options),
      };
    }
    return transformedRequest;
  }
  private transformSingleRequest(request: any): TransformedRequest | null {
    if (!request) return null;
    const requestObj = safeToObject(request) as Record<string, unknown>;
    const requestedDates = this.parseRequestedDates(requestObj.requestedDates);
    return {
      _id: safeGet(requestObj, '_id', '').toString(),
      requestType: safeGet(requestObj, 'requestType', ''),
      reason: safeGet(requestObj, 'reason', ''),
      days: safeGet(requestObj, 'days', 0),
      status: CamelCase(safeGet(requestObj, 'status', '')),
      currentStage: CamelCase(safeGet(requestObj, 'currentStage', '')),
      requestedDates,
      appliedDate: safeGet(requestObj, 'appliedDate', new Date()),
      teamLeadData: safeGet(requestObj, 'teamLeadData', undefined),
      user: this.transformUserForRequest(safeGet(requestObj, 'user', null)),
      remarks: this.transformRemarks(safeGet(requestObj, 'remarks', [])),
      department: this.transformDepartment(safeGet(requestObj, 'department', null)),
      approvedAt: requestObj.approvedAt ? new Date(requestObj.approvedAt as string) : null,
      rejectedAt: requestObj.rejectedAt ? new Date(requestObj.rejectedAt as string) : null,
      createdAt: requestObj.createdAt ? new Date(requestObj.createdAt as string) : new Date(),
      updatedAt: requestObj.updatedAt ? new Date(requestObj.updatedAt as string) : new Date(),
      approvedBy: this.transformUserBasic(safeGet(requestObj, 'approvedBy', null)),
      rejectedBy: this.transformUserBasic(safeGet(requestObj, 'rejectedBy', null)),
      createdBy: this.transformUserBasic(safeGet(requestObj, 'createdBy', null)),
      updatedBy: this.transformUserBasic(safeGet(requestObj, 'updatedBy', null)),
    };
  }
  private transformUser(
    user: UserPayload | any,
    options?: TransformationOptions,
  ): TransformedUser | any {
    if (!user) return null;
    const userWithRoleDisplay = RoleDisplay.applyRoleDisplay(user);
    const userObj = safeToObject(userWithRoleDisplay);
    const profile = this.extractProfileData(userObj);
    const department = this.transformDepartment(userObj.department);
    const userDesignation = safeGet(profile, 'designation', safeGet(userObj, 'designation', null));
    return {
      _id: safeGet<any>(userObj, '_id', null)?.toString() || '',
      fullName: safeGet(profile, 'fullName', safeGet(userObj, 'fullName', null)),
      employeeId: safeGet(profile, 'employeeId', safeGet(userObj, 'employeeId', null)),
      email: safeGet(userObj, 'email', null),
      designation: userDesignation,
      role: transformRole(safeGet(userObj, 'role', '')),
      displayRole: transformRole(safeGet(userObj, 'displayRole', '')),
      status: CamelCase(safeGet(userObj, 'status', '')),
      cell: safeGet<any>(userObj, 'cell', null)?.toString() || '',
      isVerified: safeGet(userObj, 'isVerified', false),
      lastActivatedAt: safeGet(userObj, 'lastActivatedAt', null),
      profile: options?.preserveOriginal ? profile : this.transformProfileData(profile),
      department,
      permissions: safeGet(userObj, 'permissions', []),
      loginCount: safeGet(userObj, 'loginCount', 0),
      createdAt: safeGet(userObj, 'createdAt', null),
      updatedAt: safeGet(userObj, 'updatedAt', null),
    };
  }
  private transformProfileData(profile: any): any {
    if (!profile) return null;
    return {
      _id: String(safeGet(profile, '_id', '')),
      userId: String(safeGet(profile, 'userId', safeGet(profile, '_id', ''))),
      employeeId: safeGet(profile, 'employeeId', ''),
      designation: safeGet(profile, 'designation', ''),
      fullName: safeGet(profile, 'fullName', ''),
      firstName: safeGet(profile, 'firstName', ''),
      lastName: safeGet(profile, 'lastName', ''),
      email: safeGet(profile, 'email', ''),
      role: transformRole(safeGet(profile, 'role', '')),
      status: CamelCase(safeGet(profile, 'status', '')),
      contactNumber: safeGet(profile, 'contactNumber', ''),
      profilePicture: safeGet(profile, 'profilePicture', ''),
      missionStatement: this.extractMissionStatement(profile),
      documents: safeGet(profile, 'documents', []),
    };
  }
  private transformProfile(data: any, options?: TransformationOptions): IProfileResponse | null {
    if (!data) {
      if (this.logger) {
        this.logger.warn('transformProfile: No data provided');
      }
      return null;
    }
    try {
      const dataObj = safeToObject(data) as Record<string, any>;
      const userId = safeGet(dataObj, 'userId', safeGet(dataObj, '_id', ''));
      const profile = safeGet(dataObj, 'profile', dataObj);
      const userIdString = userId ? String(userId) : '';
      const missionStatement = this.extractMissionStatement(profile, dataObj);
      const successIndicators = this.extractSuccessIndicators(profile, dataObj);
      const result: IProfileResponse = {
        userId: userIdString,
        fullName: safeGet(profile, 'fullName', safeGet(dataObj, 'fullName', '')),
        role: transformRole(safeGet(profile, 'role', safeGet(dataObj, 'role', ''))),
        employeeId: safeGet(profile, 'employeeId', safeGet(dataObj, 'employeeId', '')),
        designation: safeGet(profile, 'designation', safeGet(dataObj, 'designation', '')),
        email: safeGet(dataObj, 'email', safeGet(profile, 'email', '')),
        department: safeGet(profile, 'department', safeGet(dataObj, 'department', '')),
        pictureUrl: this.extractPictureUrl(profile, dataObj),
        missionStatement,
        successIndicators,
      };
      return result;
    } catch (error) {
      this.logger.error('Error in transformProfile:', error);
      return null;
    }
  }
  private transformDepartment(department: any): TransformedDepartment | any {
    if (!department) return null;
    const deptWithRoleDisplay = RoleDisplay.applyToDepartment(department);
    const deptObj = safeToObject(deptWithRoleDisplay);
    let teamLeadDetail: TransformedDepartment['teamLeadDetail'] = null;
    if (deptObj.teamLeadDetail) {
      const teamLeadDetailObj = deptObj.teamLeadDetail as Record<string, unknown>;
      const teamLeadFirstName = safeGet(teamLeadDetailObj, 'firstName', '');
      const teamLeadLastName = safeGet(teamLeadDetailObj, 'lastName', '');
      const teamLeadFullName = `${teamLeadFirstName} ${teamLeadLastName}`.trim();
      teamLeadDetail = {
        fullName: teamLeadFullName || '',
        firstName: teamLeadFirstName,
        lastName: teamLeadLastName,
        designation: safeGet(teamLeadDetailObj, 'designation', ''),
        email: safeGet(teamLeadDetailObj, 'email', ''),
        role: transformRole(safeGet(teamLeadDetailObj, 'role', '')),
        displayRole: transformRole(safeGet(teamLeadDetailObj, 'displayRole', '')),
        userId: safeGet(teamLeadDetailObj, 'userId', ''),
      };
    }
    const teamLeadRaw = safeGet<any>(deptObj, 'teamLead', null);
    const teamLead = teamLeadRaw != null ? String(teamLeadRaw) : null;
    return {
      _id: String(safeGet(deptObj, '_id', '')),
      name: safeGet(deptObj, 'name', ''),
      description: safeGet(deptObj, 'description', ''),
      isActive: safeGet(deptObj, 'isActive', false),
      teamLead,
      teamLeadDetail,
      createdAt: safeGet(deptObj, 'createdAt', null),
      updatedAt: safeGet(deptObj, 'updatedAt', null),
    };
  }
  private transformCandidate(candidate: any): TransformedCandidate | null {
    if (!candidate) return null;
    const candidateObj = safeToObject(candidate);
    const transformUserReference = (userRef: any): any => {
      if (userRef && typeof userRef === 'object' && '_id' in userRef) {
        return {
          _id: safeGet(userRef, '_id', '').toString(),
          fullName: safeGet(userRef, 'fullName', ''),
          employeeId: safeGet(userRef, 'employeeId', ''),
          email: safeGet(userRef, 'email', ''),
          designation: safeGet(userRef, 'designation', ''),
          role: transformRole(safeGet(userRef, 'role', '')),
          displayRole: transformRole(safeGet(userRef, 'displayRole', '')),
          status: CamelCase(safeGet(userRef, 'status', '')),
          profilePicture: safeGet(userRef, 'profilePicture', ''),
        };
      } else if (userRef) {
        return userRef.toString();
      }
      return null;
    };
    const department = this.transformDepartment(safeGet(candidateObj, 'department', null));
    const fullName = `${candidateObj.firstName} ${candidateObj.lastName}`.trim();
    return {
      _id: safeGet(candidateObj, '_id', '').toString(),
      fullName,
      email: safeGet(candidateObj, 'email', null),
      firstName: safeGet(candidateObj, 'firstName', null),
      lastName: safeGet(candidateObj, 'lastName', null),
      jobTitle: safeGet(candidateObj, 'jobTitle', null),
      hiringStage: CamelCase(safeGet(candidateObj, 'hiringStage', 'null')),
      timingStart: safeGet(candidateObj, 'timingStart', null),
      timingEnd: safeGet(candidateObj, 'timingEnd', null),
      token: safeGet(candidateObj, 'token', null),
      copyLink: safeGet(candidateObj, 'copyLink', null),
      reviewRequested: safeGet(candidateObj, 'reviewRequested', null),
      tokenType: safeGet(candidateObj, 'tokenType', null),
      officialEmail: safeGet(candidateObj, 'officialEmail', null),
      onboardedUserId: safeGet(candidateObj, 'onboardedUserId', null),
      onboardedProfileId: safeGet(candidateObj, 'onboardedProfileId', null),
      archiveReason: safeGet(candidateObj, 'archiveReason', null),
      clarificationForm: safeGet(candidateObj, 'clarificationForm', {}),
      personalInfo: safeGet(candidateObj, 'personalInfo', {}),
      documents: safeGet(candidateObj, 'documents', []),
      department,
      createdBy: transformUserReference(safeGet(candidateObj, 'createdBy', null)),
      updatedBy: transformUserReference(safeGet(candidateObj, 'updatedBy', null)),
      createdAt: candidateObj.createdAt ? new Date(candidateObj.createdAt as string) : null,
      updatedAt: candidateObj.updatedAt ? new Date(candidateObj.updatedAt as string) : null,
      tokenExpiresAt: safeGet(candidateObj, 'tokenExpiresAt', null),
      onboardedAt: candidateObj.onboardedAt ? new Date(candidateObj.onboardedAt as string) : null,
      archivedAt: candidateObj.archivedAt ? new Date(candidateObj.archivedAt as string) : null,
      tokenUsageCount: safeGet(candidateObj, 'tokenUsageCount', null),
    };
  }
  private transformDefault(data: any): any {
    return data;
  }
  // ============================================
  // Helper Methods
  // ============================================
  private transformUserForRequest(user: UserPayload | any): TransformedUserForRequest | any {
    if (!user) return null;
    const userObj = safeToObject(user);
    const profile = this.extractUserProfile(userObj);
    return {
      _id: safeGet(userObj, '_id', '').toString(),
      fullName: safeGet(profile, 'fullName', safeGet(userObj, 'fullName', '')),
      employeeId: safeGet(profile, 'employeeId', safeGet(userObj, 'employeeId', '')),
      email: safeGet(userObj, 'email', ''),
      designation: safeGet(profile, 'designation', safeGet(userObj, 'designation', '')),
      role: transformRole(safeGet(userObj, 'role', '')),
      displayRole: transformRole(safeGet(userObj, 'displayRole', '')),
      cell: safeGet(userObj, 'cell', ''),
      status: CamelCase(safeGet(userObj, 'status', '')),
      loginCount: safeGet(userObj, 'loginCount', 0).toString(),
      profile,
      permissions: safeGet(userObj, 'permissions', []),
    };
  }
  private extractUserProfile(user: any): any {
    if (!user) return this.createEmptyProfile();
    const profile = safeGet(user, 'profile', null);
    if (profile && typeof profile === 'object' && Object.keys(profile).length > 0) {
      return {
        _id: String(safeGet(profile, '_id', '')),
        userId: String(safeGet(profile, 'userId', safeGet(profile, '_id', ''))),
        employeeId: safeGet(profile, 'employeeId', ''),
        designation: safeGet(profile, 'designation', ''),
        fullName: safeGet(profile, 'fullName', ''),
        firstName: safeGet(profile, 'firstName', ''),
        lastName: safeGet(profile, 'lastName', ''),
        email: safeGet(profile, 'email', safeGet(user, 'email', '')),
        role: transformRole(safeGet(profile, 'role', safeGet(user, 'role', ''))),
        status: CamelCase(safeGet(profile, 'status', safeGet(user, 'status', ''))),
        contactNumber: safeGet(profile, 'contactNumber', ''),
        profilePicture: safeGet(profile, 'profilePicture', ''),
      };
    }
    // Construct profile from user data when profile object is empty
    const firstName = safeGet(user, 'firstName', '');
    const lastName = safeGet(user, 'lastName', '');
    const fullName = safeGet(user, 'fullName', '');
    return {
      _id: safeGet(user, '_id', '').toString(),
      userId: safeGet(user, '_id', '').toString(),
      fullName: fullName || `${firstName} ${lastName}`.trim() || safeGet(user, 'username', ''),
      firstName: firstName,
      lastName: lastName,
      email: safeGet(user, 'email', ''),
      designation: safeGet(user, 'designation', ''),
      role: transformRole(safeGet(user, 'role', '')),
      employeeId: safeGet(user, 'employeeId', ''),
      status: CamelCase(safeGet(user, 'status', '')),
      contactNumber: safeGet(user, 'cell', safeGet(user, 'contactNumber', '')),
      profilePicture: '',
    };
  }
  private transformUserBasic(user: unknown): TransformedUserBasic | null {
    if (!user) return null;
    const userObj = safeToObject(user) as Record<string, unknown>;
    const profile = safeGet(userObj, 'profile', null);
    const designation = profile
      ? safeGet(profile, 'designation', '')
      : safeGet(userObj, 'designation', '');
    const fullName = profile
      ? safeGet(profile, 'fullName', '')
      : safeGet(userObj, 'fullName', safeGet(userObj, 'username', ''));
    return {
      _id: safeGet(userObj, '_id', '').toString(),
      email: safeGet(userObj, 'email', ''),
      designation,
      fullName,
    };
  }
  private transformRemarks(remarks: unknown[]): TransformedRemark[] {
    if (!remarks || !Array.isArray(remarks)) return [];
    return remarks.map(remark => {
      const remarkObj = remark as Record<string, unknown>;
      const byUser = safeGet(remarkObj, 'by', null);
      const byProfile = byUser ? safeGet(byUser, 'profile', null) : null;
      const designation = byProfile
        ? safeGet(byProfile, 'designation', '')
        : safeGet(byUser, 'designation', '');
      const fullName = byProfile
        ? safeGet(byProfile, 'fullName', '')
        : safeGet(byUser, 'fullName', safeGet(byUser, 'username', ''));
      return {
        _id: safeGet(remarkObj, '_id', '').toString(),
        by: {
          _id: safeGet(byUser, '_id', '').toString(),
          email: safeGet(byUser, 'email', ''),
          designation,
          fullName,
        },
        role: transformRole(safeGet(remarkObj, 'role', '')),
        remark: safeGet(remarkObj, 'remark', ''),
        date: remarkObj.date ? new Date(remarkObj.date as string) : new Date(),
        createdAt: remarkObj.createdAt ? new Date(remarkObj.createdAt as string) : new Date(),
        updatedAt: remarkObj.updatedAt ? new Date(remarkObj.updatedAt as string) : new Date(),
      };
    });
  }
  private parseRequestedDates(requestedDates: unknown): Date[] {
    if (!requestedDates) return [];
    if (Array.isArray(requestedDates)) {
      return requestedDates.map((date: string | Date) =>
        date instanceof Date ? date : new Date(date),
      );
    }
    if (typeof requestedDates === 'string') {
      return requestedDates.split(',').map((dateStr: string) => new Date(dateStr.trim()));
    }
    return [];
  }
  private extractProfileData(obj: any): any {
    return safeGet(obj, 'profile', obj);
  }
  private extractMissionStatement(profile: any, dataObj?: any): IMission {
    const missionStatements = safeGet(
      profile,
      'missionStatement.statements',
      safeGet(dataObj || {}, 'missionStatement.statements', []),
    );
    if (missionStatements && Array.isArray(missionStatements) && missionStatements.length > 0) {
      const sortedStatements = [...missionStatements].sort((a: any, b: any) => {
        const dateA = new Date(safeGet(a, 'createdAt', 0)).getTime();
        const dateB = new Date(safeGet(b, 'createdAt', 0)).getTime();
        return dateB - dateA;
      });
      const latest = sortedStatements[0];
      if (latest) {
        return {
          statement: safeGet(latest, 'content', ''),
          status: CamelCase(safeGet(latest, 'status', 'PENDING')),
        };
      }
    }
    return {
      statement: '',
      status: '',
    };
  }
  private extractSuccessIndicators(profile: any, dataObj?: any): any[] {
    let successIndicators = safeGet(profile, 'successIndicators', []);
    if (!successIndicators || !Array.isArray(successIndicators) || successIndicators.length === 0) {
      successIndicators = safeGet(dataObj || {}, 'successIndicators', []);
    }
    if (!Array.isArray(successIndicators)) {
      successIndicators = [];
    }
    const quarters: any[] = [];
    for (let q = 1; q <= 4; q++) {
      const existingQuarter = successIndicators.find((sq: any) => sq.quarter === q);
      if (existingQuarter) {
        const indicators = safeGet(existingQuarter, 'indicators', []);
        const formattedIndicators = Array.isArray(indicators)
          ? indicators.map((indicator: any) => ({
              id: safeGet(indicator, 'id', 0),
              Indicator: safeGet(indicator, 'Indicator', ''),
              status: CamelCase(safeGet(indicator, 'status', 'IN_PROGRESS')),
              isMoved: safeGet(indicator, 'isMoved', false),
              fromQuarter: safeGet(indicator, 'fromQuarter', null),
              toQuarter: safeGet(indicator, 'toQuarter', null),
              quarter: safeGet(indicator, 'quarter', q),
            }))
          : [];
        quarters.push({
          quarter: q,
          indicators: formattedIndicators,
          isActive: safeGet(existingQuarter, 'isActive', false),
        });
      } else {
        quarters.push({
          quarter: q,
          indicators: [],
          isActive: false,
        });
      }
    }
    return quarters;
  }
  private extractPictureUrl(profile: any, dataObj?: any): string {
    return safeGet(
      profile,
      'profilePicture.url',
      safeGet(
        dataObj || {},
        'profilePicture.url',
        safeGet(profile, 'profilePicture', safeGet(dataObj || {}, 'profilePicture', '')),
      ),
    );
  }
  // ============================================
  // Profile Response Method
  // ============================================
  async profileResponse(profile: any): Promise<TransformedProfile | any> {
    if (!profile) {
      return this.createEmptyProfile();
    }
    const profileWithRoleDisplay = RoleDisplay.applyToProfile(profile);
    const profileObj = safeToObject(profileWithRoleDisplay);
    let missionStatement = safeGet(profileObj, 'missionStatement', null);
    if (missionStatement && typeof missionStatement === 'object' && missionStatement.statements) {
      const sortedStatements = [...missionStatement.statements].sort((a: any, b: any) => {
        if (a.type === 'APPROVED' && b.type !== 'APPROVED') return -1;
        if (b.type === 'APPROVED' && a.type !== 'APPROVED') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      const latestStatement = sortedStatements.length > 0 ? sortedStatements[0] : undefined;
      missionStatement = {
        latestStatement: latestStatement
          ? {
              id: (latestStatement.id || latestStatement._id)?.toString() || '',
              content: latestStatement.content,
              type: latestStatement.type,
              status: latestStatement.status,
              createdAt: latestStatement.createdAt,
              createdBy: {
                id:
                  (latestStatement.createdBy.id || latestStatement.createdBy._id)?.toString() || '',
                fullName: latestStatement.createdBy?.fullName || '',
                email: latestStatement.createdBy?.email || '',
                role: latestStatement.createdBy?.role || '',
              },
              feedback: latestStatement.feedback,
              feedbackDate: latestStatement.feedbackDate,
            }
          : undefined,
      };
    }
    const transformedProfile: TransformedProfile | any = {
      _id: String(safeGet(profileObj, '_id', '')),
      userId: String(safeGet(profileObj, 'userId', safeGet(profileObj, '_id', ''))),
      employeeId: safeGet(profileObj, 'employeeId', ''),
      designation: safeGet(profileObj, 'designation', ''),
      fullName: safeGet(profileObj, 'fullName', ''),
      firstName: safeGet(profileObj, 'firstName', ''),
      lastName: safeGet(profileObj, 'lastName', ''),
      email: safeGet(profileObj, 'email', ''),
      role: transformRole(safeGet(profileObj, 'role', '')),
      status: CamelCase(safeGet(profileObj, 'status', '')),
      contactNumber: safeGet(profileObj, 'contactNumber', ''),
      profilePicture: safeGet(profileObj, 'profilePicture', ''),
      missionStatement: missionStatement,
      successIndicators: this.extractSuccessIndicators(profileObj, 'successIndicators'),
      documents: safeGet(profileObj, 'documents', []),
    };
    return transformedProfile;
  }
  // ============================================
  // Utility Methods
  // ============================================
  createEmptyProfile(): any {
    return {
      _id: '',
      fullName: '',
      firstName: '',
      lastName: '',
      designation: '',
      userId: '',
      role: '',
      displayRole: '',
      employeeId: '',
      profilePicture: '',
      contactNumber: '',
      missionStatement: null,
    };
  }
  createEmptyUserPayload(): UserPayload {
    return {
      _id: '',
      fullName: '',
      role: '',
      email: '',
      status: '',
      displayRole: '',
      permissions: [],
      cell: '',
      loginCount: '0',
    } as unknown as UserPayload;
  }
}
// ============================================
// Export Functions for Backward Compatibility
// ============================================
const transformer = UnifiedTransformer.getInstance();
export function unifiedTransform(data: any, options: TransformationOptions = {}): any {
  return transformer.transform(data, options);
}
export function responseTransform({
  data,
  authUserProfile,
  context,
  dataObj = data as Record<string, any>,
}: {
  data: any;
  authUserProfile?: UserPayload | any;
  context?: 'login' | 'request' | 'user';
  dataObj?: Record<string, any>;
}): UserPayload | any {
  const options: TransformationOptions = {
    authUserProfile,
    context: context as TransformationContext,
  };
  return transformer.transform(data, options);
}
export function logInResponse(accessToken: string, user: UserPayload | any): LoginResponse | any {
  return transformer.transform({ access_token: accessToken, user }, { context: 'login' });
}
export function userResponse(user: UserPayload | any): TransformedUser | any {
  return transformer.transform(user, { context: 'user' });
}
export function unifiedProfileResponse(data: any): IProfileResponse | null {
  return transformer.transform(data, { context: 'profile' });
}
export function departmentResponse(department: any): TransformedDepartment | any {
  return transformer.transform(department, { context: 'department' });
}
export function candidateResponse(candidate: any): TransformedCandidate | any {
  return transformer.transform(candidate, { context: 'candidate' });
}
export function RequestResponse(request: unknown): TransformedRequest | null {
  return transformer.transform(request, { context: 'request' });
}
export function transformUserForRequest(
  user: UserPayload | any,
  teamLeadData?: unknown,
): TransformedUserForRequest | any {
  const transformedUser = transformer.transform(user, { context: 'user' });
  if (teamLeadData && transformedUser) {
    transformedUser.teamLeadData = teamLeadData;
  }
  return transformedUser;
}
export function transformUserBasic(user: unknown): TransformedUserBasic | null {
  return transformer.transform(user, { context: 'user' });
}
export function transformRemarks(remarks: unknown[]): TransformedRemark[] {
  return transformer.transform(remarks, { context: 'default' });
}
export function parseRequestedDates(requestedDates: unknown): Date[] {
  const instance = UnifiedTransformer.getInstance();
  return (instance as any).parseRequestedDates(requestedDates);
}
// Export utilities
export { safeGet, safeToObject };
// Default export for easy import
export default {
  transform: unifiedTransform,
  responseTransform,
  logInResponse,
  userResponse,
  unifiedProfileResponse,
  departmentResponse,
  candidateResponse,
  RequestResponse,
  transformUserForRequest,
  transformUserBasic,
  transformRemarks,
  parseRequestedDates,
  safeGet,
  safeToObject,
  createEmptyProfile: () => transformer.createEmptyProfile(),
  userProfileResponse: transformer.profileResponse.bind(transformer),
};
