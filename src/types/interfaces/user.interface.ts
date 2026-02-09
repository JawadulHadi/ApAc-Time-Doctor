import { Types } from 'mongoose';

import { UserStatus } from '../constants/user-status.constants';
import { Role } from '../enums/role.enums';
import { BaseDocument } from './base.interface';
import { TransformedDepartment, UserDepartment } from './department.interface';
import { UserPayload } from './jwt.interface';
import { ProfileData, TransformedProfile } from './profile.interface';
export interface IUserDocument extends BaseDocument {
  email: string;
  username?: string;
  password: string;
  role: Role;
  displayRole: Role;
  status: UserStatus;
  cell?: string;
  department?: Types.ObjectId;
  profile?: Types.ObjectId;
  permissions: Permissions[];
  loginCount: number;
  isVerified: boolean;
  activationCode?: string;
  activationCodeGeneratedAt?: Date;
}
export interface CombinedUserProfile {
  _id: Types.ObjectId;
  email: string;
  username?: string;
  role: string;
  displayRole: string;
  status: string;
  cell: string;
  fullName: string;
  designation: string;
  employeeId: string;
  password: string;
  isVerified: boolean;
  department: UserDepartment;
  lastLogin: string;
  loginCount: string;
  activationCode?: string;
  activationCodeGeneratedAt?: string;
  lastLogout?: string;
  resetPasswordCode?: string;
  resetPasswordCodeGeneratedAt?: string;
  lastActivatedAt: string;
  lockoutExpires?: string;
  failedLoginAttempts?: number;
  profile: ProfileData;
  departmentDetails: UserDepartment;
  permissions: string[];
}
export interface ILeanUser {
  _id: Types.ObjectId;
  fullName: string;
  designation?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
}
export interface UserOperationResult {
  user: CombinedUserProfile | TransformedUser | string;
  authUser: UserPayload;
}
export interface GetUserProfileResponse {
  user: UserPayload;
  authUser: UserPayload;
}
export interface GetGroupUsersResponse {
  users: UserPayload[];
  authUser: UserPayload;
}
export interface TransformedUser {
  _id: string;
  userId?: string;
  employeeId?: string;
  fullName?: string;
  designation?: string;
  role?: string;
  displayRole?: string;
  email?: string;
  status?: string;
  cell?: string;
  profile?: TransformedProfile;
  department?: TransformedDepartment;
  permissions?: string[];
  activationCode?: string;
  lastActivatedAt?: Date | null;
  isVerified: boolean;
  password?: string;
  loginCount?: number;
  leaveBankRecords?: Record<string, unknown>[];
}
export interface TransformedUserBasic {
  _id: string;
  email: string;
  fullName?: string;
  designation?: string;
}
export function isUserPayload(user: UserPayload): user is UserPayload {
  return user && typeof user._id === 'string' && typeof user.email === 'string';
}
export function isTransformedUser(user: unknown): user is TransformedUser {
  return (
    user &&
    typeof user === 'object' &&
    '_id' in user &&
    typeof (user as Record<string, unknown>)._id === 'string' &&
    'permissions' in user &&
    Array.isArray((user as Record<string, unknown>).permissions)
  );
}
