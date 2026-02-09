import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResponseDto } from '../../core/decorators/api-response.decorators';
import { GetUser } from '../../core/decorators/get-user.decorators';
import { JwtAuthGuard } from '../../core/decorators/public.decorators';
import { GlobalExceptionFilter } from '../../core/filters/global-exception.filter';
import { SecurityLoggingInterceptor } from '../../core/interceptors/security-logging.interceptor';
import { AUTH, EMAIL_ERROR } from '../../types/constants/error-messages.constants';
import { LoginResponseDto } from '../user/dto/user.dto';
import { AuthService } from './auth.service';
import {
  ActivateUserDto,
  ForgotPasswordDto,
  LoginDto,
  ReActivationDto,
  ResetPasswordDto,
} from './dto/auth.dto';
@ApiTags('auth')
@Controller('auth')
@UseFilters(GlobalExceptionFilter)
@UseInterceptors(SecurityLoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and return JWT token' })
  @ApiBody({ type: LoginDto, description: 'Login credentials' })
  /**
   * Logs in a user with the given credentials and returns a JWT token with user information.
   *
   * @param loginDto - User credentials
   * @returns Promise<ApiResponseDto<LoginResponseDto>> - Promise with a LoginResponseDto or an error message
   * @throws UnauthorizedException if user credentials are invalid
   * @throws InternalServerErrorException if there is an error while generating the JWT token
   */
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<LoginResponseDto>> {
    const result = await this.authService.login(loginDto);
    return ApiResponseDto.success(result, AUTH.LOGIN_SUCCESS, HttpStatus.OK);
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout', description: 'Logout the currently authenticated user' })
  /**
   * Logs out the currently authenticated user.
   *
   * @param user - Currently authenticated user
   * @returns Promise<ApiResponseDto<null>> - Promise with a null response or an error message
   * @throws UnauthorizedException if the user is not authenticated
   * @throws InternalServerErrorException if there is an error while logging out the user
   */
  async logout(@GetUser() user: any): Promise<ApiResponseDto<null>> {
    if (!user?._id) {
      return ApiResponseDto.error(AUTH.NOT_AUTHENTICATED, HttpStatus.OK);
    }
    await this.authService.logout({ userId: user._id });
    return ApiResponseDto.success(null, AUTH.LOGOUT_SUCCESS, HttpStatus.OK);
  }
  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot password', description: 'Request password reset instructions' })
  @ApiBody({ type: ForgotPasswordDto, description: 'Email address for password reset' })
  /**
   * Resets the password for a user with a given email.
   *
   * @param forgotPasswordDto - Email address and reset code
   * @returns Promise<ApiResponseDto<null>> - Promise with a null response or an error message
   * @throws NotFoundException if the user is not found
   * @throws BadRequestException if the user is unverified or in an invalid state
   * @throws InternalServerErrorException if there is an error while sending the password reset email
   */
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ApiResponseDto<null>> {
    await this.authService.forgotPassword(forgotPasswordDto);
    return ApiResponseDto.success(null, AUTH.FORGOT_PASSWORD, HttpStatus.OK);
  }
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password', description: 'Reset user password with token' })
  @ApiBody({ type: ResetPasswordDto, description: 'Password reset data' })
  /**
   * Resets the password for a user with a given ID and new password.
   *
   * @param resetPasswordDto - User ID and new password
   * @returns Promise<ApiResponseDto<null>> - Promise with a null response or an error message
   * @throws NotFoundException if the user is not found
   * @throws BadRequestException if the user is unverified or in an invalid state
   * @throws InternalServerErrorException if there is an error while updating the user
   */
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ApiResponseDto<null>> {
    await this.authService.resetPassword(resetPasswordDto);
    return ApiResponseDto.success(null, AUTH.RESET_PASSWORD, HttpStatus.OK);
  }
  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activate user',
    description: 'Activate user account with activation code',
  })
  @ApiBody({ description: 'Activation data', type: ActivateUserDto })
  /**
   * Activate user account with activation code.
   *
   * @param activateUserDto - User ID, password, and activation code
   * @returns Promise<ApiResponseDto<any>> - Promise with a response containing the activated user and a success message
   * @throws NotFoundException if the user is not found
   * @throws BadRequestException if the user ID, password, or activation code is invalid
   * @throws InternalServerErrorException if there is an error while updating the user
   */
  async activateUser(@Body() activateUserDto: ActivateUserDto): Promise<ApiResponseDto<any>> {
    const result = await this.authService.activateUser(activateUserDto);
    return ApiResponseDto.success(result, AUTH.WELCOME, HttpStatus.OK);
  }
  @Post('re-activation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend activation email',
    description: 'Resend activation email to unverified user',
  })
  @ApiBody({ type: ReActivationDto })
  /**
   * Resents an activation email to an unverified user.
   *
   * @param resendActivationDto - Email address
   * @returns Promise<ApiResponseDto<null>> - Promise with a response containing a success message
   * @throws InternalServerErrorException if there is an error while sending the activation email
   */
  async resentActivation(
    @Body() resendActivationDto: ReActivationDto,
  ): Promise<ApiResponseDto<null>> {
    await this.authService.resentActivationEmail(resendActivationDto.email);
    return ApiResponseDto.success(null, EMAIL_ERROR.SEND_SUCCESS, HttpStatus.OK);
  }
  @Get('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Test authentication',
    description: 'Test endpoint to verify authentication is working',
  })
  @UseGuards(JwtAuthGuard)
  /**
   * Test authentication endpoint.
   *
   * @param req Express request object
   * @returns { user: any, message: string } - User object with a welcome message
   */
  testAuth(@Req() req: any) {
    return {
      user: req.user,
      message: AUTH.WELCOME,
    };
  }
}
