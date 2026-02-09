import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types, UpdateQuery } from 'mongoose';

import { PaginationDto } from '@/types/dtos/pagination.dto';

import { PaginationHelper } from '@/shared/helpers/pagination.helper';
import { EmailService } from '../../services/email/request/email-request-action.service';
import { EmailProcessService } from '../../services/email/request/email-request-process.service';
import { CommonHelpers } from '../../shared/helpers/common.helpers';
import { prepareProcessTemplate, prepareTemplate } from '../../shared/helpers/email.helper';
import { DateHelper } from '../../shared/helpers/format-Dates.helper';
import { RequestHelper } from '../../shared/helpers/request.helpers';
import { RoleDisplay } from '../../shared/utils/role-display.utils';
import {
  RequestResponse,
  responseTransform,
  transformRole,
} from '../../shared/utils/unified-transform.utils';
import { RequestValidationHelper } from '../../shared/validators/request-validation.helper';
import { REQUEST, USER } from '../../types/constants/error-messages.constants';
import { System } from '../../types/constants/system.constants';
import { IBaseUrl, IRemarksTag, IRequestTag } from '../../types/constants/url-tags.constants';
import { ActionType, Requests, RequestStage, RequestStatus } from '../../types/enums/request.enums';
import { Role } from '../../types/enums/role.enums';
import { UserPayload } from '../../types/interfaces/jwt.interface';
import { TransformedProfile } from '../../types/interfaces/profile.interface';
import {
  PaginatedRequestListResponse,
  RequestListResponse,
  TransformedRequest,
  TransformedTeamLeadData,
} from '../../types/interfaces/request.interface';
import { TransformedRemark, TransformedUser } from '../../types/interfaces/transform.interface';
import { UserService } from '../user/user.service';
import { AddRemarksDto, CreateRequestDto, ProcessActionDto } from './dto/request-dto';
import { RequestRepository } from './request.repository';
import { Request, RequestDocument } from './schemas/request.schema';

