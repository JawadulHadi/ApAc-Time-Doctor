import { NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import { UserStatus } from '../../types/constants/user-status.constants';
import { Permissions } from '../../types/enums/permissions.enum';
import { CombinedUserProfile } from '../../types/interfaces/user.interface';
import { DepartmentService } from '../department/department.service';
import { ProfileService } from '../profile/profile.service';
import { RequestService } from '../request/request.service';
import { CreateUserProfileDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
jest.mock('@/index', () => ({
  ...jest.requireActual('@/index'),
  prepareTemplate: jest.fn().mockResolvedValue({
    userName: 'Test User',
    requestType: 'Test Request',
    status: 'PENDING',
  }),
  EmailService: {
    sendRequest: jest.fn(),
    sendWithdrawal: jest.fn(),
  },
  InputValidation: {
    validateCreateUser: jest.fn(),
    validateEmail: jest.fn(),
    validateId: jest.fn(),
  },
  IdValidation: {
    validateId: jest.fn(),
  },
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('@/shared/validators/input.validation');
jest.mock('@/shared/validators/user-data.validation');
jest.mock('@/services/email/user/email-auth-templates.service');
const mockUserRepository = {
  startSession: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findLean: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  updateUserSession: jest.fn(),
  validateExisting: jest.fn(),
};
const mockProfileService = {
  getProfilesByUserIds: jest.fn(),
  updateProfile: jest.fn(),
  createProfile: jest.fn(),
  updateProfileSession: jest.fn(),
  createUserProfile: jest.fn(),
  generateEmployeeId: jest.fn(),
  uploadProfilePicture: jest.fn(),
};
const mockDepartmentService = {
  getDepartmentsByIdsLean: jest.fn(),
  getDepartmentById: jest.fn(),
};
const mockRequestService = {
  getAllRequests: jest.fn(),
};
describe('UserService', () => {
  let service: UserService; // eslint-disable-line @typescript-eslint/no-unused-vars
  let _userRepository: UserRepository;
  let departmentService: DepartmentService;
  let moduleRef: ModuleRef;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: DepartmentService, useValue: mockDepartmentService },
        { provide: RequestService, useValue: mockRequestService },
        {
          provide: ModuleRef,
          useValue: {
            resolve: jest.fn().mockImplementation(type => {
              if (type === ProfileService) {
                return Promise.resolve(mockProfileService);
              }
              if (type === DepartmentService) {
                return Promise.resolve(mockDepartmentService);
              }
              if (type === RequestService) {
                return Promise.resolve(mockRequestService);
              }
              return Promise.resolve(null);
            }),
          },
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    _userRepository = module.get<UserRepository>(UserRepository);
    moduleRef = module.get<ModuleRef>(ModuleRef);
    departmentService = await moduleRef.resolve(DepartmentService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getUser', () => {
    it('should return a user if found', async () => {
      const user: CombinedUserProfile = {
        _id: new Types.ObjectId(),
        email: 'test@mailinator.com',
      } as CombinedUserProfile;
      jest.spyOn(service, 'getUsersDetails').mockResolvedValue([user] as any);
      const result = await service.getUser({ email: 'test@mailinator.com' });
      expect(result).toEqual(user);
    });
    it('should return null if user not found', async () => {
      jest.spyOn(service, 'getUsersDetails').mockResolvedValue([]);
      const result = await service.getUser({ email: 'none@mailinator.com' });
      expect(result).toBeNull();
    });
  });
  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users: CombinedUserProfile[] = [
        { email: 'user1@mailinator.com' },
      ] as CombinedUserProfile[];
      jest.spyOn(service, 'getUsersDetails').mockResolvedValue(users as any);
      const result = await service.getAllUsers();
      expect(result).toEqual(users);
    });
  });
  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = new Types.ObjectId();
      const updateUserDto = { status: UserStatus.INACTIVE };
      const updatedUser: CombinedUserProfile = {
        _id: userId,
        status: UserStatus.INACTIVE,
      } as CombinedUserProfile;
      mockUserRepository.updateUserSession.mockResolvedValue(updatedUser);
      const result = await service.updateUser(userId, updateUserDto);
      expect(mockUserRepository.updateUserSession).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });
  describe('incrementLoginCount', () => {
    it('should increment login count for a user', async () => {
      const userId = new Types.ObjectId();
      mockUserRepository.update.mockResolvedValue({ loginCount: 2 });
      await service.incrementLoginCount(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, { $inc: { loginCount: 1 } });
    });
  });
  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@mailinator.com';
      const user: CombinedUserProfile = { email: email } as CombinedUserProfile;
      jest.spyOn(service, 'getUser').mockResolvedValue(user as any);
      const result = await service.getUserByEmail(email);
      expect(service.getUser).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });
  });
  describe('activateUserAccount', () => {
    it('should activate a user account', async () => {
      const userId = new Types.ObjectId();
      const updateData = { password: 'newPassword' };
      const activatedUser: CombinedUserProfile = {
        _id: userId,
        status: UserStatus.ACTIVE,
      } as CombinedUserProfile;
      mockUserRepository.updateUserSession.mockResolvedValue({});
      mockProfileService.updateProfile.mockResolvedValue({});
      jest.spyOn(service, 'getUserById').mockResolvedValue(activatedUser as any);
      const result = await service.activateUserAccount(userId, updateData);
      expect(mockUserRepository.updateUserSession).toHaveBeenCalledWith(
        userId,
        expect.any(Object),
        undefined,
      );
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        userId,
        {
          status: UserStatus.ACTIVE,
        },
        undefined,
      );
      expect(result).toEqual(activatedUser);
    });
  });
  describe('changePassword', () => {
    it('should change user password', async () => {
      const userId = new Types.ObjectId();
      const changePasswordDto = { newPassword: 'newPassword123' };
      const user: CombinedUserProfile = {
        _id: userId,
        password: 'oldPassword',
      } as CombinedUserProfile;
      const hashedPassword = 'hashedNewPassword';
      mockUserRepository.findById.mockResolvedValue(user as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.update.mockResolvedValue({ ...user, password: hashedPassword });
      const result = await service.changePassword(changePasswordDto, userId);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(bcrypt.hash).toHaveBeenCalledWith(changePasswordDto.newPassword, 10);
      expect(mockUserRepository.update).toHaveBeenCalledWith(user._id, {
        password: hashedPassword,
      });
      expect(result.user).toBeDefined();
    });
    it('should throw NotFoundException if user not found', async () => {
      const userId = new Types.ObjectId();
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(service.changePassword({ newPassword: 'p' }, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('createUserProfile', () => {
    it('should create a new user profile', async () => {
      const creatorId = new Types.ObjectId();
      const createUserDto: CreateUserProfileDto = {
        email: 'jhadiiii@mailinator.com',
        firstName: 'New',
        lastName: 'User',
        role: 'MEMBER',
        designation: 'dev',
        department: new Types.ObjectId().toHexString(),
      }; // eslint-disable-line @typescript-eslint/no-unused-vars
      const creator = { _id: creatorId, permissions: [Permissions.CAN_ADD_USER] };
      const department = { _id: createUserDto.department };
      const hashedPassword = 'hashedPassword';
      const employeeId = 'EMP001';
      jest
        .spyOn(service, 'validateDepartment')
        .mockResolvedValue(new Types.ObjectId(createUserDto.department));
      jest
        .spyOn(service, 'getUserById')
        .mockResolvedValueOnce(creator as CombinedUserProfile)
        .mockResolvedValueOnce({
          _id: expect.any(Types.ObjectId),
          email: createUserDto.email,
        } as CombinedUserProfile);
      jest.spyOn(service, 'getUserByEmail').mockResolvedValue(null);
      mockUserRepository.startSession.mockResolvedValue({
        withTransaction: jest.fn(async fn => await fn()),
        endSession: jest.fn(),
      } as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockProfileService.generateEmployeeId.mockResolvedValue(employeeId);
      mockUserRepository.create.mockImplementation(user => Promise.resolve(user));
      const result = await service.createUserProfile(createUserDto, creatorId);
      expect(result.user).toBeDefined();
      expect(result.authUser).toBeDefined();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockProfileService.createUserProfile).toHaveBeenCalled();
    });
  });
});
