import { Role } from '../enums/role.enums';
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.MEMBER]: 0,
  [Role.TEAM_LEAD]: 1,
  [Role.REPORTING_LINE]: 2,
  [Role.RECRUITER]: 3,
  [Role.TRAINER]: 4,
  [Role.HR]: 5,
  [Role.ADMIN]: 6,
  [Role.COO]: 7,
  [Role.SUPER_ADMIN]: 8,
} as const;
export const ROLE_HIERARCHY_ARRAY: readonly Role[] = [
  Role.MEMBER,
  Role.TEAM_LEAD,
  Role.REPORTING_LINE,
  Role.RECRUITER,
  Role.TRAINER,
  Role.HR,
  Role.ADMIN,
  Role.COO,
  Role.SUPER_ADMIN,
] as const;
export function getRoleHierarchyLevel(role: Role): number {
  return ROLE_HIERARCHY[role] ?? -1;
}
export function hasRolePrivilege(userRole: Role, requiredRole: Role): boolean {
  return getRoleHierarchyLevel(userRole) >= getRoleHierarchyLevel(requiredRole);
}
