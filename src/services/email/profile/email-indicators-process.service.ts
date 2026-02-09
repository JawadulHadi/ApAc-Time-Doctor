import { Injectable, Logger } from '@nestjs/common';

import { ProfileUser } from '../../../modules/profile/schemas/profiles.schema';
import { UserService } from '../../../modules/user/user.service';
import { indicatorsRecipients } from '../../../shared/helpers/email.helper';
import { DateHelper } from '../../../shared/helpers/format-Dates.helper';
import { transformRole } from '../../../shared/utils/unified-transform.utils';
import { DASHBOARD_URL, MISSION_STATEMENT_URL } from '../../../types/constants/url-tags.constants';
import { DisplayRole, Role } from '../../../types/enums/role.enums';
import { UserPayload } from '../../../types/interfaces/jwt.interface';
import { IIndicator } from '../../../types/interfaces/statement.interface';
import { EmailIndicatorTemplatesService } from './email-indicators-templates.service';
@Injectable()
export class EmailIndicatorsProcessService {
  private static logger = new Logger(EmailIndicatorsProcessService.name);
  private static userService: UserService;
  constructor(userService: UserService) {
    EmailIndicatorsProcessService.userService = userService;
  }
  private static async getExecutives() {
    try {
      return await EmailIndicatorsProcessService.userService.fetchExecutives();
    } catch (error) {
      this.logger.error('Error fetching executives:', error);
      return null;
    }
  }
  static async notifySuccessIndicatorsAdded(
    targetUser: UserPayload,
    currentUser: UserPayload,
    indicators: IIndicator[],
    quarter: number,
    year: number,
    teamLeadDetail?: ProfileUser,
  ): Promise<void> {
    const recipientsConfig = indicatorsRecipients(targetUser.role, currentUser.role);
    Logger.log('Indicators Recipients Config:', {
      targetUserRole: targetUser.role,
      assignerRole: currentUser.role,
      config: recipientsConfig,
    });
    let indicatorsUrl: string;
    let landDIndicatorsUrl: string;
    if (
      targetUser.role === Role.TEAM_LEAD ||
      DisplayRole.TEAM_LEAD ||
      targetUser.role === Role.COO ||
      DisplayRole.COO ||
      targetUser.role === Role.MEMBER ||
      DisplayRole.MEMBER
    ) {
      indicatorsUrl = DASHBOARD_URL;
    } else {
      indicatorsUrl = MISSION_STATEMENT_URL;
    }
    landDIndicatorsUrl = DASHBOARD_URL;
    const indicatorsList = Array.isArray(indicators) ? indicators : [];
    const quarterIndicators = indicatorsList.filter((ind: any) => ind.quarter === quarter);
    if (recipientsConfig.shouldNotifyTrainer) {
      const executives = await this.getExecutives();
      const trainer = executives?.TRAINER;
      if (trainer?.email) {
        await EmailIndicatorTemplatesService.sendSuccessIndicatorsAdded(
          trainer.email,
          'Trainer - Operations',
          targetUser.profile?.fullName || '',
          indicators,
          landDIndicatorsUrl,
          {
            employeeRole: transformRole(targetUser.role || ''),
            quarter: `Q${quarter}`,
            year: year.toString(),
            addedByName: currentUser.fullName,
            addedByRole: transformRole(currentUser.role || ''),
            dateAdded: DateHelper.Dates([new Date().toDateString()]).individual,
            newIndicatorsCount: quarterIndicators.length,
            indicatorsList: quarterIndicators,
          },
        );
      }
    }
    if (
      recipientsConfig.shouldNotifyTeamLead &&
      teamLeadDetail?.email &&
      teamLeadDetail.email !== currentUser.email
    ) {
      await EmailIndicatorTemplatesService.sendSuccessIndicatorsAdded(
        teamLeadDetail?.email,
        teamLeadDetail?.fullName,
        targetUser?.fullName,
        indicators,
        indicatorsUrl,
        {
          employeeRole: transformRole(targetUser.role || ''),
          quarter: `Q${quarter}`,
          year: year.toString(),
          addedByName: currentUser.fullName,
          addedByRole: transformRole(currentUser.role || ''),
          dateAdded: DateHelper.Dates([new Date().toDateString()]).individual,
          newIndicatorsCount: quarterIndicators.length,
          indicatorsList: quarterIndicators,
        },
      );
    }
    if (recipientsConfig.shouldNotifyCOO) {
      this.logger.log(
        `COO notification for ${targetUser.role} ${targetUser.fullName} indicators added`,
      );
    }
  }
  static async notifySuccessIndicatorsMoved(
    targetUser: UserPayload,
    currentUser: UserPayload,
    indicators: IIndicator[],
    fromQuarter: number,
    toQuarter: number,
    year: number,
    movedIndicators: IIndicator[],
  ): Promise<void> {
    const recipientsConfig = indicatorsRecipients(targetUser.role, currentUser.role);
    Logger.log('Indicators Move Recipients Config:', {
      targetUserRole: targetUser.role,
      assignerRole: currentUser.role,
      config: recipientsConfig,
    });
    let indicatorsUrl: string;
    let landDIndicatorsUrl: string;
    if (
      targetUser.role === Role.TEAM_LEAD ||
      DisplayRole.TEAM_LEAD ||
      targetUser.role === Role.COO ||
      DisplayRole.COO ||
      targetUser.role === Role.MEMBER ||
      DisplayRole.MEMBER
    ) {
      indicatorsUrl = DASHBOARD_URL;
    } else {
      indicatorsUrl = MISSION_STATEMENT_URL;
    }
    landDIndicatorsUrl = DASHBOARD_URL;
    if (recipientsConfig.shouldNotifyTrainer) {
      const executives = await this.getExecutives();
      const trainer = executives?.TRAINER;
      if (trainer?.email) {
        await EmailIndicatorTemplatesService.sendSuccessIndicatorsMoved(
          trainer.email,
          'L & D - Operations',
          targetUser.fullName,
          indicators,
          landDIndicatorsUrl,
          {
            employeeRole: transformRole(targetUser.role || ''),
            fromQuarter: `Q${fromQuarter}`,
            toQuarter: `Q${toQuarter}`,
            year: year.toString(),
            movedByName: currentUser.fullName,
            movedByRole: transformRole(currentUser.role || ''),
            dateMoved: DateHelper.Dates([new Date().toDateString()]).individual,
            movedIndicatorsCount: movedIndicators.length,
            movedIndicatorsList: movedIndicators,
          },
        );
      }
      if (recipientsConfig.shouldNotifyTargetUser && targetUser.email !== currentUser.email) {
        await EmailIndicatorTemplatesService.sendSuccessIndicatorsMoved(
          targetUser.email,
          targetUser.fullName,
          targetUser.fullName,
          indicators,
          indicatorsUrl,
          {
            employeeRole: transformRole(targetUser.role || ''),
            fromQuarter: `Q${fromQuarter}`,
            toQuarter: `Q${toQuarter}`,
            year: year.toString(),
            movedByName: currentUser.fullName,
            movedByRole: transformRole(currentUser.role || ''),
            dateMoved: DateHelper.Dates([new Date().toDateString()]).individual,
            movedIndicatorsCount: movedIndicators.length,
            movedIndicatorsList: movedIndicators,
          },
        );
      }
    }
  }
  static async notifySuccessIndicatorsDeleted(
    targetUser: UserPayload,
    currentUser: UserPayload,
    indicators: any[],
    quarter: number,
    year: number,
    deletedIndicators: any[],
  ): Promise<void> {
    const recipientsConfig = indicatorsRecipients(targetUser.role, currentUser.role);
    Logger.log('Indicators Delete Recipients Config:', {
      targetUserRole: targetUser.role,
      assignerRole: currentUser.role,
      config: recipientsConfig,
    });
    let indicatorsUrl: string;
    let landDIndicatorsUrl: string;
    if (
      targetUser.role === Role.TEAM_LEAD ||
      DisplayRole.TEAM_LEAD ||
      targetUser.role === Role.COO ||
      DisplayRole.COO ||
      targetUser.role === Role.MEMBER ||
      DisplayRole.MEMBER
    ) {
      indicatorsUrl = DASHBOARD_URL;
    } else {
      indicatorsUrl = MISSION_STATEMENT_URL;
    }
    landDIndicatorsUrl = DASHBOARD_URL;
    if (recipientsConfig.shouldNotifyTrainer) {
      const executives = await this.getExecutives();
      const trainer = executives?.TRAINER;
      if (trainer?.email) {
        await EmailIndicatorTemplatesService.sendSuccessIndicatorsDeleted(
          trainer.email,
          'Trainer - Operations',
          targetUser.fullName,
          indicators,
          landDIndicatorsUrl,
          {
            employeeRole: transformRole(targetUser.role || ''),
            quarter: `Q${quarter}`,
            year: year.toString(),
            deletedByName: currentUser.fullName,
            deletedByRole: transformRole(currentUser.role || ''),
            dateDeleted: DateHelper.Dates([new Date().toDateString()]).individual,
            deletedIndicatorsCount: deletedIndicators.length,
            deletedIndicatorsList: deletedIndicators,
          },
        );
      }
      if (recipientsConfig.shouldNotifyTargetUser && targetUser.email !== currentUser.email) {
        await EmailIndicatorTemplatesService.sendSuccessIndicatorsDeleted(
          targetUser.email,
          targetUser.fullName,
          targetUser.fullName,
          indicators,
          indicatorsUrl,
          {
            employeeRole: transformRole(targetUser.role || ''),
            quarter: `Q${quarter}`,
            year: year.toString(),
            deletedByName: currentUser.fullName,
            deletedByRole: transformRole(currentUser.role || ''),
            dateDeleted: DateHelper.Dates([new Date().toDateString()]).individual,
            deletedIndicatorsCount: deletedIndicators.length,
            deletedIndicatorsList: deletedIndicators,
          },
        );
      }
    }
  }
  static async notifySuccessIndicatorsDuplicated(
    targetUser: UserPayload,
    currentUser: UserPayload,
    indicators: IIndicator[],
    fromQuarter: number,
    toQuarter: number,
    year: number,
    originalIndicators: IIndicator[],
    duplicatedIndicators: IIndicator[],
  ): Promise<void> {
    const recipientsConfig = indicatorsRecipients(targetUser.role, currentUser.role);
    Logger.log('Indicators Duplicate Recipients Config:', {
      targetUserRole: targetUser.role,
      assignerRole: currentUser.role,
      config: recipientsConfig,
    });
    let indicatorsUrl: string;
    let landDIndicatorsUrl: string;
    if (
      targetUser.role === Role.TEAM_LEAD ||
      DisplayRole.TEAM_LEAD ||
      targetUser.role === Role.COO ||
      DisplayRole.COO ||
      targetUser.role === Role.MEMBER ||
      DisplayRole.MEMBER
    ) {
      indicatorsUrl = DASHBOARD_URL;
    } else {
      indicatorsUrl = MISSION_STATEMENT_URL;
    }
    landDIndicatorsUrl = DASHBOARD_URL;
    if (recipientsConfig.shouldNotifyTrainer) {
      const executives = await this.getExecutives();
      const trainer = executives?.TRAINER;
      if (trainer?.email) {
        await EmailIndicatorTemplatesService.sendSuccessIndicatorsDuplicated(
          trainer.email,
          'Trainer - Operations',
          targetUser.fullName,
          indicators,
          landDIndicatorsUrl,
          {
            employeeRole: transformRole(targetUser.role || ''),
            fromQuarter: `Q${fromQuarter}`,
            toQuarter: `Q${toQuarter}`,
            year: year.toString(),
            duplicatedByName: currentUser.fullName,
            duplicatedByRole: transformRole(currentUser.role || ''),
            dateDuplicated: DateHelper.Dates([new Date().toDateString()]).individual,
            duplicatedIndicatorsCount: duplicatedIndicators.length,
            originalIndicatorsList: originalIndicators,
            duplicatedIndicatorsList: duplicatedIndicators,
          },
        );
      }
      if (recipientsConfig.shouldNotifyTargetUser && targetUser.email !== currentUser.email) {
        await EmailIndicatorTemplatesService.sendSuccessIndicatorsDuplicated(
          targetUser.email,
          targetUser.fullName,
          targetUser.fullName,
          indicators,
          indicatorsUrl,
          {
            employeeRole: transformRole(targetUser.role || ''),
            fromQuarter: `Q${fromQuarter}`,
            toQuarter: `Q${toQuarter}`,
            year: year.toString(),
            duplicatedByName: currentUser.fullName,
            duplicatedByRole: transformRole(currentUser.role || ''),
            dateDuplicated: DateHelper.Dates([new Date().toDateString()]).individual,
            duplicatedIndicatorsCount: duplicatedIndicators.length,
            originalIndicatorsList: originalIndicators,
            duplicatedIndicatorsList: duplicatedIndicators,
          },
        );
      }
    }
  }
  static async notifySuccessIndicatorsSubmission(
    targetUser: UserPayload,
    assigner: UserPayload,
    indicators: IIndicator[],
    teamLeadDetail?: ProfileUser,
  ): Promise<void> {
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
    const currentYear = new Date().getFullYear();
    return this.notifySuccessIndicatorsAdded(
      targetUser,
      assigner,
      indicators,
      currentQuarter,
      currentYear,
      teamLeadDetail,
    );
  }
  static async notifySuccessIndicatorsUpdate(
    targetUser: UserPayload,
    assigner: UserPayload,
    indicators: IIndicator[],
    updatedQuarters: number[],
  ): Promise<void> {
    if (updatedQuarters.length >= 2) {
      return this.notifySuccessIndicatorsMoved(
        targetUser,
        assigner,
        indicators,
        updatedQuarters[0],
        updatedQuarters[updatedQuarters.length - 1],
        new Date().getFullYear(),
        indicators.filter((ind: any) => updatedQuarters.includes(ind.quarter)),
      );
    }
  }
}
