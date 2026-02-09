import { SetMetadata } from '@nestjs/common';

import { DECORATOR_KEYS } from '../../types/constants/decorator-keys.constants';
/**
 * Metadata key for permissions decorator
 * @constant
 */
export const PERMISSIONS_KEY = DECORATOR_KEYS.PERMISSIONS;
/**
 * Decorator to specify required permissions for a route
 *
 * This decorator sets metadata that is read by the PermissionsGuard to determine
 * if a user has the required permission(s) to access a route.
 *
 * @param permissions - One or more permissions required to access the route
 * @returns Decorator function
 *
 * @example
 * ```typescript
 * @Permission(Permissions.CAN_MANAGE_USERS)
 * @Get('users')
 * getUsers() {
 *   return 'This route requires user management permission';
 * }
 * ```
 *
 * @example
 * ```typescript
 * @Permission(Permissions.CAN_ADD_USER, Permissions.CAN_UPDATE_USER)
 * @Post('users')
 * createUser() {
 *   return 'This route requires add and update user permissions';
 * }
 * ```
 */
export const Permission = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
