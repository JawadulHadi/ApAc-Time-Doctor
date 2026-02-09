import { Module } from '@nestjs/common';

import { AnnouncementEmailService } from '../../services/email/announcement/announcement-email.service';
import { UserModule } from '../user/user.module';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
@Module({
  imports: [UserModule],
  providers: [AnnouncementService, AnnouncementEmailService],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}
