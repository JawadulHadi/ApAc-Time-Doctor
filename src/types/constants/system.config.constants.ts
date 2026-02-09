/**
 * System configuration constants
 * Contains system-level configuration and default values
 */

import { Role } from '../enums/role.enums';

export const EXCLUDED_ROLES = [Role.SUPER_ADMIN, Role.ADMIN, Role.HR, Role.TRAINER];

export const SYSTEM_EMAILS = ['learning.development@apac-dev.agilebrains.com'];

export const SYSTEM_CONFIG = {
  EXCLUDED_ROLES,
  SYSTEM_EMAILS,
} as const;
