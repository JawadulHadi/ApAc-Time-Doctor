import { DepartmentData } from './department.interface';
import { ProfileData } from './profile.interface';
export interface LoginResponse {
  access_token: string | any;
  user: UserPayload | any;
}
export interface LoggedInResponse {
  success: boolean | any;
  data: LoginResponse | any;
}
export interface UserPayload {
  _id: string | any;
  fullName: string | any;
  password?: string | any;
  employeeId: string | any;
  designation: string | any;
  role: string | any;
  displayRole: string | any;
  email: string | any;
  status: string | any;
  cell: string | any;
  profile: ProfileData | any;
  department: DepartmentData | any;
  permissions: string[] | any;
  loginCount?: string | any;
  isVerified: string | any;
}
export interface AuthenticatedUser extends Request {
  user: UserPayload;
}
