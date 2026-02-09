import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ReviewMissionStatementDto } from '../../../modules/profile/dto/profile.dto';
import { ProfileUser } from '../../../modules/profile/schemas/profiles.schema';
import { UserService } from '../../../modules/user/user.service';
import { statementRecipients } from '../../../shared/helpers/email.helper';
import { DateHelper } from '../../../shared/helpers/format-Dates.helper';
import { transformRole } from '../../../shared/utils/unified-transform.utils';
import { DASHBOARD_URL, MISSION_STATEMENT_URL } from '../../../types/constants/url-tags.constants';
import { IStatementStatus } from '../../../types/enums/profile.enums';
import { DisplayRole, Role } from '../../../types/enums/role.enums';
import { UserPayload } from '../../../types/interfaces/jwt.interface';
import { EmailStatementTemplatesService } from './email-statement-templates.service';

@Injectable()
export class EmailstatementService {
  private static logger = new Logger(EmailstatementService.name);
  private static userService: UserService;
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    EmailstatementService.userService = this.userService;
  }
  /**
   * Validate submission input parameters for mission statement
   * @param user - User payload containing user information
   * @param content - Mission statement content to validate
   * @param reviewer - Optional reviewer information
   * @throws Error when validation fails
   * @returns void
   */
  private static validateSubmissionInput(
    user: UserPayload,
    content: string,
    reviewer?: ProfileUser | null,
  ): void {
    if (!user) {
      throw new Error('User is required');
    }
    if (!user.email) {
      throw new Error('User email is required');
    }
    if (!user.profile?.fullName) {
      throw new Error('User full name is required');
    }
    if (!content || content.trim().length === 0) {
      throw new Error('Mission statement content is required');
    }
    if (reviewer && !reviewer.email) {
      throw new Error('Reviewer email is required when reviewer is provided');
    }
  }
  /**
   * Map and find appropriate reviewer based on submitter role
   * @param submitterRole - Role of the person submitting the mission statement
   * @param submitterUser - Optional user payload for additional context
   * @returns Promise<ProfileUser | null> - Reviewer information or null if not found
   * @throws Error when reviewer mapping fails
   */
  private static async mapReviewer(
    submitterRole: Role,
    submitterUser?: UserPayload,
  ): Promise<ProfileUser | null> {
    try {
      if (!this.userService) {
        this.logger.log('UserService not available for finding reviewer');
        return null;
      }
      const targetRole = this.mapReviewerRole(submitterRole);
      const executives = await this.userService.fetchExecutives();
      let executive: ProfileUser | null = null;
      switch (targetRole) {
        case Role.TEAM_LEAD:
          if (submitterUser?.department?.teamLeadDetail) {
            executive = {
              userId: submitterUser?.department?.teamLeadDetail?.userId,
              email: submitterUser?.department?.teamLeadDetail?.email,
              fullName: submitterUser?.department?.teamLeadDetail?.fullName,
              role: submitterUser?.department?.teamLeadDetail?.role,
            };
          }
          break;
        case Role.TRAINER:
          executive = executives.TRAINER;
          break;
        case Role.COO:
          executive = executives.COO;
          break;
        default:
          executive = executives.TRAINER;
      }
      if (executive?.email) {
        this.logger.log(`Found reviewer with role ${targetRole}: ${executive.fullName}`);
        return {
          email: executive.email,
          fullName: executive.fullName,
          role: targetRole,
        } as unknown as ProfileUser;
      }
      this.logger.log(`No reviewer found for role: ${targetRole}`);
      return null;
    } catch (error) {
      this.logger.log('Error finding reviewer:', error);
      return null;
    }
  }
  /**
   * Determine the appropriate reviewer role based on submitter role
   * @param submitterRole - Role of the person submitting the mission statement
   * @returns Role - The role that should review the submission
   */
  private static mapReviewerRole(submitterRole: Role): Role {
    if (submitterRole === Role.MEMBER) {
      return Role.TEAM_LEAD;
    } else if (submitterRole === Role.TEAM_LEAD) {
      return Role.TRAINER;
    } else if (submitterRole === Role.COO) {
      return Role.TRAINER;
    }
    return Role.TRAINER;
  }
  /**
   * Send mission statement submission notifications to all relevant parties
   * @param user - User payload of the person submitting the statement
   * @param content - Mission statement content
   * @param reviewer - Optional reviewer information
   * @param conService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when notification sending fails
   */
  static async notifyStatement(
    user: UserPayload,
    content: string,
    reviewer?: ProfileUser | null,
    conService?: ConfigService,
  ): Promise<void> {
    this.validateSubmissionInput(user, content, reviewer);
    const recipientsConfig = statementRecipients(user.role);
    Logger.log('Mission Statement Recipients Config:', {
      submitterRole: user.role,
      config: recipientsConfig,
      reviewer,
    });
    let actualReviewer = reviewer;
    let reviewerRoleForLogic = actualReviewer?.role;
    if (!actualReviewer) {
      reviewerRoleForLogic = recipientsConfig.nextReviewerRole;
      actualReviewer = await this.mapReviewer(user.role, user);
    }
    const applicantStatementUrl = DASHBOARD_URL;
    const reviewerStatementUrl = MISSION_STATEMENT_URL;
    await EmailStatementTemplatesService.sendStatementAcknowledgement(
      user.email,
      user?.profile?.fullName ?? '',
      content,
      applicantStatementUrl,
      {
        applicantRole: transformRole(user.role ?? ''),
        applicantDepartment: user.department?.name ?? '',
        submissionDate: DateHelper.Dates([new Date()]).individual,
        reviewerName: actualReviewer?.fullName ?? '',
        reviewerRole: transformRole(reviewerRoleForLogic ?? ''),
      },
      conService,
    );
    if (recipientsConfig.shouldNotifyTrainer && user.role === Role.MEMBER) {
      if (!EmailstatementService.userService) {
        this.logger.error('UserService not available in static context');
        return;
      }
      const executives = await EmailstatementService.userService.fetchExecutives();
      await EmailStatementTemplatesService.sendStatementSubmitted(
        executives.TRAINER?.email,
        'Trainer - Operations',
        user?.profile?.fullName || '',
        content,
        MISSION_STATEMENT_URL,
        {
          applicantRole: transformRole(user.role || ''),
          applicantDepartment: user?.department?.name || '',
          submissionDate: DateHelper.Dates([new Date()]).individual,
          reviewerName: actualReviewer?.fullName || '',
          reviewerRole: transformRole(reviewerRoleForLogic || ''),
        },
        conService,
      );
    }
    if (actualReviewer?.email) {
      await EmailStatementTemplatesService.sendStatementReviewRequest(
        actualReviewer?.email,
        actualReviewer?.fullName,
        user?.profile?.fullName || '',
        content,
        reviewerStatementUrl,
        {
          applicantRole: transformRole(user.role || ''),
          applicantDepartment: user?.department?.name || '',
          submissionDate: DateHelper.Dates([new Date()]).individual,
        },
        conService,
      );
    }
    if (recipientsConfig.shouldNotifyTeamLead && user.role === Role.TEAM_LEAD) {
      await this.sendCOONotification(user, content, conService);
    }
  }
  /**
   * Send review decision notifications to applicant and relevant parties
   * @param user - User payload of the applicant whose statement was reviewed
   * @param dto - Review mission statement DTO containing decision and feedback
   * @param currentUser - User payload of the person who made the review decision
   * @param missionStatement - Mission statement document with all versions
   * @param conService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when notification sending fails
   */
  static async notifyReviewDecision(
    user: UserPayload,
    dto: ReviewMissionStatementDto,
    currentUser: UserPayload,
    missionStatement: any,
    conService?: ConfigService,
  ): Promise<void> {
    const applicantStatementUrl = DASHBOARD_URL;
    const landDStatementUrl = MISSION_STATEMENT_URL;
    const latestStatement = missionStatement.statements[missionStatement.statements.length - 1];
    const status = dto.status;
    if (status === IStatementStatus.APPROVED) {
      await EmailStatementTemplatesService.sendMissionStatementApproved(
        user.email,
        user?.profile?.fullName || '',
        latestStatement.content,
        currentUser.profile?.fullName || '',
        currentUser.role || '',
        DateHelper.Dates([new Date()]).individual,
        applicantStatementUrl,
        {
          applicantRole: transformRole(user.role || ''),
          applicantDepartment: user.department?.name || '',
        },
        conService,
      );
      if (user.role === Role.MEMBER) {
        const executives = await EmailstatementService.userService.fetchExecutives();
        await EmailStatementTemplatesService.sendMissionStatementApprovedLAndD(
          executives.TRAINER?.email,
          user?.profile?.fullName || '',
          latestStatement.content,
          currentUser.profile?.fullName || '',
          currentUser.role || '',
          DateHelper.Dates([new Date()]).individual,
          landDStatementUrl,
          {
            applicantRole: transformRole(user.role || ''),
            applicantDepartment: user.department?.name || '',
          },
          conService,
        );
      } else {
        const isReviewerLAndD =
          currentUser.role === Role.TRAINER ||
          currentUser.role === DisplayRole.TRAINER ||
          currentUser.role === Role.COO ||
          currentUser.role === DisplayRole.COO ||
          currentUser.role === Role.TEAM_LEAD ||
          currentUser.role === DisplayRole.TEAM_LEAD;
        if (!isReviewerLAndD) {
          await EmailStatementTemplatesService.sendMissionStatementApprovedLAndD(
            undefined,
            user?.profile?.fullName || '',
            latestStatement.content,
            currentUser.profile?.fullName || '',
            currentUser.role || '',
            DateHelper.Dates([new Date()]).individual,
            landDStatementUrl,
            {
              applicantRole: transformRole(user.role || ''),
              applicantDepartment: user.department?.name || '',
            },
            conService,
          );
        }
      }
    } else if (status === IStatementStatus.SUGGEST_CHANGES) {
      await EmailStatementTemplatesService.sendMissionStatementSuggestChanges(
        user.email,
        user.profile?.fullName || '',
        latestStatement.content,
        dto.changesRequired || '',
        currentUser.profile?.fullName || '',
        currentUser.role || '',
        DateHelper.Dates([new Date()]).individual,
        applicantStatementUrl,
        {
          applicantRole: transformRole(user.role || ''),
          applicantDepartment: user.department?.name || '',
        },
        conService,
      );
      if (user.role === Role.MEMBER) {
        const executives = await EmailstatementService.userService.fetchExecutives();
        await EmailStatementTemplatesService.sendMissionStatementSuggestChangesLAndD(
          executives.TRAINER?.email,
          user?.profile?.fullName || '',
          latestStatement.content,
          dto.changesRequired || '',
          currentUser.profile?.fullName || '',
          currentUser.role || '',
          DateHelper.Dates([new Date()]).individual,
          landDStatementUrl,
          {
            applicantRole: transformRole(user.role || ''),
            applicantDepartment: user.department?.name || '',
          },
          conService,
        );
      } else {
        const isReviewerLAndD =
          currentUser.role === Role.TRAINER || currentUser.role === DisplayRole.TRAINER;
        if (!isReviewerLAndD) {
          await EmailStatementTemplatesService.sendMissionStatementSuggestChangesLAndD(
            undefined,
            user?.profile?.fullName || '',
            latestStatement.content,
            dto.changesRequired || '',
            currentUser.profile?.fullName || '',
            currentUser.role || '',
            DateHelper.Dates([new Date()]).individual,
            landDStatementUrl,
            {
              applicantRole: transformRole(user.role || ''),
              applicantDepartment: user.department?.name || '',
            },
            conService,
          );
        }
      }
    }
  }
  /**
   * Send COO notification for Team Lead mission statement submissions
   * @param user - User payload of the Team Lead who submitted the statement
   * @param content - Mission statement content
   * @param conService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when COO notification fails
   */
  private static async sendCOONotification(
    user: UserPayload,
    content: string,
    conService?: ConfigService,
  ): Promise<void> {
    try {
      const executives = await this.userService?.fetchExecutives();
      const coo = executives?.COO;
      if (coo?.email) {
        await EmailStatementTemplatesService.sendStatementReviewRequest(
          coo.email,
          coo.fullName,
          user?.profile?.fullName || '',
          content,
          MISSION_STATEMENT_URL,
          {
            applicantRole: transformRole(user.role || ''),
            applicantDepartment: user.department?.name || '',
            submissionDate: DateHelper.Dates([new Date()]).individual,
          },
          conService,
        );
        this.logger.log(
          `COO notification sent to ${coo.fullName} for Team Lead ${user.profile?.fullName}`,
        );
      } else {
        this.logger.log('No COO found in the system to send notification');
      }
    } catch (error) {
      this.logger.log('Error sending COO notification:', error);
    }
  }
}
