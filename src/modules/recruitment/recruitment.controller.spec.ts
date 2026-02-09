import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserPayload } from '@/types/interfaces/jwt.interface';

import { AddCandidateDto } from './dto/recruitment.dto';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentService } from './recruitment.service';
jest.mock('@/core/decorators/permission.decorators', () => ({
  Permission: jest.fn(() => ({})),
}));
jest.mock('@nestjs/swagger', () => ({
  ApiOperation: jest.fn(() => ({})),
  ApiResponse: jest.fn(() => ({})),
  ApiTags: jest.fn(() => ({})),
  ApiBearerAuth: jest.fn(() => ({})),
}));
describe('RecruitmentController (unit)', () => {
  let controller: RecruitmentController;
  let recruitmentService: jest.Mocked<RecruitmentService>;
  const mockUser: UserPayload = {
    _id: new Types.ObjectId().toString(),
    email: 'test@mailinator.com',
    role: 'ADMIN',
  } as any;
  const mockRecruitment = {
    _id: new Types.ObjectId(),
    candidateName: 'John Doe',
    email: 'john.doe@mailinator.com',
    phone: '+1234567890',
    position: 'Software Developer',
    status: 'PENDING',
    experience: '5 years',
    skills: ['JavaScript', 'Node', 'React'],
    resumeUrl: 'https://example.com/resume.pdf',
    appliedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(async () => {
    const mockRecruitmentService = {
      addCandidate: jest.fn(),
      fetchAllCandidates: jest.fn(),
      requestClarification: jest.fn(),
      requestPersonalInfoWithDocuments: jest.fn(),
      requestCompletePersonalInfo: jest.fn(),
      moveToOnboarding: jest.fn(),
      archiveCandidate: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruitmentController],
      providers: [
        {
          provide: RecruitmentService,
          useValue: mockRecruitmentService,
        },
      ],
    }).compile();
    controller = module.get<RecruitmentController>(RecruitmentController);
    recruitmentService = module.get(RecruitmentService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('addCandidate', () => {
    it('should create candidate successfully', async () => {
      const createDto: AddCandidateDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mailinator.com',
        jobTitle: 'Software Developer',
        department: new Types.ObjectId(),
        timingStart: '09:00 AM',
        timingEnd: '06:00 PM',
      };
      const expectedCandidate = { ...mockRecruitment, ...createDto };
      recruitmentService.addCandidate.mockResolvedValue(expectedCandidate as any);
      const result = await controller.addCandidate(createDto, mockUser);
      expect(recruitmentService.addCandidate).toHaveBeenCalledWith(
        createDto,
        new Types.ObjectId(mockUser._id),
      );
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(expectedCandidate);
    });
    it('should throw error for duplicate email', async () => {
      const createDto: AddCandidateDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@mailinator.com',
        jobTitle: 'Software Developer',
        department: new Types.ObjectId(),
        timingStart: '09:00 AM',
        timingEnd: '06:00 PM',
      };
      recruitmentService.addCandidate.mockRejectedValue(
        new Error('Candidate with this email already exists'),
      );
      await expect(controller.addCandidate(createDto, mockUser)).rejects.toThrow(
        new Error('Candidate with this email already exists'),
      );
    });
  });
  describe('getAllCandidates', () => {
    it('should return all candidates', async () => {
      const query = {};
      const expectedCandidates = { candidates: [mockRecruitment] };
      recruitmentService.fetchAllCandidates.mockResolvedValue(expectedCandidates as any);
      const result = await controller.getAllCandidates(query, mockUser);
      expect(recruitmentService.fetchAllCandidates).toHaveBeenCalledWith(query);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(expectedCandidates);
    });
  });
  describe('requestClarification', () => {
    it('should request clarification successfully', async () => {
      const candidateId = new Types.ObjectId();
      const clarificationResult = { formUrl: 'https://example.com/clarification/123' };
      recruitmentService.requestClarification.mockResolvedValue(clarificationResult as any);
      const result = await controller.requestClarification(candidateId, mockUser);
      expect(recruitmentService.requestClarification).toHaveBeenCalledWith(
        candidateId,
        new Types.ObjectId(mockUser._id),
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(clarificationResult);
    });
  });
  describe('requestPersonalInfoWithDocuments', () => {
    it('should request personal info successfully', async () => {
      const candidateId = new Types.ObjectId();
      const personalInfoResult = { formUrl: 'https://example.com/personal-info/123' };
      recruitmentService.requestPersonalInfoWithDocuments.mockResolvedValue(
        personalInfoResult as any,
      );
      const result = await controller.requestPersonalInfoWithDocuments(candidateId, mockUser);
      expect(recruitmentService.requestPersonalInfoWithDocuments).toHaveBeenCalledWith(
        candidateId.toString(),
        new Types.ObjectId(mockUser._id),
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(personalInfoResult);
    });
  });
  describe('requestCompletePersonalInfo', () => {
    it('should complete personal info successfully', async () => {
      const candidateId = new Types.ObjectId();
      const completedCandidate = { ...mockRecruitment, status: 'personal_info_completed' };
      recruitmentService.requestCompletePersonalInfo.mockResolvedValue(completedCandidate as any);
      const result = await controller.requestCompletePersonalInfo(candidateId, mockUser);
      expect(recruitmentService.requestCompletePersonalInfo).toHaveBeenCalledWith(
        candidateId.toString(),
        new Types.ObjectId(mockUser._id),
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(completedCandidate);
    });
  });
  describe('moveToOnboarding', () => {
    it('should move candidate to onboarding successfully', async () => {
      const candidateId = new Types.ObjectId();
      const createUserDto = {
        email: 'john.doe@mailinator.com',
        password: 'TempPassword123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'MEMBER',
        department: new Types.ObjectId().toString(),
      };
      const onboardingResult = {
        user: { _id: new Types.ObjectId(), email: 'john.doe@mailinator.com' },
        authUser: { _id: new Types.ObjectId(), email: 'john.doe@mailinator.com' },
      };
      recruitmentService.moveToOnboarding.mockResolvedValue(onboardingResult as any);
      const result = await controller.moveToOnboarding(candidateId, mockUser, createUserDto);
      expect(recruitmentService.moveToOnboarding).toHaveBeenCalledWith(
        candidateId.toString(),
        new Types.ObjectId(mockUser._id),
        createUserDto,
      );
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
  describe('archiveCandidate', () => {
    it('should archive candidate successfully', async () => {
      const candidateId = new Types.ObjectId();
      recruitmentService.archiveCandidate.mockResolvedValue(undefined);
      const result = await controller.archiveCandidate(candidateId, mockUser);
      expect(recruitmentService.archiveCandidate).toHaveBeenCalledWith(candidateId.toString());
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });
});
