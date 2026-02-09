import { Injectable, Logger } from '@nestjs/common';

import { AnnouncementEmailService } from '../../services/email/announcement/announcement-email.service';
import { IBaseUrl } from '../../types/constants/url-tags.constants';
import { EmailResult } from '../../types/interfaces/email.interface';
import { UserService } from '../user/user.service';
@Injectable()
export class AnnouncementService {
  private readonly logger = new Logger(AnnouncementService.name);
  constructor(
    private readonly userService: UserService,
    private readonly announcementEmailService: AnnouncementEmailService,
  ) {}
  /**
   * Sends a bulk email announcement to all users about the Mission Statement 2026 feature.
   * @returns Promise with the result of the bulk email operation
   */
  async sendAnnouncementToAllUsers(): Promise<EmailResult> {
    const allUsers = await this.userService.getAllUsers();
    this.logger.log(`Fetching all users for announcement. Count: ${allUsers.length}`);
    const url = IBaseUrl;
    return await this.announcementEmailService.sendAnnouncementToAllUsers(allUsers, url);
  }
}
