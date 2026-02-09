import { Injectable, Logger } from '@nestjs/common';

import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
import { EmailProcessService } from './email-request-process.service';
@Injectable()
export class EmailService {
  static async sendRequest(templateVariables: any, userRole: string): Promise<void> {
    return EmailProcessService.sendRequest(templateVariables, userRole);
  }
  static async sendRemarks(templateVariables: any): Promise<void> {
    return EmailProcessService.sendRemarksEmails(templateVariables);
  }
  static async sendApproval(
    replacements: any,
    userRole: string,
    approvedByRole: string,
  ): Promise<void> {
    return EmailProcessService.sendApproval(replacements, userRole, approvedByRole);
  }
  static async sendDisapproval(
    replacements: any,
    userRole: string,
    disapprovedByRole: string,
  ): Promise<void> {
    return EmailProcessService.sendDisapproval(replacements, userRole, disapprovedByRole);
  }
  static async sendWithdrawal(
    replacements: any,
    userRole: string,
    withdrawnByRole: string,
  ): Promise<void> {
    return EmailProcessService.sendWithdrawal(replacements, userRole, withdrawnByRole);
  }
  static async checkEmailServiceHealth(): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      Logger.error(EMAIL_ERROR.CHANNEL_UNAVAILABLE, error);
      return false;
    }
  }
}
