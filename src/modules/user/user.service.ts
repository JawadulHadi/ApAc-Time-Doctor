import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ClientSession, Types } from 'mongoose';

import { EmailAuthTemplatesService } from '../../services/email/user/email-auth-templates.service';
import { CodeHelper } from '../../shared/helpers/code.helper';
import { UserHelper } from '../../shared/helpers/user.helpers';
import { RoleDisplay } from '../../shared/utils/role-display.utils';
import { responseTransform } from '../../shared/utils/unified-transform.utils';
import { IdValidation } from '../../shared/validators/iD.validation';
import { InputValidation } from '../../shared/validators/input.validation';
import { UserValidator } from '../../shared/validators/user-data.validation';
import { DEPARTMENT, EMAIL_ERROR, USER } from '../../types/constants/error-messages.constants';
import { UserStatus } from '../../types/constants/user-status.constants';
import { Role } from '../../types/enums/role.enums';
import { UserFilter } from '../../types/interfaces/filters.interface';
import { IExecutive } from '../../types/interfaces/request.interface';
import { TransformedUser } from '../../types/interfaces/transform.interface';
import { CombinedUserProfile, UserOperationResult } from '../../types/interfaces/user.interface';
import { DepartmentService } from '../department/department.service';
import { ProfileService } from '../profile/profile.service';
import { Profiles } from '../profile/schemas/profiles.schema';
import { RequestService } from '../request/request.service';
import {
  ChangePasswordDto,
  CreateUserProfileDto,
  UpdateUserDto,
  UpdateUserProfileDto,
} from './dto/user.dto';
import { User } from './schemas/user.schema';
import { UserRepository } from './user.repository';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
    @Inject(forwardRef(() => DepartmentService))
    private departmentService: DepartmentService,
    @Inject(forwardRef(() => RequestService))
    private requestService: RequestService,
    private readonly userRepository: UserRepository,
  ) {}
  /**
   * Starts a mongoose session for the user model.
   * @returns A promise that resolves to a mongoose session.
   */
  async startSession(): Promise<ClientSession> {
    return this.userRepository.startSession();
  }
  /**
   * Check if a user with the given email address already exists
   *
   * @param email - Email address of the user
   * @throws HttpException if the user is already registered
   */
  async existingUser(email: string): Promise<void> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new HttpException(USER.ALREADY_EXISTS, HttpStatus.OK);
    }
  }
  /**
   * Updates the status of a user's profile.
   *
   * @param userId - User ID
   * @param status - Status to update the profile to
   * @param session - Mongoose session to use for the query
   * @returns A promise that resolves when the profile status has been updated
   * @throws NotFoundException if the user is not found
   * @throws InternalServerErrorException if there is an error while updating the user
   */
  async updateProfileStatus(
    userId: Types.ObjectId,
    status: UserStatus,
    session: ClientSession,
  ): Promise<void> {
    await this.profileService.updateProfileSession(userId, { status }, session);
  }
  /**
   * Changes the password for a user with a given ID.
   *
   * @param changePasswordDto - User ID and new password
   * @returns Promise<UserOperationResult> - Promise with the updated user and the authenticated user
   * @throws NotFoundException if the user is not found
   * @throws InternalServerErrorException if there is an error while updating the user
   */
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: Types.ObjectId,
  ): Promise<UserOperationResult> {
    IdValidation.validateId(userId, 'User ID');
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(USER.NOT_FOUND);
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    const updatedUser = await this.userRepository.update(user._id, {
      password: hashedPassword,
    });
    if (!updatedUser) {
      throw new InternalServerErrorException(USER.CHANGE_PASSWORD_FAILED);
    }
    const transformedUser = RoleDisplay.applyRoleDisplay(updatedUser);
    return {
      user: transformedUser,
      authUser: transformedUser as CombinedUserProfile,
    };
  }
  /**
   * Activates a user account by checking the activation code and then updating the user status to verified.
   *
   * @param userId - User ID
   * @param updateData - User account update data
   * @param session - Optional session to use for the query
   * @returns Promise with the activated user
   * @throws NotFoundException if the user is not found
   * @throws BadRequestException if the user ID, password, or activation code is invalid
   * @throws InternalServerErrorException if there is an error while updating the user
   */
  async activateUserAccount(
    userId: Types.ObjectId | string,
    updateData: {
      password: string;
      activationCode?: string;
      lastActivatedAt?: Date;
      isVerified?: boolean;
    },
    session?: ClientSession,
  ): Promise<CombinedUserProfile> {
    IdValidation.validateId(userId, 'User ID');
    const objectId = IdValidation.createId(userId);
    await this.userRepository.updateUserSession(
      objectId,
      {
        ...updateData,
        status: UserStatus.ACTIVE,
      },
      session,
    );
    await this.profileService.updateProfile(
      objectId,
      {
        status: UserStatus.ACTIVE,
      },
      session,
    );
    const activatedUser = await this.getUserById(objectId as Types.ObjectId);
    return activatedUser;
  }
  /**
   * Get a user by given filter
   * @param filter - Filter to find the user
   * @param session - Client session to use for the query
   * @returns The found user or null if no user is found
   * @throws Error if the query fails
   */
  async getUser(filter: UserFilter, session?: ClientSession): Promise<CombinedUserProfile | null> {
    const user = await this.getUsersDetails(filter, session);
    return user.length > 0 ? user[0] : null;
  }
  /**
   * Retrieves the role of a user by given user ID
   * @param userIds - List of user IDs
   * @returns A list of users with their roles
   * @throws Error if the query fails
   */
  async getRole(userIds: string[]): Promise<TransformedUser[]> {
    if (!userIds || userIds.length === 0) {
      return [];
    }
    const users = await this.getUsersByIds(userIds);
    return RoleDisplay.applyDisplay(users);
  }
  /**
   * Retrieves all users from the database
   *
   * @returns A promise containing all users in the database
   * @throws Error if the query fails
   */
  async getAllUsers(): Promise<CombinedUserProfile[]> {
    return this.getUsersDetails({});
  }
  /**
   * Updates a user with the given ID.
   *
   * @param id - ID of the user to update
   * @param updateUserDto - Data to update the user with
   * @returns A promise containing the updated user
   * @throws Error if the query fails
   */
  async updateUser(
    id: Types.ObjectId | string,
    updateUserDto: UpdateUserDto,
  ): Promise<CombinedUserProfile> {
    return await this.userRepository.updateUserSession(id, updateUserDto);
  }
  /**
   * Increments the login count for a user
   *
   * @param userId - ID of the user to increment the login count for
   * @returns A promise containing the updated user
   * @throws Error if the query fails
   */
  async incrementLoginCount(userId: Types.ObjectId | string): Promise<User | null> {
    return this.userRepository.update(userId, { $inc: { loginCount: 1 } });
  }
  /**
   * Retrieves a user by email address
   * @param email - Email address of the user to retrieve
   * @returns A promise containing the user object or null if not found
   * @throws Error if the query fails
   */
  async getUserByEmail(email: string): Promise<CombinedUserProfile | null> {
    return await this.getUser({ email });
  }
  /**
   * Retrieves a user by their ID.
   *
   * @param id - ID of the user to retrieve
   * @param session - Optional session to use for the query
   * @returns A promise containing the user object
   * @throws Error if the query fails
   */
  async getUserById(
    id: Types.ObjectId | string,
    session?: ClientSession,
  ): Promise<CombinedUserProfile> {
    IdValidation.validateId(id, 'User ID');
    const objectId = IdValidation.createId(id);
    const user = await this.getUser({ _id: objectId }, session);
    return RoleDisplay.applyRoleDisplay(user);
  }
  /**
   * Retrieves a list of users by their IDs.
   * @param userIds - List of user IDs to retrieve
   * @returns A promise containing an array of user objects
   * @throws HttpException if the input is invalid or if the query fails
   */
  async getUsersByIds(userIds: (string | Types.ObjectId)[]): Promise<CombinedUserProfile[]> {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new HttpException(USER.USER_IDS_REQUIRED, HttpStatus.OK);
    }
    const validUserIds = IdValidation.filterIds(userIds);
    if (validUserIds.length === 0) {
      throw new HttpException(USER.USER_IDS_REQUIRED, HttpStatus.OK);
    }
    const users = await this.getUsersDetails({ _id: { $in: validUserIds } });
    return RoleDisplay.applyDisplay(users);
  }
  /**
   * Retrieves a list of users without excluded roles and grouped by their roles
   * @returns A promise containing an array of user objects grouped by their roles
   * @throws Error if the query fails
   */
  /**
   * Retrieves a list of users without excluded roles and grouped by their roles
   * @returns A promise containing an array of user objects grouped by their roles
   * @throws Error if the query fails
   */
  async getUsersTeam(requesterRole?: Role): Promise<TransformedUser[]> {
    const users = await this.getUsersDetails({});
    if (!UserValidator.isValidArray(users)) {
      this.logger.warn('⚠ No valid users array returned from getUsersDetails');
      return [];
    }
    const filteredUsers = UserHelper.filterExcludedRoles(users, requesterRole);
    const groupedUsers = UserHelper.groupUserProfiles(filteredUsers, requesterRole);
    return groupedUsers;
  }
  /**
   * Retrieves a list of users by the given filter.
   * @param filter - Filter to apply to the query
   * @param session - Optional session to use for the query
   * @returns A promise containing an array of user objects
   * @throws Error if the query fails
   */
  async getUsersDetails(
    filter: UserFilter,
    session?: ClientSession,
  ): Promise<CombinedUserProfile[]> {
    const users = await this.userRepository.findLean(filter, session);
    if (!UserValidator.isValidArray(users)) {
      return [];
    }
    UserValidator.UserArray(users);
    const userIds = UserValidator.extractIds(users);
    const departmentIds = UserValidator.extractDepartment(users);
    const [profiles, departments] = await Promise.all([
      this.profileService.getProfilesByUserIds(userIds, session),
      departmentIds.length > 0
        ? this.departmentService.getDepartmentsByIdsLean(departmentIds)
        : Promise.resolve([]),
    ]);
    const profileMap = UserHelper.createProfileMap(profiles);
    const departmentMap = UserHelper.createDepartmentMap(departments);
    const combinedUsers = UserHelper.combineUserData(users, profileMap, departmentMap);
    return RoleDisplay.applyDisplay(combinedUsers);
  }
  /**
   * Retrieves a map of executives by their roles.
   * @returns A promise containing a map of executives, where the key is the role name and the value is the executive object
   * @throws Error if the query fails
   */
  async fetchExecutives(): Promise<{
    HR?: IExecutive;
    COO?: IExecutive;
    ADMIN?: IExecutive;
    SUPER_ADMIN?: IExecutive;
    TRAINER?: IExecutive;
  }> {
    const roles = Object.values(Role);
    const users = await this.userRepository.findByRoles(roles);
    const userIds = users.map(u => u._id);
    const profiles = await this.profileService.getProfilesByUserIds(userIds);
    const profileMap = UserHelper.createProfileMap(profiles);
    const response = UserHelper.createExecutivesMap(users, profileMap);
    this.logger.log(response);
    return response;
  }
  /**
   * Retrieves users by their role.
   * @param role - The role to filter users by
   * @returns A promise containing an array of users with the specified role
   * @throws Error if the query fails
   */
  async getUsersByRole(role: Role): Promise<CombinedUserProfile[]> {
    const users = await this.userRepository.findByRoles([role]);
    const userIds = users.map(u => u._id);
    const profiles = await this.profileService.getProfilesByUserIds(userIds);
    const profileMap = UserHelper.createProfileMap(profiles);
    const departments = await this.departmentService.findAll();
    const departmentMap = UserHelper.createDepartmentMap(departments);
    return UserHelper.combineUserData(users, profileMap, departmentMap);
  }
  /**
   * Validates a department ID.
   * @param department - The department ID to validate
   * @returns A promise containing the validated department ID or null if the department ID is not provided
   * @throws NotFoundException if the department ID is not found
   */
  async validateDepartment(department?: string): Promise<Types.ObjectId | null> {
    if (!department) return null;
    IdValidation.validateId(department, 'Department ID');
    const departmentDetails = await this.departmentService.getDepartmentById(department);
    if (!departmentDetails) {
      throw new NotFoundException(DEPARTMENT.NOT_FOUND);
    }
    return new Types.ObjectId(department);
  }
  /**
   * Creates a new user account and profile.
   * @param createUserDto - User creation data
   * @param creatorId - ID of the user creating the account
   * @returns Promise with operation result
   */
  async createUserProfile(
    createUserDto: CreateUserProfileDto,
    creatorId: Types.ObjectId,
  ): Promise<UserOperationResult> {
    IdValidation.validateId(creatorId, 'Creator ID');
    InputValidation.validateCreateUser(createUserDto);
    const session = await this.userRepository.startSession();
    try {
      const [departmentDetails, creator] = await Promise.all([
        this.validateDepartment(createUserDto.department),
        this.getUserById(creatorId),
      ]);
      if (!creator) throw new NotFoundException(USER.NOT_FOUND);
      InputValidation.validatePermissions(creator);
      const userId = new Types.ObjectId();
      const activationCode = CodeHelper.generateCode();
      const rawPassword = CodeHelper.generateCode();
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      let createdUser: User;
      await session.withTransaction(async () => {
        createdUser = await this.performUserCreation(
          userId,
          createUserDto,
          hashedPassword,
          activationCode,
          creatorId,
          departmentDetails,
          session,
        );
      });
      await this.postUserCreationActions(userId, createdUser, activationCode, departmentDetails);
      const user = await this.getUserById(userId);
      return { user, authUser: responseTransform({ data: creator }) };
    } catch (error) {
      UserHelper.handleUserCreationError(error);
    } finally {
      await session.endSession();
    }
  }
  /**
   * Updates a user's profile with the given data.
   * @param userId - The ID of the user to update.
   * @param updateUserDto - The data to update the user with.
   * @param updaterId - The ID of the user performing the update.
   * @returns A promise that resolves with the updated user data and the user performing the update.
   * @throws BadRequestException if the user ID or updater ID is invalid, or if the user data is invalid.
   * @throws NotFoundException if the user to update or the updater user is not found.
   * @throws InternalServerErrorException if there is an error while updating the user.
   */
  async updateUserProfile(
    userId: Types.ObjectId,
    updateUserDto: UpdateUserProfileDto,
    updaterId: Types.ObjectId,
  ): Promise<UserOperationResult> {
    IdValidation.validateId(userId, 'User ID');
    IdValidation.validateId(updaterId, 'Updater ID');
    const session = await this.userRepository.startSession();
    try {
      const [existingUser, updater] = await Promise.all([
        this.getUserById(userId),
        this.getUserById(updaterId),
      ]);
      if (!existingUser || !updater) throw new NotFoundException(USER.NOT_FOUND);
      InputValidation.validatePermissions(updater);
      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        await this.userRepository.validateExisting(updateUserDto.email, existingUser);
      }
      await session.withTransaction(async () => {
        if (updateUserDto.status === UserStatus.DISABLED) {
          await this.handleUserSuspension(userId, existingUser, updaterId, session);
        } else {
          await this.performUserUpdate(userId, existingUser, updateUserDto, updaterId, session);
        }
      });
      if (updateUserDto.status === UserStatus.DISABLED) {
        return {
          user: 'User Suspended Successfully',
          authUser: responseTransform({ data: updater }),
        };
      }
      await this.handleTeamLeadTransition(userId, existingUser, updateUserDto);
      const userProfile = await this.getUserById(userId);
      return { user: userProfile, authUser: responseTransform({ data: updater }) };
    } catch (error) {
      UserHelper.handleUserCreationError(error);
    } finally {
      await session.endSession();
    }
  }
  /**
   * Creates a new user account and profile in a single transaction.
   * @param userId - ID of the user to be created
   * @param dto - User creation data
   * @param hashedPassword - Hashed password of the user
   * @param activationCode - Activation code for the user
   * @param creatorId - ID of the user creating the account
   * @param departmentDetails - ID of the department the user belongs to (optional)
   * @param session - Client session for the transaction
   * @returns Promise with the created user
   * @throws InternalServerErrorException if the user creation fails
   */
  private async performUserCreation(
    userId: Types.ObjectId,
    dto: CreateUserProfileDto,
    hashedPassword: string,
    activationCode: string,
    creatorId: Types.ObjectId,
    departmentDetails: Types.ObjectId | null,
    session: ClientSession,
  ): Promise<User> {
    const { firstName, lastName, designation, cell, email, username, permissions, role, status } =
      dto;
    const employeeId = await this.profileService.generateEmployeeId();
    const createdUser = await this.userRepository.create(
      {
        _id: userId,
        email,
        username: username || undefined,
        cell: cell || undefined,
        password: hashedPassword,
        activationCode: Number(activationCode),
        activationCodeGeneratedAt: new Date(),
        isVerified: false,
        createdBy: creatorId,
        department: departmentDetails,
        status: status || UserStatus.INACTIVE,
        role,
        permissions,
      } as User,
      session,
    );
    if (!createdUser) throw new InternalServerErrorException(USER.CREATION_FAILED);
    await this.profileService.createUserProfile(
      {
        userId: createdUser._id,
        email: createdUser.email,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        designation,
        role: createdUser.role as Role,
        status: createdUser.status,
        employeeId,
        contactNumber: cell,
        createdBy: creatorId,
      } as Partial<Profiles>,
      session,
    );
    return createdUser;
  }
  /**
   * Perform post-user creation actions such as sending an activation email and assigning a team lead.
   * @param userId - ID of the newly created user
   * @param user - Newly created user document
   * @param activationCode - Activation code sent to the user
   * @param departmentDetails - Department ID of the newly created user (if applicable)
   * @returns Promise with no value
   */
  private async postUserCreationActions(
    userId: Types.ObjectId,
    user: User,
    activationCode: string,
    departmentDetails: Types.ObjectId | null,
  ): Promise<void> {
    UserHelper.uploadDefaultProfilePicture(this.profileService, userId.toString()).catch(err =>
      this.logger.error(`Failed to upload default profile picture: ${err.message}`),
    );
    try {
      const fullUser = await this.getUserById(userId);
      EmailAuthTemplatesService.sendActivationEmail(fullUser, activationCode, userId);
    } catch (err) {
      this.logger.error(EMAIL_ERROR.ACTIVATION_EMAIL_FAILED, err.stack);
    }
    if (user.role === Role.TEAM_LEAD && departmentDetails) {
      await this.departmentService.assignTeamLead(departmentDetails, userId);
    }
  }
  /**
   * Handles the suspension of a user.
   * If the user is a team lead, it also removes the team lead from the department.
   * It then updates the user and profile to reflect the suspension.
   * Finally, it deletes all requests sent by the user.
   * @param userId - The ID of the user to suspend.
   * @param existingUser - The existing user data.
   * @param updaterId - The ID of the user performing the suspension.
   * @param session - The MongoDB session to use.
   */
  private async handleUserSuspension(
    userId: Types.ObjectId,
    existingUser: CombinedUserProfile,
    updaterId: Types.ObjectId,
    session: ClientSession,
  ): Promise<void> {
    if (existingUser.role === Role.TEAM_LEAD && existingUser.department) {
      const deptId = (existingUser.department as any)?._id || existingUser.department;
      await this.departmentService.handleTeamLeadRemoval(deptId, userId);
    }
    const userUpdateData = {
      status: UserStatus.SUSPENDED,
      updatedBy: updaterId,
      updatedAt: new Date(),
    };
    await this.userRepository.updateUserSession(userId, userUpdateData, session);
    const profileUpdateData: Partial<Profiles> = {
      status: UserStatus.SUSPENDED,
      leftUs: new Date(),
      updatedBy: updaterId,
      updatedAt: new Date(),
    };
    await this.profileService.updateProfile(userId, profileUpdateData, session);
    await this.requestService.deleteRequestsByUser(userId, session);
  }
  /**
   * Performs the actual user update operation. This involves updating the user
   * document and the profile document.
   * @param userId - The ID of the user to update.
   * @param existingUser - The existing user data.
   * @param dto - The data to update the user with.
   * @param updaterId - The ID of the user performing the update.
   * @param session - The MongoDB session to use.
   */
  private async performUserUpdate(
    userId: Types.ObjectId,
    existingUser: CombinedUserProfile,
    dto: any,
    updaterId: Types.ObjectId,
    session: ClientSession,
  ): Promise<void> {
    const userUpdateData = UserHelper.prepareUserUpdateData({
      ...dto,
      updaterId,
    });
    await this.userRepository.updateUserSession(userId, userUpdateData, session);
    const profileUpdateData = UserHelper.prepareProfileUpdateData(existingUser, dto);
    if (dto.status === UserStatus.ACTIVE && existingUser.profile?.status === UserStatus.SUSPENDED) {
      profileUpdateData.rejoinUs = new Date();
      profileUpdateData.leftUs = undefined;
    }
    if (dto.status === UserStatus.SUSPENDED) {
      profileUpdateData.leftUs = new Date();
    }
    if (Object.keys(profileUpdateData).length > 0) {
      await this.profileService.updateProfile(userId, profileUpdateData as any, session);
    }
  }
  /**
   * Handles the transition of a team lead due to a role change or department change.
   * If the user is demoted from a team lead, the department is updated to remove the lead.
   * If the user is promoted to a team lead, the department is updated to assign the lead.
   * @param userId - The ID of the user being updated.
   * @param existingUser - The existing user data.
   * @param dto - The update data.
   */
  private async handleTeamLeadTransition(
    userId: Types.ObjectId,
    existingUser: CombinedUserProfile,
    dto: UpdateUserProfileDto,
  ): Promise<void> {
    const { role, department, status } = dto;
    if (status === UserStatus.SUSPENDED || status === UserStatus.DISABLED) return;
    const oldDeptIdStr =
      (existingUser.department as any)?._id?.toString() || existingUser.department?.toString();
    const isDeptChanged = department && department !== oldDeptIdStr;
    const isRoleChanged = role && role !== existingUser.role;
    if (existingUser.role === Role.TEAM_LEAD && (isRoleChanged || isDeptChanged)) {
      const oldDeptId = (existingUser.department as any)?._id || existingUser.department;
      if (oldDeptId) await this.departmentService.handleTeamLeadRemoval(oldDeptId, userId);
    }
    const effectiveRole = role || existingUser.role;
    if (effectiveRole === Role.TEAM_LEAD) {
      const isRolePromoted = role === Role.TEAM_LEAD && existingUser.role !== Role.TEAM_LEAD;
      if (isRolePromoted || isDeptChanged) {
        const targetDeptId = department
          ? new Types.ObjectId(department)
          : (existingUser.department as any)?._id || existingUser.department;
        if (targetDeptId) await this.departmentService.assignTeamLead(targetDeptId, userId);
      }
    }
  }
}
