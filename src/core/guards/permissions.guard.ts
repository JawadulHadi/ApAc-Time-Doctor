import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION } from '../../types/constants/error-messages.constants';
import { PERMISSIONS_KEY } from '../decorators/permission.decorators';
/**
 * Guard to enforce permission-based access control
 *
 * This guard checks if the authenticated user has all the required permissions
 * specified by the @Permission decorator. All specified permissions must be present
 * for the user to access the route.
 *
 * @example
 * ```typescript
 * @Permission(Permissions.CAN_MANAGE_USERS)
 * @UseGuards(PermissionsGuard)
 * @Get('users')
 * getUsers() {
 *   return 'Only users with manage users permission can access this';
 * }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  /**
   * Determines if the current user can activate the route
   * @param context - Execution context containing request information
   * @returns True if user has all required permissions, throws ForbiddenException otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.permissions) {
      throw new ForbiddenException(PERMISSION.INSUFFICIENT_PERMISSIONS);
    }
    const hasAllPermissions = requiredPermissions.every(permission =>
      user.permissions.includes(permission),
    );
    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        permission => !user.permissions.includes(permission),
      );
      throw new ForbiddenException(
        `${PERMISSION.INSUFFICIENT_PERMISSIONS}. Missing: ${missingPermissions.join(', ')}`,
      );
    }
    return true;
  }
}
