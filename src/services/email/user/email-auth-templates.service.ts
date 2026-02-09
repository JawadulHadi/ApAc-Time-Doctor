import { Injectable, Logger } from '@nestjs/common';
import handlebars from 'handlebars';
import { Types } from 'mongoose';

import { Mail } from '../../../shared/utils/email.utils';
import {
  htmlCreateUser,
  htmlResendActivation,
  htmlResetPassword,
} from '../../../types/constants/emails/user-creation-emails.constants';
import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
import { IBaseUrl, ICreatePasswordTag } from '../../../types/constants/url-tags.constants';
@Injectable()
export class EmailAuthTemplatesService {
  static sendActivationEmail(user: any, activationCode: string, userId: Types.ObjectId): void {
    try {
      const template = handlebars.compile(htmlCreateUser);
      const setPasswordUrl = IBaseUrl + ICreatePasswordTag + `${activationCode}/${userId}`;
      const applicantName =
        user?.profile?.fullName ||
        (user?.profile?.firstName || user?.profile?.lastName
          ? `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim()
          : user?.firstName || user?.lastName
            ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
            : user?.fullName || 'User');
      const sanitizedReplacements = {
        applicantName,
        applicantRole: user?.role || user?.profile?.role || 'User',
        url: setPasswordUrl,
        activationCode,
        emailSubject: 'APAC – Please set your password',
        generatedAt: new Date().toLocaleString(),
      };
      const htmlToSend = template(sanitizedReplacements);
      const newMail = new Mail(
        user.email,
        'APAC – Please set your password',
        'APAC – Please set your password',
        htmlToSend,
      );
      newMail.sendMail();
    } catch (emailError) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, emailError, 'ActivationEmail');
    }
  }
  static sendResendActivationEmail(
    user: any,
    activationCode: string,
    userId: Types.ObjectId | string,
    isReminder: boolean = true,
  ): void {
    try {
      const template = handlebars.compile(htmlResendActivation);
      const setPasswordUrl = IBaseUrl + ICreatePasswordTag + `${activationCode}/${userId}`;
      const applicantName =
        user?.profile?.fullName ||
        (user?.profile?.firstName || user?.profile?.lastName
          ? `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim()
          : user?.firstName || user?.lastName
            ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
            : user?.fullName || 'User');
      const sanitizedReplacements = {
        applicantName,
        applicantRole: user?.role || user?.profile?.role || 'User',
        url: setPasswordUrl,
        activationCode,
        emailSubject: isReminder
          ? 'APAC – Account Activation Reminder'
          : 'APAC – Please set your password',
        currentYear: new Date().getFullYear(),
      };
      const htmlToSend = template(sanitizedReplacements);
      const newMail = new Mail(
        user.email,
        isReminder ? 'APAC – Account Activation Reminder' : 'APAC – Please set your password',
        isReminder ? 'APAC – Account Activation Reminder' : 'APAC – Please set your password',
        htmlToSend,
      );
      newMail.sendMail();
    } catch (emailError) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, emailError, 'ResendActivationEmail');
    }
  }
  static sendPasswordReset(sanitizedReplacements: any, userEmail: string): void {
    try {
      if (!userEmail) {
        Logger.warn(' No user email provided, skipping password reset email');
        return;
      }
      const template = handlebars.compile(htmlResetPassword);
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(
        userEmail,
        'APAC - Reset Your Password',
        'Please reset your password to secure your account',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.warn(EMAIL_ERROR.SEND_FAILED + 'Reset Password');
      throw error;
    }
  }
}
