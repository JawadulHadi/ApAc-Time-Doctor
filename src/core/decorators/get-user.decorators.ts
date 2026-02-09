import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

import { AuthenticatedUser, UserPayload } from '../../types/interfaces/jwt.interface';
const userCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;
export const GetUser = createParamDecorator(
  async (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedUser>();
    const user = request.user;
    if (!user) {
      return null;
    }
    const userId = user._id;
    const now = Date.now();
    const cached = userCache.get(userId);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      const cachedUser = cached.data;
      if (user.profile || data === 'profile') {
        if (!cachedUser.profile?.fullName) {
          userCache.delete(userId);
        } else {
          return data ? cachedUser[data] : cachedUser;
        }
      }
    }
    if (user._id && (!user.profile || data === 'profile')) {
      try {
        const userService = await getUserService(ctx);
        if (userService) {
          const userDetails = await userService.getUserById(user._id);
          if (userDetails) {
            user.profile = {
              _id: userDetails._id || '',
              userId: userDetails.profile?.userId.toString(),
              fullName: userDetails.profile?.fullName || '',
              firstName: userDetails.profile?.firstName || '',
              lastName: userDetails.profile?.lastName || '',
              designation: userDetails.profile?.designation || '',
              role: userDetails.profile?.role || '',
              displayRole: userDetails.profile?.displayRole || '',
              contactNumber: userDetails.cell.toString() || '',
              dateOfBirth: userDetails.profile?.dateOfBirth || '',
              employeeId: userDetails.profile?.employeeId || '',
              profilePicture: userDetails.profile?.profilePicture || '',
              resume: userDetails.profile?.resume || '',
              idProof: userDetails.profile?.idProof || '',
              documents: userDetails.profile?.documents || [],
              emergencyContact: userDetails.profile?.emergencyContact || '',
              currentAddress: userDetails.profile?.currentAddress || '',
              permanentAddress: userDetails.profile?.permanentAddress || '',
              dateOfJoining: userDetails.profile?.dateOfJoining || '',
              skills: userDetails.profile?.skills || [],
              achievements: userDetails.profile?.achievements || [],
            };
            user.department = userDetails.department
              ? {
                  _id: userDetails.department._id.toString(),
                  name: userDetails.department?.name,
                  isActive: userDetails.department?.isActive,
                  teamLead: userDetails.department?.teamLead,
                  teamLeadDetail: userDetails.department?.teamLeadDetail,
                }
              : undefined;
            user.designation = userDetails.profile?.designation || '';
            user.fullName = `${userDetails.profile?.fullName || ''}`.trim();
            userCache.set(userId, { data: user, timestamp: now });
          }
        }
      } catch (error) {
        Logger.warn('⚠ Failed to fetch user profile:', error.message);
      }
    }
    if (data && user) {
      return user[data];
    }
    return user;
  },
);
async function getUserService(ctx: ExecutionContext): Promise<any> {
  try {
    const httpAdapter = ctx.switchToHttp();
    const request = httpAdapter.getRequest();
    const app = request.app;
    const userService = app.get('UserService');
    return userService;
  } catch {
    return null;
  }
}
export const GetUserBasic = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedUser>();
    const user = request.user;
    if (data && user) {
      return user[data];
    }
    return user;
  },
);
