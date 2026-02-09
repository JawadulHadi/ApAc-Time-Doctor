import { Types } from 'mongoose';

import { RequestStage } from '../../types/enums/request.enums';
import { DisplayRole, Role } from '../../types/enums/role.enums';
import { TransformedRequest, TransformedUser } from '../../types/interfaces/transform.interface';
import { RoleDisplay } from '../utils/role-display.utils';
export class RequestHelper {
  static isPopulatedUser(user: any): user is TransformedUser {
    return user && typeof user === 'object' && '_id' in user && 'email' in user;
  }
  static getUserRole(request: any): string | null {
    if (request.user && typeof request.user === 'object') {
      if (RoleDisplay.isReportingLineUser(request.user)) {
        return Role.REPORTING_LINE;
      }
      if (request.user.originalRole) {
        return request.user.originalRole;
      }
      if (request.user.role) {
        return request.user.role;
      }
      if (request.user.profile?.role) {
        return request.user.profile.role;
      }
    }
    return null;
  }
  static getTeamLead(request: any): string | null {
    if (request?.department?.teamLead) {
      return request.department.teamLead.toString();
    }
    if (request?.department?.teamLeadDetail?.userId) {
      return request.department.teamLeadDetail.userId.toString();
    }
    if (request?.teamLeadData?.userId) {
      return request.teamLeadData.userId.toString();
    }
    if (request?.teamLeadId) {
      return request.teamLeadId.toString();
    }
    return null;
  }
  static isUserTeamLead(userRole: string): boolean {
    return (
      userRole === Role.TEAM_LEAD ||
      userRole === DisplayRole.TEAM_LEAD ||
      userRole === Role.REPORTING_LINE
    );
  }
  static isUserMember(userRole: string): boolean {
    return userRole === Role.MEMBER || userRole === DisplayRole.MEMBER;
  }
  static getUserId(request: any): string | null {
    if (request?.user?._id) {
      const userId = request.user._id.toString();
      return userId;
    } else if (request?.user) {
      const userId = request.user.toString();
      return userId;
    }
    return null;
  }
  static applyRoleToRequest(request: any): any {
    if (!request) return request;
    const enhancedRequest = { ...request };
    if (enhancedRequest.user) {
      enhancedRequest.user = RoleDisplay.applyRoleDisplay(enhancedRequest.user);
    }
    if (enhancedRequest.department) {
      enhancedRequest.department = RoleDisplay.applyToDepartment(enhancedRequest.department);
    }
    if (enhancedRequest.remarks && Array.isArray(enhancedRequest.remarks)) {
      enhancedRequest.remarks = enhancedRequest.remarks.map((remark: any) => ({
        ...remark,
        by: remark.by ? RoleDisplay.applyRoleDisplay(remark.by) : remark.by,
      }));
    }
    return enhancedRequest;
  }
  static requestWithProfiles(request: any, userProfileMap: Map<string, any>): any {
    const enhanced = { ...request };
    const userFields = ['user', 'approvedBy', 'rejectedBy', 'createdBy', 'updatedBy'] as const;
    userFields.forEach(field => {
      if (enhanced[field]?._id) {
        const userId = enhanced[field]._id.toString();
        enhanced[field].profile = userProfileMap.get(userId);
      }
    });
    if (enhanced.remarks) {
      enhanced.remarks = enhanced.remarks.map((remark: any) => ({
        ...remark,
        by: remark.by
          ? {
              ...remark.by,
              profile: userProfileMap.get(remark.by._id.toString()),
            }
          : remark.by,
      }));
    }
    return enhanced;
  }
  static fallbackProfile(user: any): any {
    const nameParts = (user.fullName || user.username || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return {
      _id: new Types.ObjectId(),
      userId: user._id,
      firstName,
      lastName,
      fullName: user.fullName || user.username || '',
      designation: user.designation || '',
      role: user.role || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  static getTeamLeadData(userDetails: any, executives: any, currentStage: RequestStage): any {
    let teamLeadData: any = {
      fullName: 'Not Assigned',
      email: '',
      userId: null,
    };
    if (currentStage === RequestStage.TEAM_LEAD) {
      if (userDetails.department?.teamLeadDetail) {
        teamLeadData = {
          fullName:
            userDetails.department.teamLeadDetail.fullName ||
            `${userDetails.department.teamLeadDetail.firstName || ''} ${userDetails.department.teamLeadDetail.lastName || ''}`.trim(),
          email: userDetails.department.teamLeadDetail.email,
          userId: userDetails.department.teamLead,
        };
      }
    } else if (currentStage === RequestStage.COO) {
      if (executives.COO) {
        teamLeadData = {
          fullName: executives.COO.fullName,
          email: executives.COO.email,
          userId: executives.COO.userId,
        };
      }
    } else if (currentStage === RequestStage.SUPER_ADMIN) {
      if (executives.SUPER_ADMIN) {
        teamLeadData = {
          fullName: executives.SUPER_ADMIN.fullName,
          email: executives.SUPER_ADMIN.email,
          userId: executives.SUPER_ADMIN.userId,
        };
      }
    } else {
      if (executives.COO) {
        teamLeadData = {
          fullName: executives.COO.fullName,
          email: executives.COO.email,
          userId: executives.COO.userId,
        };
      }
    }
    return teamLeadData;
  }
  static requestsByRole(requests: any[], userRole: Role, userId: string): any[] {
    switch (userRole) {
      case Role.MEMBER:
        return [];
      case Role.TEAM_LEAD:
      case Role.REPORTING_LINE:
        return requests.filter(request => {
          const requestUserId = RequestHelper.getUserId(request);
          const teamLeadId = RequestHelper.getTeamLead(request);
          return requestUserId !== userId && teamLeadId === userId;
        });
      case Role.COO:
        return requests.filter(request => {
          const requestUserId = RequestHelper.getUserId(request);
          const userRoleFromRequest = RequestHelper.getUserRole(request);
          const isTeamLeadOrReporting =
            userRoleFromRequest?.toUpperCase() === Role.TEAM_LEAD ||
            userRoleFromRequest?.toUpperCase() === Role.REPORTING_LINE;
          return requestUserId !== userId && isTeamLeadOrReporting;
        });
      case Role.HR:
      case Role.ADMIN:
      case Role.SUPER_ADMIN:
        return requests;
      default:
        return [];
    }
  }
  static safelyGetTeamRequests(
    requests: TransformedRequest[],
    effectiveRole: Role,
    userId: string,
  ): any[] {
    try {
      if (!RequestHelper.shouldSeeTeamRequests(effectiveRole)) {
        return [];
      }
      return RequestHelper.requestsByRole(requests, effectiveRole, userId);
    } catch (error) {
      return [];
    }
  }
  static allowedRoles(currentStage: string | any): Role[] {
    const stageRoleMap: Record<string, Role[]> = {
      [RequestStage.HR]: [Role.HR],
      [RequestStage.TEAM_LEAD]: [Role.TEAM_LEAD, Role.REPORTING_LINE],
      [RequestStage.COO]: [Role.COO, Role.HR, Role.ADMIN, Role.SUPER_ADMIN],
      [RequestStage.SUPER_ADMIN]: [Role.SUPER_ADMIN, Role.ADMIN],
      [RequestStage.COMPLETED]: [],
    };
    return stageRoleMap[currentStage] || [];
  }
  static isRequestCompleted(request: any): boolean {
    const completedStage =
      request.currentStage?.toUpperCase() === 'COMPLETED' || request.currentStage === 'Completed';
    const approvedStatus =
      request.status?.toUpperCase() === 'APPROVED' || request.status === 'Approved';
    const disapprovedStatus =
      request.status?.toUpperCase() === 'DISAPPROVED' || request.status === 'Disapproved';
    return completedStage && (approvedStatus || disapprovedStatus);
  }
  static shouldSeeTeamRequests(userRole: string): boolean {
    const normalizedRole = userRole?.toUpperCase().replace(/\s+/g, '_');
    return [
      Role.TEAM_LEAD,
      Role.REPORTING_LINE,
      Role.COO,
      Role.HR,
      Role.ADMIN,
      Role.SUPER_ADMIN,
      DisplayRole.REPORTING_LINE,
      'TEAM_LEAD',
      'TEAM LEAD',
      'COO',
      'HR',
      'ADMIN',
      'SUPER_ADMIN',
      'Reporting Line',
      'REPORTING_LINE',
    ].includes(normalizedRole as Role);
  }
  static extractUserIdsFromRequests(requests: any[]): Set<string> {
    const userIds = new Set<string>();
    if (!requests || !Array.isArray(requests)) {
      return userIds;
    }
    requests.forEach(request => {
      if (request.user?._id) userIds.add(request.user._id.toString());
      if (request.approvedBy?._id) userIds.add(request.approvedBy._id.toString());
      if (request.rejectedBy?._id) userIds.add(request.rejectedBy._id.toString());
      if (request.createdBy?._id) userIds.add(request.createdBy._id.toString());
      if (request.updatedBy?._id) userIds.add(request.updatedBy._id.toString());
      if (request.remarks && Array.isArray(request.remarks)) {
        request.remarks.forEach((remark: any) => {
          if (remark.by?._id) userIds.add(remark.by._id.toString());
        });
      }
      if (request.department?.teamLeadDetail?.userId) {
        userIds.add(request.department.teamLeadDetail.userId.toString());
      }
    });
    return userIds;
  }
}
