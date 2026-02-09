import { Types } from 'mongoose';

import { RequestStage, RequestStatus, RequestType } from '../enums/request.enums';
import { TransformedDepartment } from './department.interface';
import { TransformedProfile } from './profile.interface';
import { TransformedUserBasic } from './transform.interface';
export interface TransformedRemark {
  _id: string;
  by: TransformedUserBasic | null;
  role: string;
  remark: string;
  date: Date;
}
export interface TransformedTeamLeadData {
  fullName: string;
  email: string;
  userId: Types.ObjectId;
  designation?: string;
  role?: string;
}
export interface TransformedUserForRequest {
  _id: string;
  fullName?: string;
  employeeId: string;
  teamLeadData?: TransformedTeamLeadData;
  designation?: string;
  role: string;
  displayRole: string;
  email: string;
  status: string;
  cell?: string;
  loginCount: string;
  profile: TransformedProfile;
  permissions: string[];
}
export interface TransformedRequest {
  _id: string;
  requestType: string;
  reason: string;
  days: number;
  requestedDates: Date[];
  status: string;
  currentStage: string;
  appliedDate: Date;
  remarks?: TransformedRemark[];
  teamLeadData?: TransformedTeamLeadData;
  user: TransformedUserForRequest | null;
  department?: TransformedDepartment | null;
  approvedAt?: Date | null;
  rejectedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: TransformedUserBasic | null;
  rejectedBy?: TransformedUserBasic | null;
  createdBy?: TransformedUserBasic | null;
  updatedBy?: TransformedUserBasic | null;
}
export interface RequestListResponse {
  requests: TransformedRequest[];
  myRequests: TransformedRequest[];
}
export interface PaginatedRequestListResponse extends RequestListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface SingleRequestResponse {
  request: TransformedRequest;
}
export interface IExecutiveData {
  userId: Types.ObjectId;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  designation?: string;
  role: string;
  status?: string;
  displayRole?: string;
}
export interface IExecutive {
  userId: Types.ObjectId;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  designation: string;
  role: string;
  displayRole: string;
  status: string;
}
export interface IRequest {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  requestType: RequestType;
  requestedDates: Date[] | null;
  days: number;
  reason?: string;
  status: RequestStatus;
  currentStage: RequestStage;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: Types.ObjectId;
  rejectedAt?: Date;
  remarks: Array<{
    by: Types.ObjectId;
    role: string;
    remark: string;
    date: Date;
  }>;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  department?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPopulatedUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  role: string;
  displayRole: string;
  permissions: string[];
  status: string;
  cell?: string;
  fullName: string;
  designation?: string;
  profile?: {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    firstName: string;
    lastName: string;
    fullName: string;
    designation: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
export interface IPopulatedDepartment {
  _id: Types.ObjectId;
  name: string;
  description: string;
  teamLead?: Types.ObjectId;
  teamLeadDetail: {
    fullName: string;
    displayRole: string;
    userId: Types.ObjectId;
    username: string;
    email: string;
    role: string;
    designation: string;
    firstName: string;
    lastName: string;
  };
}
export interface IPopulatedRequest extends Omit<
  IRequest,
  'user' | 'approvedBy' | 'rejectedBy' | 'remarks' | 'createdBy' | 'updatedBy' | 'department'
> {
  user: IPopulatedUser;
  approvedBy?: IPopulatedUser;
  rejectedBy?: IPopulatedUser;
  remarks: Array<{
    by: IPopulatedUser;
    role: string;
    remark: string;
    date: Date;
  }>;
  createdBy: IPopulatedUser;
  updatedBy?: IPopulatedUser;
  department?: IPopulatedDepartment;
}
