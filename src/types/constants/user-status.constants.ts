/**
 * User status constants and enums
 * Contains all possible user account statuses
 */

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DISABLED = 'DELETED',
  LOCKED = 'LOCKED',
}

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Active',
  [UserStatus.INACTIVE]: 'Inactive',
  [UserStatus.SUSPENDED]: 'Suspended',
  [UserStatus.DISABLED]: 'Deleted',
  [UserStatus.LOCKED]: 'Locked',
} as const;

export const ACTIVE_USER_STATUSES = [UserStatus.ACTIVE] as const;

export const INACTIVE_USER_STATUSES = [
  UserStatus.INACTIVE,
  UserStatus.SUSPENDED,
  UserStatus.DISABLED,
  UserStatus.LOCKED,
] as const;
