import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { ApiResponseDto, ApiUserResponse } from '../../core/decorators/api-response.decorators';
import { GetUser } from '../../core/decorators/get-user.decorators';
import { USER } from '../../types/constants/error-messages.constants';
import { maxFileSize } from '../../types/enums/doc.enums';
import * as jwtInterface from '../../types/interfaces/jwt.interface';
import { IProfileResponse, IQuarter } from '../../types/interfaces/statement.interface';
import {
  CreateStatementDto,
  ReviewMissionStatementDto,
  SubmissionQuarterDto,
  UpdateProfileDto,
} from './dto/profile.dto';
import { ProfileService } from './profile.service';
import { Profiles } from './schemas/profiles.schema';
@ApiTags('profiles')
@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt-auth')
export class ProfileController {
  constructor(private readonly profilesService: ProfileService) {}
  @Get('all')
  @ApiOperation({ summary: 'Get all user profiles with role-based filtering' })
  @ApiUserResponse('Users retrieved successfully')
  async getAllProfiles(
    @GetUser() authUser: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<any>> {
    const result = await this.profilesService.getAllProfiles(authUser);
    return ApiResponseDto.success(result, 'Users retrieved successfully');
  }
  @Post('mission-statement')
  @ApiOperation({ summary: 'Submit Mission Statement' })
  @ApiUserResponse('Mission statement submitted successfully')
  async submitMissionStatement(
    @Body() dto: CreateStatementDto,
    @GetUser() authUser: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<IProfileResponse>> {
    const result = await this.profilesService.submitMissionStatement(dto, authUser);
    return ApiResponseDto.success(result, 'Mission statement submitted successfully');
  }
  @Put('mission-statement/:userId')
  @ApiOperation({ summary: 'Review Mission Statement' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiUserResponse('Mission statement reviewed successfully')
  async reviewMissionStatement(
    @Param('userId') userId: string,
    @Body() dto: ReviewMissionStatementDto,
    @GetUser() authUser: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<IProfileResponse>> {
    const updatedProfile = await this.profilesService.reviewMissionStatement(userId, dto, authUser);
    return ApiResponseDto.success(updatedProfile, 'Statement reviewed successfully');
  }
  @Post('indicators/:userId')
  @ApiOperation({
    summary: 'Submit Success Indicators',
    description: 'Add or update delete review success indicators for all quarters In One Api',
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiUserResponse('Success indicators submitted successfully')
  async addSuccessIndicators(
    @Param('userId') userId: string,
    @Body() dto: SubmissionQuarterDto,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<IQuarter[]>> {
    const result = await this.profilesService.addSuccessIndicators(userId, dto, user);
    return ApiResponseDto.success(result, 'Success indicators submitted successfully');
  }
  @Put('me')
  async updateMyProfile(
    @Body() updateDto: UpdateProfileDto,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<{ profile: Profiles | null }>> {
    const userId = new Types.ObjectId(user._id as unknown as string);
    const updatedProfile = await this.profilesService.updateProfile(userId, updateDto);
    return ApiResponseDto.success({ profile: updatedProfile }, 'Profile updated successfully');
  }
  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadProfilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: maxFileSize.maxFile }),
          new FileTypeValidator({ fileType: /(jpeg|jpg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<{ profile: Profiles }>> {
    if (!user?._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    const updatedProfile = await this.profilesService.uploadProfilePicture(
      user._id as unknown as string,
      file,
    );
    return ApiResponseDto.success(
      { profile: updatedProfile },
      'Profile picture uploaded successfully',
    );
  }
  @Delete('profile-picture')
  async removeProfilePicture(
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<{ profile: Profiles }>> {
    if (!user?._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    const updatedProfile = await this.profilesService.removeProfilePicture(
      user._id as unknown as string,
    );
    return ApiResponseDto.success(
      { profile: updatedProfile },
      'Profile picture removed successfully',
    );
  }
}
