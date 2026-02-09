import { Injectable, Logger } from '@nestjs/common';

import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
import { EmailRequestTemplatesService } from './email-request-templates.service';
import {
  approvalRecipients,
  creatorRecipients,
  disapprovalRecipients,
  validateTemplateVariables,
  withdrawalRecipients,
} from '@/shared/helpers/email.helper';
@Injectable()
export class EmailProcessService {
  static async sendRequest(templateVariables: any, userRole: string): Promise<void> {
    try {
      const normalizedUserRole = userRole?.toUpperCase().replace(/\s+/g, '_');
      Logger.log('EmailRequestService - Critical Info:', {
        inputUserRole: userRole,
        normalizedUserRole: normalizedUserRole,
        currentStage: templateVariables.currentStage,
        applicantFullName: templateVariables.applicantFullName,
        teamLeadFullName: templateVariables.teamLeadFullName,
        approverFullName: templateVariables.approverFullName,
        approverRole: templateVariables.approverRole,
      });
      this.sendWithHandling(
        () => EmailRequestTemplatesService.sendRequestAcknowledgment(templateVariables),
        'Acknowledgment Email to Requester',
      );
      const approverConfig = creatorRecipients(normalizedUserRole);
      Logger.log('Final approverConfig:', approverConfig);
      if (approverConfig.shouldNotifyTeamLead) {
        const teamLeadRecipientEmail = templateVariables.teamLeadEmail;
        Logger.log('Sending to Team Lead:', {
          recipientEmail: teamLeadRecipientEmail,
          teamLeadFullName: templateVariables.teamLeadFullName,
          userRole: normalizedUserRole,
        });
        if (teamLeadRecipientEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendRequestTl(templateVariables),
            'Creation Email to Team Lead',
          );
        }
      }
      if (approverConfig.shouldNotifyCOO) {
        const cooRecipientEmail = templateVariables.approverEmail;
        Logger.log('Sending to COO:', {
          recipientEmail: cooRecipientEmail,
          approverFullName: templateVariables.approverFullName,
          approverRole: templateVariables.approverRole,
          userRole: normalizedUserRole,
        });
        if (cooRecipientEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendRequestCoo(templateVariables),
            'Creation Email to COO',
          );
        }
      }
      if (approverConfig.shouldNotifySuperAdmin) {
        const superAdminRecipientEmail = templateVariables.approverEmail;
        Logger.log('Sending to Super Admin:', {
          recipientEmail: superAdminRecipientEmail,
          approverFullName: templateVariables.approverFullName,
          approverRole: templateVariables.approverRole,
          userRole: normalizedUserRole,
        });
        if (superAdminRecipientEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendRequestSa(templateVariables),
            'Creation Email to Super Admin',
          );
        }
      }
    } catch (error) {
      Logger.error('Error in Email Handling For Request Creation:', error);
      throw error;
    }
  }
  static async sendRemarksEmails(templateVariables: any): Promise<void> {
    try {
      this.sendWithHandling(
        () => EmailRequestTemplatesService.sendHRRemarks(templateVariables),
        'HR Remarks Email',
      );
    } catch (error) {
      Logger.error('Error in Email Handling For Remarks:', error);
      throw error;
    }
  }
  static async sendApproval(
    replacements: any,
    userRole: string,
    approvedByRole: string,
  ): Promise<void> {
    try {
      const sanitizedReplacements = validateTemplateVariables(replacements);
      Logger.log(EMAIL_ERROR.PROCESSING, {
        applicantFullName: sanitizedReplacements.applicantFullName,
        applicantEmail: sanitizedReplacements.applicantEmail,
        applicantDepartment: sanitizedReplacements.applicantDepartment,
        teamLeadFullName: sanitizedReplacements.teamLeadFullName,
        teamLeadEmail: sanitizedReplacements.teamLeadEmail,
      });
      const recipientsConfig = approvalRecipients(userRole, approvedByRole);
      Logger.log(EMAIL_ERROR.PREPARING, recipientsConfig);
      if (recipientsConfig.shouldNotifyRequester && sanitizedReplacements.applicantEmail) {
        this.sendWithHandling(
          () => EmailRequestTemplatesService.sendApprovalRequester(sanitizedReplacements),
          'Applicant Approval Email',
        );
      }
      if (recipientsConfig.shouldNotifyTeamLead && sanitizedReplacements.teamLeadEmail) {
        this.sendWithHandling(
          () => EmailRequestTemplatesService.sendApprovalTL(sanitizedReplacements),
          'Team Lead Approval Email',
        );
      }
      if (recipientsConfig.shouldNotifyCOO) {
        if (sanitizedReplacements.cooEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendApprovalCoo(sanitizedReplacements),
            'COO Approval Email',
          );
        } else {
          Logger.warn(EMAIL_ERROR.SEND_FAILED + sanitizedReplacements.cooEmail);
        }
      }
      if (recipientsConfig.shouldNotifySuperAdmin) {
        if (sanitizedReplacements.superAdminEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendApprovalSa(sanitizedReplacements),
            'Super Admin Approval Email',
          );
        } else {
          Logger.warn(EMAIL_ERROR.SEND_FAILED + sanitizedReplacements.superAdminEmail);
        }
      }
      if (recipientsConfig.shouldNotifyAdmin) {
        if (sanitizedReplacements.adminEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendApprovalAdmin(sanitizedReplacements),
            'Admin Notification Email',
          );
        } else {
          Logger.warn(EMAIL_ERROR.SEND_FAILED + sanitizedReplacements.adminEmail);
        }
      }
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, error);
    }
  }
  static async sendDisapproval(
    replacements: any,
    userRole: string | any,
    disapprovedByRole: string,
  ): Promise<void> {
    try {
      const recipientsConfig = disapprovalRecipients(userRole, disapprovedByRole);
      Logger.log(EMAIL_ERROR.PREPARING, recipientsConfig);
      if (recipientsConfig.shouldNotifyRequester) {
        this.sendWithHandling(
          () => EmailRequestTemplatesService.sendRejectionRequester(replacements),
          'Applicant Disapproval Email',
        );
        if (recipientsConfig.shouldNotifyAdmin) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendRejectionAdmin(replacements),
            'Admin Disapproval Email',
          );
        }
      }
      if (recipientsConfig.shouldNotifyTeamLead) {
        this.sendWithHandling(
          () => EmailRequestTemplatesService.sendRejectionTL(replacements),
          'Team Lead Disapproval Email',
        );
      }
      if (recipientsConfig.shouldNotifyCOO) {
        this.sendWithHandling(
          () => EmailRequestTemplatesService.sendRejectionCoo(replacements),
          'COO Disapproval Email',
        );
      }
      if (recipientsConfig.shouldNotifySuperAdmin) {
        this.sendWithHandling(
          () => EmailRequestTemplatesService.sendRejectionSa(replacements),
          'Super Admin Disapproval Email',
        );
      }
    } catch {
      Logger.error(EMAIL_ERROR.SEND_FAILED);
    }
  }
  static async sendWithdrawal(
    replacements: any,
    userRole: string | any,
    withdrawnByRole: string,
  ): Promise<void> {
    try {
      const sanitized = validateTemplateVariables(replacements);
      const recipientsConfig = withdrawalRecipients(userRole, withdrawnByRole);
      Logger.log(EMAIL_ERROR.PREPARING, {
        applicantEmail: sanitized.applicantEmail,
        teamLeadEmail: sanitized.teamLeadEmail,
        withdrawnByRole,
        recipientsConfig,
      });
      if (recipientsConfig.shouldNotifyRequester && sanitized.applicantEmail) {
        this.sendWithHandling(
          () => EmailRequestTemplatesService.sendWithdrawalRequester(sanitized),
          'Applicant Withdrawal Email',
        );
      }
      if (recipientsConfig.shouldNotifyTeamLead && sanitized.teamLeadEmail) {
        this.sendWithHandling(
          () => EmailRequestTemplatesService.sendWithdrawalTL(sanitized),
          'Team Lead Withdrawal Email',
        );
      }
      if (recipientsConfig.shouldNotifyCOO) {
        if (sanitized.cooEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendWithdrawalCoo?.(sanitized),
            'COO Withdrawal Email',
          );
        } else {
          Logger.warn(EMAIL_ERROR.SEND_FAILED + sanitized.cooEmail);
        }
      }
      if (recipientsConfig.shouldNotifySuperAdmin) {
        if (sanitized.superAdminEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendWithdrawalSa?.(sanitized),
            'Super Admin Withdrawal Email',
          );
        } else {
          Logger.warn(EMAIL_ERROR.SEND_FAILED + sanitized.superAdminEmail);
        }
      }
      if (recipientsConfig.shouldNotifyAdmin) {
        if (sanitized.adminEmail) {
          this.sendWithHandling(
            () => EmailRequestTemplatesService.sendWithdrawalAdmin?.(sanitized),
            'Admin Withdrawal Email',
          );
        } else {
          Logger.warn(EMAIL_ERROR.SEND_FAILED + sanitized.adminEmail);
        }
      }
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, error);
    }
  }
  static sendWithHandling(emailFn: () => void, emailType: string): void {
    try {
      emailFn();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + emailType, error);
      Logger.warn(EMAIL_ERROR.PROCESSING_FAILED + emailType);
    }
  }
}
