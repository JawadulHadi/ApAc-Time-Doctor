import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponseDto,
  ApiUnauthorizedResponse,
  ApiUserResponse,
  ApiUsersResponse,
} from '../../core/decorators/api-response.decorators';
import { GetUser } from '../../core/decorators/get-user.decorators';
import { Permission } from '../../core/decorators/permission.decorators';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { RoleDisplay } from '../../shared/utils/role-display.utils';
import { responseTransform } from '../../shared/utils/unified-transform.utils';
import { IdValidation } from '../../shared/validators/iD.validation';
import { USER } from '../../types/constants/error-messages.constants';
import { Permissions } from '../../types/enums/permissions.enum';
import * as jwtInterface from '../../types/interfaces/jwt.interface';
import {
  GetGroupUsersResponse,
  GetUserProfileResponse,
  UserOperationResult,
} from '../../types/interfaces/user.interface';
import { ChangePasswordDto, CreateUserProfileDto } from './dto/user.dto';
import { UserService } from './user.service';
@ApiTags('user')
@ApiBearerAuth('jwt-auth')
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}
  @Get('all')
  /**
   * TODO: uncomment when permission system is ready
   * @Permission(Permissions.CAN_MANAGE_USERS)
   * @UseGuards(PermissionsGuard)
   */
  @ApiOperation({
    summary: 'Get all users with organizational hierarchy',
    description:
      'Retrieve all users organized by organizational hierarchy. Requires CAN_MANAGE_USERS permission.',
  })
  @ApiUsersResponse('Users Retrieved Successfully with Organizational Hierarchy')
  @ApiForbiddenResponse('Insufficient Permissions to Access User Data')
  @ApiInternalServerErrorResponse('Internal Server Error')
  /**
   * Retrieve all users organized by organizational hierarchy. Requires CAN_MANAGE_USERS permission.
   * @param user - Currently authenticated user
   * @returns Promise with a list of users and the authenticated user transformed into the response format
   * @throws ForbiddenException if the user does not have the required permissions
   * @throws InternalServerErrorException if there is an error while retrieving the users
   */
  async getUsersTeam(
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<GetGroupUsersResponse>> {
    const requesterRole = user.role;
    const users = await this.userService.getUsersTeam(requesterRole);
    const displayRole = RoleDisplay.applyDisplay(users);
    const transformedUsers = displayRole.map(user => responseTransform({ data: user }));
    return ApiResponseDto.success(
      { users: transformedUsers, authUser: responseTransform({ data: user }) },
      'Users Retrieved Successfully',
    );
  }
  @Get(':id')
  @Permission(Permissions.CAN_MANAGE_USERS)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Get user profile by ID',
    description: 'Retrieve the complete profile of a specific user by their ID.',
  })
  @ApiParam({ name: 'id', description: 'User ID', example: '507f1f77bcf86cd799439011' })
  @ApiUserResponse('User Profile Retrieved Successfully')
  @ApiUnauthorizedResponse('User Not Authenticated')
  @ApiNotFoundResponse('User Profile Not Found')
  /**
   * Retrieves the complete profile of a specific user by their ID.
   * @param userId - User ID
   * @param authUser - Currently authenticated user
   * @returns Promise with a response containing the user profile and the authenticated user transformed into the response format
   * @throws UnauthorizedException if the user is not authenticated
   * @throws NotFoundException if the user profile is not found
   */
  async getUserProfileById(
    @Param('id') userId: string,
    @GetUser() authUser: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<GetUserProfileResponse>> {
    if (!authUser._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    IdValidation.validateId(userId, 'User ID');
    const userProfile = await this.userService.getUserById(new Types.ObjectId(userId));
    const transformedUser = responseTransform({ data: userProfile });
    return ApiResponseDto.success(
      {
        user: transformedUser,
        authUser: responseTransform({ data: authUser }),
      },
      'User Profile Retrieved Successfully',
    );
  }
  @Get('profile/me')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve the complete profile of the currently authenticated user',
  })
  @ApiUserResponse('User Profile Retrieved Successfully')
  @ApiUnauthorizedResponse('User Not Authenticated')
  @ApiNotFoundResponse('User Profile Not Found')
  /**
   * Retrieves the complete profile of the currently authenticated user.
   * @param user - Currently authenticated user
   * @returns Promise with a response containing the user profile and the authenticated user transformed into the response format
   * @throws UnauthorizedException if the user is not authenticated
   * @throws NotFoundException if the user profile is not found
   */
  async getCurrentUserProfile(
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<GetUserProfileResponse>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    const userProfile = await this.userService.getUserById(new Types.ObjectId(user._id));
    const transformedUser = responseTransform({ data: userProfile });
    return ApiResponseDto.success(
      {
        user: transformedUser,
        authUser: transformedUser,
      },
      'User Profile Retrieved Successfully',
    );
  }
  @Post('user')
  @Permission(Permissions.CAN_MANAGE_USERS, Permissions.CAN_ADD_USER)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Create user with profile',
    description: 'Create a new user account with profile information.',
  })
  @ApiBody({ type: CreateUserProfileDto })
  @ApiCreatedResponse('User Records Created Successfully')
  @ApiBadRequestResponse('Invalid Input Data or User Already Exists')
  @ApiForbiddenResponse('Insufficient Permissions')
  @ApiNotFoundResponse('Creator User Not Found or Department Not Found')
  /**
   * Creates a new user account with profile information.
   * Requires CAN_MANAGE_USERS and CAN_ADD_USER permissions.
   * @param createUserProfileDto - User creation data
   * @param user - Currently authenticated user
   * @returns Promise with a response containing the created user and the authenticated user transformed into the response format
   * @throws UnauthorizedException if the user is not authenticated or does not have the required permissions
   * @throws BadRequestException if the input data is invalid or the user already exists
   * @throws NotFoundException if the creator user or department is not found
   */
  async createUserProfile(
    @Body() createUserProfileDto: CreateUserProfileDto,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<UserOperationResult>> {
    if (!user._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    const result = await this.userService.createUserProfile(
      createUserProfileDto,
      new Types.ObjectId(user._id),
    );
    const response = responseTransform({ data: result.user });
    return ApiResponseDto.success(
      {
        user: response,
        authUser: result.authUser,
      },
      'User Created Successfully',
    );
  }
  @Put(':userId')
  /**
   * TODO: uncomment when permission system is ready
   * @Permission(Permissions.CAN_MANAGE_USERS, Permissions.CAN_UPDATE_USER)
   * @UseGuards(PermissionsGuard)
   */
  @ApiOperation({
    summary: 'Update user with profile',
    description: 'Update user information (Super Admin/HR only)',
  })
  @ApiParam({ name: 'userId', description: 'User ID', example: '507f1f77bcf86cd799439011' })
  @ApiBody({ description: 'User Update Data' })
  @ApiUserResponse('User Records Updated Successfully')
  @ApiUnauthorizedResponse('User Not Authenticated')
  @ApiNotFoundResponse('User Not Found')
  @ApiForbiddenResponse('Insufficient Permissions')
  /**
   * Update user information (Super Admin/HR only)
   * @param userId - User ID
   * @param updateUserDto - User update data
   * @param user - Currently authenticated user
   * @returns Promise with a response containing the updated user and the authenticated user transformed into the response format
   * @throws UnauthorizedException if the user is not authenticated
   * @throws NotFoundException if the user is not found
   * @throws ForbiddenException if the user does not have the required permissions
   */
  async updateUserProfile(
    @Param('userId') userId: Types.ObjectId,
    @Body() updateUserDto: any,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<UserOperationResult>> {
    const authUserId = new Types.ObjectId(user._id);
    const result = await this.userService.updateUserProfile(userId, updateUserDto, authUserId);
    const transformedUser = responseTransform({ data: result.user });
    return ApiResponseDto.success(
      {
        user: transformedUser,
        authUser: user,
      },
      'User Updated Successfully',
    );
  }
  @Post('password')
  @ApiOperation({
    summary: 'Change password',
    description: 'Change the password for the authenticated user.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiUserResponse('Password Changed Successfully')
  @ApiBadRequestResponse('Invalid Input Data or Password Requirements Not Met')
  @ApiUnauthorizedResponse('User Not Authenticated or Current Password Incorrect')
  /**
   * Change the password for the authenticated user.
   * @param resetPasswordDto - New password data
   * @param user - Currently authenticated user
   * @returns Promise with a response containing the updated user and the authenticated user transformed into the response format
   * @throws UnauthorizedException if the user is not authenticated or the current password is incorrect
   */
  async changePassword(
    @Body() resetPasswordDto: any,
    @GetUser() user: jwtInterface.UserPayload,
  ): Promise<ApiResponseDto<UserOperationResult>> {
    if (!user?._id) {
      throw new UnauthorizedException(USER.UNAUTHORIZED_ACCESS);
    }
    const userId = new Types.ObjectId(user._id);
    const result = await this.userService.changePassword(resetPasswordDto, userId);
    return ApiResponseDto.success(
      {
        ...result,
        authUser: user,
      },
      'User Password Changed Successfully',
    );
  }
}
