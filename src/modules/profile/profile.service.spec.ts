import { HttpException, HttpStatus } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserStatus } from '@/types/constants/user-status.constants';
import { Role } from '@/types/enums/role.enums';

import { CreateStatementDto } from './dto/profile.dto';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';
import { Profiles } from './schemas/profiles.schema';
import { PROFILE } from '@/types/constants/error-messages.constants';
jest.mock('@/shared/helpers/profile.helper', () => ({
  ProfileHelper: {
    validateIndicatorAuthorization: jest.fn(),
    validateLAndDForTarget: jest.fn(),
    handleIsMoved: jest.fn(),
    cleanUpdateData: jest.fn((data: any) => data),
  },
}));
jest.mock('@/shared/utils/response.utils', () => ({
  ApiResponseDto: {
    success: jest.fn((data: unknown, message: string) => ({
      success: true,
      data,
      message,
    })),
    error: jest.fn((message: string, statusCode: number) => ({
      success: false,
      message,
      statusCode,
    })),
  },
  CamelCase: jest.fn((str: string) => str),
  transformRole: jest.fn((role: string) => role),
  PaginationHelper: {
    createPaginatedResponse: jest.fn(),
    calculateSkip: jest.fn(),
    normalizePagination: jest.fn(),
    isPaginatedResponse: jest.fn(),
  },
}));
jest.mock('@/services/email/profile/email-profile-process.service', () => ({
  EmailstatementService: {
    notifyStatement: jest.fn(),
    notifyReviewDecision: jest.fn(),
  },
}));
jest.mock('@/services/email/profile/email-indicators-process.service', () => ({
  EmailIndicatorsProcessService: {
    notifySuccessIndicatorsAdded: jest.fn(),
    notifySuccessIndicatorsMoved: jest.fn(),
  },
}));
jest.mock('@/shared/utils/gcs.utils', () => ({
  uploadingValidator: {
    ensureGcsInitialized: jest.fn(),
    validationOptions: jest.fn(),
    validateFile: jest.fn(),
    uploadFile: jest.fn(),
    deleteFileFromGcsByUrl: jest.fn(),
    createProfileFile: jest.fn(),
    createFile: jest.fn(),
  },
}));
jest.mock('@/shared/helpers/user.helpers', () => ({
  UserHelper: {
    getTeam: jest.fn(),
  },
}));
const mockUserService = {
  getUserById: jest.fn(),
  getAllUsers: jest.fn(),
  getUsersDetails: jest.fn(),
};
describe('ProfileService - Isolated Unit Tests', () => {
  let service: ProfileService;
  let profileRepository: jest.Mocked<ProfileRepository>;
  let moduleRef: jest.Mocked<ModuleRef>;
  const mockUserId = new Types.ObjectId('68fa610c3a50f116c7311d73');
  const mockProfile: Profiles = {
    _id: new Types.ObjectId('68fa610c3a50f116c7311d76'),
    userId: mockUserId,
    fullName: 'Jawad-Ul-Hadi',
    email: 'jhadi@mailinator.com',
    employeeId: 'MAS-MIS-5062',
    designation: 'Lead Backend Developer',
    missionStatement: null,
    successIndicators: [],
    documents: [],
    skills: [],
    achievements: [],
    status: UserStatus.ACTIVE,
    role: Role.MEMBER,
    salary: '',
    contactNumber: '03467248414',
    emergencyContact: '',
    currentAddress: '',
    permanentAddress: '',
    firstName: 'Jawad',
    lastName: 'Ul Hadi',
    dateOfBirth: null,
    dateOfJoining: null,
    leftUs: null,
    rejoinUs: null,
    createdBy: null,
    updatedBy: null,
    createdAt: new Date('2025-10-23T17:08:28.570Z'),
    updatedAt: new Date('2026-02-01T07:29:52.716Z'),
  };
  const mockAuthUser = {
    _id: mockUserId.toString(),
    fullName: 'Jawad-Ul-Hadi',
    email: 'jhadi@mailinator.com',
    role: Role.MEMBER,
    employeeId: 'MAS-MIS-5062',
    designation: 'Lead Backend Developer',
    displayRole: 'Member',
    status: UserStatus.ACTIVE,
    cell: '3117248414',
    profile: mockProfile,
    department: {
      _id: '68d0892452b91a26b1bf85bc',
      name: 'Solutions Delivery Team',
      description:
        'Specializes in delivering custom software solutions, application development, and technical implementation for clients.',
      isActive: true,
      teamLead: '68fa60d93a50f116c7311d5e',
      teamLeadDetail: {
        fullName: 'Muhammad Umer Awan',
        firstName: 'Muhammad Umer',
        lastName: 'Awan',
        designation: 'Lead Product Owner',
        email: 'mumer@mailinator.com',
        role: 'Team Lead',
        displayRole: 'Team lead',
        userId: '68fa60d93a50f116c7311d5e',
      },
    },
    permissions: [
      'can_submit_request',
      'can_manage_my_request',
      'can_submit_wfh_request',
      'can_manage_my_wfh_request',
      'can_view_company_resource',
      'can_view_leave_bank',
    ],
    isVerified: 'true',
    lastActivatedAt: '2025-10-23T17:26:22.153Z',
  };
  const mockUser = {
    _id: mockUserId,
    fullName: 'Jawad-Ul-Hadi',
    email: 'jhadi@mailinator.com',
    role: Role.MEMBER,
    status: UserStatus.ACTIVE,
    profile: mockProfile,
  };
  beforeEach(async () => {
    const mockProfileRepository = {
      createProfile: jest.fn(),
      createUserProfile: jest.fn(),
      findProfilesByEmails: jest.fn(),
      findProfilesByEmployeeIds: jest.fn(),
      updateProfileSession: jest.fn(),
      getProfilesByUserIds: jest.fn(),
      getProfileByUserId: jest.fn(),
      updateProfileByUserId: jest.fn(),
      generateEmployeeId: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };
    const mockModuleRef = {
      resolve: jest.fn().mockResolvedValue(mockUserService),
    } as unknown as jest.Mocked<ModuleRef>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: ProfileRepository,
          useValue: mockProfileRepository,
        },
        {
          provide: ModuleRef,
          useValue: mockModuleRef,
        },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get(ProfileRepository);
    moduleRef = mockModuleRef;
    await service.onModuleInit();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createProfile', () => {
    it('should create a profile successfully', async () => {
      const createProfileDto = {
        userId: mockUserId,
        fullName: 'Test User',
        email: 'jhadi@mailinator.com',
        role: Role.MEMBER,
      };
      profileRepository.createProfile.mockResolvedValue(mockProfile as any);
      const result = await service.createProfile(createProfileDto);
      expect(result).toEqual(mockProfile);
      expect(profileRepository.createProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: expect.any(Types.ObjectId),
          ...createProfileDto,
        }),
      );
    });
    it('should throw error if no data provided', async () => {
      await expect(service.createProfile(null as any)).rejects.toThrow(
        new HttpException(PROFILE.INVALID_DATA, HttpStatus.OK),
      );
    });
    it('should handle creation with session', async () => {
      const createProfileDto = {
        userId: mockUserId,
        fullName: 'Test User',
        email: 'jhadi@mailinator.com',
        role: Role.MEMBER,
      };
      const mockSession = {} as any;
      profileRepository.createUserProfile.mockResolvedValue(mockProfile as any);
      const result = await service.createProfile(createProfileDto, { session: mockSession });
      expect(result).toEqual(mockProfile);
      expect(profileRepository.createUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: expect.any(Types.ObjectId),
          ...createProfileDto,
        }),
        mockSession,
      );
    });
  });
  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        designation: 'Senior Developer',
      };
      const updatedProfile = { ...mockProfile, ...updateData };
      profileRepository.findOne.mockResolvedValue(mockProfile as any);
      profileRepository.updateProfileSession.mockResolvedValue(updatedProfile as any);
      const result = await service.updateProfile(mockUserId.toString(), updateData);
      expect(result).toEqual(updatedProfile);
      expect(profileRepository.updateProfileSession).toHaveBeenCalledWith(
        mockUserId,
        {
          firstName: 'Updated',
          lastName: 'Name',
          fullName: 'Updated Name',
          designation: 'Senior Developer',
        },
        undefined,
      );
    });
    it('should throw error if no user ID provided', async () => {
      await expect(service.updateProfile('', {})).rejects.toThrow(
        new HttpException('👤 We need a user ID', HttpStatus.OK),
      );
    });
    it('should throw error if no update data provided', async () => {
      await expect(service.updateProfile(mockUserId.toString(), null as any)).rejects.toThrow(
        new HttpException(PROFILE.INVALID_DATA, HttpStatus.OK),
      );
    });
  });
  describe('getProfileByUserId', () => {
    it('should get profile by user ID successfully', async () => {
      profileRepository.getProfileByUserId.mockResolvedValue(mockProfile as any);
      const result = await service.getProfileByUserId(mockUserId.toString());
      expect(result).toEqual(mockProfile);
      expect(profileRepository.getProfileByUserId).toHaveBeenCalledWith(mockUserId.toString());
    });
    it('should throw error if profile not found', async () => {
      profileRepository.getProfileByUserId.mockResolvedValue(null);
      await expect(service.getProfileByUserId(mockUserId.toString())).rejects.toThrow(
        new HttpException('Profile not found', HttpStatus.NOT_FOUND),
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
      const updatedProfile = {
        ...mockProfile,
        profilePicture: {
          url: 'https://storage.googleapis.com/iagility-apac/profile_pic_68fa610c3a50f116c7311d73_cropped-image_1769098390620.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=a05deb775880b8bab1b51631bc2cdcf58de47a9c9efe36bedf5ad5d11510594feb0050ced625f6666530f55998849c52074858428f14d39cc88bb471e8733cb942c962a4b3792740b6255f97fa9c266120fba1373067d400b71d35e5a69fc13da5c151d5870731539fe4ce11b20a26c2a3921cb87a5a39e3ea3027e131cc874eb94f88ae51f5fba3d6f52eb09248f96dfea676f6f505c13443d5d59df92310abaaa38394b432954f86e5c5e27cc4b961637255c42ede47d80970133658fe9589d429e3407e0a43dae1eb6f2d617c453f066e044c9518d0c64ec8b8f1b3d48b7bfa6a58f16bc2a49c8aa68f3bc1a19bb7f58fdbd69319aa598d5ef2ed4707ceaf',
        },
      };
      profileRepository.getProfileByUserId.mockResolvedValue(mockProfile as any);
      const { uploadingValidator } = require('@/shared/utils/gcs.utils');
      uploadingValidator.ensureGcsInitialized.mockResolvedValue(undefined);
      uploadingValidator.validationOptions.mockReturnValue({} as any);
      uploadingValidator.validateFile.mockReturnValue(undefined);
      const uploadResult = {
        fileUrl:
          'https://storage.googleapis.com/iagility-apac/profile_pic_68fa610c3a50f116c7311d73_cropped-image_1769098390620.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=a05deb775880b8bab1b51631bc2cdcf58de47a9c9efe36bedf5ad5d11510594feb0050ced625f6666530f55998849c52074858428f14d39cc88bb471e8733cb942c962a4b3792740b6255f97fa9c266120fba1373067d400b71d35e5a69fc13da5c151d5870731539fe4ce11b20a26c2a3921cb87a5a39e3ea3027e131cc874eb94f88ae51f5fba3d6f52eb09248f96dfea676f6f505c13443d5d59df92310abaaa38394b432954f86e5c5e27cc4b961637255c42ede47d80970133658fe9589d429e3407e0a43dae1eb6f2d617c453f066e044c9518d0c64ec8b8f1b3d48b7bfa6a58f16bc2a49c8aa68f3bc1a19bb7f58fdbd69319aa598d5ef2ed4707ceaf',
      };
      uploadingValidator.uploadFile.mockResolvedValue(uploadResult as any);
      uploadingValidator.createProfileFile.mockReturnValue({} as any);
      profileRepository.updateProfileByUserId.mockResolvedValue(updatedProfile as any);
      const result = await service.uploadProfilePicture(mockUserId, mockFile);
      expect(result).toEqual(updatedProfile);
      expect(profileRepository.updateProfileByUserId).toHaveBeenCalled();
    });
    it('should throw error if profile not found', async () => {
      profileRepository.getProfileByUserId.mockResolvedValue(null);
      await expect(service.uploadProfilePicture(mockUserId, mockFile)).rejects.toThrow(
        new HttpException('Profile not found for the given user ID', HttpStatus.OK),
      );
    });
  });
  describe('removeProfilePicture', () => {
    it('should remove profile picture successfully', async () => {
      const profileWithPicture = {
        ...mockProfile,
        profilePicture: {
          url: 'https://storage.googleapis.com/iagility-apac/profile_pic_68fa610c3a50f116c7311d73_cropped-image_1769098390620.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=a05deb775880b8bab1b51631bc2cdcf58de47a9c9efe36bedf5ad5d11510594feb0050ced625f6666530f55998849c52074858428f14d39cc88bb471e8733cb942c962a4b3792740b6255f97fa9c266120fba1373067d400b71d35e5a69fc13da5c151d5870731539fe4ce11b20a26c2a3921cb87a5a39e3ea3027e131cc874eb94f88ae51f5fba3d6f52eb09248f96dfea676f6f505c13443d5d59df92310abaaa38394b432954f86e5c5e27cc4b961637255c42ede47d80970133658fe9589d429e3407e0a43dae1eb6f2d617c453f066e044c9518d0c64ec8b8f1b3d48b7bfa6a58f16bc2a49c8aa68f3bc1a19bb7f58fdbd69319aa598d5ef2ed4707ceaf',
        },
      };
      profileRepository.getProfileByUserId.mockResolvedValue(profileWithPicture as any);
      const { uploadingValidator } = require('@/shared/utils/gcs.utils');
      uploadingValidator.deleteFileFromGcsByUrl.mockResolvedValue(undefined);
      profileRepository.updateProfileByUserId.mockResolvedValue(mockProfile as any);
      const result = await service.removeProfilePicture(mockUserId);
      expect(result).toEqual(mockProfile);
      expect(uploadingValidator.deleteFileFromGcsByUrl).toHaveBeenCalled();
      expect(uploadingValidator.deleteFileFromGcsByUrl).toHaveBeenCalledWith(
        'https://storage.googleapis.com/iagility-apac/profile_pic_68fa610c3a50f116c7311d73_cropped-image_1769098390620.jpg?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=a05deb775880b8bab1b51631bc2cdcf58de47a9c9efe36bedf5ad5d11510594feb0050ced625f6666530f55998849c52074858428f14d39cc88bb471e8733cb942c962a4b3792740b6255f97fa9c266120fba1373067d400b71d35e5a69fc13da5c151d5870731539fe4ce11b20a26c2a3921cb87a5a39e3ea3027e131cc874eb94f88ae51f5fba3d6f52eb09248f96dfea676f6f505c13443d5d59df92310abaaa38394b432954f86e5c5e27cc4b961637255c42ede47d80970133658fe9589d429e3407e0a43dae1eb6f2d617c453f066e044c9518d0c64ec8b8f1b3d48b7bfa6a58f16bc2a49c8aa68f3bc1a19bb7f58fdbd69319aa598d5ef2ed4707ceaf',
      );
    });
    it('should throw error if profile not found', async () => {
      profileRepository.getProfileByUserId.mockResolvedValue(null);
      await expect(service.removeProfilePicture(mockUserId)).rejects.toThrow(
        new HttpException('Profile not found for the given user ID', HttpStatus.OK),
      );
    });
  });
  describe('addDocument', () => {
    const mockFile = {
      originalname: 'document.pdf',
      mimetype: 'application/pdf',
      size: 10000,
      buffer: Buffer.from('test'),
    } as Express.Multer.File;
    it('should add document successfully', async () => {
      const updatedProfile = {
        ...mockProfile,
        documents: [
          {
            url: 'https://storage.googleapis.com/iagility-apac/document_68fa610c3a50f116c7311d73_document.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=document-signature-hash',
          },
        ],
      };
      profileRepository.getProfileByUserId.mockResolvedValue(mockProfile as any);
      const { uploadingValidator } = require('@/shared/utils/gcs.utils');
      uploadingValidator.validationOptions.mockReturnValue({} as any);
      uploadingValidator.validateFile.mockReturnValue(undefined);
      const uploadResult = {
        fileUrl:
          'https://storage.googleapis.com/iagility-apac/document_68fa610c3a50f116c7311d73_document.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=document-signature-hash',
      };
      uploadingValidator.uploadFile.mockResolvedValue(uploadResult as any);
      uploadingValidator.createFile.mockReturnValue({
        url: 'https://storage.googleapis.com/iagility-apac/document_68fa610c3a50f116c7311d73_document.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=document-signature-hash',
      } as any);
      profileRepository.updateProfileByUserId.mockResolvedValue(updatedProfile as any);
      const result = await service.addDocument(mockUserId, mockFile);
      expect(result).toEqual(updatedProfile);
      expect(profileRepository.updateProfileByUserId).toHaveBeenCalledWith(
        mockUserId.toString(),
        expect.objectContaining({
          $push: { documents: expect.any(Object) },
        }),
      );
    });
    it('should throw error if profile not found', async () => {
      profileRepository.getProfileByUserId.mockResolvedValue(null);
      await expect(service.addDocument(mockUserId, mockFile)).rejects.toThrow(
        new HttpException('Profile not found for the given user ID', HttpStatus.OK),
      );
    });
  });
  describe('removeDocument', () => {
    const documentId = new Types.ObjectId();
    it('should remove document successfully', async () => {
      const profileWithDocument = {
        ...mockProfile,
        documents: [
          {
            _id: documentId,
            url: 'https://storage.googleapis.com/iagility-apac/document_68fa610c3a50f116c7311d73_document.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=document-signature-hash',
          },
        ],
      };
      profileRepository.getProfileByUserId.mockResolvedValue(profileWithDocument as any);
      const { uploadingValidator } = require('@/shared/utils/gcs.utils');
      uploadingValidator.deleteFileFromGcsByUrl.mockResolvedValue(undefined);
      profileRepository.updateProfileByUserId.mockResolvedValue(mockProfile as any);
      const result = await service.removeDocument(mockUserId, documentId);
      expect(result).toEqual(mockProfile);
      expect(uploadingValidator.deleteFileFromGcsByUrl).toHaveBeenCalled();
      expect(uploadingValidator.deleteFileFromGcsByUrl).toHaveBeenCalledWith(
        'https://storage.googleapis.com/iagility-apac/document_68fa610c3a50f116c7311d73_document.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=stroageaccesskey%40artful-talon-269415.iam.gserviceaccount.com%2F20260122%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20260122T161311Z&X-Goog-Expires=604800&X-Goog-SignedHeaders=host&X-Goog-Signature=document-signature-hash',
      );
    });
    it('should throw error if profile not found', async () => {
      profileRepository.getProfileByUserId.mockResolvedValue(null);
      await expect(service.removeDocument(mockUserId, documentId)).rejects.toThrow(
        new HttpException('Profile not found for the given user ID', HttpStatus.OK),
      );
    });
  });
  describe('submitMissionStatement', () => {
    const missionDto: CreateStatementDto = {
      content: 'This is my mission statement',
    };
    it('should submit mission statement successfully', async () => {
      mockUserService.getUserById.mockResolvedValue(mockUser as any);
      profileRepository.getProfileByUserId.mockResolvedValue(mockProfile as any);
      profileRepository.updateProfileByUserId.mockResolvedValue(mockProfile as any);
      const {
        EmailstatementService,
      } = require('@/services/email/profile/email-profile-process.service');
      EmailstatementService.notifyStatement.mockResolvedValue(undefined);
      const { CamelCase } = require('@/shared/utils/response.utils');
      CamelCase.mockReturnValue('pending');
      const result = await service.submitMissionStatement(missionDto, mockAuthUser as any);
      expect(result).toEqual({
        userId: mockUser._id.toString(),
        fullName: mockUser.fullName || '',
        role: mockUser.role || '',
        employeeId: mockProfile.employeeId || '',
        designation: mockProfile.designation || '',
        pictureUrl: '',
        missionStatement: missionDto.content,
        status: 'pending',
      });
      expect(EmailstatementService.notifyStatement).toHaveBeenCalled();
    });
    it('should throw error if user not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);
      await expect(service.submitMissionStatement(missionDto, mockAuthUser as any)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
  describe('generateEmployeeId', () => {
    it('should generate employee ID successfully', async () => {
      const employeeId = 'EMP001';
      profileRepository.generateEmployeeId.mockResolvedValue(employeeId);
      const result = await service.generateEmployeeId();
      expect(result).toBe(employeeId);
      expect(profileRepository.generateEmployeeId).toHaveBeenCalled();
    });
  });
  describe('findProfilesByEmails', () => {
    it('should find profiles by emails', async () => {
      const emails = ['jhadi@mailinator.com', 'mumer@mailinator.com'];
      profileRepository.findProfilesByEmails.mockResolvedValue([mockProfile] as any);
      const result = await service.findProfilesByEmails(emails);
      expect(result).toEqual([mockProfile]);
      expect(profileRepository.findProfilesByEmails).toHaveBeenCalledWith(emails);
    });
  });
  describe('findProfilesByEmployeeIds', () => {
    it('should find profiles by employee IDs', async () => {
      const employeeIds = ['MAS-MIS-5062', 'MAS-MIS-5063'];
      profileRepository.findProfilesByEmployeeIds.mockResolvedValue([mockProfile] as any);
      const result = await service.findProfilesByEmployeeIds(employeeIds);
      expect(result).toEqual([mockProfile]);
      expect(profileRepository.findProfilesByEmployeeIds).toHaveBeenCalledWith(employeeIds);
    });
  });
  describe('getProfilesByUserIds', () => {
    it('should get profiles by user IDs', async () => {
      const userIds = [mockUserId];
      profileRepository.getProfilesByUserIds.mockResolvedValue([mockProfile] as any);
      const result = await service.getProfilesByUserIds(userIds);
      expect(result).toEqual([mockProfile]);
      expect(profileRepository.getProfilesByUserIds).toHaveBeenCalledWith(userIds, undefined);
    });
  });
});
