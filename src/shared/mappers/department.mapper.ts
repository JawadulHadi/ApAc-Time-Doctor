import { Types } from 'mongoose';

import {
  DepartmentResponseDto,
  DepartmentResponseWithIdDto,
} from '../../modules/department/dto/department.dto';
import { IDepartmentDocument, UserDepartment } from '../../types/interfaces/department.interface';
import { IProfile } from '../../types/interfaces/profile.interface';
import { CombinedUserProfile, IUserDocument } from '../../types/interfaces/user.interface';
export class DepartmentMapper {
  static toResponseDto(department: IDepartmentDocument | any): DepartmentResponseDto | any {
    if (!department) {
      throw new Error('Department data is required');
    }
    return {
      _id: this.safeObjectId(department._id || department.id),
      name: department.name,
      description: department.description,
      isActive: department.isActive ?? true,
      teamLead: department.teamLead ? this.safeObjectId(department.teamLead) : undefined,
      teamLeadDetail: department.teamLeadDetail
        ? this.transformTeamLeadDetail(department.teamLeadDetail)
        : undefined,
      createdAt: this.safeDate(department.createdAt),
      updatedAt: this.safeDate(department.updatedAt),
      __v: department.__v,
    };
  }
  static toResponseDtoList(departments: IDepartmentDocument[] | any[]): DepartmentResponseDto[] {
    if (!Array.isArray(departments)) {
      throw new Error('Departments must be an array');
    }
    return departments.map(department => this.toResponseDto(department));
  }
  static toUserDepartment(department: IDepartmentDocument | any): UserDepartment | any {
    if (!department) {
      throw new Error('Department data is required');
    }
    const responseDto = this.toResponseDto(department);
    return {
      _id: responseDto._id,
      name: responseDto.name,
      description: responseDto.description,
      isActive: responseDto.isActive,
      teamLead: responseDto.teamLead,
      teamLeadDetail: responseDto.teamLeadDetail
        ? {
            userId: responseDto.teamLeadDetail.userId,
            username: responseDto.teamLeadDetail.username || '',
            email: responseDto.teamLeadDetail.email || '',
            role: responseDto.teamLeadDetail.role || '',
            designation: responseDto.teamLeadDetail.designation || '',
            firstName: responseDto.teamLeadDetail.firstName || '',
            lastName: responseDto.teamLeadDetail.lastName || '',
            fullName:
              `${responseDto.teamLeadDetail.firstName} ${responseDto.teamLeadDetail.lastName}`.trim(),
          }
        : undefined,
      createdAt: responseDto.createdAt,
      updatedAt: responseDto.updatedAt,
    };
  }
  static toUserDepartmentList(departments: IDepartmentDocument[] | any[]): UserDepartment[] {
    if (!Array.isArray(departments)) {
      throw new Error('Departments must be an array');
    }
    return departments.map(department => this.toUserDepartment(department));
  }
  static toApiResponse(department: IDepartmentDocument | any): DepartmentResponseWithIdDto {
    const responseDto = this.toResponseDto(department);
    const { _id, __v, ...rest } = responseDto;
    return {
      id: _id.toString(),
      ...rest,
    };
  }
  static toApiResponseList(
    departments: IDepartmentDocument[] | any[],
  ): DepartmentResponseWithIdDto[] {
    return departments.map(department => this.toApiResponse(department));
  }
  static toCombinedUserProfile(
    user: IUserDocument | any,
    department?: UserDepartment,
  ): CombinedUserProfile | any {
    if (!user) {
      throw new Error('User data is required');
    }
    const baseUser = {
      _id: this.safeObjectId(user._id),
      email: user.email,
      username: user.username,
      role: user.role,
      displayRole: user.displayRole,
      permissions: user.permissions || [],
      status: user.status,
      cell: user.cell.toString(),
      department: user.department ? this.safeObjectId(user.department) : undefined,
      lastLogin: this.safeDate(user.lastLogin),
      loginCount: user.loginCount.toString(),
      createdBy: user.createdBy ? this.safeObjectId(user.createdBy) : undefined,
      updatedBy: user.updatedBy ? this.safeObjectId(user.updatedBy) : undefined,
      activationCode: user.activationCode,
      activationCodeGeneratedAt: this.safeDate(user.activationCodeGeneratedAt),
      lastLogout: this.safeDate(user.lastLogout),
      resetPasswordCode: user.resetPasswordCode,
      resetPasswordCodeGeneratedAt: this.safeDate(user.resetPasswordCodeGeneratedAt),
      lastActivatedAt: this.safeDate(user.lastActivatedAt),
      lockoutExpires: this.safeDate(user.lockoutExpires),
      isVerified: user.isVerified ?? false,
      createdAt: this.safeDate(user.createdAt),
      updatedAt: this.safeDate(user.updatedAt),
    };
    const profile = user.profile ? this.transformProfile(user.profile) : undefined;
    const departmentDetails = department ? this.toUserDepartment(department) : undefined;
    return {
      ...baseUser,
      profile,
      departmentDetails,
      fullName: profile?.fullName || user.fullName,
      designation: profile?.designation || user.designation,
    };
  }
  private static transformProfile(profile: IProfile | any): IProfile | any {
    if (!profile) {
      return undefined;
    }
    return {
      _id: this.safeObjectId(profile._id),
      userId: this.safeObjectId(profile.userId),
      email: profile.email || '',
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      fullName: profile.fullName || `${profile.firstName} ${profile.lastName}`.trim(),
      status: profile.status,
      profilePicture: profile.profilePicture,
      resume: profile.resume,
      idProof: profile.idProof,
      documents: profile.documents || [],
      dateOfBirth: this.safeDate(profile.dateOfBirth),
      designation: profile.designation,
      role: profile.role,
      employeeId: profile.employeeId,
      contactNumber: profile.contactNumber,
      emergencyContact: profile.emergencyContact,
      currentAddress: profile.currentAddress,
      permanentAddress: profile.permanentAddress,
      dateOfJoining: this.safeDate(profile.dateOfJoining),
      leftUs: this.safeDate(profile.leftUs),
      rejoinUs: this.safeDate(profile.rejoinUs),
      skills: profile.skills || [],
      achievements: profile.achievements || [],
      missionStatement: profile.missionStatement,
      createdBy: profile.createdBy ? this.safeObjectId(profile.createdBy) : undefined,
      updatedBy: profile.updatedBy ? this.safeObjectId(profile.updatedBy) : undefined,
      createdAt: this.safeDate(profile.createdAt),
      updatedAt: this.safeDate(profile.updatedAt),
    };
  }
  private static safeObjectId(id: any): Types.ObjectId {
    if (!id) {
      throw new Error('ID is required');
    }
    if (id instanceof Types.ObjectId) {
      return id;
    }
    if (typeof id === 'string' && Types.ObjectId.isValid(id)) {
      return new Types.ObjectId(id);
    }
    if (id && typeof id.toHexString === 'function') {
      return id;
    }
    throw new Error(`Invalid ObjectId: ${id}`);
  }
  private static safeDate(date: any): Date | undefined {
    if (!date) {
      return undefined;
    }
    if (date instanceof Date) {
      return date;
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return undefined;
    }
    return parsedDate;
  }
  private static transformTeamLeadDetail(teamLeadDetail: any): any {
    if (!teamLeadDetail) {
      return undefined;
    }
    return {
      userId: this.safeObjectId(teamLeadDetail.userId || teamLeadDetail._id),
      username: teamLeadDetail.username || '',
      email: teamLeadDetail.email || '',
      role: teamLeadDetail.role || '',
      designation: teamLeadDetail.designation || '',
      firstName: teamLeadDetail.firstName || '',
      lastName: teamLeadDetail.lastName || '',
      fullName:
        teamLeadDetail.fullName || `${teamLeadDetail.firstName} ${teamLeadDetail.lastName}`.trim(),
    };
  }
  static toBasicDepartmentInfo(department: IDepartmentDocument | any): {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    isActive: boolean;
  } {
    if (!department) {
      throw new Error('Department data is required');
    }
    return {
      _id: this.safeObjectId(department._id),
      name: department.name,
      description: department.description,
      isActive: department.isActive ?? true,
    };
  }
  static toDepartmentWithTeamLead(
    department: IDepartmentDocument | any,
    teamLead?: IUserDocument | any,
  ) {
    const baseDepartment = this.toResponseDto(department);
    if (!teamLead) {
      return baseDepartment;
    }
    return {
      ...baseDepartment,
      teamLeadDetail: this.transformTeamLeadDetail({
        ...teamLead,
        userId: teamLead._id,
        firstName: teamLead.profile?.firstName || teamLead.firstName,
        lastName: teamLead.profile?.lastName || teamLead.lastName,
        designation: teamLead.profile?.designation || teamLead.designation,
        email: teamLead.email,
        role: teamLead.role,
      }),
    };
  }
}
