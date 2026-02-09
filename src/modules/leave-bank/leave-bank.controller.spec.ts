import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserPayload } from '@/types/interfaces/jwt.interface';

// Import directly to avoid circular dependencies
import { LeaveBankController } from './leave-bank.controller';
import { LeaveBankService } from './leave-bank.service';
import { BankRecordService } from './process/leave-bank-processor.service';
// Mock decorators
jest.mock('@/core/decorators/permission.decorators', () => ({
  Permission: jest.fn(() => ({})),
}));
jest.mock('@nestjs/swagger', () => ({
  ApiOperation: jest.fn(() => ({})),
  ApiResponse: jest.fn(() => ({})),
  ApiTags: jest.fn(() => ({})),
  ApiBearerAuth: jest.fn(() => ({})),
}));
describe('LeaveBankController (unit)', () => {
  let controller: LeaveBankController;
  let leaveBankService: jest.Mocked<LeaveBankService>;
  let leaveBankProcessorService: jest.Mocked<BankRecordService>;
  let leaveBankEmailService: any;
  const mockUser: UserPayload = {
    _id: new Types.ObjectId().toString(),
    email: 'test@mailinator.com',
    role: 'ADMIN',
  } as any;
  const mockLeaveBank = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    employeeId: 'EMP001',
    year: 2024,
    monthlyData: {
      '2024': {
        months: {
          january: {
            workingDays: 22,
            shortHours: 2,
            casualLeave: 1,
            sickLeave: 0,
            absent: 0,
            extraHours: 4,
            netHoursWorked: 176,
          },
        },
        summary: { totalCL: 12, totalSL: 8, remainingCL: 11, remainingSL: 8 },
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(async () => {
    const mockLeaveBankService = {
      fetchRecords: jest.fn(),
      notifyDiscrepancyResolved: jest.fn(),
    };
    const mockLeaveBankProcessorService = {
      processBank: jest.fn(),
    };
    const mockLeaveBankEmailService = {
      emailsToEmployees: jest.fn(),
      EmailsToAllUsers: jest.fn(),
      emailToEmployee: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveBankController],
      providers: [
        {
          provide: LeaveBankService,
          useValue: mockLeaveBankService,
        },
        {
          provide: BankRecordService,
          useValue: mockLeaveBankProcessorService,
        },
        {
          provide: 'LeaveBankEmailService',
          useValue: mockLeaveBankEmailService,
        },
      ],
    }).compile();
    controller = module.get<LeaveBankController>(LeaveBankController);
    leaveBankService = module.get(LeaveBankService);
    leaveBankProcessorService = module.get(BankRecordService);
    leaveBankEmailService = (controller as any).leaveBankEmailService;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('fetchAllRecords', () => {
    it('should fetch all leave bank records successfully', async () => {
      const expectedResult = {
        records: [mockLeaveBank],
        originalRecords: [mockLeaveBank],
      };
      leaveBankService.fetchRecords.mockResolvedValue(expectedResult as any);
      const result = await controller.fetchAllRecords(mockUser, '2024');
      expect(leaveBankService.fetchRecords).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.records).toBeDefined();
      expect(result.data.myRecords).toBeDefined();
      expect(result.data.analytics).toBeDefined();
    });
    it('should handle empty records case', async () => {
      const expectedResult = {
        records: [],
        originalRecords: [],
      };
      leaveBankService.fetchRecords.mockResolvedValue(expectedResult as any);
      const result = await controller.fetchAllRecords(mockUser);
      expect(result.success).toBe(true);
      expect(result.data.records).toEqual([]);
      expect(result.data.myRecords).toEqual([]);
      expect(result.message).toContain('Currently Updating Your recrods');
    });
  });
  describe('uploadLeaveBankFile', () => {
    it('should upload and process leave bank file successfully', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'leave-bank.xlsx',
        buffer: Buffer.from('test content'),
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      } as Express.Multer.File;
      const processResult = {
        totalRecords: 10,
        processed: 10,
        errors: 0,
        createdCount: 5,
        updatedCount: 5,
      };
      const fetchResult = {
        records: [mockLeaveBank],
        originalRecords: [mockLeaveBank],
      };
      leaveBankProcessorService.processBank.mockResolvedValue(processResult as any);
      leaveBankService.fetchRecords.mockResolvedValue(fetchResult as any);
      const result = await controller.uploadLeaveBankFile(
        mockFile,
        mockUser,
        { month: 'january' },
        'january',
      );
      expect(leaveBankProcessorService.processBank).toHaveBeenCalledWith(
        mockFile.buffer,
        'january',
        mockFile.originalname,
      );
      expect(result.success).toBe(true);
      expect(result.data.totalRecords).toBe(10);
      expect(result.data.processed).toBe(10);
    });
  });
  describe('notifyAllUsers', () => {
    it('should send bulk emails successfully', async () => {
      const emailDto = {
        employeeIds: ['EMP001', 'EMP002'],
        baseUrl: 'https://example.com',
      };
      const emailResult = {
        success: true,
        sent: 2,
        failed: 0,
      };
      const fetchResult = {
        records: [mockLeaveBank],
        originalRecords: [mockLeaveBank],
      };
      leaveBankEmailService.emailsToEmployees.mockResolvedValue(emailResult);
      leaveBankService.fetchRecords.mockResolvedValue(fetchResult as any);
      const result = await controller.notifyAllUsers(
        mockUser,
        emailDto,
        2024,
        'january',
        'Engineering',
      );
      expect(leaveBankEmailService.emailsToEmployees).toHaveBeenCalledWith(
        emailDto.employeeIds,
        expect.any(Object),
      );
      expect(result.success).toBe(true);
    });
  });
  describe('sendSingleUserEmail', () => {
    it('should send email to single user successfully', async () => {
      const employeeId = 'EMP001';
      const emailDto = {
        baseUrl: 'https://example.com',
      };
      leaveBankEmailService.emailToEmployee.mockResolvedValue({ success: true });
      const result = await controller.sendSingleUserEmail(employeeId, emailDto, 'january', 2024);
      expect(leaveBankEmailService.emailToEmployee).toHaveBeenCalledWith(
        employeeId,
        expect.any(Object),
      );
      expect(result.success).toBe(true);
    });
  });
  describe('notifyDiscrepancyResolved', () => {
    it('should notify discrepancy resolved successfully', async () => {
      const employeeId = 'EMP001';
      const discrepancyDto = {
        sendEmail: true,
        baseUrl: 'https://example.com',
        month: 'january',
        year: 2024,
        remarks: 'Discrepancy resolved',
      };
      leaveBankService.notifyDiscrepancyResolved.mockResolvedValue({
        success: true,
        data: {},
        message: 'Success',
      });
      const result = await controller.notifyDiscrepancyResolved(employeeId, discrepancyDto);
      expect(leaveBankService.notifyDiscrepancyResolved).toHaveBeenCalledWith(
        employeeId,
        discrepancyDto.sendEmail,
        discrepancyDto.baseUrl,
        discrepancyDto.month,
        discrepancyDto.year,
      );
      expect(result.success).toBe(true);
    });
  });
});
