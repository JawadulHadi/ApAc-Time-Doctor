import { Types } from 'mongoose';
export interface UserFilter {
  _id?: Types.ObjectId | { $in: Types.ObjectId[] };
  email?: string;
  status?: string;
  role?: string;
  department?: Types.ObjectId;
  employeeId?: string;
}
export interface CandidateFilter {
  _id?: Types.ObjectId;
  email?: string;
  hiringStage?: string;
  department?: Types.ObjectId;
  createdBy?: Types.ObjectId;
}
export interface RequestFilter {
  _id?: Types.ObjectId;
  user?: Types.ObjectId;
  status?: string;
  type?: string;
  department?: Types.ObjectId;
}