@Injectable()
export class RequestService implements OnModuleInit {
  private userService: UserService;
  private readonly logger = new Logger(RequestService.name);
  constructor(
    private moduleRef: ModuleRef,
    @InjectModel(Request.name) private RequestModel: Model<RequestDocument>,
    private readonly requestRepository: RequestRepository,
  ) {}
  async onModuleInit(): Promise<void> {
    this.userService = await this.moduleRef.resolve(UserService, undefined, { strict: false });
  }
  async getOneRequest(
    requestId: string,
    authUserProfile: UserPayload,
  ): Promise<TransformedRequest> {
    const result = await this.findOnePopulation(requestId, authUserProfile);
    if (!result) {
      throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return {
      request: RequestResponse(result),
    } as unknown as TransformedRequest;
  }
  private processRequests({
    requests,
    authUserProfile,
  }: {
    requests: any[];
    authUserProfile: UserPayload;
  }): {
    transformedRequests: TransformedRequest[];
    transformedMyRequests: TransformedRequest[];
  } {
    const safeRequests = Array.isArray(requests) ? requests : [];
    if (!authUserProfile || safeRequests.length === 0) {
      return { transformedRequests: [], transformedMyRequests: [] };
    }
    const userDisplayRole = RoleDisplay.getDisplayRole(authUserProfile);
    const userOriginalRole = RoleDisplay.normalizeRole(authUserProfile);
    const effectiveRole: Role = RoleDisplay.isReportingLineUser(authUserProfile)
      ? Role.REPORTING_LINE
      : ((userOriginalRole || userDisplayRole || authUserProfile.role)?.toUpperCase() as Role);
    const userId = authUserProfile._id;
    const myRequests = safeRequests.filter(request => RequestHelper.getUserId(request) === userId);
    const filteredRequests = RequestHelper.safelyGetTeamRequests(
      safeRequests,
      effectiveRole,
      userId,
    );
    const sortedRequests = CommonHelpers.sortByUpdateTime(filteredRequests);
    const sortedMyRequests = CommonHelpers.sortByUpdateTime(myRequests);
    return {
      transformedRequests: sortedRequests
        .map(request => RequestResponse(request))
        .filter((r): r is TransformedRequest => r !== null),
      transformedMyRequests: sortedMyRequests
        .map(request => RequestResponse(request))
        .filter((r): r is TransformedRequest => r !== null),
    };
  }
  async getAllRequests(
    authUserProfile: UserPayload,
    filter: Record<string, any> = {},
    paginationDto?: PaginationDto,
  ): Promise<RequestListResponse | PaginatedRequestListResponse> {
    try {
      const baseResponse = { requests: [], myRequests: [] };
      const usePagination = paginationDto && (paginationDto.page || paginationDto.limit);
      const effectiveRole = RoleDisplay.isReportingLineUser(authUserProfile)
        ? Role.REPORTING_LINE
        : ((
            RoleDisplay.normalizeRole(authUserProfile) ||
            RoleDisplay.getDisplayRole(authUserProfile) ||
            authUserProfile.role
          )?.toUpperCase() as Role);
      if (usePagination) {
        const { page, limit, skip } = PaginationHelper.normalizePagination(
          paginationDto.page,
          paginationDto.limit,
        );
        const myFilter: Record<string, any> = {
          createdBy: new Types.ObjectId(authUserProfile._id),
        };
        if (filter.status) myFilter.status = filter.status;
        const myRequests = await this.findAllPopulation(myFilter);
        const allRequests = await this.findAllPopulation(filter);
        const teamRequestsFull = RequestHelper.safelyGetTeamRequests(
          allRequests,
          effectiveRole,
          authUserProfile._id.toString(),
        );
        const teamRequestsPaginated = teamRequestsFull.slice(skip, skip + limit);
        const transformedMyRequests = CommonHelpers.sortByUpdateTime(myRequests)
          .map(r => RequestResponse(r))
          .filter((r): r is TransformedRequest => r !== null);
        const transformedRequests = CommonHelpers.sortByUpdateTime(teamRequestsPaginated)
          .map(r => RequestResponse(r))
          .filter((r): r is TransformedRequest => r !== null);
        return {
          ...baseResponse,
          requests: transformedRequests,
          myRequests: transformedMyRequests,
          total: teamRequestsFull.length,
          page,
          limit,
          totalPages: Math.ceil(teamRequestsFull.length / limit),
        } as PaginatedRequestListResponse;
      }
      const requests = await this.findAllPopulation(filter);
      const { transformedRequests, transformedMyRequests } = this.processRequests({
        requests,
        authUserProfile,
      });
      return {
        ...baseResponse,
        requests: transformedRequests,
        myRequests: transformedMyRequests,
      } as RequestListResponse;
    } catch (error) {
      throw new InternalServerErrorException(error.message, REQUEST.FETCH_FAILED);
    }
  }
  async createRequest(
    createRequestDto: CreateRequestDto,
    userId: Types.ObjectId,
    authUserProfile?: UserPayload,
  ): Promise<TransformedRequest> {
    if (!authUserProfile) {
      throw new HttpException(USER.NOT_FOUND, HttpStatus.OK);
    }
    const { requestedDates, requestType, reason } = createRequestDto;

    const dateValidation = RequestValidationHelper.validateRequestDates(
      requestedDates,
      requestType,
    );
    if (!dateValidation.isValid) {
      throw new BadRequestException(dateValidation.error);
    }

    const reasonValidation = RequestValidationHelper.validateReason(reason);
    if (!reasonValidation.valid) {
      throw new BadRequestException(reasonValidation.error);
    }

    if (!requestType) {
      throw new BadRequestException('requestType field cannot be empty');
    }

    const dateObjects = requestedDates
      .map(date => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());
    const days = dateObjects.length;
    const userObjectId = userId;
    const userDetails = await this.userService.getUserById(userId);
    this.logger.log(userDetails);
    if (!userDetails) {
      throw new HttpException(USER.NOT_FOUND, HttpStatus.OK);
    }
    const userRole = userDetails.role?.toUpperCase().replace(/\s+/g, '_');
    let currentStage: RequestStage = RequestStage.COO;
    let teamLeadData: TransformedTeamLeadData | null = null;
    const executives = await this.userService.fetchExecutives();
    switch (userRole) {
      case Role.MEMBER.toUpperCase():
        const memberDept = userDetails.department as any;
        if (memberDept?.teamLeadDetail?.email && memberDept?.teamLeadDetail?.userId) {
          currentStage = RequestStage.TEAM_LEAD;
          teamLeadData = {
            fullName:
              memberDept.teamLeadDetail.fullName ||
              `${memberDept.teamLeadDetail.firstName || ''} ${memberDept.teamLeadDetail.lastName || ''}`.trim(),
            email: memberDept.teamLeadDetail.email,
            userId: memberDept.teamLeadDetail.userId,
            role: Role.TEAM_LEAD,
          };
          break;
        }
        this.logger.log(
          `No Team Lead found for department ${memberDept?.name}, falling back to COO for user ${userId}`,
        );
      case Role.TEAM_LEAD.toUpperCase():
      case Role.REPORTING_LINE.toUpperCase():
        currentStage = RequestStage.COO;
        let targetExecutive = executives.COO;
        let targetRole = Role.COO;
        if (!targetExecutive?.userId) {
          targetExecutive = executives.SUPER_ADMIN;
          targetRole = Role.SUPER_ADMIN;
        }
        if (!targetExecutive?.email || !targetExecutive?.userId) {
          if (userRole === Role.MEMBER.toUpperCase()) {
            throw new HttpException(
              'Team Lead not assigned and COO/Super Admin details not found. Please contact HR.',
              HttpStatus.OK,
            );
          }
          throw new HttpException(
            'COO and Super Admin details not found. Please contact System Administrator.',
            HttpStatus.OK,
          );
        }
        teamLeadData = {
          fullName:
            targetExecutive.fullName || (targetRole === Role.COO ? System.COO : System.SUPER_ADMIN),
          email: targetExecutive.email,
          userId: targetExecutive.userId,
          role: targetRole,
        };
        break;
      case Role.COO.toUpperCase():
        currentStage = RequestStage.SUPER_ADMIN;
        if (!executives.SUPER_ADMIN?.userId) {
          throw new HttpException(
            'Super Admin details not found. Please contact System Administrator.',
            HttpStatus.OK,
          );
        }
        teamLeadData = {
          fullName: executives.SUPER_ADMIN?.fullName || System.SUPER_ADMIN,
          email: executives.SUPER_ADMIN?.email || System.SUPER_ADMIN_EMAIL,
          userId: executives.SUPER_ADMIN?.userId,
          role: Role.SUPER_ADMIN,
        };
        break;
      default:
        currentStage = RequestStage.COO;
        let defaultTargetExecutive = executives.COO;
        let defaultTargetRole = Role.COO;
        if (!defaultTargetExecutive?.userId) {
          defaultTargetExecutive = executives.SUPER_ADMIN;
          defaultTargetRole = Role.SUPER_ADMIN;
        }
        if (!defaultTargetExecutive?.email || !defaultTargetExecutive?.userId) {
          throw new HttpException(
            'COO and Super Admin details not found. Please contact System Administrator.',
            HttpStatus.OK,
          );
        }
        teamLeadData = {
          fullName:
            defaultTargetExecutive.fullName ||
            (defaultTargetRole === Role.COO ? System.COO : System.SUPER_ADMIN),
          email: defaultTargetExecutive.email,
          userId: defaultTargetExecutive.userId,
          role: defaultTargetRole,
        };
    }
    const trimmedReason = reason?.trim() ?? '';
    const requestData = {
      teamLeadData: teamLeadData,
      teamLeadName: teamLeadData.fullName,
      user: userId,
      requestType,
      requestedDates: dateObjects.map(date => date.toISOString()),
      days,
      reason: trimmedReason,
      status: RequestStatus.PENDING,
      currentStage: currentStage,
      escalationNotified: false,
      createdBy: userObjectId,
      updatedBy: userObjectId,
      department: (userDetails.department as any)?._id
        ? new Types.ObjectId((userDetails.department as any)._id)
        : null,
    };
    const result = await this.requestRepository.create(requestData);
    const populatedRequest = await this.getOneRequest(result._id.toString(), authUserProfile);
    const templateVariables = await prepareTemplate(result, userDetails, executives);
    await EmailService.sendRequest(templateVariables, userDetails.role);
    return populatedRequest;
  }

  async addRemarks(
    id: string,
    remarksDto: AddRemarksDto,
    authUser: UserPayload,
  ): Promise<TransformedRequest> {
    RequestValidationHelper.validateRequestId(id);

    const remarkValidation = RequestValidationHelper.validateRemark(remarksDto.remark);
    if (!remarkValidation.valid) {
      throw new BadRequestException(remarkValidation.error);
    }

    if (!authUser?._id) {
      throw new HttpException(USER.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
    }

    const requestResponse = await this.getOneRequest(id, authUser);
    if (!requestResponse) {
      throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
    }

    try {
      const commenterUserId = authUser._id.toString();
      const userProfileMap = await this.populateUserInfo([{ _id: authUser._id }]);
      const commenterProfile = userProfileMap.get(commenterUserId);

      if (!commenterProfile) {
        this.logger.warn(`Profile not found for user ${commenterUserId}. Using fallback data.`);
      }

      const enrichedAuthUser = {
        ...authUser,
        profile: commenterProfile || {
          fullName: authUser.fullName || authUser.email || 'Unknown User',
          firstName: authUser.fullName?.split(' ')[0] || '',
          lastName: authUser.fullName?.split(' ').slice(1).join(' ') || '',
        },
      };

      const remarkData = {
        by: new Types.ObjectId(authUser._id),
        role: authUser.role,
        remark: remarksDto.remark.trim(),
        date: new Date(),
      };

      await this.remarks(id, remarkData);

      const requestResult = await this.getOneRequest(id, authUser);
      if (!requestResult) {
        this.logger.error(
          `Failed to retrieve request ${id} after adding remark. Request may have been deleted or there's a data consistency issue.`,
        );
        throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
      }

      const updatedRequest = (requestResult as any).request || requestResult;
      if (!updatedRequest || !updatedRequest._id) {
        this.logger.error(
          `Invalid request structure returned from getOneRequest for ${id}:`,
          requestResult,
        );
        throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
      }

      this.logger.log(`Successfully retrieved request ${id} after remark addition. Request data:`, {
        _id: updatedRequest._id,
        status: updatedRequest.status,
        requestedDates: updatedRequest.requestedDates,
        user: updatedRequest.user?._id,
      });

      const transformedRemarkData: TransformedRemark = {
        by: {
          _id: authUser._id,
          email: authUser.email,
          fullName:
            enrichedAuthUser.profile?.fullName ||
            authUser.fullName ||
            authUser.email ||
            'Unknown User',
        },
        role: authUser.role,
        remark: remarksDto.remark.trim(),
        date: new Date(),
        _id: '',
      };

      try {
        await this.remarksRecipients(updatedRequest, enrichedAuthUser, transformedRemarkData);
      } catch (emailError) {
        this.logger.error(
          `Failed to send remark notifications for request ${id}: ${emailError?.message || emailError}`,
        );
      }

      return updatedRequest;
    } catch (error) {
      this.logger.error(`Error in addRemarks for request ${id}:`, error);
      throw error;
    }
  }

  async remarks(
    id: string,
    remarksData: { by: Types.ObjectId; role: string; remark: string; date: Date },
  ): Promise<void> {
    RequestValidationHelper.validateRequestId(id);

    const remarkValidation = RequestValidationHelper.validateRemark(remarksData.remark);
    if (!remarkValidation.valid) {
      throw new BadRequestException(remarkValidation.error);
    }

    RequestValidationHelper.validateUserId(remarksData.by);

    const objectId = new Types.ObjectId(id);

    try {
      const result = await this.RequestModel.findByIdAndUpdate(
        objectId,
        {
          $push: {
            remarks: {
              by: remarksData.by,
              role: remarksData.role,
              remark: remarksData.remark.trim(),
              date: remarksData.date,
            },
          },
          $set: {
            updatedAt: new Date(),
            currentStage: RequestStage.HR,
            status: RequestStatus.IN_PROCESS,
          },
        },
        { new: true },
      ).exec();

      if (!result) {
        throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Failed to add remark to request ${id}:`, error);
      throw new HttpException(
        'Failed to add remark. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processRequest(
    requestId: string,
    actionDto: ProcessActionDto,
    authUser: UserPayload,
  ): Promise<TransformedRequest> {
    RequestValidationHelper.validateRequestId(requestId);
    if (!authUser?._id) {
      throw new HttpException(USER.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
    }

    const request = await this.findOnePopulation(requestId, authUser);
    if (!request) {
      throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
    }

    if (RequestHelper.isRequestCompleted(request)) {
      throw new HttpException('Cannot process a completed request', HttpStatus.BAD_REQUEST);
    }

    const processTransition = RequestValidationHelper.canTransitionStatus(
      request.status as RequestStatus,
      actionDto.action === ActionType.APPROVED ? RequestStatus.APPROVED : RequestStatus.DISAPPROVED,
    );
    if (!processTransition.allowed) {
      throw new HttpException(processTransition.reason, HttpStatus.BAD_REQUEST);
    }

    const allowedRoles = RequestHelper.allowedRoles(request.currentStage);
    const userRole = RoleDisplay.normalizeRole(authUser) as Role;
    if (!allowedRoles.includes(userRole)) {
      throw new HttpException(
        `Only ${allowedRoles.join(', ')} can approve at ${request.currentStage} stage`,
        HttpStatus.FORBIDDEN,
      );
    }

    const requestOwnerId = RequestHelper.getUserId(request);
    if (requestOwnerId === authUser._id.toString()) {
      throw new HttpException('Cannot approve your own request', HttpStatus.FORBIDDEN);
    }

    if (actionDto.action === ActionType.APPROVED) {
      return this.handleApproval(request, authUser, actionDto.remarks);
    } else {
      return this.handleDisapproval(request, authUser, actionDto.remarks);
    }
  }

  async handleApproval(
    request: TransformedRequest,
    user: UserPayload,
    remark?: string,
  ): Promise<TransformedRequest> {
    if (!request?._id) {
      throw new BadRequestException('Invalid request data');
    }

    if (!user?._id) {
      throw new HttpException(USER.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
    }

    if (remark) {
      const remarkValidation = RequestValidationHelper.validateRemark(remark);
      if (!remarkValidation.valid) {
        throw new BadRequestException(remarkValidation.error);
      }
    }

    const updateData: UpdateQuery<RequestDocument> = {
      $set: {
        updatedBy: new Types.ObjectId(user._id),
        updatedAt: new Date(),
      },
      $push: {
        remarks: {
          by: new Types.ObjectId(user._id),
          role: user.role,
          remark: remark || `Request approved by ${user.role}`,
          date: new Date(),
        },
      },
    };

    if (request.currentStage === RequestStage.HR) {
      updateData.$set.status = RequestStatus.APPROVED;
      updateData.$set.currentStage = RequestStage.COMPLETED;
      updateData.$set.approvedBy = new Types.ObjectId(user._id);
      updateData.$set.approvedAt = new Date();
      updateData.$push.remarks.remark =
        `Final approval by ${user.role}` + (remark ? `: ${remark}` : '');
    }

    let updatedRequest;
    try {
      updatedRequest = await this.requestRepository.updateWithOperator(
        new Types.ObjectId(request._id),
        updateData,
      );
    } catch (error) {
      this.logger.error(`Failed to approve request ${request._id}:`, error);
      throw new HttpException(
        'Failed to approve request. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!updatedRequest) {
      throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
    }

    const result = await this.findOnePopulation(updatedRequest._id.toString(), user);

    if (RequestHelper.isRequestCompleted(result)) {
      try {
        const executives = await this.userService.fetchExecutives();
        const templateVariables = await prepareProcessTemplate(
          result,
          result.user,
          executives,
          user,
        );
        await EmailService.sendApproval(templateVariables, result.user.role, user.role);
      } catch (emailError) {
        this.logger.error(
          `Failed to send approval notification for request ${request._id}:`,
          emailError?.message || emailError,
        );
      }
    }

    const transformed = responseTransform({ data: result, authUserProfile: user });
    return {
      request: transformed?.request ?? RequestResponse(result),
    } as unknown as TransformedRequest;
  }

  async handleDisapproval(
    request: TransformedRequest,
    user: UserPayload,
    remark?: string,
  ): Promise<TransformedRequest> {
    if (!request?._id) {
      throw new BadRequestException('Invalid request data');
    }

    if (!user?._id) {
      throw new HttpException(USER.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
    }

    if (remark) {
      const remarkValidation = RequestValidationHelper.validateRemark(remark);
      if (!remarkValidation.valid) {
        throw new BadRequestException(remarkValidation.error);
      }
    }

    const updateData: UpdateQuery<RequestDocument> = {
      $set: {
        updatedBy: new Types.ObjectId(user._id),
        updatedAt: new Date(),
      },
      $push: {
        remarks: {
          by: new Types.ObjectId(user._id),
          role: user.role,
          remark: remark || `Request disapproved by ${user.role}`,
          date: new Date(),
        },
      },
    };

    if (request.currentStage === RequestStage.HR) {
      updateData.$set.status = RequestStatus.DISAPPROVED;
      updateData.$set.currentStage = RequestStage.COMPLETED;
      updateData.$set.disapprovedBy = new Types.ObjectId(user._id);
      updateData.$set.disapprovedAt = new Date();
      updateData.$push.remarks.remark =
        `Final disapproval by ${user.role}` + (remark ? `: ${remark}` : '');
    }
    let updatedRequest;
    try {
      updatedRequest = await this.requestRepository.updateWithOperator(
        new Types.ObjectId(request._id),
        updateData,
      );
    } catch (error) {
      this.logger.error(`Failed to disapprove request ${request._id}:`, error);
      throw new HttpException(
        'Failed to disapprove request. Please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!updatedRequest) {
      throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
    }
    const result = await this.findOnePopulation(updatedRequest._id.toString(), user);

    if (RequestHelper.isRequestCompleted(result)) {
      try {
        const emailExecutives = await this.userService.fetchExecutives();
        const templateVariables = await prepareProcessTemplate(
          result,
          result.user,
          emailExecutives,
          user,
        );
        await EmailService.sendDisapproval(templateVariables, result.user.role, user.role);
      } catch (emailError) {
        this.logger.error(
          `Failed to send disapproval notification for request ${request._id}:`,
          emailError?.message || emailError,
        );
      }
    }

    const transformed = responseTransform({ data: result, authUserProfile: user });
    return {
      request: transformed?.request ?? RequestResponse(result),
    } as unknown as TransformedRequest;
  }

  async findAllPopulationPaginated(
    filter: Record<string, any> = {},
    skip: number,
    limit: number,
  ): Promise<TransformedRequest[]> {
    try {
      const requests = await this.RequestModel.find(filter)
        .select(
          '_id user requestType requestedDates days reason status teamLeadData currentStage approvedBy approvedAt rejectedBy rejectedAt remarks createdBy updatedBy department createdAt updatedAt',
        )
        .populate(
          'user',
          'email username role permissions status cell fullName designation department',
        )
        .populate('approvedBy', 'email designation firstName lastName fullName')
        .populate('rejectedBy', 'email designation firstName lastName fullName')
        .populate('createdBy', 'email designation firstName lastName fullName')
        .populate('updatedBy', 'email designation firstName lastName fullName')
        .populate({
          path: 'department',
          select: 'name description teamLead teamLeadDetail',
          populate: {
            path: 'teamLeadDetail',
            select: 'email username role designation firstName lastName userId fullName',
          },
        })
        .populate({
          path: 'remarks.by',
          select: 'email username firstName lastName role fullName',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
      if (!requests || !Array.isArray(requests) || requests.length === 0) {
        return [];
      }
      const userIds = RequestHelper.extractUserIdsFromRequests(requests);
      const userProfileMap = await this.populateUserInfo(
        Array.from(userIds).map(id => ({ _id: id })),
      );
      const requestsWithProfiles = requests.map(request =>
        RequestHelper.requestWithProfiles(request, userProfileMap),
      );
      const requestsWithRoleDisplay = requestsWithProfiles.map(request =>
        RequestHelper.applyRoleToRequest(request),
      );
      return requestsWithRoleDisplay;
    } catch (error) {
      this.logger.error('Error in findAllPopulationPaginated:', {
        filter,
        error: error?.message || error,
        stack: error?.stack,
      });
      return [];
    }
  }
  async findAllPopulation(filter: Record<string, any> = {}): Promise<TransformedRequest[]> {
    try {
      const requests = await this.RequestModel.find(filter)
        .select(
          '_id user requestType requestedDates days reason status teamLeadData currentStage approvedBy approvedAt rejectedBy rejectedAt remarks createdBy updatedBy department createdAt updatedAt',
        )
        .populate(
          'user',
          'email username role permissions status cell fullName designation department',
        )
        .populate('approvedBy', 'email designation firstName lastName fullName')
        .populate('rejectedBy', 'email designation firstName lastName fullName')
        .populate('createdBy', 'email designation firstName lastName fullName')
        .populate('updatedBy', 'email designation firstName lastName fullName')
        .populate({
          path: 'department',
          select: 'name description teamLead teamLeadDetail',
          populate: {
            path: 'teamLeadDetail',
            select: 'email username role designation firstName lastName userId fullName',
          },
        })
        .populate({
          path: 'remarks.by',
          select: 'email username firstName lastName role fullName',
        })
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      if (!requests || !Array.isArray(requests) || requests.length === 0) {
        return [];
      }
      const userIds = RequestHelper.extractUserIdsFromRequests(requests);
      this.logger.log(userIds);
      const userProfileMap = await this.populateUserInfo(
        Array.from(userIds).map(id => ({ _id: id })),
      );
      const requestsWithProfiles = requests.map(request =>
        RequestHelper.requestWithProfiles(request, userProfileMap),
      );
      const requestsWithRoleDisplay = requestsWithProfiles.map(request =>
        RequestHelper.applyRoleToRequest(request),
      );
      return requestsWithRoleDisplay;
    } catch (error) {
      this.logger.error('Error in findAllPopulation:', {
        filter,
        error: error?.message || error,
        stack: error?.stack,
      });
      return [];
    }
  }
  async findOnePopulation(
    id: string,
    authUser: UserPayload | TransformedUser,
  ): Promise<TransformedRequest | null> {
    const objectId = new Types.ObjectId(id);
    const request = await this.RequestModel.findOne({ _id: objectId })
      .select(
        '_id user requestType requestedDates days reason status currentStage teamLeadData approvedBy approvedAt rejectedBy rejectedAt remarks createdBy updatedBy department createdAt updatedAt',
      )
      .populate('user', 'email username role permissions status cell fullName designation')
      .populate('approvedBy', 'email designation firstName lastName fullName')
      .populate('rejectedBy', 'email designation firstName lastName fullName')
      .populate('createdBy', 'email designation firstName lastName fullName')
      .populate('updatedBy', 'email designation firstName lastName fullName')
      .populate({
        path: 'department',
        select: 'name description teamLead teamLeadDetail',
        populate: {
          path: 'teamLeadDetail',
          select: 'email username role designation firstName lastName userId fullName',
        },
      })
      .populate({
        path: 'remarks.by',
        select: 'email username firstName lastName role fullName',
      })
      .exec();
    if (!request) {
      return null;
    }
    const requestPlain = (request as any).toObject ? (request as any).toObject() : request;
    const populatedRequest = requestPlain as TransformedRequest;
    if (populatedRequest.user && populatedRequest.user._id) {
      const userId = populatedRequest.user._id.toString();
      const userProfileMap = await this.populateUserInfo([{ _id: userId }]);
      if (userProfileMap.has(userId)) {
        populatedRequest.user.profile = userProfileMap.get(userId);
      } else {
        populatedRequest.user.profile = RequestHelper.fallbackProfile(populatedRequest.user);
      }
    }
    const requestWithRoleDisplay = RequestHelper.applyRoleToRequest(populatedRequest);
    return requestWithRoleDisplay;
  }

  async remarksRecipients(
    updatedRequest: TransformedRequest,
    enrichedAuthUser: any,
    remarkData: TransformedRemark,
  ): Promise<void> {
    if (!updatedRequest) {
      this.logger.error('remarksRecipients called with undefined updatedRequest');
      return;
    }

    if (!updatedRequest._id) {
      this.logger.error('remarksRecipients called with updatedRequest that has no _id');
      return;
    }

    if (!enrichedAuthUser) {
      this.logger.error('remarksRecipients called with undefined enrichedAuthUser');
      return;
    }

    const commenterName =
      enrichedAuthUser.profile?.fullName ||
      enrichedAuthUser.fullName ||
      enrichedAuthUser.email ||
      'User';

    if (!enrichedAuthUser.profile) {
      this.logger.warn(
        `remarksRecipients called without profile for user ${enrichedAuthUser._id}. ` +
          `Using fallback name: ${commenterName}`,
      );
    }

    const applicantName =
      updatedRequest.user?.profile?.fullName ||
      updatedRequest.user?.fullName ||
      updatedRequest.user?.email ||
      'Applicant';

    const applicantFirstName =
      updatedRequest.user?.profile?.firstName ||
      updatedRequest.user?.fullName?.split(' ')[0] ||
      'User';

    if (!enrichedAuthUser.profile) {
      this.logger.warn(
        `remarksRecipients called without profile for user ${enrichedAuthUser._id}. ` +
          `Using fallback name: ${commenterName}`,
      );
    }

    const isApplicantReportingLine = RoleDisplay.isReportingLineUser(updatedRequest.user);
    const applicantRole = isApplicantReportingLine
      ? 'Reporting Line'
      : updatedRequest.user?.displayRole || updatedRequest.user?.role;
    const departmentName = updatedRequest.department?.name;
    const teamLeadName =
      `${updatedRequest.department?.teamLeadDetail?.firstName || ''} ${updatedRequest.department?.teamLeadDetail?.lastName || ''}`.trim() ||
      updatedRequest.department?.teamLeadDetail?.fullName ||
      'Not Assigned';
    const teamLeadEmail = updatedRequest.department?.teamLeadDetail?.email;
    const isTeamLeadReportingLine = RoleDisplay.isReportingLineUser(
      updatedRequest.department?.teamLeadDetail,
    );
    const teamLeadRole = isTeamLeadReportingLine
      ? 'Reporting Line'
      : updatedRequest.department?.teamLeadDetail?.displayRole ||
        updatedRequest.department?.teamLeadDetail?.role;
    const emailExecutives = await this.userService.fetchExecutives();

    if (!updatedRequest.requestedDates || !Array.isArray(updatedRequest.requestedDates)) {
      this.logger.warn(
        `Request ${updatedRequest._id} has invalid requestedDates:`,
        updatedRequest.requestedDates,
      );
      return;
    }

    const dates = DateHelper.Dates(updatedRequest.requestedDates);
    const dateObjects = (updatedRequest.requestedDates as (string | number | Date)[])
      .map((date: string | number | Date) => new Date(date))
      .sort((a, b) => a.getTime() - b.getTime());
    const days = dateObjects.length;
    const isCommenterReportingLine = RoleDisplay.isReportingLineUser(enrichedAuthUser);
    const finalCommenterRole = isCommenterReportingLine
      ? 'Reporting Line'
      : enrichedAuthUser?.displayRole || enrichedAuthUser?.role;
    const replacements = {
      applicantFullName: applicantName,
      applicantFirstName: applicantFirstName,
      applicantEmail: updatedRequest.user?.email,
      applicantRole: transformRole(applicantRole),
      applicantDepartment: departmentName,
      teamLeadFullName: teamLeadName,
      teamLeadEmail: teamLeadEmail,
      teamLeadRole: transformRole(teamLeadRole),
      commenterName: commenterName,
      commenterRole: transformRole(finalCommenterRole),
      requestType: Requests(updatedRequest.requestType),
      requestedDates: dates.emailFormat,
      totalDays: days,
      requestReason: updatedRequest.reason,
      requestId: updatedRequest._id.toString(),
      commenterRemarks: remarkData.remark,
      hrFullName: emailExecutives.HR?.fullName,
      hrEmail: emailExecutives.HR?.email,
      cooFullName: emailExecutives.COO?.fullName,
      cooEmail: emailExecutives.COO?.email,
      superAdminFullName: emailExecutives.SUPER_ADMIN?.fullName,
      superAdminEmail: emailExecutives.SUPER_ADMIN?.email,
      adminFullName: emailExecutives.ADMIN?.fullName,
      adminEmail: emailExecutives.ADMIN?.email,
      remarksUrl: IBaseUrl + IRequestTag + `${updatedRequest._id}` + IRemarksTag,
      actionUrl: IBaseUrl + IRequestTag + `${updatedRequest._id}`,
      currentYear: new Date().getFullYear(),
      currentDate: new Date().toLocaleDateString(),
      commentDate: new Date().toLocaleDateString(),
      isReportingLine: isCommenterReportingLine,
    };
    await EmailProcessService.sendRemarksEmails(replacements);
  }
  async populateUserInfo(
    users: { _id?: string | Types.ObjectId }[],
  ): Promise<Map<string, TransformedProfile>> {
    if (!users || users.length === 0) {
      return new Map();
    }
    const userIds = users
      .filter(user => user?._id)
      .map(user => user._id.toString())
      .filter((id, index, self) => self.indexOf(id) === index);
    if (userIds.length === 0) {
      return new Map();
    }
    try {
      const usersWithProfiles = await this.userService.getRole(userIds);
      this.logger.log(usersWithProfiles);
      return new Map(
        usersWithProfiles.map(user => [
          user._id.toString(),
          user.profile || RequestHelper.fallbackProfile(user),
        ]),
      );
    } catch {
      return new Map();
    }
  }
  async deleteRequestsByUser(userId: Types.ObjectId, session?: ClientSession): Promise<void> {
    await this.requestRepository.deleteByUserId(userId, session);
  }

  /**
   * Withdraw a pending request by the request owner
   * Business rules:
   * - Only creator can withdraw
   * - Only PENDING requests can be withdrawn
   * - Status changes to WITHDRAWN
   * - Notification sent to requester and Team Lead
   * - Audit trail is maintained via remarks and updatedBy
   */
  async withdrawRequest(id: string, authUser: UserPayload): Promise<TransformedRequest> {
    const request = await this.findOnePopulation(id, authUser);
    if (!request) {
      throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
    }
    const requestOwnerId = RequestHelper.getUserId(request);
    if (!requestOwnerId || requestOwnerId !== authUser._id) {
      throw new HttpException(REQUEST.UNAUTHORIZED_ACTION, HttpStatus.OK);
    }

    const withdrawalCheck = RequestValidationHelper.canWithdraw(request.status as RequestStatus);
    if (!withdrawalCheck.allowed) {
      throw new HttpException(withdrawalCheck.reason, HttpStatus.BAD_REQUEST);
    }
    const updater = new Types.ObjectId(authUser._id);
    const updateData: UpdateQuery<RequestDocument> = {
      $set: {
        updatedBy: updater,
        updatedAt: new Date(),
        status: RequestStatus.WITHDRAWN,
      },
      $push: {
        remarks: {
          by: updater,
          role: authUser.role,
          remark: `Request withdrawn by ${authUser.fullName || authUser.email || authUser.role}`,
          date: new Date(),
        },
      },
    };

    const updatedRequest = await this.requestRepository.updateWithOperator(
      new Types.ObjectId(request._id),
      updateData,
    );
    if (!updatedRequest) {
      throw new HttpException(REQUEST.NOT_FOUND, HttpStatus.OK);
    }
    const result = await this.findOnePopulation(updatedRequest._id.toString(), authUser);
    try {
      const executives = await this.userService.fetchExecutives();
      const templateVariables = await prepareProcessTemplate(
        result,
        result.user,
        executives,
        authUser,
      );
      templateVariables.withdrawnBy = authUser.fullName || authUser.email || authUser.role;
      templateVariables.withdrawnByRole = authUser.role;
      await EmailService.sendWithdrawal(templateVariables, result.user.role, authUser.role);
    } catch (error) {
      this.logger.error('Failed to send withdrawal notifications', error?.message || error);
    }
    const transformed = responseTransform({ data: result, authUserProfile: authUser });
    return {
      request: transformed?.request ?? RequestResponse(result),
    } as unknown as TransformedRequest;
  }
}
