import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';

import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
import { IBaseUrl, IRestPasswordTag } from '../../../types/constants/url-tags.constants';
import { EmailAuthTemplatesService } from './email-auth-templates.service';
@Injectable()
export class EmailAuthService {
  static sendActivationEmail(user: any, activationCode: string, userId: Types.ObjectId): void {
    try {
      EmailAuthTemplatesService.sendActivationEmail(user, activationCode, userId);
    } catch (emailError) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, emailError);
    }
  }
  static sendResendActivationEmail(
    user: any,
    activationCode: string,
    userId: Types.ObjectId | string,
    isReminder: boolean = true,
  ): void {
    try {
      EmailAuthTemplatesService.sendResendActivationEmail(user, activationCode, userId, isReminder);
    } catch (emailError) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, emailError);
    }
  }
  static async sendPasswordResetEmail(user: any, resetCode: string): Promise<void> {
    try {
      const setPasswordUrl = IBaseUrl + IRestPasswordTag + `${resetCode}/${user._id}`;
      let applicantName = 'User';
      if (user?.profile?.fullName) {
        applicantName = user.profile?.fullName;
      } else if (user?.profile?.firstName) {
        applicantName = user.profile?.firstName;
      } else if (user?.profile?.lastName) {
        applicantName = user.profile?.lastName;
      } else if (user?.email) {
        applicantName = user.email.split('@')[0];
      }
      const replacements = {
        applicantName: applicantName,
        applicantRole: user?.profile?.role || user?.displayRole || 'User',
        userEmail: user.email,
        resetCode: resetCode,
        url: setPasswordUrl,
        emailSubject: 'APAC – Password Reset',
        currentYear: new Date().getFullYear(),
        supportEmail: 'support@agilebrains.com',
        companyName: 'APAC',
        expirationTime: '1 hour',
      };
      this.sendWithHandling(
        () => EmailAuthTemplatesService.sendPasswordReset(replacements, user.email),
        'Password Reset Email',
      );
    } catch (error) {
      Logger.warn(EMAIL_ERROR.INVALID_RECIPIENT, error);
    }
  }
  static sendWithHandling(emailFn: () => void, emailType: string): void {
    try {
      emailFn();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, emailType, error);
    }
  }
}
