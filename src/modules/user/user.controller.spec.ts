import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserStatus } from '../../types/constants/user-status.constants';
import { Role } from '../../types/enums/role.enums';
import { UserPayload } from '../../types/interfaces/jwt.interface';
import { UserController } from './user.controller';
import { UserService } from './user.service';
const mockUserService = {
  getUsersTeam: jest.fn(),
  getUserById: jest.fn(),
  createUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  changePassword: jest.fn(),
};
describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  const mockUserPayload: UserPayload = {
    //NOSONAR
    _id: new Types.ObjectId().toHexString(),
    email: 'test@mailinator.com',
    fullName: 'Test User',
    employeeId: 'EMP001',
    designation: 'Software Engineer',
    role: Role.MEMBER,
    cell: '1234567890',
    profile: {},
    department: {},
    displayRole: 'Member',
    status: UserStatus.ACTIVE,
    isVerified: true,
    permissions: [],
    loginCount: 0,
  };
  const mockApiResponse = {
    success: true,
    message: 'Operation Successful',
    data: {},
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getUsersTeam', () => {
    it('should return a list of users in the team', async () => {
      const mockUsers = [{ email: 'user1@mailinator.com' }];
      mockUserService.getUsersTeam.mockResolvedValue(mockUsers);
      const result = await controller.getUsersTeam(mockUserPayload);
      expect(userService.getUsersTeam).toHaveBeenCalledWith(mockUserPayload.role);
      expect(result.success).toBe(true);
      expect(result.data.users).toBeDefined();
      expect(result.data.authUser).toBeDefined();
    });
  });
  describe('getUserProfileById', () => {
    it('should return a user profile by ID', async () => {
      const userId = new Types.ObjectId().toHexString();
      const mockProfile = { _id: userId, email: 'test@mailinator.com' };
      mockUserService.getUserById.mockResolvedValue(mockProfile);
      const result = await controller.getUserProfileById(userId, mockUserPayload);
      expect(userService.getUserById).toHaveBeenCalledWith(new Types.ObjectId(userId));
      expect(result.success).toBe(true);
      expect(result.data.user).toBeDefined();
    });
    it('should throw UnauthorizedException if authUser has no _id', async () => {
      const invalidUser = { ...mockUserPayload, _id: undefined } as any;
      await expect(controller.getUserProfileById('someId', invalidUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
  describe('getCurrentUserProfile', () => {
    it('should return current user profile', async () => {
      const mockProfile = { _id: mockUserPayload._id, email: mockUserPayload.email };
      mockUserService.getUserById.mockResolvedValue(mockProfile);
      const result = await controller.getCurrentUserProfile(mockUserPayload);
      expect(userService.getUserById).toHaveBeenCalledWith(new Types.ObjectId(mockUserPayload._id));
      expect(result.success).toBe(true);
      expect(result.data.user).toBeDefined();
    });
    it('should throw UnauthorizedException if user has no _id', async () => {
      const invalidUser = { ...mockUserPayload, _id: undefined } as any;
      await expect(controller.getCurrentUserProfile(invalidUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
  describe('createUserProfile', () => {
    it('should create a new user profile', async () => {
      const createDto = { email: 'new@mailinator.com' } as any;
      const mockResult = { user: { email: 'new@mailinator.com' }, authUser: mockUserPayload };
      mockUserService.createUserProfile.mockResolvedValue(mockResult);
      const result = await controller.createUserProfile(createDto, mockUserPayload);
      expect(userService.createUserProfile).toHaveBeenCalledWith(
        createDto,
        new Types.ObjectId(mockUserPayload._id),
      );
      expect(result.success).toBe(true);
      expect(result.data.user).toBeDefined();
    });
    it('should throw UnauthorizedException if creator has no _id', async () => {
      const invalidUser = { ...mockUserPayload, _id: undefined } as any;
      await expect(controller.createUserProfile({} as any, invalidUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
  describe('updateUserProfile', () => {
    it('should update a user profile', async () => {
      const userId = new Types.ObjectId();
      const updateDto = { status: 'ACTIVE' };
      const mockResult = { user: { _id: userId, ...updateDto }, authUser: mockUserPayload };
      mockUserService.updateUserProfile.mockResolvedValue(mockResult);
      const result = await controller.updateUserProfile(userId, updateDto, mockUserPayload);
      expect(userService.updateUserProfile).toHaveBeenCalledWith(
        userId,
        updateDto,
        new Types.ObjectId(mockUserPayload._id),
      );
      expect(result.success).toBe(true);
      expect(result.data.user).toBeDefined();
    });
  });
  describe('changePassword', () => {
    it('should change user password', async () => {
      const resetDto = { oldPassword: 'old', newPassword: 'new' };
      const mockResult = { user: { _id: mockUserPayload._id } };
      mockUserService.changePassword.mockResolvedValue(mockResult);
      const result = await controller.changePassword(resetDto, mockUserPayload);
      expect(userService.changePassword).toHaveBeenCalledWith(
        resetDto,
        new Types.ObjectId(mockUserPayload._id),
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('User Password Changed Successfully');
    });
    it('should throw UnauthorizedException if user has no _id', async () => {
      const invalidUser = { ...mockUserPayload, _id: undefined } as any;
      await expect(controller.changePassword({}, invalidUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
