import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

import { ApiResponseDto } from '../../core/decorators/api-response.decorators';
import { Permission } from '../../core/decorators/permission.decorators';
import { PermissionsGuard } from '../../core/guards/permissions.guard';
import { apacDepartment } from '../../types/enums/doc.enums';
import { Permissions } from '../../types/enums/permissions.enum';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
@ApiTags('departments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('jwt-auth')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentService) {}
  @Get()
  @ApiOperation({
    summary: 'Get all departments with roles and designations',
    description: 'Retrieves departments along with roles and designations enums',
  })
  @ApiResponse({
    status: 200,
    description: 'All active departments and user roles retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (missing or invalid JWT token)',
  })
  async getAllMetadata(): Promise<ApiResponseDto<any>> {
    const metadata = await this.departmentsService.getAllMetadata();
    const filteredDepartments = metadata.departments.filter(
      dept =>
        dept.name !== apacDepartment.SuperAdmin &&
        dept.name !== apacDepartment.Admin &&
        dept.name !== apacDepartment.HR &&
        dept.name !== apacDepartment.IT &&
        dept.name !== apacDepartment.LD,
    );
    return ApiResponseDto.success(
      {
        departments: filteredDepartments,
        roles: metadata.roles,
      },
      'All Active Department, and User Roles Retrieved Successfully',
      HttpStatus.OK,
    );
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Get department by ID',
    description: 'Retrieves a specific department by its ID',
  })
  @ApiParam({ name: 'id', description: 'Department ID', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({
    status: 200,
    description:
      'Department retrieved successfully (also returns 200 for invalid id in your service)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (missing or invalid JWT token)',
  })
  @ApiResponse({
    status: 404,
    description: 'Department not found (if repository/service throws NotFound)',
  })
  async getDepartmentById(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const department = await this.departmentsService.getDepartmentById(id);
    return ApiResponseDto.success(
      { department },
      'Department Retrieved Successfully',
      HttpStatus.OK,
    );
  }
  @Post('create')
  @Permission(Permissions.CAN_MANAGE_DEPARTMENTS)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Create a new department',
    description: 'Creates a new department with the provided details',
  })
  @ApiBody({ type: CreateDepartmentDto, description: 'Department creation data' })
  @ApiResponse({
    status: 201,
    description: 'Department created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation failed)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (missing or invalid JWT token)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (missing CAN_MANAGE_DEPARTMENTS permission)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict (department already exists)',
  })
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<ApiResponseDto<any>> {
    const department = await this.departmentsService.create(createDepartmentDto);
    return ApiResponseDto.success({ department }, 'Department Created Successfully', HttpStatus.OK);
  }
  @Put(':id')
  @Permission(Permissions.CAN_MANAGE_DEPARTMENTS)
  @UseGuards(PermissionsGuard)
  @ApiOperation({
    summary: 'Update department',
    description: 'Updates an existing department',
  })
  @ApiParam({ name: 'id', description: 'Department ID', example: '507f1f77bcf86cd799439011' })
  @ApiBody({ type: UpdateDepartmentDto, description: 'Department update data' })
  @ApiResponse({
    status: 200,
    description: 'Department updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation failed)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (missing or invalid JWT token)',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (missing CAN_MANAGE_DEPARTMENTS permission)',
  })
  @ApiResponse({
    status: 404,
    description: 'Department not found (if repository/service throws NotFound)',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<ApiResponseDto<any>> {
    const department = await this.departmentsService.update(
      new Types.ObjectId(id),
      updateDepartmentDto,
    );
    return ApiResponseDto.success({ department }, 'Department Updated Successfully', HttpStatus.OK);
  }
}
