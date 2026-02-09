import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ClientSession, Types, UpdateQuery } from 'mongoose';

import { EmailstatementService } from '../../services/email/profile/email-statement-process.service';
import { StatementHelper } from '../../shared/helpers/indicators.helper';
import { ProfileHelper } from '../../shared/helpers/profile.helper';
import { UserHelper } from '../../shared/helpers/user.helpers';
import { RoleDisplay } from '../../shared/utils/role-display.utils';
import { CamelCase } from '../../shared/utils/unified-transform.utils';
import { uploadingValidator } from '../../shared/validators/file.validation';
import { PROFILE, USER } from '../../types/constants/error-messages.constants';
import { UserStatus } from '../../types/constants/user-status.constants';
import { DocumentCategory } from '../../types/enums/doc.enums';
import { IStatementStatus } from '../../types/enums/profile.enums';
import { Role } from '../../types/enums/role.enums';
import { UserPayload } from '../../types/interfaces/jwt.interface';
import { IIndicator, IProfileResponse, IQuarter } from '../../types/interfaces/statement.interface';
import { UserService } from '../user/user.service';
import {
  CreateStatementDto,
  ReviewMissionStatementDto,
  SubmissionQuarterDto,
} from './dto/profile.dto';
import { ProfileRepository } from './profile.repository';
import {
  DocumentFile,
  Profiles,
  ProfilesDocument,
  ProfileUser,
  StatementSchema,
} from './schemas/profiles.schema';
@Injectable()
/**
 * Service for managing user profiles in the APAC Management System.
 *
 * Handles profile CRUD operations, file uploads (profile pictures and documents),
 * mission statement submissions and reviews, and success indicator management.
 *
 * @class ProfileService
 * @implements {OnModuleInit}
 *
 * @example
 * ```typescript
 * const profile = await profileService.createProfile(createProfileDto);
 * await profileService.uploadProfilePicture(userId, file);
 * await profileService.submitMissionStatement(userId, missionDto, authUser);
 * ```
 */
