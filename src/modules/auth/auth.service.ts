import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import { EmailAuthService } from '../../services/email/user/email-auth.service';
import { CodeHelper } from '../../shared/helpers/code.helper';
import { logInResponse, responseTransform } from '../../shared/utils/unified-transform.utils';
import { UserValidator } from '../../shared/validators/user-data.validation';
import { AUTH, EMAIL_ERROR, USER } from '../../types/constants/error-messages.constants';
import { UserStatus } from '../../types/constants/user-status.constants';
import { CombinedUserProfile } from '../../types/interfaces/user.interface';
import { LoginResponseDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import {
  ActivateUserDto,
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  ResetPasswordDto,
} from './dto/auth.dto';

/**
 * Account lockout configuration
 */
const ACCOUNT_LOCKOUT_CONFIG = {
  maxFailedAttempts: 5,
  lockoutDuration: 15 * 60 * 1000,
};
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Checks if user account is locked
   * @param user - User object to check
   * @throws UnauthorizedException if account is locked
   */
  private async checkAccountLockout(user: CombinedUserProfile): Promise<void> {
    if (user.lockoutExpires) {
      const lockoutDate = new Date(user.lockoutExpires);
      if (lockoutDate > new Date()) {
        const remainingTime = Math.ceil((lockoutDate.getTime() - Date.now()) / (1000 * 60));
        throw new UnauthorizedException(`Account locked. Try again in ${remainingTime} minutes.`);
      }

      if (lockoutDate <= new Date()) {
        await this.userService.updateUser(user._id, {
          lockoutExpires: null,
          failedLoginAttempts: 0,
        });
      }
    }
  }

  /**
   * Handles failed login attempt by incrementing counter and potentially locking account
   * @param user - User object to update
   */
  private async handleFailedLogin(user: CombinedUserProfile): Promise<void> {
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;
    const updateData: any = { failedLoginAttempts: failedAttempts };

    if (failedAttempts >= ACCOUNT_LOCKOUT_CONFIG.maxFailedAttempts) {
      const lockoutExpires = new Date(Date.now() + ACCOUNT_LOCKOUT_CONFIG.lockoutDuration);
      updateData.lockoutExpires = lockoutExpires;
      updateData.status = UserStatus.LOCKED;

      this.logger.warn(
        `Account locked for user ${user.email} after ${failedAttempts} failed attempts`,
      );
    }

    await this.userService.updateUser(user._id, updateData);
  }

  /**
   * Resets failed login attempts on successful login
   * @param userId - User ID to reset
   */
  private async resetFailedLoginAttempts(userId: Types.ObjectId): Promise<void> {
    await this.userService.updateUser(userId, {
      failedLoginAttempts: 0,
      lockoutExpires: null,
      status: UserStatus.ACTIVE,
    });
  }
  /**
   * Validates user credentials and returns a JWT token with user information.
   *
   * @param loginDto - User credentials
   * @returns LoginResponseDto with JWT token and user information
   * @throws UnauthorizedException if user credentials are invalid
   * @throws InternalServerErrorException if there is an error while generating the JWT token
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log(AUTH.LOGIN_REQUESTED, loginDto.username);
    const user = await this.validateUser(loginDto.username, loginDto.password);
    const payload = {
      sub: user._id,
      role: user.role,
      email: user.email,
      permissions: user.permissions,
    };
    await this.userService
      .incrementLoginCount(user?._id)
      .catch(err => this.logger.error(AUTH.LOGIN_FAILED, err));
    const access_token = this.jwtService.sign(payload);
    return logInResponse(access_token, user);
  }
  /**
   * Logs out a user by setting the last logout date to the current time.
   *
   * @param logoutDto - User ID and other information
   * @returns Promise<void>
   * @throws InternalServerErrorException if there is an error while updating the user
   */
  async logout(logoutDto: LogoutDto): Promise<void> {
    await this.userService.updateUser(logoutDto.userId, {
      lastLogout: new Date(),
    });
  }
  /**
   * Resets the password for a user with a given email.
   *
   * @param forgotPasswordDto - Email address and reset code
   * @throws NotFoundException if the user is not found
   * @throws BadRequestException if the user is unverified or in an invalid state
   * @throws InternalServerErrorException if there is an error while sending the password reset email
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.getUserByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new NotFoundException(USER.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new BadRequestException(AUTH.UN_VERIFIED);
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException(AUTH.UN_VERIFIED);
    }
    const resetCode = CodeHelper.generateCode();
    await this.userService.updateUser(user._id, {
      resetPasswordCode: parseInt(resetCode),
      resetPasswordCodeGeneratedAt: new Date(),
    });
    try {
      EmailAuthService.sendPasswordResetEmail(responseTransform({ data: user }), resetCode);
    } catch (emailError) {
      this.logger.error(AUTH.FORGOT_PASSWORD_FAILED, emailError);
      throw new InternalServerErrorException(EMAIL_ERROR.SEND_FAILED);
    }
  }
  /**
   * Resets the password for a user with a given ID.
   *
   * @param resetPasswordDto - User ID and new password
   * @returns Promise<void>
   * @throws NotFoundException if the user is not found
   * @throws InternalServerErrorException if there is an error while updating the user
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const userId = new Types.ObjectId(resetPasswordDto.id);
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(USER.NOT_FOUND);
    }
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    const updatedUser = await this.userService.updateUser(user._id, {
      password: hashedPassword,
      resetPasswordCode: null,
      resetPasswordCodeGeneratedAt: new Date(),
      status: UserStatus.ACTIVE,
    });
    if (!updatedUser) {
      throw new InternalServerErrorException(AUTH.RESET_PASSWORD_FAILED);
    }
  }
  /**
   * Activates a user by checking the activation code and then updating the user status to verified.
   *
   * @param activateUserDto - User ID, password, and activation code
   * @returns Promise<{ access_token: string; user: any }> - Access token and the activated user
   * @throws NotFoundException if the user is not found
   * @throws BadRequestException if the user ID, password, or activation code is invalid
   * @throws InternalServerErrorException if there is an error while updating the user
   */
  async activateUser(
    activateUserDto: ActivateUserDto,
  ): Promise<{ access_token: string; user: any }> {
    if (!activateUserDto.id) {
      throw new BadRequestException(AUTH.ACTIVATION_REQUIRED);
    }
    if (!activateUserDto.password) {
      throw new BadRequestException(AUTH.PASSWORD_REQUIRED);
    }
    if (!activateUserDto.code) {
      throw new BadRequestException(AUTH.INVALID_CODE);
    }
    const userId = new Types.ObjectId(activateUserDto.id);
    const session = await this.userService.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await this.userService.getUserById(userId, session);
        if (!user) {
          throw new NotFoundException(USER.NOT_FOUND);
        }
        UserValidator.validateActive(user, activateUserDto.code);
        const hashedPassword = await bcrypt.hash(activateUserDto.password, 10);
        const activatedUser = await this.userService.activateUserAccount(
          userId,
          {
            password: hashedPassword,
            activationCode: '',
            lastActivatedAt: new Date(),
            isVerified: true,
          },
          session,
        );
        if (!activatedUser) {
          throw new InternalServerErrorException(AUTH.ACTIVATION_CODE_EXPIRED);
        }
        await this.userService.updateProfileStatus(userId, UserStatus.ACTIVE, session);
        const payload: any = {
          fullName: activatedUser.fullName,
          sub: activatedUser._id.toString(),
          _id: activatedUser._id.toString(),
          employeeId: activatedUser.employeeId || '',
          displayRole: activatedUser.displayRole || activatedUser.role,
          role: activatedUser.role,
          email: activatedUser.email,
          permissions: activatedUser.permissions,
        };
        const accessToken = this.jwtService.sign(payload);
        return logInResponse(accessToken, activatedUser);
      });
    } catch (error) {
      this.logger.error('Failed to activate user', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }
  /**
   * Resents an activation email to a user with a given email address.
   *
   * @param email - Email address of the user
   * @throws NotFoundException if the user is not found
   * @throws BadRequestException if the user is already verified
   * @throws InternalServerErrorException if there is an error while sending the activation email
   */
  async resentActivationEmail(email: string): Promise<void> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(USER.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new BadRequestException(AUTH.ACCOUNT_ALREADY_ACTIVE);
    }
    const reActivationCode = CodeHelper.generateCode();
    await this.userService.updateUser(user._id, {
      activationCode: parseInt(reActivationCode),
      activationCodeGeneratedAt: new Date(),
    });
    try {
      EmailAuthService.sendResendActivationEmail(
        responseTransform({ data: user }),
        reActivationCode,
        user._id,
      );
    } catch (emailError) {
      this.logger.error(AUTH.ACCOUNT_ALREADY_ACTIVE, emailError);
      throw new InternalServerErrorException(EMAIL_ERROR.SEND_FAILED);
    }
  }
  /**
   * Validates a user with the given email address and password.
   *
   * @param email - Email address of the user
   * @param password - Password of the user
   * @returns The validated user object
   * @throws NotFoundException if the user is not found
   * @throws UnauthorizedException if the password is incorrect
   */
  async validateUser(email: string, password: string): Promise<CombinedUserProfile> {
    this.logger.log(AUTH.VALIDATE_USER, email);
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(AUTH.PASSWORD_MISMATCH);
    }

    await this.checkAccountLockout(user);

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      await this.handleFailedLogin(user);
      throw new UnauthorizedException(AUTH.PASSWORD_MISMATCH);
    }

    await this.resetFailedLoginAttempts(user._id);
    return this.userService.getUserById(user._id);
  }
}
