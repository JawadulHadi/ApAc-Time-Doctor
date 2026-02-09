export interface IIndicator {
  id: number | null;
  content: string;
  status: string;
  isMoved?: boolean;
  log?: string;
  isTransferred?: boolean;
  from?: number | null;
  to?: number | null;
  key: number | null;
}
export interface IQuarter {
  quarter: number;
  indicators: IIndicator[];
  isActive: boolean;
  year: number;
}
export interface IProfileResponse {
  userId: string;
  fullName: string;
  role: string;
  employeeId: string;
  designation: string;
  email: string;
  department: string;
  pictureUrl: string;
  missionStatement: IMission | string;
  successIndicators: IQuarter[];
}
export interface IMission {
  statement: string;
  status: string;
}
