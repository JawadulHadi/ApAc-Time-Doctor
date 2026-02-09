export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COO = 'COO',
  ADMIN = 'ADMIN',
  HR = 'HR',
  TRAINER = 'TRAINER',
  RECRUITER = 'RECRUITER',
  TEAM_LEAD = 'TEAM_LEAD',
  MEMBER = 'MEMBER',
  REPORTING_LINE = 'REPORTING_LINE',
}
export enum DisplayRole {
  SUPER_ADMIN = 'Super Admin',
  COO = 'COO',
  ADMIN = 'Admin',
  HR = 'HR',
  TEAM_LEAD = 'Team Lead',
  MEMBER = 'Member',
  RECRUITER = 'Recruiter',
  TRAINER = 'Trainer',
  REPORTING_LINE = 'Reporting Line',
}

export const RoleDisplayMap: Record<Role, DisplayRole> = {
  [Role.SUPER_ADMIN]: DisplayRole.SUPER_ADMIN,
  [Role.COO]: DisplayRole.COO,
  [Role.ADMIN]: DisplayRole.ADMIN,
  [Role.HR]: DisplayRole.HR,
  [Role.TRAINER]: DisplayRole.TRAINER,
  [Role.RECRUITER]: DisplayRole.RECRUITER,
  [Role.TEAM_LEAD]: DisplayRole.TEAM_LEAD,
  [Role.MEMBER]: DisplayRole.MEMBER,
  [Role.REPORTING_LINE]: DisplayRole.REPORTING_LINE,
};
let DisplayRoleMap: Record<DisplayRole, Role>;
DisplayRoleMap = {
  [DisplayRole.SUPER_ADMIN]: Role.SUPER_ADMIN,
  [DisplayRole.COO]: Role.COO,
  [DisplayRole.ADMIN]: Role.ADMIN,
  [DisplayRole.HR]: Role.HR,
  [DisplayRole.TEAM_LEAD]: Role.TEAM_LEAD,
  [DisplayRole.MEMBER]: Role.MEMBER,
  [DisplayRole.RECRUITER]: Role.RECRUITER,
  [DisplayRole.TRAINER]: Role.TRAINER,
  [DisplayRole.REPORTING_LINE]: Role.REPORTING_LINE,
};
export enum UserType {
  TEAM_LEAD = 'Team Lead',
  MEMBER = 'Member',
}
export enum ExecutiveRole {
  HR = 'HR',
  COO = 'COO',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  TRAINER = 'TRAINER',
  RECRUITER = 'RECRUITER',
  REPORTING_LINE = 'REPORTING_LINE',
}
