import { Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiResponseDto,
} from '../../core/decorators/api-response.decorators';
import { GetUser } from '../../core/decorators/get-user.decorators';
import { USER } from '../../types/constants/error-messages.constants';
import { EmailResult } from '../../types/interfaces/email.interface';
import * as jwtInterface from '../../types/interfaces/jwt.interface';
import { AnnouncementService } from './announcement.service';
@ApiTags('announcement')
@ApiBearerAuth('jwt-auth')
@Controller('announcement')
@UseGuards(AuthGuard('jwt'))
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}
  @Post('all')
  @ApiOperation({
    summary: 'Send Mission Statement 2026 Announcement to All Users',
    description:
      'Triggers a bulk email to all users announcing the Mission Statement 2026 feature.',
  })
  @ApiCreatedResponse('Announcement Emails Initiated Successfully')
  @ApiForbiddenResponse('Insufficient Permissions')
  async sendAnnouncement(
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<EmailResult>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    const result = await this.announcementService.sendAnnouncementToAllUsers();
    return ApiResponseDto.success(result, 'Mission Statement Announcement Emails Initiated');
  }
}
