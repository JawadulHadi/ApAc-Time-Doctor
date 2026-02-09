import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Types } from 'mongoose';

import { DEPARTMENT } from '../../types/constants/error-messages.constants';
import { UserStatus } from '../../types/constants/user-status.constants';
import { Role, UserType } from '../../types/enums/role.enums';
import { ProfileService } from '../profile/profile.service';
import { UserService } from '../user/user.service';
import { DepartmentRepository } from './department.repository';
import {
  CreateDepartmentDto,
  DepartmentResponseDto,
  UpdateDepartmentDto,
} from './dto/department.dto';
@Injectable()
export class DepartmentService implements OnModuleInit {
  private userService: UserService;
  private profilesService: ProfileService;
  constructor(
    private departmentRepository: DepartmentRepository,
    private moduleRef: ModuleRef,
  ) {}
  /**
   * Initialize the service
   * Resolves the ProfileService and UserService instances from the module ref
   * Throws an error if the services cannot be resolved
   * @returns {Promise<void>}
   */
  async onModuleInit(): Promise<void> {
    try {
      this.profilesService = await this.moduleRef.resolve(ProfileService, undefined, {
        strict: false,
      });
      this.userService = await this.moduleRef.resolve(UserService, undefined, { strict: false });
    } catch (error) {
      throw error;
    }
  }
  /**
   * Create a department
   * Throws a ConflictException if a department with the same name already exists
   * @param {CreateDepartmentDto} createDepartmentDto - The department data
   * @returns {Promise<DepartmentResponseDto>} - The created department
   */
  async create(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const existing = await this.departmentRepository.findByName(createDepartmentDto.name);
    if (existing) {
      throw new ConflictException(DEPARTMENT.ALREADY_EXISTS);
    }
    let teamLeadDetail = null;
    if (createDepartmentDto.teamLead) {
      teamLeadDetail = await this.validateAndGetTeamLeadDetail(
        createDepartmentDto.teamLead.toString(),
      );
    }
    const departmentData = {
      ...createDepartmentDto,
      teamLeadDetail,
    };
    return this.departmentRepository.create(departmentData);
  }
  /**
   * Retrieves all departments
   * @returns {Promise<DepartmentResponseDto[]>} - A list of all departments
   */
  async findAll(): Promise<DepartmentResponseDto[]> {
    return this.departmentRepository.findAll();
  }
  /**
   * Retrieves a department by ID
   * Throws a HttpException if the provided ID is invalid
   * @param {string | Types.ObjectId} id - The department ID
   * @returns {Promise<DepartmentResponseDto>} - The department data
   */
  async getDepartmentById(id: string | Types.ObjectId): Promise<DepartmentResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK);
    }
    const department = await this.departmentRepository.findOne(new Types.ObjectId(id));
    if (!department) {
      throw new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK);
    }
    return department;
  }
  /**
   * Update a department
   * Throws a HttpException if the provided ID is invalid
   * @param {Types.ObjectId} id - The department ID
   * @param {UpdateDepartmentDto} updateDepartmentDto - The department data to update
   * @returns {Promise<DepartmentResponseDto>} - The updated department data
   */
  async update(
    id: Types.ObjectId,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK);
    }
    const existingDepartment = await this.departmentRepository.findOne(id);
    if (!existingDepartment) {
      throw new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK);
    }
    return this.departmentRepository.update(id, updateDepartmentDto);
  }
  /**
   * Deletes a department by ID
   * Throws a HttpException if the provided ID is invalid
   * @param {Types.ObjectId} id - The department ID
   * @returns {Promise<DepartmentResponseDto>} - The deleted department data
   */
  async remove(id: Types.ObjectId): Promise<DepartmentResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK);
    }
    return this.departmentRepository.delete(id);
  }
  /**
   * Retrieves all department metadata
   * @returns {Promise<{ departments: DepartmentResponseDto[]; roles: Array<{ value: string; label: string }>}>}
   *   departments: An array of all departments
   *   roles: An array of all user roles with their respective values and labels
   */
  async getAllMetadata(): Promise<{
    departments: DepartmentResponseDto[];
    roles: Array<{ value: string; label: string }>;
  }> {
    const departments = await this.departmentRepository.findAll();
    const roles = Object.entries(UserType).map(([key, value]) => ({
      value: key,
      label: value,
    }));
    return {
      departments,
      roles,
    };
  }
  /**
   * Retrieves a department by ID
   * Throws a HttpException if the provided ID is invalid
   * Throws a NotFoundException if the department does not exist
   * @param {string | Types.ObjectId} id - The department ID
   * @returns {Promise<DepartmentResponseDto>} - The department data
   */
  async getDepartmentByIdLean(id: string | Types.ObjectId): Promise<DepartmentResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK);
    }
    const department = await this.departmentRepository.findOneLean(new Types.ObjectId(id));
    if (!department) {
      throw new NotFoundException(DEPARTMENT.NOT_FOUND);
    }
    return department;
  }
  async findOneLean(id: Types.ObjectId): Promise<DepartmentResponseDto | null> {
    return this.departmentRepository.findOneLean(id);
  }
  /**
   * Retrieves multiple departments by their IDs
   * Throws a HttpException if any of the provided IDs are invalid
   * @param {Types.ObjectId[]} ids - An array of department IDs
   * @returns {Promise<DepartmentResponseDto[]>} - An array of department data
   */
  async getDepartmentsByIdsLean(ids: Types.ObjectId[]): Promise<DepartmentResponseDto[]> {
    return this.departmentRepository.findManyLean(ids);
  }
  /**
   * Validates and retrieves a team lead detail
   * Throws a NotFoundException if the team lead with the provided ID does not exist
   * Throws a HttpException if the team lead with the provided ID is invalid
   * @param {string} teamLeadId - The team lead ID
   * @returns {Promise<any>} - The team lead detail with the provided ID
   */
  async validateAndGetTeamLeadDetail(teamLeadId: string): Promise<any> {
    const teamLeadUser = await this.userService.getUserById(teamLeadId);
    if (!teamLeadUser) {
      throw new NotFoundException(DEPARTMENT.TEAM_LEAD_REQUIRED);
    }
    const teamLeadProfile = await this.profilesService.getProfileByUserId(teamLeadId);
    if (!teamLeadProfile) {
      throw new HttpException(DEPARTMENT.TEAM_LEAD_INVALID, HttpStatus.OK);
    }
    return {
      userId: teamLeadUser._id,
      email: teamLeadUser.email,
      role: teamLeadUser.role,
      designation: teamLeadUser.profile?.designation || '',
      firstName: teamLeadUser.profile?.firstName || '',
      lastName: teamLeadUser.profile?.lastName || '',
    };
  }
  /**
   * Assigns a user as the Team Lead for a department.
   * @param {Types.ObjectId} departmentId - The department ID
   * @param {Types.ObjectId} userId - The user ID to assign as lead
   */
  async assignTeamLead(departmentId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const department = await this.departmentRepository.findOne(departmentId);
    if (!department) return;
    const teamLeadDetail = await this.validateAndGetTeamLeadDetail(userId.toString());
    await this.departmentRepository.update(departmentId, {
      teamLead: userId,
      teamLeadDetail: teamLeadDetail,
    });
  }
  /**
   * Handles the removal of a Team Lead from a department (e.g., deleted or role changed).
   * Reassigns to COO or SUPER_ADMIN if the removed user was the current lead.
   * @param {Types.ObjectId} departmentId - The department ID
   * @param {Types.ObjectId} oldLeadId - The ID of the user being removed/changed
   */
  async handleTeamLeadRemoval(
    departmentId: Types.ObjectId,
    oldLeadId: Types.ObjectId,
  ): Promise<void> {
    const department = await this.departmentRepository.findOne(departmentId);
    if (
      !department ||
      !department.teamLead ||
      department.teamLead.toString() !== oldLeadId.toString()
    ) {
      return;
    }
    const fallbackUser = await this.findFallbackLead();
    if (fallbackUser) {
      await this.assignTeamLead(departmentId, fallbackUser._id);
    } else {
      await this.departmentRepository.update(departmentId, {
        teamLead: null,
        teamLeadDetail: null,
      });
    }
  }
  /**
   * Finds a fallback user (COO or SUPER_ADMIN) to assign as Team Lead.
   * @private
   * @returns {Promise<any | null>} - The fallback user or null
   */
  private async findFallbackLead(): Promise<any | null> {
    let fallback = await this.userService.getUser({
      role: Role.COO,
      status: UserStatus.ACTIVE,
    });
    if (!fallback) {
      fallback = await this.userService.getUser({
        role: Role.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      });
    }
    return fallback;
  }
}
