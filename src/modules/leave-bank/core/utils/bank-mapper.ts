import { Logger } from '@nestjs/common';

import { Permissions } from '../../../../types/enums/permissions.enum';
import { Role } from '../../../../types/enums/role.enums';
import { UserPayload } from '../../../../types/interfaces/jwt.interface';
export class BankMapper {
  static permissionsMapping(
    authUser: UserPayload,
    records: any[],
  ): { records: any[]; myRecords: any[] } {
    const userId = authUser._id.toString();
    const myRecords = records.filter(
      record => record.userId?.toString() === userId || record.employeeId === authUser.employeeId,
    );
    const hasManagePermission = authUser.permissions?.includes(Permissions.CAN_VIEW_LEAVE_BANK);
    if (!hasManagePermission) {
      return { records: [], myRecords };
    }
    const otherRecords = this.filterOtherRecords(authUser, records, userId);
    return {
      records: otherRecords,
      myRecords,
    };
  }
  static filterOtherRecords(authUser: UserPayload, records: any[], userId: string): any[] {
    const normalizeRole = (role: string): string => {
      if (!role) return '';
      return role.toLowerCase().replace(/\s+/g, '_').trim();
    };
    const normalizedRole = normalizeRole(authUser.role);
    const isUserTeamLead = (user: UserPayload | any): boolean => {
      if (!user) return false;
      const userRole = normalizeRole(user.role);
      const userDisplayRole = user.displayRole?.toLowerCase().trim();
      const hasPermission = user?.permissions?.includes(Permissions.CAN_MANAGE_LEAVE_BANK);
      const result =
        userRole === Role.TEAM_LEAD.toLowerCase() ||
        userRole === Role.REPORTING_LINE.toLowerCase() ||
        userRole === 'Team Lead' ||
        userRole === 'team_lead' ||
        userDisplayRole === 'Reporting Line' ||
        hasPermission;
      Logger.log(
        `isUserTeamLead - role: ${userRole}, displayRole: ${userDisplayRole}, hasPermission: ${hasPermission}, result: ${result}`,
      );
      return result;
    };
    const authUserIsTeamLead = isUserTeamLead(authUser);
    switch (normalizedRole) {
      case 'member':
        return [];
      case 'team_lead':
        if (authUserIsTeamLead) {
          const filteredRecords = records.filter(record => {
            const recordUserId = record.userId?.toString() || record.employeeId;
            if (recordUserId === userId) {
              return false;
            }
            const recordDepartment = record.department;
            const authUserDepartment = authUser.department?.name;
            const isSameDepartment = recordDepartment === authUserDepartment;
            const isTeamLeadOfDepartment =
              authUser.department?.teamLead?.toString() === userId ||
              authUser.department?.teamLeadDetail?.userId?.toString() === userId;
            return isSameDepartment && isTeamLeadOfDepartment;
          });
          return filteredRecords;
        }
        return [];
      case Role.COO.toLowerCase() || 'COO':
        Logger.log('COO Debug - Processing total records:', records.length);
        Logger.log('COO Debug - Auth user ID:', userId);
        const cooFilteredRecords = records.filter(record => {
          const recordUserId = record.userId?.toString() || record.employeeId;
          if (recordUserId === userId) return false;
          const isTeamLead = isUserTeamLead(record);
          Logger.log('COO Debug - record:', record);
          Logger.log('COO Debug - isTeamLead:', isTeamLead);
          Logger.log('COO Debug - record.role:', record.role);
          Logger.log('COO Debug - record.displayRole:', record.role);
          if (isTeamLead) {
            Logger.log('COO Debug - Including team lead record:', record.employeeId);
            return true;
          }
          Logger.log(`COO Debug - Excluding member ${record.employeeId} - not a team lead`);
          return false;
        });
        Logger.log('COO Debug - Final filtered records count:', cooFilteredRecords.length);
        Logger.log(
          'COO Debug - Final filtered records:',
          cooFilteredRecords.map(r => ({
            employeeId: r.employeeId,
            role: r.role,
            department: r.department,
          })),
        );
        return cooFilteredRecords;
      case 'admin':
      case 'super_admin':
        const hasUpdatePermission = authUser.permissions?.includes(
          Permissions.CAN_MANAGE_LEAVE_BANK,
        );
        if (hasUpdatePermission) {
          const adminFilteredRecords = records.filter(record => {
            const recordUserId = record.userId?.toString() || record.employeeId;
            return recordUserId !== userId;
          });
          return adminFilteredRecords;
        }
        return [];
      default:
        return [];
    }
  }
}
