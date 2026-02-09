import { SetMetadata } from '@nestjs/common';

import { DECORATOR_KEYS } from '../../types/constants/decorator-keys.constants';
export const ROLES_KEY = DECORATOR_KEYS.ROLES;
/**
 * Decorator to specify required roles for a route
 * This decorator sets metadata that is read by the AuthGuard to determine
 * if a user has the required role(s) to access a route.
 * @param roles - One or more roles required to access the route
 * @returns Decorator function
 * @example
 * ```typescript
 * @Roles(Role.HR)
 * @Post('hr-action')
 * hrAction() {
 *   return 'This route is only accessible by HR';
 * }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
