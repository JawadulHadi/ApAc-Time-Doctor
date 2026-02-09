import { DisplayRole, Role } from '../../types/enums/role.enums';
import { CamelCase, transformRole } from './unified-transform.utils';
/**
 * Utility class for handling role display logic
 */
export class RoleDisplay {
  private static readonly SPECIFIC_USERS_ROLE_MAP = {
    '68fa5d793a50f116c7311bcd': 'Reporting Line',
    '68fa5e4f3a50f116c7311c39': 'Reporting Line',
  };
  static isReportingLineUser(user: any): boolean {
    if (!user || typeof user !== 'object') {
      return false;
    }
    const userId = user._id?.toString() || user.userId?.toString();
    if (
      userId &&
      this.SPECIFIC_USERS_ROLE_MAP[userId as keyof typeof this.SPECIFIC_USERS_ROLE_MAP]
    ) {
      return true;
    }
    const employeeId = user.profile?.employeeId || user.employeeId;
    const reportingLineEmployeeIds = ['MAS-MIS-5016', 'MAS-MIS-5070'];
    return reportingLineEmployeeIds.includes(employeeId);
  }
  static applyRoleDisplay(user: any): any {
    if (!user || typeof user !== 'object') {
      return user;
    }
    const userId = user._id?.toString();
    const isReportingLine = this.isReportingLineUser(user);
    if (isReportingLine) {
      const displayRole = 'Reporting Line';
      return this.UserForDisplay(user, displayRole);
    }
    return this.baseRole(user);
  }
  static applyDisplay(users: any[]): any[] {
    if (!users || !Array.isArray(users)) {
      return [];
    }
    return users.map(user => this.applyRoleDisplay(user));
  }
  static applyToProfile(profile: any, user?: any): any {
    if (!profile || typeof profile !== 'object') {
      return profile;
    }
    const userId = profile.userId?.toString() || user?._id?.toString();
    const isReportingLine = this.isReportingLineUser({ _id: userId, ...profile, ...user });
    if (isReportingLine) {
      const displayRole = DisplayRole.REPORTING_LINE;
      const originalRole = profile.role || user?.role || DisplayRole.TEAM_LEAD;
      return {
        ...profile,
        role: originalRole,
        displayRole: displayRole,
        originalRole: originalRole,
        isReportingLineUser: true,
      };
    }
    if (!profile.displayRole && profile.role) {
      return {
        ...profile,
        displayRole: profile.role,
      };
    }
    return profile;
  }
  static applyToDepartment(department: any, user?: any): any {
    if (!department || typeof department !== 'object') {
      return department;
    }
    if (department.teamLeadDetail) {
      const teamLeadId =
        department.teamLeadDetail.userId?.toString() || department.teamLeadDetail._id?.toString();
      const isReportingLine = this.isReportingLineUser(department.teamLeadDetail);
      if (isReportingLine) {
        const displayRole = DisplayRole.REPORTING_LINE;
        const originalRole = department.teamLeadDetail.role || DisplayRole.TEAM_LEAD;
        department.teamLeadDetail = {
          ...department.teamLeadDetail,
          role: originalRole,
          displayRole: displayRole,
          originalRole: originalRole,
          isReportingLineUser: true,
        };
      } else if (!department.teamLeadDetail.displayRole && department.teamLeadDetail.role) {
        department.teamLeadDetail = {
          ...department.teamLeadDetail,
          displayRole: department.teamLeadDetail.role,
        };
      }
    }
    return department;
  }
  private static UserForDisplay(user: any, displayRole: string): any {
    const originalRole = user.role || DisplayRole.TEAM_LEAD;
    const userId = user._id?.toString();
    const transformedUser: any = {
      ...user,
      role: originalRole,
      displayRole: displayRole,
      isReportingLineUser: true,
      originalRole: originalRole,
    };
    if (transformedUser.profile) {
      transformedUser.profile = this.applyToProfile(transformedUser.profile, user);
    }
    if (transformedUser.department) {
      transformedUser.department = this.applyToDepartment(transformedUser.department, user);
    }
    if (transformedUser.departmentDetails) {
      transformedUser.departmentDetails = this.applyToDepartment(
        transformedUser.departmentDetails,
        user,
      );
    }
    if (transformedUser.executiveDetails) {
      transformedUser.executiveDetails = this.applyToDepartment(
        transformedUser.executiveDetails,
        user,
      );
    }
    return transformedUser;
  }
  private static baseRole(user: any): any {
    const baseUser = { ...user };
    if (!baseUser.displayRole && baseUser.role) {
      baseUser.displayRole = CamelCase(baseUser.role);
    }
    if (baseUser.profile && !baseUser.profile.displayRole && baseUser.profile.role) {
      baseUser.profile = {
        ...baseUser.profile,
        displayRole: transformRole(baseUser.profile.role),
      };
    }
    if (
      baseUser.department?.teamLeadDetail &&
      !baseUser.department.teamLeadDetail.displayRole &&
      baseUser.department.teamLeadDetail.role
    ) {
      baseUser.department.teamLeadDetail = {
        ...baseUser.department.teamLeadDetail,
        displayRole: transformRole(baseUser.department.teamLeadDetail.role),
      };
    }
    return baseUser;
  }
  static normalizeRole(user: any): string {
    if (!user || typeof user !== 'object') {
      return '';
    }
    return user.originalRole || user.role || '';
  }
  static shouldIncludeInUserList(user: any): boolean {
    if (!user || typeof user !== 'object') {
      return false;
    }
    const originalRole = this.normalizeRole(user);
    const excludedRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.HR];
    return !excludedRoles.includes(originalRole as Role);
  }
  static getDisplayRole(user: any): string {
    if (!user || typeof user !== 'object') {
      return '';
    }
    if (this.isReportingLineUser(user)) {
      return DisplayRole.REPORTING_LINE;
    }
    return user.displayRole || user.role || '';
  }
  static isSpecificTransformedUser(user: any): boolean {
    return this.isReportingLineUser(user);
  }
}
