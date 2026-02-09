import { Injectable } from '@nestjs/common';

import { SuccessIndicatorQuarter } from '../../modules/profile/schemas/profiles.schema';
import { Role } from '../../types/enums/role.enums';
import { IQuarter } from '../../types/interfaces/statement.interface';
import { CamelCase, transformRole } from '../utils/unified-transform.utils';
import { RoleDisplay } from '../utils/role-display.utils';
@Injectable()
export class StatementHelper {
  static async transformUserProfile(userData: any): Promise<any> {
    const transformedUser = RoleDisplay.applyRoleDisplay(userData);
    const profile = userData.profile || {};
    const user = userData;
    const missionStatement = this.filterStatement(profile.missionStatement);
    const successIndicators = this.transformIndicators({
      successIndicators: profile.successIndicators || [],
    });
    const response: any = {
      userId: user._id?.toString() || '',
      employeeId: profile.employeeId || '',
      fullName: user.fullName || '',
      email: user.email || '',
      department: user.department?.name || '',
      role: transformRole(transformedUser.role),
      displayRole: transformedUser.displayRole,
      isReportingLineUser: transformedUser.isReportingLineUser,
      designation: profile.designation || '',
      status: CamelCase(user.status) || '',
      cell: user.cell?.toString() || '',
      isVerified: user.isVerified?.toString() || 'false',
      pictureUrl: user.profile?.profilePicture?.url || '',
      missionStatement: {
        statement: missionStatement.statement,
        status: CamelCase(missionStatement.status),
      },
      successIndicators: successIndicators,
    };
    if (user.role === Role.MEMBER && user.department?.teamLead) {
      response.teamLeadDetail = {
        userId: user.department?.teamLead?.toString() || '',
        email: user.department?.teamLeadDetail?.email || '',
        role: CamelCase(user.department?.teamLeadDetail?.role) || '',
        designation: user.department?.teamLeadDetail?.designation || '',
        fullName: user.department?.teamLeadDetail?.fullName || '',
      };
    }
    return response;
  }
  static filterStatement(missionStatement: any): { statement: string; status: string } {
    if (!missionStatement || !Array.isArray(missionStatement.statements)) {
      return { statement: '', status: '' };
    }
    const statements = missionStatement.statements;
    const latestStatement = statements.length > 0 ? statements[statements.length - 1] : null;
    return {
      statement: latestStatement?.content || '',
      status: latestStatement?.status || '',
    };
  }
  static transformIndicators({
    successIndicators,
  }: {
    successIndicators: SuccessIndicatorQuarter[];
  }): IQuarter[] {
    if (!Array.isArray(successIndicators)) {
      return [1, 2, 3, 4].map(quarter => ({
        quarter,
        indicators: [],
        isActive: false,
        year: new Date().getFullYear(),
      }));
    }
    const quartersMap = new Map<number, any>();
    for (let i = 1; i <= 4; i++) {
      quartersMap.set(i, {
        quarter: i,
        isActive: false,
        year: new Date().getFullYear(),
        indicators: [],
      });
    }
    successIndicators.forEach(quarter => {
      if (quarter.quarter >= 1 && quarter.quarter <= 4) {
        const existingQuarter = quartersMap.get(quarter.quarter);
        if (existingQuarter) {
          existingQuarter.isActive = quarter.isActive || false;
          existingQuarter.year = quarter.year || new Date().getFullYear();
          existingQuarter.indicators = (quarter.indicators || []).map((ind: any) => ({
            content: ind.content || '',
            status: CamelCase(ind.status) || '',
            log: ind.log || '',
            isMoved: ind.isMoved || false,
            isTransferred: ind.isTransferred || false,
            to: ind.to || '',
            from: ind.from || '',
            key: ind.key || '',
            id: ind.id,
          }));
        }
      }
    });
    return Array.from(quartersMap.values());
  }
}
