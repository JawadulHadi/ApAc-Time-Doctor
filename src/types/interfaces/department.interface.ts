import { Types } from 'mongoose';

import { BaseDocument } from './base.interface';
export interface IDepartmentDocument extends BaseDocument {
  name: string;
  teamLead?: Types.ObjectId;
  description?: string;
}
export interface UserDepartment {
  _id: Types.ObjectId;
  name: string;
  description: string;
  isActive: boolean;
  teamLead: Types.ObjectId;
  teamLeadDetail: {
    userId: Types.ObjectId;
    username: string;
    email: string;
    role: string;
    designation: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
export interface DepartmentData {
  _id: Types.ObjectId;
  name: string;
  isActive: boolean;
  teamLead: Types.ObjectId;
  description: string;
  teamLeadDetail: {
    userId: Types.ObjectId;
    username: string;
    email: string;
    role: string;
    designation: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
}
export interface TransformedDepartment {
  _id: string;
  name: string;
  teamLead: string | any;
  description: string;
  isActive: boolean;
  teamLeadDetail:
    | {
        userId: Types.ObjectId;
        username: string;
        email: string;
        role: string;
        designation: string;
        firstName: string;
        lastName: string;
        fullName: string;
      }
    | DepartmentData
    | any;
}
