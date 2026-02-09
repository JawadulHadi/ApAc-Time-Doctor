import { Types } from 'mongoose';

import { Candidates } from '../../modules/recruitment/schemas/candidate.schema';
export interface IFileUploadResult {
  url: string;
  fileName: string;
  fileType: string;
  size: number;
}
export interface ITokenValidationResult {
  candidate: Candidates;
  isValid: boolean;
  error?: string;
}
export interface IEnrichedCandidate {
  createdBy?: {
    _id: Types.ObjectId;
    fullName: string;
    employeeId: string;
    email: string;
    designation: string;
    role: string;
    displayRole: string;
    status: string;
  };
  updatedBy?: {
    _id: Types.ObjectId;
    fullName: string;
    employeeId: string;
    email: string;
    designation: string;
    role: string;
    displayRole: string;
    status: string;
  };
  department?: {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    isActive: boolean;
    teamLead?: string;
    teamLeadDetail?: {
      fullName: string;
      firstName: string;
      lastName: string;
      designation: string;
      email: string;
      role: string;
      displayRole: string;
      userId: Types.ObjectId;
    };
  };
}
export interface ICandidateFilter {
  hiringStage?: string;
  id?: string;
  department?: string;
  jobTitle?: string;
  email?: string;
  createdBy?: string;
  skip?: number;
  limit?: number;
}
export interface IPaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IOnboardingResult {
  user: {
    _id: Types.ObjectId;
    email: string;
    role: string;
    status: string;
    profile?: {
      _id: Types.ObjectId;
      firstName: string;
      lastName: string;
      designation: string;
      employeeId?: string;
    };
  };
  candidate: Candidates;
  message: string;
}
export interface ICandidateDocument {
  _id: Types.ObjectId;
  url: string;
  name: string;
  fileName: string;
  fileExtension: string;
  fileType: string;
  mimeType: string;
  size: number;
  category: string;
  uploadedAt: Date;
}
export interface IValidationError {
  field: string;
  message: string;
}
export interface IRecruitmentServiceConfig {
  maxFileSize: number;
  allowedMime: string[];
  tokenExpiryDays: number;
  uploadRetryAttempts: number;
  baseUrl: string;
  clarificationTag: string;
  personalInfoTag: string;
}
export interface IServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: IValidationError[];
  message?: string;
}