export class ProfileService implements OnModuleInit {
  private readonly logger = new Logger(ProfileService.name);
  private userService: UserService;
  constructor(
    private readonly profilesRepository: ProfileRepository,
    private moduleRef: ModuleRef,
  ) {}
  async onModuleInit(): Promise<void> {
    this.userService = await this.moduleRef.resolve(UserService, undefined, { strict: false });
  }
  async createProfile(
    createProfileDto: Partial<Profiles>,
    options?: { session?: ClientSession },
  ): Promise<Profiles> {
    try {
      if (!createProfileDto) {
        throw new HttpException(PROFILE.INVALID_DATA, HttpStatus.OK);
      }
      const profileData: Profiles = {
        _id: new Types.ObjectId(),
        ...createProfileDto,
      } as Profiles;
      if (options?.session) {
        return this.profilesRepository.createUserProfile(profileData, options.session);
      }
      return this.profilesRepository.createProfile(profileData);
    } catch (error) {
      if (error instanceof HttpException || error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException(PROFILE.CREATION_FAILED, HttpStatus.OK);
    }
  }
  async createUserProfile(
    profileData: Partial<Profiles>,
    session: ClientSession,
  ): Promise<Profiles> {
    try {
      return await this.profilesRepository.createUserProfile(profileData, session);
    } catch (error) {
      const mongoError = error as { code?: number };
      if (mongoError.code === 11000) {
        throw new HttpException(PROFILE.ALREADY_EXISTS, HttpStatus.OK);
      }
      throw new HttpException(PROFILE.CREATION_FAILED, HttpStatus.OK);
    }
  }
  async findProfilesByEmails(emails: string[]): Promise<Profiles[]> {
    return this.profilesRepository.findProfilesByEmails(emails);
  }
  async findProfilesByEmployeeIds(employeeIds: string[]): Promise<Profiles[]> {
    return this.profilesRepository.findProfilesByEmployeeIds(employeeIds);
  }
  async updateProfileSession(
    userId: Types.ObjectId,
    any: Partial<Profiles>,
    session: ClientSession,
  ): Promise<Profiles | null> {
    try {
      if (!userId) {
        throw new HttpException(USER.ID_REQUIRED, HttpStatus.OK);
      }
      if (!any) {
        throw new HttpException(PROFILE.INVALID_DATA, HttpStatus.OK);
      }
      return await this.profilesRepository.updateProfileSession(userId, any, session);
    } catch (error) {
      this.logger.error(`Error updating profile for user ${userId.toString()}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(PROFILE.UPDATE_FAILED, HttpStatus.OK);
    }
  }
  async updateProfile(
    userId: Types.ObjectId | string,
    any: any,
    session?: ClientSession,
  ): Promise<Profiles | null> {
    try {
      if (!userId) {
        throw new HttpException(USER.ID_REQUIRED, HttpStatus.OK);
      }
      if (!any) {
        throw new HttpException(PROFILE.INVALID_DATA, HttpStatus.OK);
      }
      const cleanUpdateData = ProfileHelper.cleanUpdateData(any);
      if ((cleanUpdateData.firstName || cleanUpdateData.lastName) && !cleanUpdateData.fullName) {
        const existingProfile = await this.profilesRepository.findOne(userId as Types.ObjectId);
        const newFirstName = cleanUpdateData.firstName || existingProfile?.firstName || '';
        const newLastName = cleanUpdateData.lastName || existingProfile?.lastName || '';
        cleanUpdateData.fullName = `${newFirstName} ${newLastName}`.trim();
      }
      return await this.profilesRepository.updateProfileSession(
        userId as Types.ObjectId,
        cleanUpdateData,
        session,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(PROFILE.UPDATE_FAILED, HttpStatus.OK);
    }
  }
  async getProfilesByUserIds(
    userIds: Types.ObjectId[],
    session?: ClientSession,
  ): Promise<Profiles[]> {
    return this.profilesRepository.getProfilesByUserIds(userIds, session);
  }
  async getProfileByUserId(userId: string): Promise<Profiles | null> {
    try {
      const profile = await this.profilesRepository.getProfileByUserId(userId);
      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
      }
      return profile;
    } catch (error: any) {
      this.logger.error(`Error getting profile: ${error.message}`, error.stack);
      throw error;
    }
  }
  async uploadProfilePicture(
    userId: Types.ObjectId | string,
    file: Express.Multer.File,
  ): Promise<Profiles> {
    await uploadingValidator.ensureGcsInitialized();
    const existingProfile = await this.profilesRepository.getProfileByUserId(userId);
    if (!existingProfile) {
      throw new HttpException('Profile not found for the given user ID', HttpStatus.OK);
    }
    const options = uploadingValidator.validationOptions('profilePicture');
    uploadingValidator.validateFile(file, options);
    if (existingProfile.profilePicture?.url) {
      await uploadingValidator.deleteFileFromGcsByUrl(existingProfile.profilePicture.url);
    }
    const result = await uploadingValidator.uploadFile(file, 'profile_pic', userId, {
      ...options,
      makePublic: true,
    });
    const profilePictureDoc = uploadingValidator.createProfileFile(
      file,
      result.fileUrl,
      DocumentCategory.PROFILE_PICTURE,
    );
    return this.profilesRepository.updateProfileByUserId(
      userId as unknown as string,
      {
        profilePicture: profilePictureDoc,
        updatedAt: new Date(),
      } as UpdateQuery<ProfilesDocument>,
    );
  }
  async removeProfilePicture(userId: Types.ObjectId | string): Promise<Profiles | null> {
    const existingProfile = await this.profilesRepository.getProfileByUserId(userId);
    if (!existingProfile) {
      throw new HttpException('Profile not found for the given user ID', HttpStatus.OK);
    }
    if (existingProfile.profilePicture?.url) {
      await uploadingValidator.deleteFileFromGcsByUrl(existingProfile.profilePicture.url);
    }
    return this.profilesRepository.updateProfileByUserId(
      userId as unknown as string,
      {
        $unset: { profilePicture: 1 },
        updatedAt: new Date(),
      } as UpdateQuery<ProfilesDocument>,
    );
  }
  async addDocument(
    userId: Types.ObjectId | string,
    file: Express.Multer.File,
  ): Promise<Profiles | null> {
    const existingProfile = await this.profilesRepository.getProfileByUserId(userId);
    if (!existingProfile) {
      throw new HttpException('Profile not found for the given user ID', HttpStatus.OK);
    }
    const options = uploadingValidator.validationOptions('documents');
    uploadingValidator.validateFile(file, options);
    const result = await uploadingValidator.uploadFile(file, 'document', userId, options);
    const documentDoc = uploadingValidator.createFile(file, result.fileUrl, {
      category: DocumentCategory.OTHER,
    });
    return this.profilesRepository.updateProfileByUserId(
      userId as unknown as string,
      {
        $push: { documents: documentDoc },
        updatedAt: new Date(),
      } as UpdateQuery<ProfilesDocument>,
    );
  }
  async removeDocument(
    userId: Types.ObjectId | string,
    documentId: Types.ObjectId | string,
  ): Promise<Profiles | null> {
    const existingProfile = await this.profilesRepository.getProfileByUserId(userId);
    if (!existingProfile) {
      throw new HttpException('Profile not found for the given user ID', HttpStatus.OK);
    }
    const document = existingProfile.documents.find(
      (doc: DocumentFile) => doc._id.toString() === documentId.toString(),
    );
    if (document?.url) {
      await uploadingValidator.deleteFileFromGcsByUrl(document.url);
    }
    return this.profilesRepository.updateProfileByUserId(
      userId as unknown as string,
      {
        $pull: { documents: { _id: documentId } },
        updatedAt: new Date(),
      } as UpdateQuery<ProfilesDocument>,
    );
  }
  async generateEmployeeId(): Promise<string> {
    return this.profilesRepository.generateEmployeeId();
  }
  private async getStatementReviewer(user: any): Promise<any> {
    try {
      const userRole = user.role?.toUpperCase().replace(/\s+/g, '_');
      const executives = await this.userService.fetchExecutives();
      switch (userRole) {
        case Role.MEMBER:
          if (user.department?.teamLeadDetail) {
            return {
              userId: user.department.teamLeadDetail.userId,
              fullName: user.department.teamLeadDetail.fullName,
              email: user.department.teamLeadDetail.email,
              role: user.department.teamLeadDetail.role,
            };
          }
          if (executives.COO) {
            return {
              userId: executives.COO.userId,
              fullName: executives.COO.fullName,
              email: executives.COO.email,
              role: executives.COO.role,
            };
          }
          break;
        case Role.TEAM_LEAD:
        case Role.REPORTING_LINE:
        case Role.COO:
          if (executives.TRAINER) {
            return {
              userId: executives.TRAINER.userId,
              fullName: executives.TRAINER.fullName,
              email: executives.TRAINER.email,
              role: executives.TRAINER.role,
            };
          }
          break;
        default:
          if (executives.TRAINER) {
            return {
              userId: executives.TRAINER.userId,
              fullName: executives.TRAINER.fullName,
              email: executives.TRAINER.email,
              role: executives.TRAINER.role,
            };
          }
      }
      this.logger.warn(`No reviewer found for user role: ${userRole}`);
      return null;
    } catch (error) {
      this.logger.error(`Error getting statement reviewer: ${error.message}`, error.stack);
      return null;
    }
  }
  async submitMissionStatement(
    createStatementDto: CreateStatementDto,
    authUser: UserPayload,
  ): Promise<any> {
    try {
      const userId = authUser._id;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new HttpException(USER.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      const reviewer = await this.getStatementReviewer(user);
      const statementContent: StatementSchema = {
        id: new Types.ObjectId(),
        content: createStatementDto.content,
        status: IStatementStatus.PENDING,
        changesRequired: '',
        createdBy: {
          userId: new Types.ObjectId(user._id),
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
        reviewer: {
          userId: reviewer?.userId ? new Types.ObjectId(reviewer.userId) : null,
          fullName: reviewer?.fullName || '',
          email: reviewer?.email || '',
          role: reviewer?.role || '',
        },
        createdAt: new Date(),
      };
      const updateQuery: any = user.profile?.missionStatement
        ? {
            $push: {
              'missionStatement.statements': statementContent,
            },
          }
        : {
            $set: {
              missionStatement: {
                statements: [statementContent],
                createdAt: new Date(),
              },
            },
          };
      const updatedProfile = await this.profilesRepository.updateProfileByUserId(
        userId,
        updateQuery as UpdateQuery<ProfilesDocument>,
      );
      if (!updatedProfile) {
        throw new HttpException(
          'Failed to submit mission statement',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      await EmailstatementService.notifyStatement(
        user,
        createStatementDto.content,
        statementContent.reviewer,
      );
      const transformedUser = RoleDisplay.applyRoleDisplay(user);
      return {
        userId: user._id.toString(),
        fullName: user.fullName || '',
        role: transformedUser.role,
        displayRole: transformedUser.displayRole,
        originalRole: transformedUser.originalRole,
        isReportingLineUser: transformedUser.isReportingLineUser,
        employeeId: user.employeeId || '',
        designation: user.designation || '',
        pictureUrl: user.profile?.profilePicture?.url || '',
        missionStatement: createStatementDto.content,
        status: CamelCase(IStatementStatus.PENDING),
      };
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred';
      const errorStack = error?.stack || 'No stack trace available';
      this.logger.error(`Error submitting mission statement: ${errorMessage}`, errorStack);
      throw error;
    }
  }
  async reviewMissionStatement(
    userId: string,
    dto: ReviewMissionStatementDto,
    authUser: UserPayload,
  ): Promise<any> {
    try {
      const targetUser = await this.userService.getUserById(userId);
      if (!targetUser) {
        throw new HttpException(USER.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      const profile = await this.profilesRepository.getProfileByUserId(userId);
      if (!profile || !profile.missionStatement) {
        throw new HttpException('Mission statement not found', HttpStatus.NOT_FOUND);
      }
      const latestStatement =
        profile.missionStatement.statements[profile.missionStatement.statements.length - 1];
      if (latestStatement.status !== IStatementStatus.PENDING) {
        throw new HttpException('Mission statement is not pending review', HttpStatus.BAD_REQUEST);
      }
      const reviewer: ProfileUser = {
        userId: authUser?._id,
        fullName: authUser?.fullName,
        email: authUser?.email,
        role: authUser?.role,
      };
      const updateQuery = {
        'missionStatement.statements.$[elem].status': dto.status,
        'missionStatement.statements.$[elem].changesRequired': dto.changesRequired || '',
        'missionStatement.statements.$[elem].reviewer': reviewer,
        'missionStatement.statements.$[elem].reviewedAt': new Date(),
      } as UpdateQuery<ProfilesDocument>;
      const arrayFilters = [{ 'elem.status': IStatementStatus.PENDING }];
      const updatedProfile = await this.profilesRepository.updateProfileSession(
        userId,
        updateQuery,
        undefined,
        arrayFilters,
      );
      if (!updatedProfile) {
        throw new HttpException(
          'Failed to review mission statement',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      await EmailstatementService.notifyReviewDecision(
        targetUser,
        dto,
        authUser,
        updatedProfile.missionStatement || profile.missionStatement,
      );
      const missionStatements = (updatedProfile.missionStatement || profile.missionStatement)
        .statements;
      const updatedStatement = missionStatements[missionStatements.length - 1];
      const updatedStatus = CamelCase(updatedStatement.status);
      const transformedTargetUser = RoleDisplay.applyRoleDisplay(targetUser);
      return {
        userId: targetUser._id.toString(),
        fullName: targetUser.fullName || '',
        role: transformedTargetUser.role,
        displayRole: transformedTargetUser.displayRole,
        originalRole: transformedTargetUser.originalRole,
        isReportingLineUser: transformedTargetUser.isReportingLineUser,
        employeeId: targetUser.profile?.employeeId || '',
        designation: targetUser.profile?.designation || '',
        pictureUrl: profile.profilePicture?.url || targetUser.profile?.profilePicture?.url || '',
        missionStatement: updatedStatement.content,
        status: updatedStatus,
      };
    } catch (error: any) {
      this.logger.error(`Error reviewing mission statement: ${error.message}`, error.stack);
      throw error;
    }
  }
  async getAllProfiles(
    authUser: UserPayload,
  ): Promise<{ records: IProfileResponse[]; myRecords: IProfileResponse }> {
    try {
      const userRole = authUser.role?.toUpperCase().replace(/\s+/g, '_');
      const allUsers = await this.userService.getAllUsers();
      const activeUsers = allUsers.filter(
        (user: { status: string }) => user.status?.toUpperCase() !== UserStatus.SUSPENDED,
      );
      let records: any[] = [];
      let myRecords: any = null;
      switch (userRole) {
        case Role.TRAINER.toUpperCase():
          records = activeUsers.filter((user: { role: string }) => {
            return [
              Role.TEAM_LEAD.toUpperCase(),
              Role.COO.toUpperCase(),
              Role.MEMBER.toUpperCase(),
            ].includes(user.role?.toUpperCase().replace(/\s+/g, '_'));
          });
          myRecords =
            activeUsers.find(
              (user: { _id: { toString: () => any } }) =>
                user._id.toString() === authUser._id.toString(),
            ) || null;
          break;
        case Role.MEMBER.toUpperCase():
          records = [];
          myRecords =
            activeUsers.find(
              (user: { _id: { toString: () => any } }) =>
                user._id.toString() === authUser._id.toString(),
            ) || null;
          break;
        case Role.TEAM_LEAD.toUpperCase():
        case Role.COO.toUpperCase():
          const teamMembers = UserHelper.getTeam(authUser, activeUsers);
          const teamMemberIds = teamMembers.map((member: { _id: { toString: () => any } }) =>
            member._id.toString(),
          );
          records = activeUsers.filter((user: { _id: { toString: () => any } }) =>
            teamMemberIds.includes(user._id.toString()),
          );
          myRecords =
            activeUsers.find(
              (user: { _id: { toString: () => any } }) =>
                user._id.toString() === authUser._id.toString(),
            ) || null;
          break;
        case Role.HR.toUpperCase():
        case Role.ADMIN.toUpperCase():
        case Role.SUPER_ADMIN.toUpperCase():
          const excludedRoles = [
            Role.HR.toUpperCase(),
            Role.ADMIN.toUpperCase(),
            Role.SUPER_ADMIN.toUpperCase(),
            Role.TRAINER.toUpperCase(),
          ];
          records = activeUsers.filter(
            (user: { role: string }) =>
              !excludedRoles.includes(user.role?.toUpperCase().replace(/\s+/g, '_')),
          );
          myRecords =
            activeUsers.find(
              (user: { _id: { toString: () => any } }) =>
                user._id.toString() === authUser._id.toString(),
            ) || null;
          break;
        default:
          records = [];
          myRecords = null;
      }
      const transformedRecords = await Promise.all(
        records.map(async user => {
          try {
            const profileData = await StatementHelper.transformUserProfile(user);
            return profileData;
          } catch {
            return null;
          }
        }),
      );
      const transformedMyRecords = myRecords
        ? await StatementHelper.transformUserProfile(myRecords).catch(() => null)
        : null;
      return {
        records: transformedRecords.filter((record: null) => record !== null),
        myRecords: transformedMyRecords,
      };
    } catch (error: any) {
      this.logger.error(`Error getting all profiles: ${error.message}`, error.stack);
      throw new HttpException('Failed to get profiles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async addSuccessIndicators(
    userId: string,
    dto: SubmissionQuarterDto,
    authUser: UserPayload,
  ): Promise<IQuarter[]> {
    try {
      const { isTeamLead, isLAndD, isCOO } = ProfileHelper.validateIndicatorAuthorization(authUser);
      if (!isTeamLead && !isLAndD && !isCOO) {
        throw new HttpException(
          'Only Team Leads, L&D, or COO can add success indicators',
          HttpStatus.FORBIDDEN,
        );
      }
      const applicant = await this.userService.getUserById(userId);
      if (!applicant) {
        throw new HttpException(USER.NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      if (isLAndD && userId !== authUser._id.toString()) {
        await ProfileHelper.validateLAndDForTarget(applicant);
      }
      const currentYear = new Date().getFullYear();
      const processedQuarters: IQuarter[] = dto.successIndicators.map(
        (quarterDto: { indicators: any[]; quarter: any; isActive: any; year: any }) => {
          const processedIndicators: IIndicator[] = quarterDto.indicators.map(
            (indicator: IIndicator) => {
              const processedIndicator: IIndicator = {
                ...indicator,
                isMoved: indicator.isMoved ?? false,
                isTransferred: indicator.isTransferred ?? false,
              };
              return processedIndicator;
            },
          );
          return {
            quarter: quarterDto.quarter,
            isActive: quarterDto.isActive,
            year: quarterDto.year || currentYear,
            indicators: processedIndicators,
          };
        },
      );
      const isMovedQuarters = ProfileHelper.handleIsMoved(processedQuarters, applicant);
      const allQuarters = [];
      for (let quarter = 1; quarter <= 4; quarter++) {
        const existingQuarter = isMovedQuarters.find(
          (q: { quarter: number }) => q.quarter === quarter,
        );
        const profileQuarter = applicant.profile?.successIndicators?.find(
          (q: any) => q.quarter === quarter,
        );
        if (existingQuarter) {
          allQuarters.push(existingQuarter);
        } else if (profileQuarter) {
          allQuarters.push(profileQuarter);
        } else {
          allQuarters.push({
            quarter,
            isActive: false,
            year: currentYear,
            indicators: [],
          });
        }
      }
      const updatedUserProfile = await this.profilesRepository.updateProfileByUserId(userId, {
        $set: {
          successIndicators: allQuarters,
        },
      } as UpdateQuery<ProfilesDocument>);
      if (!updatedUserProfile) {
        throw new HttpException(
          'Failed to update success indicators',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      /**
       * TODO: Re-implement email notifications for success indicators
       * Email notifications are temporarily disabled. When re-enabling:
       * 1. Check if EmailIndicatorsProcessService is available
       * 2. Handle moved indicators vs new indicators separately
       * 3. Add proper error handling for email failures
       * 4. Consider making email notifications configurable
       */
      return StatementHelper.transformIndicators({ successIndicators: allQuarters });
    } catch (error: any) {
      this.logger.error(`Error adding success indicators: ${error.message}`, error.stack);
      throw error;
    }
  }
}
