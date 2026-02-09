import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { AnnouncementEmailService } from '../../services/email/announcement/announcement-email.service';
import { IBaseUrl } from '../../types/constants/url-tags.constants';
import { EmailResult } from '../../types/interfaces/email.interface';
import { CombinedUserProfile } from '../../types/interfaces/user.interface';
import { UserService } from '../user/user.service.js';
import { AnnouncementService } from './announcement.service.js';
describe('AnnouncementService', () => {
  let service: AnnouncementService;
  let userService: jest.Mocked<UserService>;
  let announcementEmailService: jest.Mocked<AnnouncementEmailService>;
  const mockUsers = [
    {
      _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
      email: 'user1@mailinator.com',
      fullName: 'John Doe',
      role: 'MEMBER',
    },
    {
      _id: new Types.ObjectId('507f1f77bcf86cd799439012'),
      email: 'user2@mailinator.com',
      fullName: 'Jane Smith',
      role: 'TEAM_LEAD',
    },
  ] as CombinedUserProfile[];
  const mockEmailResult: EmailResult = {
    successCount: 2,
    failedCount: 0,
    failedEmails: [],
    totalProcessed: 2,
    message: 'Announcement sent successfully',
  };
  beforeEach(async () => {
    const mockUserService = {
      getAllUsers: jest.fn(),
    };
    const mockAnnouncementEmailService = {
      sendAnnouncementToAllUsers: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AnnouncementEmailService,
          useValue: mockAnnouncementEmailService,
        },
      ],
    }).compile();
    service = module.get<AnnouncementService>(AnnouncementService);
    userService = module.get(UserService);
    announcementEmailService = module.get(AnnouncementEmailService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('sendAnnouncementToAllUsers', () => {
    it('should send announcement to all users successfully', async () => {
      userService.getAllUsers.mockResolvedValue(mockUsers);
      announcementEmailService.sendAnnouncementToAllUsers.mockResolvedValue(mockEmailResult);
      const result = await service.sendAnnouncementToAllUsers();
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(announcementEmailService.sendAnnouncementToAllUsers).toHaveBeenCalledWith(
        mockUsers,
        IBaseUrl,
      );
      expect(result).toEqual(mockEmailResult);
    });
    it('should handle empty user list', async () => {
      userService.getAllUsers.mockResolvedValue([]);
      announcementEmailService.sendAnnouncementToAllUsers.mockResolvedValue({
        successCount: 0,
        failedCount: 0,
        failedEmails: [],
        totalProcessed: 0,
        message: 'No users to send announcement to',
      });
      const result = await service.sendAnnouncementToAllUsers();
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(announcementEmailService.sendAnnouncementToAllUsers).toHaveBeenCalledWith(
        [],
        IBaseUrl,
      );
      expect(result.successCount).toBe(0);
      expect(result.totalProcessed).toBe(0);
    });
    it('should handle email service failure', async () => {
      userService.getAllUsers.mockResolvedValue(mockUsers);
      announcementEmailService.sendAnnouncementToAllUsers.mockResolvedValue({
        successCount: 0,
        failedCount: 2,
        failedEmails: ['user1@mailinator.com', 'user2@mailinator.com'],
        totalProcessed: 2,
        message: 'Failed to send announcement',
      });
      const result = await service.sendAnnouncementToAllUsers();
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(announcementEmailService.sendAnnouncementToAllUsers).toHaveBeenCalledWith(
        mockUsers,
        IBaseUrl,
      );
      expect(result.successCount).toBe(0);
      expect(result.failedCount).toBe(2);
    });
    it('should handle user service errors', async () => {
      userService.getAllUsers.mockRejectedValue(new Error('Database error'));
      await expect(service.sendAnnouncementToAllUsers()).rejects.toThrow('Database error');
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(announcementEmailService.sendAnnouncementToAllUsers).not.toHaveBeenCalled();
    });
    it('should handle email service errors', async () => {
      userService.getAllUsers.mockResolvedValue(mockUsers);
      announcementEmailService.sendAnnouncementToAllUsers.mockRejectedValue(
        new Error('Email service error'),
      );
      await expect(service.sendAnnouncementToAllUsers()).rejects.toThrow('Email service error');
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(announcementEmailService.sendAnnouncementToAllUsers).toHaveBeenCalledWith(
        mockUsers,
        IBaseUrl,
      );
    });
  });
});
