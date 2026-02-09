export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
  IN_PROCESS = 'IN_PROCESS',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  COMPLETED = 'COMPLETED',
}
export enum RequestStage {
  HR = 'HR',
  TEAM_LEAD = 'TEAM_LEAD',
  COO = 'COO',
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPLETED = 'COMPLETED',
}
export enum ActionType {
  APPROVED = 'APPROVED',
  DISAPPROVED = 'DISAPPROVED',
  REMARKS = 'REMARKS',
}
export enum RequestType {
  CASUAL = 'CASUAL',
  SICK = 'SICK',
  ANNUAL = 'ANNUAL',
  MATERNITY = 'MATERNITY',
  MARRIAGE = 'MARRIAGE',
  CHILD_DELIVERY = 'CHILD_DELIVERY',
  MEDICAL_EMERGENCY = 'MEDICAL_EMERGENCY',
  COMPENSATORY_LEAVE = 'COMPENSATORY_LEAVE',
  WORK_FROM_HOME = 'WORK_FROM_HOME',
  LATE_ARRIVAL = 'LATE_ARRIVAL',
  HALF_DAY = 'HALF_DAY',
  TRAINING = 'TRAINING',
}
export function Requests(requestType: string): string {
  const typeMap: { [key: string]: string } = {
    [RequestType.CASUAL]: 'Casual Leave',
    [RequestType.SICK]: 'Sick Leave',
    [RequestType.ANNUAL]: 'Annual Leave',
    [RequestType.MATERNITY]: 'Maternity Leave',
    [RequestType.MARRIAGE]: 'Marriage Leave',
    [RequestType.CHILD_DELIVERY]: 'Child Delivery Leave',
    [RequestType.MEDICAL_EMERGENCY]: 'Medical Emergency Leave',
    [RequestType.COMPENSATORY_LEAVE]: 'Compensatory Leave',
    [RequestType.WORK_FROM_HOME]: 'WFH',
    [RequestType.LATE_ARRIVAL]: 'Late Arrival',
    [RequestType.HALF_DAY]: 'Half Day',
    [RequestType.TRAINING]: 'Training',
  };
  return typeMap[requestType] || requestType;
}
