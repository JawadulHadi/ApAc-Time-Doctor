import { HttpException, HttpStatus, InternalServerErrorException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

import { Profiles } from '../../modules/profile/schemas/profiles.schema';
import { UpdateUserProfileDto } from '../../modules/user/dto/user.dto';
import { SYSTEM_ERROR, USER } from '../../types/constants/error-messages.constants';

import { EXCLUDED_ROLES } from '../../types/constants/system.config.constants';
import { UserStatus } from '../../types/constants/user-status.constants';
import { ExecutiveRole, Role } from '../../types/enums/role.enums';
import { UserPayload } from '../../types/interfaces/jwt.interface';
import { IExecutive } from '../../types/interfaces/request.interface';
import { TransformedUser } from '../../types/interfaces/transform.interface';
import { CombinedUserProfile } from '../../types/interfaces/user.interface';
import { RoleDisplay } from '../utils/role-display.utils';
import { InputValidation } from '../validators/input.validation';

export class UserHelper {
  private static readonly logger = new Logger(UserHelper.name);

  /**
   * Validate if users array is valid and not empty
   * @param users - Array of user payloads to validate
   * @returns True if valid array with users, false otherwise
   */
  static isValidArray(users: UserPayload[]): boolean {
    if (!Array.isArray(users)) {
      this.logger.error('User data retrieval failed - expected array but received:', typeof users);
      return false;
    }
    if (users.length === 0) {
      this.logger.warn('⚠ No users found in database');
      return false;
    }
    return true;
  }

  /**
   * Filter users by excluded statuses (disabled, suspended)
   * @param users - Array of user profiles to filter
   * @param excludedStatuses - Array of statuses to exclude
   * @param requesterRole - Role of the user making the request
   * @returns Filtered array of users
   */
  static filterUsersByExcludedStatuses(
    users: CombinedUserProfile[],
    excludedStatuses: string[] = [UserStatus.DISABLED, UserStatus.SUSPENDED],
    requesterRole?: string,
  ): any[] {
    if (requesterRole === Role.SUPER_ADMIN) {
      this.logger.debug('SUPER ADMIN requester - bypassing status filters');
      return users;
    }
    return users.filter(user => {
      const userStatus = user.status?.toUpperCase();
      return !excludedStatuses.includes(userStatus);
    });
  }

  /**
   * Filter out users with excluded roles based on requester role
   * @param users - Array of user profiles to filter
   * @param requesterRole - Role of the user making the request
   * @returns Filtered array of users
   */
  static filterExcludedRoles(
    users: CombinedUserProfile[] | any[],
    requesterRole?: Role,
  ): CombinedUserProfile[] | any[] {
    if (requesterRole === Role.SUPER_ADMIN) {
      this.logger.log('SUPER ADMIN requester - bypassing ALL filters');
      return users;
    }
    const activeUsers = this.filterUsersByExcludedStatuses(users, undefined, requesterRole);
    this.logger.log(
      `Starting filterExcludedRoles - Total users before filtering: ${activeUsers.length}`,
    );
    return activeUsers.filter(user => {
      const userRole = RoleDisplay.normalizeRole(user);
      const isExcludedRole = EXCLUDED_ROLES.includes(userRole as Role);
      const shouldInclude = !isExcludedRole;
      if (!shouldInclude) {
        this.logger.debug(
          `Excluding user: ${user.email} (Role: ${userRole}, Status: ${user.status})`,
        );
      }
      return shouldInclude;
    });
  }

  /**
   * Create a map of profiles by user ID for efficient lookup
   * @param profiles - Array of profile objects
   * @returns Map of user IDs to profile objects
   */
  static createProfileMap(profiles: any[]): Map<string, any> {
    const profileMap = new Map<string, any>();
    profiles.forEach(profile => {
      if (profile?.userId) {
        profileMap.set(profile.userId.toString(), profile);
      }
    });
    return profileMap;
  }

  /**
   * Create a map of departments by department ID for efficient lookup
   * @param departments - Array of department objects
   * @returns Map of department IDs to department objects
   */
  static createDepartmentMap(departments: any[]): Map<string, any> {
    const departmentMap = new Map<string, any>();
    departments.forEach(dept => {
      if (dept?._id) {
        departmentMap.set(dept._id.toString(), dept);
      }
    });
    return departmentMap;
  }

  /**
   * Combine user data with their profiles and departments
   * @param users - Array of user objects
   * @param profileMap - Map of user profiles
   * @param departmentMap - Map of departments
   * @returns Array of combined user profiles
   */
  static combineUserData(
    users: CombinedUserProfile[] | any[],
    profileMap: Map<string, any>,
    departmentMap: Map<string, any>,
  ): CombinedUserProfile[] | any[] {
    return users.map((user: CombinedUserProfile) => {
      const userId = user._id?.toString();
      const departmentId = user.department?.toString();
      const userProfile = userId ? profileMap.get(userId) || null : null;
      const userDepartment = departmentId ? departmentMap.get(departmentId) || null : null;
      const fullName =
        user.fullName ||
        (userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Unknown User');
      return {
        ...user,
        fullName,
        profile: userProfile,
        department: userDepartment,
      } as CombinedUserProfile;
    });
  }

  /**
   * Group user profiles by role hierarchy (COO, Team Lead, Reporting Line, Members)
   * @param users - Array of user profiles to group
   * @param requesterRole - Role of the user making the request
   * @returns Transformed array of grouped users
   */
  static groupUserProfiles(users: CombinedUserProfile[], requesterRole?: Role): TransformedUser[] {
    if (!users?.length) return [];
    const usersToProcess = users;
    const categorized = this.categorizeUsers(usersToProcess);
    const groupedUsers: TransformedUser[] = [];
    this.processUserGroup(categorized.coos, categorized.members, groupedUsers, 'COO');
    this.processUserGroup(
      categorized.reportingLines,
      categorized.members,
      groupedUsers,
      'Reporting Line',
    );
    this.processUserGroup(categorized.teamLeads, categorized.members, groupedUsers, 'Team Lead');
    if (categorized.members.length > 0) {
      groupedUsers.push(...(categorized.members as unknown as TransformedUser[]));
    }
    return groupedUsers;
  }

  /**
   * Categorize users by their roles for grouping
   * @param users - Array of user profiles to categorize
   * @returns Object with categorized users by role
   */
  static categorizeUsers(users: CombinedUserProfile[] | any): {
    coos: CombinedUserProfile[];
    teamLeads: CombinedUserProfile[];
    reportingLines: CombinedUserProfile[];
    members: CombinedUserProfile[];
  } {
    const coos: CombinedUserProfile[] = [];
    const teamLeads: CombinedUserProfile[] = [];
    const reportingLines: CombinedUserProfile[] = [];
    const members: CombinedUserProfile[] = [];
    users.forEach((user: CombinedUserProfile) => {
      const normalizeRole = RoleDisplay.normalizeRole(user);
      const displayRole = RoleDisplay.getDisplayRole(user);
      if (displayRole === 'Reporting Line') {
        reportingLines.push(user);
      } else if (normalizeRole === Role.COO) {
        coos.push(user);
      } else if (normalizeRole === Role.TEAM_LEAD) {
        teamLeads.push(user);
      } else {
        members.push(user);
      }
    });
    return { coos, teamLeads, reportingLines, members };
  }

  /**
   * Process a user group and add team members
   * @param groupUsers - Array of group leaders
   * @param members - Array of all members
   * @param groupedUsers - Array to store grouped results
   * @param groupType - Type of group being processed
   */
  private static processUserGroup(
    groupUsers: CombinedUserProfile[] | any[],
    members: CombinedUserProfile[] | any[],
    groupedUsers: TransformedUser[] | any[],
    groupType: string,
  ): void {
    groupUsers.forEach((leader: CombinedUserProfile) => {
      const index = members.findIndex(
        (m: CombinedUserProfile) => m._id.toString() === leader._id.toString(),
      );
      groupedUsers.push(leader as unknown as TransformedUser);
      const teamMembers = this.findTeamMembers(leader._id.toString(), members);
      teamMembers.forEach((member: CombinedUserProfile) => {
        const memberIndex = members.findIndex(
          (m: CombinedUserProfile) => m._id.toString() === member._id.toString(),
        );
        if (memberIndex > -1) members.splice(memberIndex, 1);
      });
      groupedUsers.push(...(teamMembers as unknown as TransformedUser[]));
    });
  }

  /**
   * Find team members for a given leader
   * @param leaderId - ID of the team lead
   * @param members - Array of all members to search through
   * @returns Array of team members for the leader
   */
  private static findTeamMembers(
    leaderId: string,
    members: CombinedUserProfile[],
  ): CombinedUserProfile[] {
    return members.filter(member => {
      const teamLeadId =
        (member.departmentDetails as any)?.teamLead?.toString() ||
        (typeof member.department === 'object' && member.department !== null
          ? (member.department as any).teamLead?.toString()
          : '');
      return teamLeadId === leaderId;
    });
  }

  /**
   * Prepare user update data with audit fields
   * @param updateData - Object containing update information
   * @returns Partial user payload with update data
   */
  static prepareUserUpdateData(updateData: {
    email?: string | any;
    role?: string | any;
    status?: string | any;
    loginCount?: string | any;
    cell?: string | any;
    permissions?: string[] | any;
    department?: string | any;
    updaterId: string | any;
  }): Partial<UserPayload | any> {
    const { email, role, status, loginCount, cell, permissions, department, updaterId } =
      updateData;
    const userUpdateData: Partial<UserPayload | any> = {
      updatedBy: updaterId,
      updatedAt: new Date(),
    };
    if (email !== undefined) userUpdateData.email = email;
    if (role !== undefined) userUpdateData.role = role;
    if (status !== undefined) userUpdateData.status = status;
    if (loginCount !== undefined) userUpdateData.loginCount = loginCount;
    if (cell !== undefined) userUpdateData.cell = cell;
    if (permissions !== undefined) {
      userUpdateData.permissions = permissions;
    }
    if (department !== undefined) {
      userUpdateData.department = department;
    }
    return userUpdateData;
  }

  /**
   * Prepare profile update data with validation
   * @param existingUser - Existing user profile data
   * @param dto - Update user profile DTO
   * @returns Partial profile data with updates
   */
  static prepareProfileUpdateData(
    existingUser: CombinedUserProfile,
    dto: UpdateUserProfileDto,
  ): Partial<Profiles> {
    const profileUpdateData: Partial<Profiles> = {};
    const { firstName, lastName, designation, status, email, contactNumber } = dto;
    if (firstName || lastName) {
      const newFirstName = firstName || existingUser.profile?.firstName || '';
      const newLastName = lastName || existingUser.profile?.lastName || '';
      profileUpdateData.firstName = firstName
        ? InputValidation.validateName(firstName, 'First name')
        : undefined;
      profileUpdateData.lastName = lastName
        ? InputValidation.validateName(lastName, 'Last name')
        : undefined;
      profileUpdateData.fullName = `${newFirstName} ${newLastName}`.trim();
    }
    if (designation?.trim()) profileUpdateData.designation = designation.trim();
    if (status) profileUpdateData.status = status;
    if (email) profileUpdateData.email = email;
    if (contactNumber?.trim()) profileUpdateData.contactNumber = contactNumber;
    return profileUpdateData;
  }

  /**
   * Get team members based on user role and permissions
   * @param authUser - Authenticated user object
   * @param allUsers - Array of all users to filter from
   * @returns Array of team members based on role hierarchy
   */
  static getTeam(authUser: UserPayload, allUsers: CombinedUserProfile[]): any[] {
    const normalizedRole = authUser.role?.toUpperCase().replace(/\s+/g, '_');
    switch (normalizedRole) {
      case Role.TEAM_LEAD.toUpperCase():
        return allUsers.filter(user => {
          const userRole = user.role?.toUpperCase().replace(/\s+/g, '_');
          return (
            user.department?._id?.toString() === authUser.department?._id?.toString() &&
            userRole === Role.MEMBER.toUpperCase()
          );
        });
      case Role.COO.toUpperCase():
        return allUsers.filter(user => {
          const userRole = user.role?.toUpperCase().replace(/\s+/g, '_');
          return [Role.TEAM_LEAD.toUpperCase(), Role.MEMBER.toUpperCase()].includes(userRole);
        });
      case Role.HR.toUpperCase():
      case Role.ADMIN.toUpperCase():
      case Role.SUPER_ADMIN.toUpperCase():
        return allUsers.filter(user => {
          const userRole = user.role?.toUpperCase().replace(/\s+/g, '_');
          return ![
            Role.HR.toUpperCase(),
            Role.ADMIN.toUpperCase(),
            Role.SUPER_ADMIN.toUpperCase(),
            Role.TRAINER.toUpperCase(),
          ].includes(userRole);
        });
      default:
        return [];
    }
  }

  /**
   * Uploads the default profile picture for a user.
   * @param profileService - Profile service instance
   * @param userId - The ID of the user to upload the default profile picture for.
   * @returns A promise that resolves when the default profile picture has been uploaded.
   * @throws InternalServerErrorException if there is an error while uploading the default profile picture.
   */
  static async uploadDefaultProfilePicture(profileService: any, userId: string): Promise<void> {
    const defaultImagePath = join(process.cwd(), 'public', 'assets', 'default-profile.png');
    if (fs.existsSync(defaultImagePath)) {
      const fileBuffer = fs.readFileSync(defaultImagePath);
      const mockFile: any = {
        fieldname: 'file',
        originalname: 'default-profile.png',
        encoding: '7bit',
        mimetype: 'image/png',
        buffer: fileBuffer,
        size: fileBuffer.length,
      };
      await profileService.uploadProfilePicture(userId, mockFile);
    }
  }

  /**
   * Creates executives map from users and profiles
   * @param users - Array of users with executive roles
   * @param profileMap - Map of user profiles
   * @returns Map of executives by role
   */
  static createExecutivesMap(
    users: any[],
    profileMap: Map<string, any>,
  ): {
    HR?: IExecutive;
    COO?: IExecutive;
    ADMIN?: IExecutive;
    SUPER_ADMIN?: IExecutive;
    TRAINER?: IExecutive;
  } {
    const response: {
      HR?: IExecutive;
      COO?: IExecutive;
      Admin?: IExecutive;
      SUPER_ADMIN?: IExecutive;
      TRAINER?: IExecutive;
    } = {};

    for (const [responseKey, roleValue] of Object.entries(ExecutiveRole)) {
      const user = users.find(u => u.role === roleValue);
      if (user) {
        const profile = profileMap.get(user._id.toString()) || {};
        response[responseKey as keyof typeof response] = {
          userId: user._id,
          email: user.email,
          fullName: profile.fullName || '',
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          designation: profile.designation || '',
          role: user.role as Role,
          status: user.status,
          displayRole: user.role,
        };
      }
    }

    return response;
  }

  /**
   * Handle user creation errors with proper logging and exception mapping
   * @param error - Error object from user creation
   * @throws HttpException for known errors
   * @throws InternalServerErrorException for unexpected errors
   */
  static handleUserCreationError(error: any): never {
    if (error instanceof HttpException) throw error;
    if (error.code === 11000) throw new HttpException(USER.ALREADY_EXISTS, HttpStatus.OK);
    this.logger.error(USER.CREATION_FAILED, error.stack);
    throw new InternalServerErrorException(SYSTEM_ERROR.CPU_OVERLOAD);
  }
}
