/**
 * Metadata keys used by custom decorators
 * These constants ensure consistency across guards and decorators
 */
export const DECORATOR_KEYS = {
  /** Key for role-based access control metadata */
  ROLES: 'roles',
  /** Key for permission-based access control metadata */
  PERMISSIONS: 'permissions',
  /** Key to mark routes as public (skip authentication) */
  IS_PUBLIC: 'isPublic',
} as const;
export type DecoratorKey = (typeof DECORATOR_KEYS)[keyof typeof DECORATOR_KEYS];
