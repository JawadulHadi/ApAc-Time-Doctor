import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { DECORATOR_KEYS } from '../../types/constants/decorator-keys.constants';
export const IS_PUBLIC_KEY = DECORATOR_KEYS.IS_PUBLIC;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  /**
   * Checks if the current user can activate the route
   * If the route is marked as public, authentication is skipped
   * @param context - Execution context containing request information
   * @returns True if user has required role, throws ForbiddenException otherwise
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
