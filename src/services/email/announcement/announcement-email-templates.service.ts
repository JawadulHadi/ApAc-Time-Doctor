import { Logger } from '@nestjs/common';
import handlebars from 'handlebars';

import { Mail } from '../../../shared/utils/email.utils';
import { htmlAnnouncementEmail } from '../../../types/constants/emails/announcement-email.constants';
import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
import { ImageUrl } from '../../../types/constants/storage.constants';
import { IBaseUrl } from '../../../types/constants/url-tags.constants';
import { EmailResult } from '../../../types/interfaces/email.interface';
export async function announcementEmail(
  user: any,
  baseUrl: string,
  imageUrl?: string,
): Promise<boolean> {
  try {
    if (!user.email || !user.fullName) {
      Logger.warn(EMAIL_ERROR.INVALID_RECIPIENT + (user.fullName || 'Unknown'));
      return false;
    }
    Logger.log(`Preparing Mission Statement email for: ${user.email}`);
    const template = handlebars.compile(htmlAnnouncementEmail);
    const htmlContent = template({
      userName: user.fullName,
      dashboardUrl: baseUrl || IBaseUrl,
      currentYear: new Date().getFullYear(),
      imageUrl: imageUrl || ImageUrl,
    });
    const subject = 'Mission Statement 2026 - Now Available';
    const textVersion = `Hi ${user.fullName}, You can now review your Mission Statement for 2026 on your Dashboard. Please login to view it.`;
    const mail = new Mail(user.email, subject, textVersion, htmlContent);
    mail.sendMail();
    Logger.log(EMAIL_ERROR.SEND_SUCCESS + user.email);
    return true;
  } catch (error) {
    Logger.error(EMAIL_ERROR.SEND_FAILED + user.email, error);
    return false;
  }
}
export async function bulkAnnouncementEmails(
  users: any[],
  baseUrl: string,
  batchSize: number = 50,
  delayBetweenBatches: number = 1000,
  imageUrl?: string,
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
    Logger.log(`Starting bulk announcement email processing for ${validUsers.length} users.`);
    for (let i = 0; i < validUsers.length; i += batchSize) {
      const batch = validUsers.slice(i, i + batchSize);
      Logger.log(
        `Processing announcement batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(validUsers.length / batchSize)}`,
      );
      for (const user of batch) {
        const success = await announcementEmail(user, baseUrl, imageUrl);
        if (success) {
          result.successCount++;
        } else {
          result.failedCount++;
          result.failedEmails.push(user.email);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      if (i + batchSize < validUsers.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    result.totalProcessed = validUsers.length;
    Logger.log('Bulk announcement email processing completed.');
    return result;
  } catch (error) {
    Logger.error(EMAIL_ERROR.PROCESSING_BULK, error);
    throw error;
  }
}
