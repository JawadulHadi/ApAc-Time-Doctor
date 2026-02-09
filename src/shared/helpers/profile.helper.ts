import { HttpException, HttpStatus } from '@nestjs/common';

import { Profiles } from '../../modules/profile/schemas/profiles.schema';
import { IndicatorStatus } from '../../types/enums/profile.enums';
import { Role } from '../../types/enums/role.enums';
import { UserPayload } from '../../types/interfaces/jwt.interface';
import { IQuarter } from '../../types/interfaces/statement.interface';
import { CombinedUserProfile } from '../../types/interfaces/user.interface';
export class ProfileHelper {
  static validateIndicatorAuthorization(currentUser: UserPayload) {
    const normalizedRole = currentUser.role?.toUpperCase().replace(/\s+/g, '_');
    const isTeamLead = Role.TEAM_LEAD.toUpperCase() === normalizedRole;
    const isLAndD = Role.TRAINER.toUpperCase() === normalizedRole;
    const isCOO = Role.COO.toUpperCase() === normalizedRole;
    return { isTeamLead, isLAndD, isCOO };
  }
  static validateLAndDForTarget(targetUser: CombinedUserProfile) {
    const normalizedRole = targetUser.role?.toUpperCase().replace(/\s+/g, '_');
    if (
      normalizedRole !== Role.TEAM_LEAD.toUpperCase() &&
      normalizedRole !== Role.COO.toUpperCase()
    ) {
      throw new HttpException(
        'L&D can only submit indicators for Team Leads and COO',
        HttpStatus.FORBIDDEN,
      );
    }
  }
  static handleIsMoved(quarters: IQuarter[], userProfile: CombinedUserProfile): IQuarter[] {
    const allQuarters = [];
    for (let q = 1; q <= 4; q++) {
      const existingQuarter = userProfile?.profile?.successIndicators?.find(sq => sq.quarter === q);
      const payloadQuarter = quarters.find(pq => pq.quarter === q);
      allQuarters.push({
        quarter: q,
        isActive: payloadQuarter?.isActive ?? existingQuarter?.isActive ?? false,
        year: payloadQuarter?.year ?? existingQuarter?.year ?? new Date().getFullYear(),
        indicators: payloadQuarter?.indicators || [],
      });
    }
    allQuarters.forEach(quarter => {
      quarter.indicators.forEach((indicator: any) => {
        if (indicator.isMoved === true && indicator.isTransferred === true) {
          return;
        }
        if (indicator.isMoved === true) {
          const sourceQuarter = quarter.quarter;
          const targetQuarter = sourceQuarter < 4 ? sourceQuarter + 1 : sourceQuarter;
          indicator.isMoved = true;
          indicator.isTransferred = true;
          indicator.log = `Moved To Q${targetQuarter}`;
          indicator.to = targetQuarter;
          indicator.from = sourceQuarter;
          const targetQuarterIndex = allQuarters.findIndex(q => q.quarter === targetQuarter);
          if (targetQuarterIndex !== -1) {
            const targetIndicators = allQuarters[targetQuarterIndex].indicators;
            const newId =
              targetIndicators.length > 0
                ? Math.max(...targetIndicators.map(ind => ind.id)) + 1
                : 1;
            const duplicateIndicator = {
              ...indicator,
              id: newId,
              key: targetQuarter,
              from: sourceQuarter,
              to: null,
              isMoved: false,
              isTransferred: false,
              status: IndicatorStatus.IN_PROGRESS,
              log: `Moved From Q${sourceQuarter}`,
            };
            allQuarters[targetQuarterIndex].indicators.push(duplicateIndicator);
          }
        }
      });
    });
    return allQuarters;
  }
  static cleanUpdateData(updateData: any): Partial<Profiles> {
    if (!updateData || typeof updateData !== 'object') {
      return updateData;
    }
    const cleanData: Partial<Profiles> = { ...updateData };
    const mongoProperties = ['_id', 'buffer', 'id', '__v', 'createdAt', 'updatedAt', 'userId'];
    for (const prop of mongoProperties) {
      delete cleanData[prop as keyof typeof cleanData];
    }
    return cleanData;
  }
}
