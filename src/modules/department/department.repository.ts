import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';

import { DepartmentMapper } from '../../shared/mappers/department.mapper';
import { DEPARTMENT } from '../../types/constants/error-messages.constants';
import { CreateDepartmentDto, DepartmentResponseDto } from './dto/department.dto';
import { Department } from './schemas/department.schema';
@Injectable()
export class DepartmentRepository {
  constructor(@InjectModel(Department.name) private departmentModel: Model<Department>) {}
  /**
   * Start a mongoose session for the department model.
   * @returns A promise that resolves to a mongoose session.
   */
  async startSession(): Promise<ClientSession> {
    return this.departmentModel.startSession();
  }
  /**
   * Create a new department.
   * @param {CreateDepartmentDto} createDepartmentData - The department data to create
   * @returns {Promise<DepartmentResponseDto>} - The created department data
   */
  async create(createDepartmentData: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const department = new this.departmentModel(createDepartmentData);
    const savedDepartment = await department.save();
    return DepartmentMapper.toResponseDto(savedDepartment);
  }
  /**
   * Retrieves all departments
   * @returns {Promise<DepartmentResponseDto[]>} - A list of all departments
   */
  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentModel.find().exec();
    return DepartmentMapper.toResponseDtoList(departments);
  }
  /**
   * Retrieves all departments with a lean query.
   * A lean query does not create a full-fledged Mongoose document,
   * which can be useful in scenarios where only a subset of the document
   * fields are needed.
   * @returns {Promise<DepartmentResponseDto[]>} - A list of all department response dtos
   */
  async findAllLean(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentModel.find().lean().exec();
    return DepartmentMapper.toResponseDtoList(departments);
  }
  /**
   * Retrieves a department by ID.
   * Throws a HttpException if the provided ID is invalid.
   * Throws a NotFoundException if the department does not exist.
   * @param {Types.ObjectId} id - The department ID.
   * @returns {Promise<DepartmentResponseDto>} - The department data.
   */
  async findOne(id: Types.ObjectId): Promise<DepartmentResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK);
    }
    const department = await this.departmentModel.findOne({ _id: id }).exec();
    if (!department) {
      throw new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK);
    }
    return DepartmentMapper.toResponseDto(department);
  }
  async findOneLean(id: Types.ObjectId): Promise<DepartmentResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK);
    }
    const department = await this.departmentModel.findOne({ _id: id }).lean().exec();
    if (!department) {
      throw new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK);
    }
    return DepartmentMapper.toResponseDto(department);
  }
  async findByName(name: string): Promise<DepartmentResponseDto | null> {
    const department = await this.departmentModel.findOne({ name }).exec();
    return department ? DepartmentMapper.toResponseDto(department) : null;
  }
  async update(
    id: Types.ObjectId,
    updateData: Partial<Department>,
  ): Promise<DepartmentResponseDto> {
    const department = await this.departmentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!department) {
      throw new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK);
    }
    return DepartmentMapper.toResponseDto(department);
  }
  async delete(id: Types.ObjectId): Promise<DepartmentResponseDto> {
    const department = await this.departmentModel.findByIdAndDelete(id).exec();
    if (!department) {
      throw new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK);
    }
    return DepartmentMapper.toResponseDto(department);
  }
  async findManyLean(ids: Types.ObjectId[]): Promise<DepartmentResponseDto[]> {
    if (!ids.length) return [];
    const departments = await this.departmentModel
      .find({ _id: { $in: ids } })
      .lean()
      .exec();
    return DepartmentMapper.toResponseDtoList(departments);
  }
  async getDepartmentByIdDoc(id: string | Types.ObjectId): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(DEPARTMENT.INVALID_DATA, HttpStatus.OK);
    }
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new HttpException(DEPARTMENT.NOT_FOUND, HttpStatus.OK);
    }
    return department;
  }
}
