import { HttpException, HttpStatus } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { DEPARTMENT } from '../../types/constants/error-messages.constants';
import { DepartmentRepository } from './department.repository';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
describe('DepartmentService', () => {
  let service: DepartmentService;
  const mockDepartmentId = new Types.ObjectId();
  const mockUserId = new Types.ObjectId();
  const mockDepartment = {
    _id: mockDepartmentId,
    name: 'Engineering',
    description: 'Software development team',
    teamLead: mockUserId,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockDepartmentRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByName: jest.fn(),
  };
  const mockProfileService = {
    getProfileByUserId: jest.fn(),
  };
  const mockUserService = {
    getUserById: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: DepartmentRepository,
          useValue: mockDepartmentRepository,
        },
        {
          provide: ModuleRef,
          useValue: {
            resolve: jest.fn().mockImplementation(serviceType => {
              if (serviceType.name === 'ProfileService') {
                return Promise.resolve(mockProfileService);
              }
              if (serviceType.name === 'UserService') {
                return Promise.resolve(mockUserService);
              }
              return Promise.resolve(null);
            }),
          },
        },
      ],
    }).compile();
    service = module.get<DepartmentService>(DepartmentService);
    await service.onModuleInit();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    const createDto: CreateDepartmentDto = {
      name: 'Marketing',
      description: 'Marketing team',
      teamLead: mockUserId,
    };
    it('should create a department successfully', async () => {
      mockDepartmentRepository.findByName.mockResolvedValue(null);
      mockDepartmentRepository.create.mockResolvedValue(mockDepartment);
      const result = await service.create(createDto);
      expect(mockDepartmentRepository.findByName).toHaveBeenCalledWith(createDto.name);
      expect(mockDepartmentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(createDto),
      );
      expect(result).toEqual(mockDepartment);
    });
    it('should throw ConflictException if department name already exists', async () => {
      mockDepartmentRepository.findByName.mockResolvedValue(mockDepartment);
      await expect(service.create(createDto)).rejects.toThrow(
        new HttpException(DEPARTMENT.ALREADY_EXISTS, HttpStatus.CONFLICT),
      );
      expect(mockDepartmentRepository.findByName).toHaveBeenCalledWith(createDto.name);
      expect(mockDepartmentRepository.create).not.toHaveBeenCalled();
    });
  });
  describe('getDepartmentById', () => {
    it('should return department by ID', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      const result = await service.getDepartmentById(mockDepartmentId.toString());
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith(mockDepartmentId);
      expect(result).toEqual(mockDepartment);
    });
    it('should throw HttpException if invalid ID provided', async () => {
      await expect(service.getDepartmentById('invalid-id')).rejects.toThrow(
        new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK),
      );
    });
    it('should throw HttpException if department not found', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(null);
      await expect(service.getDepartmentById(mockDepartmentId.toString())).rejects.toThrow(
        new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK),
      );
    });
  });
  describe('findAll', () => {
    it('should return all departments', async () => {
      const mockDepartments = [mockDepartment];
      mockDepartmentRepository.findAll.mockResolvedValue(mockDepartments);
      const result = await service.findAll();
      expect(mockDepartmentRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDepartments);
    });
  });
  describe('getAllMetadata', () => {
    it('should return all departments with roles', async () => {
      const mockDepartments = [mockDepartment];
      mockDepartmentRepository.findAll.mockResolvedValue(mockDepartments);
      const result = await service.getAllMetadata();
      expect(mockDepartmentRepository.findAll).toHaveBeenCalled();
      expect(result.departments).toEqual(mockDepartments);
      expect(result.roles).toBeDefined();
      expect(Array.isArray(result.roles)).toBe(true);
    });
  });
  describe('update', () => {
    const updateDto: UpdateDepartmentDto = {
      name: 'Updated Engineering',
      description: 'Updated description',
    };
    it('should update department successfully', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(mockDepartment);
      mockDepartmentRepository.update.mockResolvedValue({
        ...mockDepartment,
        ...updateDto,
      });
      const result = await service.update(mockDepartmentId, updateDto);
      expect(mockDepartmentRepository.findOne).toHaveBeenCalledWith(mockDepartmentId);
      expect(mockDepartmentRepository.update).toHaveBeenCalledWith(mockDepartmentId, updateDto);
      expect(result).toEqual(expect.objectContaining(updateDto));
    });
    it('should throw HttpException if invalid ID provided', async () => {
      return await expect(service.getDepartmentById('invalid-id')).rejects.toThrow(
        new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK),
      );
    });
    it('should throw HttpException if department to update not found', async () => {
      mockDepartmentRepository.findOne.mockResolvedValue(null);
      await expect(service.update(mockDepartmentId, updateDto)).rejects.toThrow(
        new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK),
      );
    });
  });
  describe('remove', () => {
    it('should delete department successfully', async () => {
      mockDepartmentRepository.delete.mockResolvedValue(mockDepartment);
      const result = await service.remove(mockDepartmentId);
      expect(mockDepartmentRepository.delete).toHaveBeenCalledWith(mockDepartmentId);
      expect(result).toEqual(mockDepartment);
    });
    it('should throw HttpException if invalid ID provided', async () => {
      await expect(service.getDepartmentById('invalid-id')).rejects.toThrow(
        new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK),
      );
    });
  });
});
