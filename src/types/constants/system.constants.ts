/**
 * System-related constants and enums
 * Contains system user information and default values
 */

export enum System {
  COO = ' Muhammad Usman',
  SUPER_ADMIN = 'System Administrator',
  SUPER_ADMIN_EMAIL = 'sadmin@apac-dev.agilebrains.com',
}

export const SYSTEM_DEFAULTS = {
  COO_NAME: System.COO,
  SUPER_ADMIN_NAME: System.SUPER_ADMIN,
  SUPER_ADMIN_EMAIL: System.SUPER_ADMIN_EMAIL,
} as const;
