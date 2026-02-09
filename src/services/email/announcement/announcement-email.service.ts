import { Injectable, Logger } from '@nestjs/common';

import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
import { EmailResult } from '../../../types/interfaces/email.interface';
import { bulkAnnouncementEmails } from './announcement-email-templates.service';
@Injectable()
export class AnnouncementEmailService {
  private readonly logger = new Logger(AnnouncementEmailService.name);
  async sendAnnouncementToAllUsers(
    users: any[],
    baseUrl: string,
    batchSize: number = 50,
    imageUrl?: string,
  ): Promise<EmailResult> {
    if (!users || users.length === 0) {
      this.logger.warn(EMAIL_ERROR.INVALID_RECIPIENT);
      return { successCount: 0, failedCount: 0, failedEmails: [], totalProcessed: 0 };
    }
    this.logger.log(`Initiating Mission Statement 2026 announcement for ${users.length} users.`);
    return await bulkAnnouncementEmails(users, baseUrl, batchSize, 1000, imageUrl);
  }
}
