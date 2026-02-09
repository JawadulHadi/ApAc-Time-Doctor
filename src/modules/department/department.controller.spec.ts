import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { UserPayload } from '@/types/interfaces/jwt.interface';

import { DepartmentsController } from './department.controller';
import { DepartmentService } from './department.service';
jest.mock('@/core/decorators/permission.decorators', () => ({
  Permission: jest.fn(() => ({})),
}));
jest.mock('@nestjs/swagger', () => ({
  ApiOperation: jest.fn(() => ({})),
  ApiResponse: jest.fn(() => ({})),
  ApiTags: jest.fn(() => ({})),
  ApiBearerAuth: jest.fn(() => ({})),
}));
describe('DepartmentsController (unit)', () => {
  let controller: DepartmentsController;
  let departmentService: jest.Mocked<DepartmentService>;
  const mockUser: UserPayload = {
    _id: new Types.ObjectId().toString(),
    email: 'test@mailinator.com',
    role: 'ADMIN',
  } as any;
  const mockDepartment = {
    _id: new Types.ObjectId(),
    name: 'Test Department',
    description: 'Test department description',
    isActive: true,
    teamLead: new Types.ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(async () => {
    const mockDepartmentService = {
      create: jest.fn(),
      findAll: jest.fn(),
      getDepartmentById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getAllMetadata: jest.fn(),
      getDepartmentByIdLean: jest.fn(),
      findOneLean: jest.fn(),
      getDepartmentsByIdsLean: jest.fn(),
      validateAndGetTeamLeadDetail: jest.fn(),
      handleTeamLeadRemoval: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        {
          provide: DepartmentService,
          useValue: mockDepartmentService,
        },
      ],
    }).compile();
    controller = module.get<DepartmentsController>(DepartmentsController);
    departmentService = module.get(DepartmentService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('createDepartment', () => {
    it('should create department successfully', async () => {
      const createDto = {
        name: 'New Department',
        description: 'New department description',
      };
      const expectedDepartment = { ...mockDepartment, ...createDto };
      departmentService.create.mockResolvedValue(expectedDepartment as any);
      const result = await controller.create(createDto);
      expect(departmentService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedDepartment);
    });
    it('should throw error for duplicate department name', async () => {
      const createDto = {
        name: 'Test Department',
        description: 'Test department description',
      };
      departmentService.create.mockRejectedValue(
        new Error('Department with this name already exists'),
      );
      await expect(controller.create(createDto)).rejects.toThrow(
        new Error('Department with this name already exists'),
      );
    });
  });
  describe('getAllDepartments', () => {
    it('should return all departments', async () => {
      const expectedDepartments = [mockDepartment];
      departmentService.getAllMetadata.mockResolvedValue(expectedDepartments as any);
      const result = await controller.getAllMetadata();
      expect(departmentService.getAllMetadata).toHaveBeenCalled();
      expect(result).toEqual(expectedDepartments);
    });
  });
  describe('getDepartmentById', () => {
    it('should return department by ID', async () => {
      const departmentId = new Types.ObjectId();
      departmentService.getDepartmentById.mockResolvedValue(mockDepartment as any);
      const result = await controller.getDepartmentById(departmentId.toString());
      expect(departmentService.getDepartmentById).toHaveBeenCalledWith(departmentId.toString());
      expect(result).toEqual(mockDepartment);
    });
    it('should throw error for invalid department ID', async () => {
      await expect(controller.getDepartmentById('invalid-id')).rejects.toThrow(
        new Error('Invalid department ID format'),
      );
    });
    it('should throw error when department not found', async () => {
      const departmentId = new Types.ObjectId();
      departmentService.getDepartmentById.mockRejectedValue(new Error('Department not found'));
      await expect(controller.getDepartmentById(departmentId.toString())).rejects.toThrow(
        new Error('Department not found'),
      );
    });
  });
  describe('updateDepartment', () => {
    it('should update department successfully', async () => {
      const departmentId = new Types.ObjectId();
      const updateDto = {
        name: 'Updated Department',
        description: 'Updated description',
      };
      const updatedDepartment = { ...mockDepartment, ...updateDto };
      departmentService.update.mockResolvedValue(updatedDepartment as any);
      const result = await controller.update(departmentId.toString(), updateDto);
      expect(departmentService.update).toHaveBeenCalledWith(
        new Types.ObjectId(departmentId.toString()),
        updateDto,
      );
      expect(result).toEqual(updatedDepartment);
    });
    it('should throw error for invalid department ID', async () => {
      await expect(controller.update('invalid-id', {})).rejects.toThrow(
        new Error('Invalid department ID format'),
      );
    });
  });
  describe('getAllMetadata', () => {
    it('should return all departments with roles', async () => {
      const expectedDepartments = [mockDepartment];
      const expectedRoles = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'MEMBER', label: 'Member' },
      ];
      departmentService.getAllMetadata.mockResolvedValue({
        departments: expectedDepartments,
        roles: expectedRoles,
      });
      const result = await controller.getAllMetadata();
      expect(departmentService.getAllMetadata).toHaveBeenCalled();
      expect(result).toEqual({
        departments: expectedDepartments,
        roles: expectedRoles,
      });
    });
  });
});
