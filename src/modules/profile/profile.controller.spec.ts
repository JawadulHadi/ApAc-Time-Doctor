import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { ApiResponseDto } from '../../core/decorators/api-response.decorators';
import { IStatementStatus } from '../../types/enums/profile.enums';
import {
  CreateStatementDto,
  ReviewMissionStatementDto,
  SubmissionQuarterDto,
  UpdateProfileDto,
} from './dto/profile.dto';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: jest.Mocked<ProfileService>;
  const mockProfileService = {
    getAllProfiles: jest.fn(),
    submitMissionStatement: jest.fn(),
    reviewMissionStatement: jest.fn(),
    addSuccessIndicators: jest.fn(),
    updateProfile: jest.fn(),
    uploadProfilePicture: jest.fn(),
    removeProfilePicture: jest.fn(),
  };
  const mockUser = {
    _id: '68fa610c3a50f116c7311d73',
    fullName: 'Jawad-Ul-Hadi',
    email: 'jhadi@mailinator.com',
    role: 'MEMBER',
    employeeId: 'MAS-MIS-5062',
    designation: 'Lead Backend Developer',
    displayRole: 'Member',
    status: 'Active',
    cell: '3117248414',
    profile: null,
    department: null,
    permissions: [],
    isVerified: 'true',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();
    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get(ProfileService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getAllProfiles', () => {
    it('should return all profiles for authenticated user', async () => {
      const expectedResponse = {
        records: [],
        myRecords: null,
      };
      mockProfileService.getAllProfiles.mockResolvedValue(expectedResponse);
      const result = await controller.getAllProfiles(mockUser as any);
      expect(profileService.getAllProfiles).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(
        ApiResponseDto.success(expectedResponse, 'Users retrieved successfully'),
      );
    });
  });
  describe('submitMissionStatement', () => {
    const submitDto: CreateStatementDto = {
      content: 'My mission statement',
    };
    it('should submit mission statement successfully', async () => {
      const expectedResponse = {
        userId: mockUser._id,
        missionStatement: submitDto.content,
        status: 'pending',
      };
      mockProfileService.submitMissionStatement.mockResolvedValue(expectedResponse as any);
      const result = await controller.submitMissionStatement(submitDto, mockUser as any);
      expect(profileService.submitMissionStatement).toHaveBeenCalledWith(
        mockUser._id,
        submitDto,
        mockUser,
      );
      expect(result).toEqual(
        ApiResponseDto.success(expectedResponse, 'Mission statement submitted successfully'),
      );
    });
  });
  describe('reviewMissionStatement', () => {
    const userId = '68fa610c3a50f116c7311d74';
    const reviewDto: ReviewMissionStatementDto = {
      status: IStatementStatus.APPROVED,
      changesRequired: '',
    };
    it('should review mission statement successfully', async () => {
      const expectedResponse = {
        userId,
        missionStatement: 'Reviewed statement',
        status: 'approved',
      };
      mockProfileService.reviewMissionStatement.mockResolvedValue(expectedResponse as any);
      const result = await controller.reviewMissionStatement(userId, reviewDto, mockUser as any);
      expect(profileService.reviewMissionStatement).toHaveBeenCalledWith(
        userId,
        reviewDto,
        mockUser,
      );
      expect(result).toEqual(
        ApiResponseDto.success(expectedResponse, 'Statement reviewed successfully'),
      );
    });
  });
  describe('addSuccessIndicators', () => {
    const userId = '68fa610c3a50f116c7311d74';
    const indicatorsDto: SubmissionQuarterDto = {
      successIndicators: [
        {
          isActive: true,
          year: 2026,
          quarter: 1,
          indicators: [
            {
              id: 1,
              key: 1,
              content: 'Complete project',
              status: 'in_progress' as any,
              isMoved: false,
              isTransferred: false,
              from: null,
              to: undefined,
            },
          ],
        },
      ],
    };
    it('should add success indicators successfully', async () => {
      const expectedResponse = [
        {
          quarter: 1,
          isActive: true,
          year: 2026,
          indicators: [
            {
              id: 1,
              key: 1,
              content: 'Complete project',
              status: 'in_progress',
              isMoved: false,
              isTransferred: false,
              from: null,
              to: undefined,
            },
          ],
        },
      ];
      mockProfileService.addSuccessIndicators.mockResolvedValue(expectedResponse as any);
      const result = await controller.addSuccessIndicators(userId, indicatorsDto, mockUser as any);
      expect(profileService.addSuccessIndicators).toHaveBeenCalledWith(
        userId,
        indicatorsDto,
        mockUser,
      );
      expect(result).toEqual(
        ApiResponseDto.success(expectedResponse, 'Success indicators submitted successfully'),
      );
    });
  });
  describe('updateMyProfile', () => {
    const updateDto: UpdateProfileDto = {
      fullName: 'Updated Name',
      designation: 'Senior Developer',
    };
    it('should update user profile successfully', async () => {
      const expectedProfile = {
        _id: new Types.ObjectId(mockUser._id),
        ...updateDto,
      };
      mockProfileService.updateProfile.mockResolvedValue(expectedProfile as any);
      const result = await controller.updateMyProfile(updateDto, mockUser as any);
      expect(profileService.updateProfile).toHaveBeenCalledWith(
        new Types.ObjectId(mockUser._id as unknown as string),
        updateDto,
      );
      expect(result).toEqual(
        ApiResponseDto.success({ profile: expectedProfile }, 'Profile updated successfully'),
      );
    });
  });
  describe('uploadProfilePicture', () => {
    const mockFile = {
      originalname: 'profile.jpg',
      mimetype: 'image/jpeg',
      size: 5000,
      buffer: Buffer.from('test'),
    } as Express.Multer.File;
    it('should upload profile picture successfully', async () => {
      const expectedProfile = {
        _id: new Types.ObjectId(mockUser._id),
        profilePicture: { url: 'https://example.com/pic.jpg' },
      };
      mockProfileService.uploadProfilePicture.mockResolvedValue(expectedProfile as any);
      const result = await controller.uploadProfilePicture(mockFile, mockUser as any);
      expect(profileService.uploadProfilePicture).toHaveBeenCalledWith(
        mockUser._id as unknown as string,
        mockFile,
      );
      expect(result).toEqual(
        ApiResponseDto.success(
          { profile: expectedProfile },
          'Profile picture uploaded successfully',
        ),
      );
    });
    it('should throw error if user ID is missing', async () => {
      const invalidUser = { ...mockUser, _id: undefined };
      await expect(controller.uploadProfilePicture(mockFile, invalidUser as any)).rejects.toThrow(
        'Unauthorized access',
      );
    });
  });
  describe('removeProfilePicture', () => {
    it('should remove profile picture successfully', async () => {
      const expectedProfile = {
        _id: new Types.ObjectId(mockUser._id),
        profilePicture: null,
      };
      mockProfileService.removeProfilePicture.mockResolvedValue(expectedProfile as any);
      const result = await controller.removeProfilePicture(mockUser as any);
      expect(profileService.removeProfilePicture).toHaveBeenCalledWith(
        mockUser._id as unknown as string,
      );
      expect(result).toEqual(
        ApiResponseDto.success(
          { profile: expectedProfile },
          'Profile picture removed successfully',
        ),
      );
    });
    it('should throw error if user ID is missing', async () => {
      const invalidUser = { ...mockUser, _id: undefined };
      await expect(controller.removeProfilePicture(invalidUser as any)).rejects.toThrow(
        'Unauthorized access',
      );
    });
  });
});
