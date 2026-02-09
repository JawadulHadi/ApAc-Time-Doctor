import { BadRequestException, ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientSession, Model } from 'mongoose';

import { USER } from '../../types/constants/error-messages.constants';
import { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';
const mockUserModel: any = jest.fn().mockImplementation(userData => ({
  save: jest.fn().mockResolvedValue(userData),
  ...userData,
}));
Object.assign(mockUserModel, {
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
  lean: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  startSession: jest.fn().mockResolvedValue({
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  } as unknown as ClientSession),
});
describe('UserRepository', () => {
  let repository: UserRepository;
  let model: Model<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();
    repository = module.get<UserRepository>(UserRepository);
    model = module.get<Model<User>>(getModelToken(User.name));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
  describe('create', () => {
    it('should create and save a new user', async () => {
      const userData = {
        email: 'super2@mailinator.com',
        password: '$2b$10$/OgPn4jVkxtBFPY1Fff.eehGesNDGjrPcGda8hYVaEyLgBg//qCcW',
      };
      const result = await repository.create(userData);
      expect(mockUserModel).toHaveBeenCalledWith(userData);
      expect(result.email).toEqual(userData.email);
    });
  });
  describe('find', () => {
    it('should find users based on filter', async () => {
      const filter = { role: 'user' };
      const users = [{ email: 'super@mailinator.com' }];
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      } as any);
      const result = await repository.find(filter);
      expect(model.find).toHaveBeenCalledWith(filter);
      expect(result).toEqual(users);
    });
  });
  describe('findLean', () => {
    it('should find users and return lean objects', async () => {
      const filter = { status: 'active' };
      const users = [{ email: 'super@mailinator.com' }];
      mockUserModel.find.mockReturnValue({
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      } as any);
      const result = await repository.findLean(filter);
      expect(model.find).toHaveBeenCalledWith(filter, null, { session: undefined });
      expect(result).toEqual(users);
    });
  });
  describe('findOne', () => {
    it('should find a single user', async () => {
      const filter = { email: 'super@mailinator.com' };
      const user = { email: 'super@mailinator.com' };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);
      const result = await repository.findOne(filter);
      expect(model.findOne).toHaveBeenCalledWith(filter);
      expect(result).toEqual(user);
    });
  });
  describe('findById', () => {
    it('should find a user by id', async () => {
      const id = '68d5280ea98d09600d6e4ef5';
      const user = { _id: id, email: 'super@mailinator.com' };
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);
      const result = await repository.findById(id);
      expect(model.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
  });
  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'super@mailinator.com';
      const user = { email: email };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);
      const result = await repository.findByEmail(email);
      expect(model.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });
  });
  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'System_Administrator';
      const user = { username: username };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      } as any);
      const result = await repository.findByUsername(username);
      expect(model.findOne).toHaveBeenCalledWith({ username });
      expect(result).toEqual(user);
    });
  });
  describe('findUserForAuthentication', () => {
    it('should find a user for authentication with password', async () => {
      const email = 'super@mailinator.com';
      const user = {
        email: email,
        password: '$2b$10$/OgPn4jVkxtBFPY1Fff.eehGesNDGjrPcGda8hYVaEyLgBg//qCcW',
      };
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(user),
      } as any);
      const result = await repository.findUserForAuthentication(email);
      expect(model.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });
  });
  describe('update', () => {
    it('should update a user', async () => {
      const userId = '68d5280ea98d09600d6e4ef5';
      const updateData = { email: 'super@mailinator.com' };
      const updatedUser = { _id: userId, ...updateData };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);
      const result = await repository.update(userId, updateData);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(updatedUser);
    });
  });
  describe('updateUserSession', () => {
    it('should update user session data', async () => {
      const userId = '68d5280ea98d09600d6e4ef5';
      const updateData = { loginCount: 1 };
      const updatedUser = { _id: userId, ...updateData };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);
      const result = await repository.updateUserSession(userId, updateData);
      expect(model.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });
    it('should throw BadRequestException on validation error', async () => {
      const userId = '68d5280ea98d09600d6e4ef5';
      const updateData = { email: 'super@mailinator.com' };
      const validationError = { name: 'ValidationError', message: 'Invalid email' };
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockRejectedValue(validationError),
      } as any);
      await expect(repository.updateUserSession(userId, updateData)).rejects.toThrow(
        new BadRequestException('Invalid email'),
      );
    });
  });
  describe('validateExisting', () => {
    it('should throw ConflictException if email already exists', async () => {
      const email = 'newemail@mailinator.com';
      const existingUser = { email: 'oldemail@mailinator.com' };
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ email: email }),
      } as any);
      await expect(repository.validateExisting(email, existingUser)).rejects.toThrow(
        new ConflictException(USER.ALREADY_EXISTS),
      );
    });
    it('should not throw if email is the same', async () => {
      const email = 'super@mailinator.com';
      const existingUser = { email: 'super@mailinator.com' };
      await expect(repository.validateExisting(email, existingUser)).resolves.toBeUndefined();
    });
  });
});
