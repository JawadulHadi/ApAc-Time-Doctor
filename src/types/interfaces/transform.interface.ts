import { ProfileUser } from '../../modules/profile/schemas/profiles.schema';
import { IStatementStatus } from '../enums/profile.enums';
import { UserPayload } from './jwt.interface';
import { IProfileDocumentFile } from './profile-document.interface';
import { IMission, IQuarter } from './statement.interface';
// ============================================
// Core Transformation Interfaces
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
  authUserProfile?: UserPayload | Record<string, unknown>;
  preserveOriginal?: boolean;
  customTransformers?: {
    [key in TransformationContext]?: (data: unknown, options?: TransformationOptions) => unknown;
  };
}
// ============================================
// Response Interfaces
// ============================================
export interface LoginResponse {
  access_token: string;
  user: TransformedUser;
}
export interface BaseTransformedResponse {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface TransformedUser extends BaseTransformedResponse {
  userId?: string;
  employeeId?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  designation?: string;
  role?: string;
  displayRole?: string;
  email?: string;
  status?: string;
  cell?: string;
  isVerified?: boolean;
  lastActivatedAt?: Date | null;
  profile?: TransformedProfile;
  department?: TransformedDepartment;
  permissions?: string[];
  loginCount?: number;
}
export interface TransformedUserBasic {
  _id: string;
  email: string;
  fullName?: string;
  designation?: string;
}
export interface TransformedUserForRequest extends Omit<TransformedUser, 'loginCount'> {
  loginCount: string;
  teamLeadData?: any;
}
export interface TransformedProfile extends BaseTransformedResponse {
  userId: string;
  employeeId?: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  designation?: string;
  role: string;
  status: string;
  contactNumber?: string;
  profilePicture?: IProfileDocumentFile | string;
  missionStatement?: IMission | null;
  successIndicators?: IQuarter[] | null;
  documents?: IProfileDocumentFile[];
  skills?: string[];
  achievements?: string[];
  dateOfBirth?: string;
  dateOfJoining?: string;
  emergencyContact?: string;
  currentAddress?: string;
  permanentAddress?: string;
  resume?: IProfileDocumentFile;
  idProof?: IProfileDocumentFile;
  salary?: string;
}
export interface TransformedDepartment extends BaseTransformedResponse {
  name: string;
  description?: string;
  isActive?: boolean;
  teamLead?: string | null;
  teamLeadDetail?: {
    fullName: string;
    firstName: string;
    lastName: string;
    designation: string;
    email: string;
    role: string;
    displayRole: string;
    userId: string;
  } | null;
}
export interface TransformedRemark extends BaseTransformedResponse {
  by: TransformedUserBasic | null;
  role: string;
  remark: string;
  date: Date;
}
export interface TransformedRequest extends BaseTransformedResponse {
  requestType: string;
  reason: string;
  days: number;
  status: string;
  currentStage: string;
  requestedDates: Date[];
  appliedDate: Date;
  teamLeadData?: any;
  user: TransformedUserForRequest | null;
  remarks?: TransformedRemark[];
  department?: TransformedDepartment | null;
  approvedAt?: Date | null;
  rejectedAt?: Date | null;
  approvedBy?: TransformedUserBasic | null;
  rejectedBy?: TransformedUserBasic | null;
  createdBy?: TransformedUserBasic | null;
  updatedBy?: TransformedUserBasic | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface TransformedCandidate extends BaseTransformedResponse {
  fullName: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  hiringStage: string;
  timingStart: string | null;
  timingEnd: string | null;
  token: string | null;
  copyLink: string | null;
  reviewRequested: string | null;
  tokenType: string | null;
  officialEmail: string | null;
  onboardedUserId: string | null;
  onboardedProfileId: string | null;
  archiveReason: string | null;
  clarificationForm: Record<string, unknown>;
  personalInfo: Record<string, unknown>;
  documents: Record<string, unknown>[];
  department: TransformedDepartment | null;
  createdBy: Record<string, unknown>;
  updatedBy: Record<string, unknown>;
  tokenExpiresAt: string | null;
  onboardedAt: Date | null;
  archivedAt: Date | null;
  tokenUsageCount: string | null;
}
// ============================================
// Utility Interfaces
// ============================================
export interface SafeObjectOptions {
  virtual?: boolean;
  getters?: boolean;
}
export interface TransformerConfig {
  enableLogging?: boolean;
  fallbackToDefault?: boolean;
  strictMode?: boolean;
}
// ============================================
// Error Handling Interfaces
// ============================================
export interface TransformationError extends Error {
  context: TransformationContext;
  data?: unknown;
  originalError?: Error;
}
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}
// ============================================
// Profile Response Interfaces
// ============================================
export interface IProfileResponse {
  userId: string;
  fullName: string;
  role: string;
  employeeId: string;
  designation: string;
  email: string;
  department: Record<string, unknown>;
  pictureUrl: string;
  missionStatement?: IMission;
  successIndicators?: IQuarter[];
}
// ============================================
// Mission Statement Interfaces
// ============================================
export interface EmployeeData {
  employeeId?: string[];
  email?: string;
  name?: string;
}
export interface IMissionStatement {
  id: string;
  content: string;
  status: IStatementStatus;
  changesRequired?: string;
  createdBy: ProfileUser;
  reviewer: ProfileUser;
  createdAt: Date;
  reviewedAt?: Date;
}
// ============================================
// Type Guards
// ============================================
export function isTransformedUser(obj: unknown): obj is TransformedUser {
  return (
    obj &&
    typeof obj === 'object' &&
    '_id' in obj &&
    typeof (obj as Record<string, unknown>)._id === 'string'
  );
}
export function isTransformedProfile(obj: unknown): obj is TransformedProfile {
  return (
    obj &&
    typeof obj === 'object' &&
    'userId' in obj &&
    typeof (obj as Record<string, unknown>).userId === 'string'
  );
}
export function isTransformedDepartment(obj: unknown): obj is TransformedDepartment {
  return (
    obj &&
    typeof obj === 'object' &&
    'name' in obj &&
    typeof (obj as Record<string, unknown>).name === 'string'
  );
}
export function isTransformedRequest(obj: unknown): obj is TransformedRequest {
  return (
    obj &&
    typeof obj === 'object' &&
    'requestType' in obj &&
    typeof (obj as Record<string, unknown>).requestType === 'string'
  );
}
