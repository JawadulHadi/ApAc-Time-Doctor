import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION } from '../../types/constants/error-messages.constants';
import { getRoleHierarchyLevel } from '../../types/constants/role-hierarchy.constants';
import { Role } from '../../types/enums/role.enums';
import { ROLES_KEY } from '../decorators/roles.decorators';
/**
 * Guard to enforce role-based access control
 *
 * This guard checks if the authenticated user has one of the required roles
 * specified by the @Roles decorator. It uses a role hierarchy system where
 * higher-level roles automatically have access to lower-level role requirements.
 *
 * @example
 * ```typescript
 * @Roles(Role.ADMIN)
 * @UseGuards(AuthGuard)
 * @Get('admin-route')
 * adminRoute() {
 *   return 'Only admins can access this';
 * }
 * ```
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  /**
   * Determines if the current user can activate the route
   * @param context - Execution context containing request information
   * @returns True if user has required role, throws ForbiddenException otherwise
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.role) {
      throw new ForbiddenException(PERMISSION.INSUFFICIENT_ROLE);
    }
    const userRoleLevel = getRoleHierarchyLevel(user.role);
    const requiredRoleLevel = Math.max(
      ...requiredRoles.map(role => getRoleHierarchyLevel(role as Role)),
    );
    if (userRoleLevel < requiredRoleLevel) {
      throw new ForbiddenException(
        `${PERMISSION.INSUFFICIENT_ROLE}. Required: ${requiredRoles.join(', ')}, Current: ${user.role}`,
      );
    }
    return true;
  }
}
