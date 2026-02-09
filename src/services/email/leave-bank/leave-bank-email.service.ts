import { Injectable, Logger } from '@nestjs/common';

import { ATTENDANCE, EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
import { EmailRecipients, EmailResult } from '../../../types/interfaces/email.interface';
import { leaveBankTemplates, notifyAllUsers } from './leave-bank-email-templates.service';
@Injectable()
export class LeaveBankEmailService {
  private readonly logger = new Logger(LeaveBankEmailService.name);
  async EmailsToAllUsers(
    leaveBankData: any[],
    baseUrl?: string | any,
    batchSize?: number,
    month?: string,
    year?: string,
  ): Promise<EmailResult> {
    const recipients = this.recipientsFromLeaveBank(leaveBankData);
    if (recipients.length === 0) {
      this.logger.warn(EMAIL_ERROR.INVALID_RECIPIENT);
      return { successCount: 0, failedCount: 0, failedEmails: [], totalProcessed: 0 };
    }
    this.logger.log(EMAIL_ERROR.PROCESSING + recipients.length);
    return await notifyAllUsers(recipients, baseUrl, batchSize, 1000, month, year);
  }
  async EmailToUser(
    userData: any,
    baseUrl?: string | any,
    month?: string,
    year?: string,
  ): Promise<boolean> {
    const recipient = this.singleRecipient(userData);
    if (!recipient.email || !recipient.fullName) {
      this.logger.warn(EMAIL_ERROR.INVALID_NOTIFICATION_ID);
      return false;
    }
    return await leaveBankTemplates(recipient, baseUrl, month, year);
  }
  async emailsToEmployees(
    employeeIds: string[],
    leaveBankRecords: any[],
    baseUrl?: string,
    batchSize?: number,
    month?: string,
    year?: string,
  ): Promise<EmailResult> {
    const targetRecords = leaveBankRecords.filter(
      record =>
        employeeIds.includes(record.employeeId) || employeeIds.includes(record.user?.employeeId),
    );
    if (targetRecords.length === 0) {
      this.logger.warn(ATTENDANCE.EMPLOYEE_NOT_FOUND + employeeIds.join(', '));
      return { successCount: 0, failedCount: 0, failedEmails: [], totalProcessed: 0 };
    }
    this.logger.log(EMAIL_ERROR.PROCESSING + targetRecords.length);
    return await this.EmailsToAllUsers(targetRecords, baseUrl, batchSize, month, year);
  }
  private recipientsFromLeaveBank(leaveBankData: any[]): EmailRecipients[] {
    return leaveBankData
      .filter(record => {
        const email = record.user?.email || record.email;
        return !!email;
      })
      .map(record => this.singleRecipient(record));
  }
  async emailToEmployee(
    employeeId: string,
    leaveBankRecords: any[],
    baseUrl?: string | any,
    month?: string,
    year?: string,
  ): Promise<boolean> {
    const userRecord = leaveBankRecords.find(
      record => record.employeeId === employeeId || record.user?.employeeId === employeeId,
    );
    if (!userRecord) {
      this.logger.warn(ATTENDANCE.EMPLOYEE_NOT_FOUND + employeeId);
      return false;
    }
    const recipient = this.singleRecipient(userRecord);
    if (month) {
      recipient.currentMonth = month;
    }
    return await leaveBankTemplates(recipient, baseUrl, month, year);
  }
  private singleRecipient(userData: any): any & { currentMonth?: string } {
    const profile = userData.profile || userData.user?.profile || userData.user || {};
    const userObj = userData.user || {};
    const department =
      userData.department?.name ||
      userData.department ||
      profile.department?.name ||
      userObj.department?.name ||
      null;
    const firstName =
      userData.firstName ||
      profile.firstName ||
      userObj.fullName ||
      (userData.name ? userData.name.split(' ')[0] : null);
    const lastName =
      userData.lastName ||
      profile.lastName ||
      userObj.lastName ||
      (userData.name ? userData.name.split(' ').slice(1).join(' ') : null);
    const fullName =
      userData.fullName ||
      profile.fullName ||
      userObj.fullName ||
      userData.name ||
      `${firstName ?? ''} ${lastName ?? ''}`.trim();
    const role = userData.role || profile.role || userObj.role;
    const tlEmail = userObj.department?.teamLeadDetail?.email || null;
    return {
      email: userData.email || profile.email || userObj.email,
      fullName,
      firstName,
      lastName,
      employeeId: userData.employeeId || profile.employeeId || userObj.employeeId,
      department,
      designation: userData.designation || profile.designation || userObj.designation,
      role: role,
      tlEmail: tlEmail,
    };
  }
}
