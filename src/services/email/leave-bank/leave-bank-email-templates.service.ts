import { Logger } from '@nestjs/common';
import handlebars from 'handlebars';

import { Mail } from '../../../shared/utils/email.utils';
import {
  htmlLeaveBankNotification_Member,
  htmlLeaveBankNotification_TeamLead,
} from '../../../types/constants/emails/leave-bank-emails.constants';
import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
import { ILeaveBankTag, leadLbUrL } from '../../../types/constants/url-tags.constants';
import { DisplayRole, Role } from '../../../types/enums/role.enums';
import { EmailResult } from '../../../types/interfaces/email.interface';
import { UserPayload } from '../../../types/interfaces/jwt.interface';
export async function leaveBankTemplates(
  user: UserPayload,
  baseUrl: string,
  month?: string,
  year?: string,
): Promise<boolean> {
  try {
    if (!user.email || !user.fullName) {
      Logger.warn(EMAIL_ERROR.INVALID_RECIPIENT + user.fullName);
      return false;
    }
    const userRole = user.role || user.displayRole || Role.MEMBER;
    Logger.log(EMAIL_ERROR.PREPARING + userRole + ' - ' + user.email);
    Logger.log(user.fullName + ' ' + userRole);
    const isTeamLead = [Role.COO, Role.TEAM_LEAD, DisplayRole.TEAM_LEAD].includes(userRole as Role);
    const urlTag = isTeamLead ? leadLbUrL : ILeaveBankTag;
    const dashboardUrl = baseUrl + urlTag;
    const selectedTemplate = isTeamLead
      ? htmlLeaveBankNotification_TeamLead
      : htmlLeaveBankNotification_Member;
    const currentMonth = month
      ? month.charAt(0).toUpperCase() + month.slice(1)
      : new Date().toLocaleString('default', { month: 'long' });
    const currentYear = year || new Date().getFullYear().toString();
    const selectedMonths = month ? `${currentMonth} ${currentYear}` : currentYear;
    const template = handlebars.compile(selectedTemplate);
    const htmlContent = template({
      employeeName: user.fullName,
      currentMonth: month,
      currentYear: year,
      selectedMonths: selectedMonths,
      BaseUrl: baseUrl,
      dashboardUrl: dashboardUrl,
      tlEmail: user.department?.teamLeadDetail?.email,
    });
    const subject = [Role.COO, Role.TEAM_LEAD, DisplayRole.TEAM_LEAD].includes(userRole as Role)
      ? `Leave Bank Update: ${selectedMonths} - ${user.fullName}`
      : `Leave Bank Update: ${selectedMonths} - ${user.fullName}`;
    const textVersion = [Role.COO, Role.TEAM_LEAD, DisplayRole.TEAM_LEAD].includes(userRole as Role)
      ? `Dear ${user.fullName}, please review your and your team's leave balance for ${currentMonth}. Contact Admin if any discrepancies are found. Please check the Leave Bank for more details.`
      : `Dear ${user.fullName}, please review your leave balance for ${currentMonth}. Contact Admin if any discrepancies are found. Please check the Leave Bank for more details.`;
    const mail = new Mail(user.email, subject, textVersion, htmlContent);
    mail.sendMail();
    Logger.log(EMAIL_ERROR.SEND_SUCCESS + user.email);
    return true;
  } catch (error) {
    Logger.error(EMAIL_ERROR.SEND_FAILED + user.email);
    return false;
  }
}
export async function notifyAllUsers(
  users: any[],
  baseUrl: string,
  batchSize: number = 100,
  delayBetweenBatches: number = 1000,
  month?: string,
  year?: string,
): Promise<EmailResult> {
  const result: EmailResult = {
    successCount: 0,
    failedCount: 0,
    failedEmails: [],
    totalProcessed: 0,
  };
  try {
    const validUsers = users.filter(
      user => user.email && user.fullName && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim()),
    );
    const roleCounts: Record<string, number> = {};
    users.forEach((user: any) => {
      const role = user.role || 'UNKNOWN';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    Logger.log('Role distribution in bulk email:', roleCounts);
    Logger.log(EMAIL_ERROR.PREPARING + validUsers.length);
    for (let i = 0; i < validUsers.length; i += batchSize) {
      const batch = validUsers.slice(i, i + batchSize);
      Logger.log(
        EMAIL_ERROR.PROCESSING +
          Math.floor(i / batchSize) +
          1 / Math.ceil(validUsers.length / batchSize),
      );
      for (const user of batch) {
        const success = await leaveBankTemplates(user, baseUrl, month, year);
        if (success) {
          result.successCount++;
        } else {
          result.failedCount++;
          result.failedEmails.push(user.email);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      if (i + batchSize < validUsers.length) {
        Logger.log(EMAIL_ERROR.PROCESSING_FAILED);
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    Logger.log(EMAIL_ERROR.PROCESSING_DONE);
    return result;
  } catch (error) {
    Logger.error(EMAIL_ERROR.PROCESSING_BULK, error);
    throw error;
  }
}
