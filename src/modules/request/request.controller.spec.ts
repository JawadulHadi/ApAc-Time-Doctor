import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { AddRemarksDto, CreateRequestDto, ProcessActionDto } from './dto/request-dto';
import { ApiResponseDto } from '@/core/decorators/api-response.decorators';
import { ActionType, RequestStatus, RequestType } from '@/types/enums/request.enums';
import { UserPayload } from '@/types/interfaces/jwt.interface';

import { RequestController } from './request.controller';
import { RequestService } from './request.service';
jest.mock('@/core/decorators/permission.decorators', () => ({
  Permission: jest.fn(() => ({})),
}));

jest.mock('@nestjs/swagger', () => ({
  ApiOperation: jest.fn(() => ({})),
  ApiResponse: jest.fn(() => ({})),
  ApiTags: jest.fn(() => ({})),
  ApiBearerAuth: jest.fn(() => ({})),
}));

/**
 * Unit tests for RequestController
 * Tests all controller endpoints with proper validation and error handling
 */
describe('RequestController', () => {
  let controller: RequestController;
  let requestService: jest.Mocked<RequestService>;

  /**
   * Mock user payload for testing
   */
  const mockUser: UserPayload = {
    _id: new Types.ObjectId().toString(),
    email: 'test@mailinator.com',
    role: 'MEMBER',
    fullName: 'Test User',
  } as any;

  /**
   * Mock request object for testing
   */
  const mockRequest = {
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(),
    requestType: RequestType.WORK_FROM_HOME,
    status: RequestStatus.PENDING,
    requestedDates: ['2024-01-15', '2024-01-16', '2024-01-17'],
    days: 3,
    reason: 'Personal work from home',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  /**
   * Setup test module before each test
   */
  beforeEach(async () => {
    const mockRequestService = {
      createRequest: jest.fn(),
      getOneRequest: jest.fn(),
      getAllRequests: jest.fn(),
      addRemarks: jest.fn(),
      processRequest: jest.fn(),
      withdrawRequest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: mockRequestService,
        },
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);
    requestService = module.get(RequestService);
  });

  /**
   * Clear all mocks after each test
   */
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for createRequest endpoint
   */
  describe('createRequest', () => {
    it('should create request successfully', async () => {
      const createDto: CreateRequestDto = {
        requestType: RequestType.WORK_FROM_HOME,
        requestedDates: ['2024-01-15', '2024-01-16', '2024-01-17'],
        reason: 'Personal work from home',
      };

      const expectedRequest = { ...mockRequest, ...createDto };
      requestService.createRequest.mockResolvedValue(expectedRequest as any);

      const result = await controller.createRequest(createDto, mockUser);

      expect(requestService.createRequest).toHaveBeenCalledWith(
        createDto,
        new Types.ObjectId(mockUser._id),
        mockUser,
      );
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: expectedRequest,
          message: 'Shared Successfully',
        }),
      );
    });

    it('should throw UnauthorizedException when user ID is missing', async () => {
      const createDto: CreateRequestDto = {
        requestType: RequestType.WORK_FROM_HOME,
        requestedDates: ['2024-01-15'],
        reason: 'Test',
      };

      const invalidUser = { ...mockUser, _id: undefined } as any;

      await expect(controller.createRequest(createDto, invalidUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle validation errors from service', async () => {
      const createDto: CreateRequestDto = {
        requestType: RequestType.WORK_FROM_HOME,
        requestedDates: ['2024-01-15'],
        reason: 'Test',
      };

      requestService.createRequest.mockRejectedValue(new BadRequestException('Invalid date range'));

      await expect(controller.createRequest(createDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /**
   * Test suite for getAllRequest endpoint
   */
  describe('getAllRequest', () => {
    it('should return all requests without pagination', async () => {
      const expectedRequests = { requests: [mockRequest], myRequests: [] };
      requestService.getAllRequests.mockResolvedValue(expectedRequests as any);

      const result = await controller.getAllRequest(mockUser, {});

      expect(requestService.getAllRequests).toHaveBeenCalledWith(mockUser, {}, undefined);
      expect(result).toEqual(
        ApiResponseDto.success(expectedRequests, 'Requests retrieved successfully'),
      );
    });

    it('should return paginated requests when pagination params provided', async () => {
      const query = { page: '1', limit: '10', status: RequestStatus.PENDING };
      const expectedRequests = {
        requests: [mockRequest],
        myRequests: [],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      requestService.getAllRequests.mockResolvedValue(expectedRequests as any);

      const result = await controller.getAllRequest(mockUser, query);

      expect(requestService.getAllRequests).toHaveBeenCalledWith(
        mockUser,
        { status: RequestStatus.PENDING },
        { page: 1, limit: 10 },
      );
      expect(result).toEqual(
        ApiResponseDto.success(expectedRequests, 'Requests retrieved successfully'),
      );
    });

    it('should handle pagination with default values', async () => {
      const query = { page: undefined, limit: '5' };
      const expectedRequests = { requests: [mockRequest], myRequests: [] };

      requestService.getAllRequests.mockResolvedValue(expectedRequests as any);

      await controller.getAllRequest(mockUser, query);

      expect(requestService.getAllRequests).toHaveBeenCalledWith(
        mockUser,
        {},
        { page: 1, limit: 5 },
      );
    });
  });

  /**
   * Test suite for getOneRequest endpoint
   */
  describe('getOneRequest', () => {
    it('should return request by ID', async () => {
      const requestId = new Types.ObjectId().toString();
      requestService.getOneRequest.mockResolvedValue(mockRequest as any);

      const result = await controller.getOneRequest(requestId, mockUser);

      expect(requestService.getOneRequest).toHaveBeenCalledWith(requestId, mockUser);
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: mockRequest,
          message: 'request and user details retrieved successfully',
        }),
      );
    });

    it('should handle request not found', async () => {
      const requestId = new Types.ObjectId().toString();
      requestService.getOneRequest.mockResolvedValue(null);

      await expect(controller.getOneRequest(requestId, mockUser)).rejects.toThrow();
    });
  });

  /**
   * Test suite for addRemarks endpoint
   */
  describe('addRemarks', () => {
    it('should add remarks to request successfully', async () => {
      const requestId = new Types.ObjectId().toString();
      const remarksDto: AddRemarksDto = {
        remark: 'Test remarks',
      };

      const updatedRequest = {
        ...mockRequest,
        remarks: [
          { by: mockUser._id, role: mockUser.role, remark: remarksDto.remark, date: new Date() },
        ],
      };

      requestService.addRemarks.mockResolvedValue(updatedRequest as any);

      const result = await controller.addRemarks(requestId, remarksDto, mockUser);

      expect(requestService.addRemarks).toHaveBeenCalledWith(requestId, remarksDto, mockUser);
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: updatedRequest,
          message: 'Remarks added successfully',
        }),
      );
    });

    it('should handle empty remark validation', async () => {
      const requestId = new Types.ObjectId().toString();
      const remarksDto: AddRemarksDto = {
        remark: '',
      };

      requestService.addRemarks.mockRejectedValue(
        new BadRequestException('Remark cannot be empty'),
      );

      await expect(controller.addRemarks(requestId, remarksDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /**
   * Test suite for processRequest endpoint
   */
  describe('processRequest', () => {
    it('should approve request successfully', async () => {
      const requestId = new Types.ObjectId().toString();
      const processDto: ProcessActionDto = {
        action: ActionType.APPROVED,
        remarks: 'Approved for valid reasons',
      };

      const processedRequest = { ...mockRequest, status: RequestStatus.APPROVED };
      requestService.processRequest.mockResolvedValue(processedRequest as any);

      const result = await controller.processRequest(requestId, processDto, mockUser);

      expect(requestService.processRequest).toHaveBeenCalledWith(requestId, processDto, mockUser);
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: processedRequest,
          message: 'Approved successfully',
        }),
      );
    });

    it('should disapprove request successfully', async () => {
      const requestId = new Types.ObjectId().toString();
      const processDto: ProcessActionDto = {
        action: ActionType.DISAPPROVED,
        remarks: 'Insufficient information',
      };

      const processedRequest = { ...mockRequest, status: RequestStatus.DISAPPROVED };
      requestService.processRequest.mockResolvedValue(processedRequest as any);

      const result = await controller.processRequest(requestId, processDto, mockUser);

      expect(requestService.processRequest).toHaveBeenCalledWith(requestId, processDto, mockUser);
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: processedRequest,
          message: 'Disapproved successfully',
        }),
      );
    });

    it('should handle invalid action type', async () => {
      const requestId = new Types.ObjectId().toString();
      const processDto = {
        action: 'INVALID_ACTION' as ActionType,
        remarks: 'Test',
      };

      requestService.processRequest.mockRejectedValue(
        new BadRequestException('Invalid action type'),
      );

      await expect(controller.processRequest(requestId, processDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /**
   * Test suite for withdrawRequest endpoint
   */
  describe('withdrawRequest', () => {
    it('should withdraw request successfully', async () => {
      const requestId = new Types.ObjectId().toString();
      const withdrawnRequest = { ...mockRequest, status: RequestStatus.WITHDRAWN };

      requestService.withdrawRequest.mockResolvedValue(withdrawnRequest as any);

      const result = await controller.withdrawRequest(requestId, mockUser);

      expect(requestService.withdrawRequest).toHaveBeenCalledWith(requestId, mockUser);
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: withdrawnRequest,
          message: 'Withdrawn successfully',
        }),
      );
    });

    it('should handle withdrawal of non-pending request', async () => {
      const requestId = new Types.ObjectId().toString();
      requestService.withdrawRequest.mockRejectedValue(
        new BadRequestException('Cannot withdraw approved request'),
      );

      await expect(controller.withdrawRequest(requestId, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /**
   * Test suite for getUserRequests endpoint
   */
  describe('getUserRequests', () => {
    it('should return user requests without pagination', async () => {
      const expectedRequests = { requests: [], myRequests: [mockRequest] };
      requestService.getAllRequests.mockResolvedValue(expectedRequests as any);

      const result = await controller.getUserRequests(mockUser, {});

      expect(requestService.getAllRequests).toHaveBeenCalledWith(
        mockUser,
        { user: new Types.ObjectId(mockUser._id) },
        undefined,
      );
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: expectedRequests,
          message: 'Found 1 request(s) for the user',
        }),
      );
    });

    it('should return paginated user requests', async () => {
      const query = { page: '2', limit: '5' };
      const expectedRequests = {
        requests: [],
        myRequests: [mockRequest],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1,
      };

      requestService.getAllRequests.mockResolvedValue(expectedRequests as any);

      const result = await controller.getUserRequests(mockUser, query);

      expect(requestService.getAllRequests).toHaveBeenCalledWith(
        mockUser,
        { user: new Types.ObjectId(mockUser._id) },
        { page: 2, limit: 5 },
      );
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: expectedRequests,
          message: 'Found 1 request(s) for the user',
        }),
      );
    });

    it('should handle empty user requests', async () => {
      const expectedRequests = { requests: [], myRequests: [] };
      requestService.getAllRequests.mockResolvedValue(expectedRequests as any);

      const result = await controller.getUserRequests(mockUser, {});

      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          data: expectedRequests,
          message: 'Found 0 request(s) for the user',
        }),
      );
    });
  });
});
