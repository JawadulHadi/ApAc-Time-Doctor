import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserStatus } from '../../types/constants/user-status.constants';
import { CombinedUserProfile } from '../../types/interfaces/user.interface';
import { LoginResponseDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import {
  ActivateUserDto,
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  ResetPasswordDto,
} from './dto/auth.dto';

jest.mock('@/core/decorators/permission.decorators', () => ({
  Permission: jest.fn(() => ({})),
}));

jest.mock('@nestjs/swagger', () => ({
  ApiOperation: jest.fn(() => ({})),
  ApiResponse: jest.fn(() => ({})),
  ApiTags: jest.fn(() => ({})),
  ApiBearerAuth: jest.fn(() => ({})),
}));

const mockUser: CombinedUserProfile = {
  _id: new Types.ObjectId(),
  email: 'test@mailinator.com',
  role: 'ADMIN',
  displayRole: 'Admin',
  status: UserStatus.ACTIVE,
  cell: '+1234567890',
  fullName: 'Test User',
  designation: 'Developer',
  employeeId: 'EMP001',
  password: 'hashedPassword',
  isVerified: true,
  department: {} as any,
  lastLogin: new Date().toISOString(),
  loginCount: '1',
  lastActivatedAt: new Date().toISOString(),
  profile: {} as any,
  departmentDetails: {} as any,
  permissions: ['CAN_MANAGE_USERS'],
};

const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  activateUser: jest.fn(),
  resentActivationEmail: jest.fn(),
  validateUser: jest.fn(),
};

const mockUserService = {
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  incrementLoginCount: jest.fn(),
  startSession: jest.fn(),
  activateUserAccount: jest.fn(),
  updateProfileStatus: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'test@mailinator.com',
      password: 'Password123!',
    };

    it('should return JWT token for valid credentials', async () => {
      const expectedResponse: LoginResponseDto = {
        access_token: 'jwt-token',
        user: mockUser as any,
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      userService.incrementLoginCount.mockResolvedValue(mockUser as any);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        role: mockUser.role,
        email: mockUser.email,
        permissions: mockUser.permissions,
      });
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockRejectedValue(new UnauthorizedException('Password mismatch'));

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.username, loginDto.password);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockRejectedValue(new UnauthorizedException('Password mismatch'));

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    const logoutDto: LogoutDto = {
      userId: new Types.ObjectId().toString(),
    };

    it('should update user logout timestamp', async () => {
      userService.updateUser.mockResolvedValue(mockUser as any);

      await service.logout(logoutDto);

      expect(userService.updateUser).toHaveBeenCalledWith(logoutDto.userId, {
        lastLogout: expect.any(Date),
      });
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@mailinator.com',
    };

    it('should generate reset code and send email for valid user', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUser);
      userService.updateUser.mockResolvedValue(mockUser as any);

      await service.forgotPassword(forgotPasswordDto);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(forgotPasswordDto.email);
      expect(userService.updateUser).toHaveBeenCalledWith(mockUser._id, {
        resetPasswordCode: expect.any(Number),
        resetPasswordCodeGeneratedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException for non-existent user', async () => {
      userService.getUserByEmail.mockResolvedValue(null);

      await expect(service.forgotPassword(forgotPasswordDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for unverified user', async () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      userService.getUserByEmail.mockResolvedValue(unverifiedUser);

      await expect(service.forgotPassword(forgotPasswordDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      id: new Types.ObjectId().toString(),
      code: '123456',
      newPassword: 'NewPassword123!',
    };

    it('should update password with valid reset code', async () => {
      userService.getUserById.mockResolvedValue(mockUser);
      userService.updateUser.mockResolvedValue(mockUser as any);

      await service.resetPassword(resetPasswordDto);

      expect(userService.getUserById).toHaveBeenCalledWith(expect.any(Types.ObjectId));
      expect(userService.updateUser).toHaveBeenCalledWith(mockUser._id, {
        password: expect.any(String),
        resetPasswordCode: null,
        resetPasswordCodeGeneratedAt: expect.any(Date),
        status: UserStatus.ACTIVE,
      });
    });

    it('should throw NotFoundException for invalid user ID', async () => {
      userService.getUserById.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('activateUser', () => {
    const activateUserDto: ActivateUserDto = {
      id: new Types.ObjectId().toString(),
      code: '123456',
      password: 'Password123!',
    };

    it('should activate user with valid code', async () => {
      const mockSession = {
        withTransaction: jest.fn(callback => callback()),
        endSession: jest.fn(),
        hasEnded: false,
        clientOptions: {},
        supports: {},
        explicit: {},
        inTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        startTransaction: jest.fn(),
      } as any;

      userService.startSession.mockResolvedValue(mockSession);
      userService.getUserById.mockResolvedValue(mockUser);
      userService.activateUserAccount.mockResolvedValue(mockUser);
      userService.updateProfileStatus.mockResolvedValue(mockUser as any);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.activateUser(activateUserDto);

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: expect.any(Object),
      });
      expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid code', async () => {
      activateUserDto.code = '';

      await expect(service.activateUser(activateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('resentActivationEmail', () => {
    const email = 'test@mailinator.com';

    it('should resend activation email for unverified user', async () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      userService.getUserByEmail.mockResolvedValue(unverifiedUser);
      userService.updateUser.mockResolvedValue(unverifiedUser as any);

      await service.resentActivationEmail(email);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(userService.updateUser).toHaveBeenCalledWith(unverifiedUser._id, {
        activationCode: expect.any(Number),
        activationCodeGeneratedAt: expect.any(Date),
      });
    });

    it('should throw BadRequestException for already verified user', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUser);

      await expect(service.resentActivationEmail(email)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUser', () => {
    const email = 'test@mailinator.com';
    const password = 'Password123!';

    it('should return user for valid credentials', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUser);
      userService.getUserById.mockResolvedValue(mockUser);

      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(result).toBe(mockUser);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUser);

      jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      userService.getUserByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });
});
