import { ModuleRef } from '@nestjs/core';
import { Types } from 'mongoose';
import path from 'path';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';

import { EmailRecruitmentService } from '../../services/email/recruitment/email-recruitment-templates.service';
import { CodeHelper } from '../../shared/helpers/code.helper';
import { CommonHelpers } from '../../shared/helpers/common.helpers';
import { DateHelper } from '../../shared/helpers/format-Dates.helper';
import { RecruitmentHelpers } from '../../shared/helpers/recruitment.helpers';
import { ensureGcsInitialized, generateSignedUrl } from '../../shared/utils/gcs.utils';
import { CamelCase, candidateResponse } from '../../shared/utils/unified-transform.utils';
import { uploadingValidator } from '../../shared/validators/file.validation';
import {
  DOCUMENTS,
  EMAIL_ERROR,
  FILE,
  RECRUITER,
  SYSTEM_ERROR,
  USER,
} from '../../types/constants/error-messages.constants';
import { ONE_DAY_IN_MS } from '../../types/constants/recruitment.constants';
import { IBaseUrl, IClarificationForm, IRecruiter } from '../../types/constants/url-tags.constants';
import { DocumentCategory } from '../../types/enums/doc.enums';
import {
  CandidateDocumentCategory,
  HiringStage,
  TokenType,
} from '../../types/enums/recruitment.enums';
import { ICandidateDocument } from '../../types/interfaces/recruitment.interface';
import { UserOperationResult } from '../../types/interfaces/user.interface';
import { DepartmentService } from '../department/department.service';
import { ProfileService } from '../profile/profile.service';
import { CreateUserProfileDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { RecruitmentRepository } from './recruitment.repository';
import { Candidates } from './schemas/candidate.schema';
import {
  AddCandidateDto,
  CandidateFilterDto,
  ClarificationFormDto,
  PersonalInfoWithDocumentsDto,
  RequestFormDto,
} from '@/modules/recruitment/dto/recruitment.dto';
@Injectable()
export class RecruitmentService implements OnModuleInit {
  private userService: UserService;
  private departmentService: DepartmentService;
  private profileService: ProfileService;
  private readonly logger = new Logger(RecruitmentService.name);
  private readonly DOCUMENT_CATEGORY_LIMITS: Record<string, number> = {
    cnic: 2,
    photograph: 1,
    resume: 1,
    educationalDocs: 5,
    experienceLetter: 2,
    salarySlip: 3,
  };
  private readonly CATEGORY_TO_ENUM_MAP: Record<string, CandidateDocumentCategory[]> = {
    cnic: [CandidateDocumentCategory.CNIC_FRONT, CandidateDocumentCategory.CNIC_BACK],
    photograph: [CandidateDocumentCategory.PASSPORT_PHOTO],
    resume: [CandidateDocumentCategory.CV_RESUME],
    educationalDocs: [
      CandidateDocumentCategory.EDUCATIONAL_CERTIFICATE,
      CandidateDocumentCategory.EDUCATIONAL_TRANSCRIPT,
    ],
    experienceLetter: [CandidateDocumentCategory.EXPERIENCE_LETTER],
    salarySlip: [CandidateDocumentCategory.SALARY_SLIP],
  };
  constructor(
    private readonly recruitmentRepository: RecruitmentRepository,
    private readonly moduleRef: ModuleRef,
  ) {}
  async onModuleInit(): Promise<void> {
    try {
      this.userService = await this.moduleRef.resolve(UserService, undefined, { strict: false });
      this.departmentService = await this.moduleRef.resolve(DepartmentService, undefined, {
        strict: false,
      });
      this.profileService = await this.moduleRef.resolve(ProfileService, undefined, {
        strict: false,
      });
    } catch (error) {
      this.logger.error('Error initializing recruitment service dependencies', error.stack);
      throw error;
    }
  }
  async addCandidate(dto: AddCandidateDto, recruiterId: Types.ObjectId): Promise<Candidates> {
    try {
      await this.recruitmentRepository.validateUniqueEmail(dto.email);
      const candidate = await this.recruitmentRepository.create({
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        jobTitle: dto.jobTitle,
        timingStart: dto.timingStart,
        timingEnd: dto.timingEnd,
        hiringStage: HiringStage.ADDED,
        department: new Types.ObjectId(dto.department),
        createdBy: recruiterId,
      });
      const enrichedCandidate = await this.enrichResponse(candidate);
      return candidateResponse(enrichedCandidate);
    } catch (error) {
      this.logger.error(`Error adding candidate ${dto.email}`, error.stack);
      throw error;
    }
  }
  async findAll(): Promise<{ data: any[] }> {
    try {
      const result = await this.recruitmentRepository.findAll();
      if (!result || result.length === 0) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      const sortedCandidates = CommonHelpers.sortByUpdateTime(result);
      const enrichedCandidates = await this.enrichResponse(sortedCandidates);
      const transformedCandidates = enrichedCandidates.map(candidate =>
        candidateResponse(candidate),
      );
      return { data: transformedCandidates };
    } catch (error) {
      this.logger.error('Error finding all candidates', error.stack);
      throw error;
    }
  }
  async fetchAllCandidates(
    query: CandidateFilterDto,
  ): Promise<{ candidates: Candidates[] | null; pagination?: any }> {
    try {
      const filter: any = {};
      const searchConditions: any[] = [];
      /**
       * Handle search query (case-insensitive search across name, email, job title)
       */
      if (query.search) {
        const searchRegex = new RegExp(query.search.trim(), 'i');
        searchConditions.push(
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
          { jobTitle: searchRegex },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ['$firstName', ' ', '$lastName'] },
                regex: query.search.trim(),
                options: 'i',
              },
            },
          },
        );
      }
      /**
       * Apply search conditions
       */
      if (searchConditions.length > 0) {
        filter.$or = searchConditions;
      }
      /**
       * Handle specific filters
       */
      if (query.id) {
        if (!Types.ObjectId.isValid(query.id)) {
          this.logger.warn(RECRUITER.NOT_FOUND, `${query.id}`);
          throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
        }
        filter._id = new Types.ObjectId(query.id);
      }
      if (query.department) {
        filter.department = query.department;
      }
      if (query.jobTitle) {
        filter.jobTitle = new RegExp(query.jobTitle.trim(), 'i');
      }
      if (query.email) {
        filter.email = new RegExp(query.email.trim(), 'i');
      }
      if (query.createdBy) {
        if (Types.ObjectId.isValid(query.createdBy)) {
          filter.createdBy = new Types.ObjectId(query.createdBy);
        } else {
          filter.createdBy = query.createdBy;
        }
      }
      if (query.token) {
        filter.token = query.token;
      }
      if (query.hiringStage) {
        filter.hiringStage = query.hiringStage;
      } else if (query.status) {
        const statusMap: { [key: string]: HiringStage } = {
          added: HiringStage.ADDED,
          clarification: HiringStage.CLARIFICATION_REQUESTED,
          personal_info: HiringStage.PERSONAL_INFO_AND_DOCUMENTS_REQUESTED,
          onboarded: HiringStage.ONBOARDED,
        };
        const mappedStatus = statusMap[query.status.toLowerCase()];
        if (mappedStatus) {
          filter.hiringStage = mappedStatus;
        }
      }
      if (query.dateFrom || query.dateTo) {
        filter.createdAt = {};
        if (query.dateFrom) {
          filter.createdAt.$gte = new Date(query.dateFrom);
        }
        if (query.dateTo) {
          const endDate = new Date(query.dateTo);
          endDate.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = endDate;
        }
      }
      const page = query.page || 1;
      const limit = query.limit || 20;
      const usePagination = query.page !== undefined || query.limit !== undefined;
      let result: any;
      let pagination: any = undefined;
      if (usePagination) {
        result = await this.recruitmentRepository.findWithPagination(filter, page, limit);
        pagination = {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        };
      } else {
        /**
         * Return all results without pagination (existing behavior)
         */
        const allResults = await this.recruitmentRepository.findWithPagination(filter, 1, 1000);
        result = { data: allResults.data };
      }
      const sortedCandidates = CommonHelpers.sortByUpdateTime(result.data);
      const enrichedCandidates = await this.enrichResponse(sortedCandidates);
      const transformedCandidates = Array.isArray(enrichedCandidates)
        ? enrichedCandidates.map(candidate => candidateResponse(candidate))
        : [];
      const response: any = { candidates: transformedCandidates };
      if (pagination) {
        response.pagination = pagination;
      }
      return response;
    } catch (error) {
      this.logger.error('Error fetching candidates with filters', error.stack);
      throw error;
    }
  }
  async requestClarification(
    candidateId: Types.ObjectId,
    recruiterId: Types.ObjectId,
  ): Promise<RequestFormDto> {
    try {
      const candidate = await this.recruitmentRepository.findById(candidateId);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      const token = CodeHelper.generateSecureToken();
      const clarificationUrl = RecruitmentHelpers.generateClarificationUrl(token);
      const updatedCandidate = await this.recruitmentRepository.update(candidateId, {
        token,
        tokenExpiresAt: new Date(Date.now() + 45 * ONE_DAY_IN_MS),
        tokenType: TokenType.CLARIFICATION_FORM,
        tokenUsed: false,
        hiringStage: HiringStage.CLARIFICATION_REQUESTED,
        updatedBy: recruiterId,
        copyLink: clarificationUrl,
      });
      if (!updatedCandidate) {
        throw new HttpException(RECRUITER.UPDATE_FAILED, HttpStatus.OK);
      }
      return {
        id: updatedCandidate._id.toString(),
        fullName: `${updatedCandidate.firstName} ${updatedCandidate.lastName}`,
        email: updatedCandidate.email,
        jobTitle: updatedCandidate.jobTitle,
        timingStart: updatedCandidate.timingStart,
        timingEnd: updatedCandidate.timingEnd,
        token: updatedCandidate.token,
        copyLink: updatedCandidate.copyLink,
        hiringStage: CamelCase(updatedCandidate.hiringStage),
        updatedAt: updatedCandidate.updatedAt,
      };
    } catch (error) {
      this.logger.error(`Error requesting clarification for candidate ${candidateId}`, error.stack);
      throw error;
    }
  }
  async submitClarificationForm(
    token: string,
    clarificationForm: ClarificationFormDto,
  ): Promise<Candidates> {
    try {
      const candidate = await this.validateToken(token, TokenType.CLARIFICATION_FORM);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      const updatedRecords = await this.recruitmentRepository.update(candidate._id, {
        firstName: clarificationForm.firstName,
        lastName: clarificationForm.lastName,
        clarificationForm: {
          ...clarificationForm,
          submittedAt: new Date(),
        },
        hiringStage: HiringStage.CLARIFICATION_SUBMITTED,
        tokenUsed: true,
        copyLink: null,
      });
      if (!updatedRecords) {
        throw new HttpException(RECRUITER.UPDATE_FAILED, HttpStatus.OK);
      }
      const enrichedCandidate = await this.enrichResponse(
        (updatedRecords as any).toObject ? (updatedRecords as any).toObject() : updatedRecords,
      );
      const submittedAt = DateHelper.Dates([new Date()]);
      if (enrichedCandidate.updatedBy?.email) {
        const replacements = {
          recruiterName: enrichedCandidate.updatedBy.fullName || 'Recruiter',
          recruiterEmail: enrichedCandidate.updatedBy.email,
          candidateName: `${clarificationForm.firstName} ${clarificationForm.lastName}`,
          candidateEmail: candidate.email,
          jobTitle: candidate.jobTitle,
          submittedAt: submittedAt.emailFormat,
          dashboardUrl: `${IBaseUrl}${IClarificationForm}`,
          currentYear: new Date().getFullYear(),
        };
        try {
          EmailRecruitmentService.sendClarificationSubmittedToRecruiter(replacements);
        } catch (emailError) {
          this.logger.error(EMAIL_ERROR.SEND_FAILED, emailError);
        }
      }
      return candidateResponse(enrichedCandidate);
    } catch (error) {
      this.logger.error(
        `Error submitting clarification form for candidate ${token.substring(0, 8)}...`,
        error.stack,
      );
      throw error;
    }
  }
  async requestPersonalInfoWithDocuments(
    candidateId: string,
    recruiterId: Types.ObjectId,
  ): Promise<RequestFormDto> {
    try {
      const candidate = await this.recruitmentRepository.findById(candidateId);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      const token = CodeHelper.generateSecureToken();
      const personalInfoUrl = RecruitmentHelpers.generatePersonalInfoUrl(token);
      const updatedCandidate = await this.recruitmentRepository.update(candidateId, {
        copyLink: personalInfoUrl,
        token,
        tokenExpiresAt: new Date(Date.now() + 45 * ONE_DAY_IN_MS),
        tokenType: TokenType.PERSONAL_INFO_AND_DOCUMENTS,
        tokenUsed: false,
        hiringStage: HiringStage.PERSONAL_INFO_AND_DOCUMENTS_REQUESTED,
        updatedBy: recruiterId,
      });
      if (!updatedCandidate) {
        throw new HttpException(RECRUITER.UPDATE_FAILED, HttpStatus.OK);
      }
      return {
        id: updatedCandidate._id.toString(),
        fullName: `${updatedCandidate.firstName} ${updatedCandidate.lastName}`,
        email: updatedCandidate.email,
        jobTitle: updatedCandidate.jobTitle,
        timingStart: updatedCandidate.timingStart,
        timingEnd: updatedCandidate.timingEnd,
        token: updatedCandidate.token,
        copyLink: updatedCandidate.copyLink,
        hiringStage: CamelCase(updatedCandidate.hiringStage),
        updatedAt: updatedCandidate.updatedAt,
      };
    } catch (error) {
      this.logger.error(`Error requesting personal info for candidate ${candidateId}`, error.stack);
      throw error;
    }
  }
  async submitPersonalInfoWithDocuments(
    token: string,
    personalData: PersonalInfoWithDocumentsDto,
    files?: {
      cnic?: Express.Multer.File[];
      photograph?: Express.Multer.File[];
      resume?: Express.Multer.File[];
      educationalDocs?: Express.Multer.File[];
      experienceLetter?: Express.Multer.File[];
      salarySlip?: Express.Multer.File[];
    },
  ): Promise<Candidates> {
    try {
      const candidate = await this.validateToken(token, TokenType.PERSONAL_INFO_AND_DOCUMENTS);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      if (!candidate.clarificationForm || !candidate.clarificationForm.submittedAt) {
        throw new HttpException(
          'Clarification form must be submitted before personal information and documents',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hasPersonalData = personalData && Object.keys(personalData).length > 0;
      const hasFiles =
        files &&
        (Array.isArray(files)
          ? files.length > 0
          : Object.values(files).some(arr => arr && arr.length > 0));
      if (!hasPersonalData && !hasFiles) {
        throw new HttpException(
          'At least personal information or documents must be provided',
          HttpStatus.OK,
        );
      }
      const fileList: { file: Express.Multer.File; category: string }[] = [];
      if (hasFiles && files) {
        for (const [category, fileArray] of Object.entries(files)) {
          if (fileArray && fileArray.length > 0) {
            const limit = this.DOCUMENT_CATEGORY_LIMITS[category];
            if (limit && fileArray.length > limit) {
              throw new HttpException(
                `Maximum ${limit} file(s) allowed for ${category}, but ${fileArray.length} provided`,
                HttpStatus.BAD_REQUEST,
              );
            }
          }
        }
        if (files.cnic) {
          fileList.push(...files.cnic.map(f => ({ file: f, category: 'cnic' })));
        }
        if (files.photograph) {
          fileList.push(...files.photograph.map(f => ({ file: f, category: 'photograph' })));
        }
        if (files.resume) {
          fileList.push(...files.resume.map(f => ({ file: f, category: 'resume' })));
        }
        if (files.educationalDocs) {
          fileList.push(
            ...files.educationalDocs.map(f => ({ file: f, category: 'educationalDocs' })),
          );
        }
        if (files.experienceLetter) {
          fileList.push(
            ...files.experienceLetter.map(f => ({ file: f, category: 'experienceLetter' })),
          );
        }
        if (files.salarySlip) {
          fileList.push(...files.salarySlip.map(f => ({ file: f, category: 'salarySlip' })));
        }
      }
      if (fileList.length > 0) {
        let gcsInitialized = false;
        for (let i = 0; i < 3; i++) {
          try {
            await ensureGcsInitialized();
            gcsInitialized = true;
            break;
          } catch (gcsError) {
            this.logger.warn(SYSTEM_ERROR.CPU_OVERLOAD, gcsError);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        if (!gcsInitialized) {
          throw new ServiceUnavailableException(RECRUITER.GCS_UNAVAILABLE);
        }
      }
      const existingDocuments = candidate.documents || [];
      const uploadedDocs: ICandidateDocument[] = [];
      const filesToDelete: any[] = [];
      const newFiles: { file: Express.Multer.File; category: string }[] = [];
      try {
        if (fileList.length > 0) {
          const uploadStartTime = Date.now();
          this.logger.log(`Starting parallel upload for ${fileList.length} files...`);
          const categoriesBeingUploaded = new Set<string>();
          fileList.forEach(({ category }) => categoriesBeingUploaded.add(category));
          existingDocuments.forEach((doc: any) => {
            const docCategory = doc.category as CandidateDocumentCategory;
            for (const uploadCategory of categoriesBeingUploaded) {
              const matchingEnums = this.CATEGORY_TO_ENUM_MAP[uploadCategory] || [];
              if (matchingEnums.includes(docCategory)) {
                filesToDelete.push(doc);
                break;
              }
            }
          });
          this.logger.log(
            `Found ${filesToDelete.length} existing documents to delete for re-upload`,
          );
          await Promise.all(
            fileList.map(({ file, category }) => {
              return new Promise<void>((resolve, reject) => {
                try {
                  const options = uploadingValidator.validationOptions(category);
                  uploadingValidator.validateFile(file, options);
                  if (!file.originalname || file.originalname.trim() === '') {
                    reject(new HttpException(RECRUITER.INCOMPLETE_INFO, HttpStatus.OK));
                    return;
                  }
                  if (!file.mimetype) {
                    reject(new HttpException(RECRUITER.FILE_TYPE, HttpStatus.OK));
                    return;
                  }
                  if (!file.size || file.size === 0) {
                    reject(new HttpException(RECRUITER.FILE_TYPE, HttpStatus.OK));
                    return;
                  }
                  newFiles.push({ file, category });
                  resolve();
                } catch (error) {
                  reject(error);
                }
              });
            }),
          );
          if (filesToDelete.length > 0) {
            const deleteResults = await Promise.allSettled(
              filesToDelete.map(async docToDelete => {
                if (docToDelete.url) {
                  try {
                    await uploadingValidator.deleteFileFromGcsByUrl(docToDelete.url);
                    this.logger.log(FILE.DELETED, `${docToDelete.name} (${docToDelete.category})`);
                  } catch (cleanupError) {
                    throw cleanupError;
                  }
                }
              }),
            );
            const deletedCount = deleteResults.filter(r => r.status === 'fulfilled').length;
            this.logger.log(
              `Deleted ${deletedCount}/${filesToDelete.length} old files from categories being re-uploaded`,
            );
          }
          const uploadPromises = newFiles.map(async ({ file, category }) => {
            try {
              const uploadResult = await uploadingValidator.uploadFileWithRetry(
                file,
                'candidate_document',
                candidate._id,
              );
              this.logger.log(`Upload result: ${JSON.stringify(uploadResult)}`);
              this.logger.log(`File URL: ${uploadResult?.fileUrl}`);
              if (!uploadResult?.fileUrl) {
                throw new HttpException(
                  `Upload failed for ${file.originalname}: No URL returned`,
                  HttpStatus.BAD_REQUEST,
                );
              }
              if (!uploadResult || !uploadResult.fileUrl) {
                throw new HttpException(
                  `Failed to upload file: ${file.originalname}`,
                  HttpStatus.BAD_REQUEST,
                );
              }
              const detectedCategory = RecruitmentHelpers.detectDocumentCategory(
                file.originalname,
                category,
              );
              const documentDoc = {
                _id: new Types.ObjectId(),
                url: uploadResult.fileUrl,
                name: file.originalname,
                fileName: file.originalname,
                fileExtension: path.extname(file.originalname).replace('.', ''),
                fileType: file.mimetype.split('/')[0],
                mimeType: file.mimetype,
                size: file.size,
                category: detectedCategory,
                uploadedAt: new Date(),
              };
              return documentDoc;
            } catch (error) {
              this.logger.error(`Failed to process file ${file.originalname}:`, error);
              throw error;
            }
          });
          uploadedDocs.push(...(await Promise.all(uploadPromises)));
          const uploadDuration = ((Date.now() - uploadStartTime) / 1000).toFixed(2);
          this.logger.log(
            ` Parallel upload completed: ${uploadedDocs.length} files in ${uploadDuration}s`,
          );
        }
        const updateOperation: any = {
          tokenUsed: true,
          copyLink: null,
        };
        if (hasPersonalData) {
          const existingPersonalInfo = candidate.personalInfo || {};
          const updatedPersonalInfo = RecruitmentHelpers.mergePersonalInfo(
            existingPersonalInfo,
            personalData,
          );
          if (Object.keys(updatedPersonalInfo).length > 0) {
            updateOperation.personalInfo = updatedPersonalInfo;
          }
        }
        updateOperation.hiringStage = HiringStage.PERSONAL_INFO_AND_DOCUMENTS_SUBMITTED;
        updateOperation.reviewRequested = false;
        updateOperation.tokenType = null;
        const documentsToRemove = filesToDelete.map((doc: any) => doc._id);
        if (documentsToRemove.length > 0) {
          await this.recruitmentRepository.update(candidate._id, {
            $pull: { documents: { _id: { $in: documentsToRemove } } },
          });
        }
        let updatedRecords: Candidates | null;
        if (uploadedDocs.length > 0) {
          updatedRecords = await this.recruitmentRepository.update(candidate._id, {
            ...updateOperation,
            $push: { documents: { $each: uploadedDocs } },
          });
        } else {
          updatedRecords = await this.recruitmentRepository.update(candidate._id, updateOperation);
        }
        if (!updatedRecords) {
          throw new HttpException(RECRUITER.UPDATE_FAILED, HttpStatus.OK);
        }
        const submissionType =
          hasPersonalData && hasFiles
            ? 'personal info and documents'
            : hasPersonalData
              ? 'personal info'
              : 'documents';
        this.logger.log(
          `Successfully submitted ${submissionType} (${uploadedDocs.length} new documents) for candidate ${candidate._id}`,
        );
        const response = candidateResponse(updatedRecords);
        if (
          updateOperation.hiringStage === HiringStage.PERSONAL_INFO_AND_DOCUMENTS_SUBMITTED &&
          response.updatedBy?.email
        ) {
          const submittedAt = DateHelper.Dates([new Date()]);
          const replacements = {
            recruiterName: response.updatedBy.fullName || 'Recruiter',
            recruiterEmail: response.updatedBy.email,
            candidateName: `${response.firstName} ${response.lastName}`,
            candidateEmail: response.email,
            jobTitle: response.jobTitle,
            submittedAt: submittedAt.emailFormat,
            dashboardUrl: `${IBaseUrl}${IRecruiter}${response._id}`,
            currentYear: new Date().getFullYear(),
          };
          try {
            EmailRecruitmentService.sendPersonalInfoSubmittedToRecruiter(replacements);
            this.logger.log(RECRUITER.PERSONAL_FORM_SUBMITTED, `${response.updatedBy.fullName}`);
          } catch (emailError) {
            this.logger.error(EMAIL_ERROR.SEND_FAILED, emailError);
          }
        }
        return response;
      } catch (error) {
        this.logger.error(RECRUITER.PERSONAL_FAILED, `${candidate._id}:`, error);
        for (const doc of uploadedDocs) {
          try {
            await uploadingValidator.deleteFileFromGcsByUrl(doc.url);
            this.logger.log(FILE.CLEANED + doc.name);
          } catch (cleanupError) {
            this.logger.error(FILE.CLEANED_FAILED + doc.name, cleanupError);
          }
        }
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException((error as Error).message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      this.logger.error(
        `Error submitting personal info with documents for token ${token.substring(0, 8)}...`,
        error.stack,
      );
      throw error;
    }
  }
  async requestCompletePersonalInfo(
    candidateId: string,
    recruiterId: Types.ObjectId,
  ): Promise<Candidates> {
    try {
      const candidate = await this.recruitmentRepository.findById(candidateId);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      const token = candidate.token;
      const personalInfoUrl = RecruitmentHelpers.generatePersonalInfoUrl(token);
      const updatedCandidate = await this.recruitmentRepository.update(candidateId, {
        copyLink: personalInfoUrl,
        token,
        tokenExpiresAt: new Date(Date.now() + 45 * ONE_DAY_IN_MS),
        tokenType: TokenType.PERSONAL_INFO_AND_DOCUMENTS,
        tokenUsed: false,
        hiringStage: HiringStage.PERSONAL_INFO_AND_DOCUMENTS_REQUESTED,
        reviewRequested: true,
        updatedBy: recruiterId,
      });
      if (!updatedCandidate) {
        throw new HttpException(RECRUITER.UPDATE_FAILED, HttpStatus.OK);
      }
      const candidateName = `${updatedCandidate.firstName} ${updatedCandidate.lastName}`;
      if (updatedCandidate.email) {
        const replacements = {
          candidateName: candidateName || 'Candidate',
          candidateEmail: updatedCandidate.email,
          jobTitle: updatedCandidate.jobTitle,
          dashboardUrl: personalInfoUrl,
          currentYear: new Date().getFullYear(),
        };
        try {
          EmailRecruitmentService.sendPersonalInfoRequestedToCandidate(replacements);
        } catch (emailError) {
          this.logger.error(EMAIL_ERROR.SEND_FAILED, emailError);
        }
      }
      return candidateResponse(updatedCandidate);
    } catch (error) {
      this.logger.error(
        `Error requesting complete personal info for candidate ${candidateId}`,
        error.stack,
      );
      throw error;
    }
  }
  async updateDocument(
    candidateId: string | Types.ObjectId,
    documentId: string | Types.ObjectId,
    file: Express.Multer.File,
    recruiterId: Types.ObjectId,
  ): Promise<Candidates> {
    try {
      const candidate = await this.recruitmentRepository.findById(candidateId);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      const options = uploadingValidator.validationOptions('candidateDocuments');
      uploadingValidator.validateFiles([file], options);
      const documentToUpdate = candidate.documents?.find(
        (doc: { _id: { toString: () => string } }) => doc._id.toString() === documentId.toString(),
      );
      if (!documentToUpdate) {
        throw new HttpException(FILE.FILE_METADATA_INVALID, HttpStatus.OK);
      }
      uploadingValidator.validateFile(file, options);
      try {
        if (documentToUpdate.url) {
          await uploadingValidator.deleteFileFromGcsByUrl(documentToUpdate.url);
        }
        const fileUrl = await uploadingValidator.uploadFileWithRetry(
          file,
          'candidate_document',
          candidate._id,
        );
        const newDocumentDoc = uploadingValidator.createFile(file, fileUrl);
        newDocumentDoc._id = new Types.ObjectId(documentId);
        if (!newDocumentDoc) {
          throw new HttpException(FILE.UPLOAD_FAILED, HttpStatus.OK);
        }
        const updatedCandidate = await this.recruitmentRepository.update(candidate._id, {
          $pull: { documents: { _id: new Types.ObjectId(documentId) } },
        } as any);
        const finalCandidate = await this.recruitmentRepository.update(updatedCandidate._id, {
          $push: { documents: newDocumentDoc },
          updatedBy: recruiterId,
        } as any);
        if (!finalCandidate) {
          throw new HttpException(RECRUITER.UPDATE_FAILED, HttpStatus.OK);
        }
        const enrichedCandidate = await this.enrichResponse(
          (finalCandidate as any).toObject ? (finalCandidate as any).toObject() : finalCandidate,
        );
        return candidateResponse(enrichedCandidate);
      } catch (error) {
        uploadingValidator.cleanupTemp(file);
        throw error;
      }
    } catch (error) {
      this.logger.error(
        `Error updating document ${documentId} for candidate ${candidateId}`,
        error.stack,
      );
      throw error;
    }
  }
  async removeDocument(
    candidateId: string | Types.ObjectId,
    documentId: string | Types.ObjectId,
    recruiterId: Types.ObjectId,
  ): Promise<Candidates> {
    try {
      const candidate = await this.recruitmentRepository.findById(candidateId);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      const documentToRemove = candidate.documents?.find(
        (doc: { _id: { toString: () => string } }) => doc._id.toString() === documentId.toString(),
      );
      if (!documentToRemove) {
        throw new HttpException(FILE.FILE_METADATA_INVALID, HttpStatus.OK);
      }
      if (documentToRemove.url) {
        await uploadingValidator.deleteFileFromGcsByUrl(documentToRemove.url);
      }
      const updatedCandidate = await this.recruitmentRepository.update(candidate._id, {
        $pull: { documents: { _id: new Types.ObjectId(documentId) } },
        updatedBy: recruiterId,
      } as any);
      if (!updatedCandidate) {
        throw new HttpException(FILE.FAILED_TO_DELETE, HttpStatus.OK);
      }
      const enrichedCandidate = await this.enrichResponse(
        (updatedCandidate as any).toObject
          ? (updatedCandidate as any).toObject()
          : updatedCandidate,
      );
      return candidateResponse(enrichedCandidate);
    } catch (error) {
      this.logger.error(
        `Error removing document ${documentId} for candidate ${candidateId}`,
        error.stack,
      );
      throw error;
    }
  }
  async archiveCandidate(candidateId: string): Promise<void> {
    try {
      const candidate = await this.recruitmentRepository.findById(candidateId);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      if (candidate.documents?.length > 0) {
        for (const doc of candidate.documents) {
          if (doc.url) {
            try {
              await uploadingValidator.deleteFileFromGcsByUrl(doc.url);
            } catch (error) {
              this.logger.warn(DOCUMENTS.DELETION_FAILED, `${doc.name}`, error);
            }
          }
        }
      }
      await this.recruitmentRepository.archiveCandidate(candidateId);
    } catch (error) {
      this.logger.error(`Error archiving candidate ${candidateId}`, error.stack);
      throw error;
    }
  }
  async moveToOnboarding(
    candidateId: string,
    recruiterId: Types.ObjectId,
    createUserDto: CreateUserProfileDto,
  ): Promise<UserOperationResult> {
    try {
      const candidate = await this.recruitmentRepository.findById(candidateId);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      if (!candidate.clarificationForm || !candidate.personalInfo || !candidate.documents) {
        throw new HttpException(RECRUITER.ONBOARDING_PREREQUISITES, HttpStatus.OK);
      }
      const userProfileData = createUserDto;
      const userOperationResult = await this.userService.createUserProfile(
        userProfileData,
        recruiterId,
      );
      const createdUser = userOperationResult.user;
      if (typeof createdUser === 'string') {
        throw new HttpException(USER.CREATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if (candidate.documents && candidate.documents.length > 0) {
        const docsToTransfer = candidate.documents.map(
          (doc: { category: string; url: string; name: string; uploadedAt: Date }) => {
            const categoryInput = (doc.category || '').toString().toLowerCase();
            const category = Object.values(DocumentCategory).includes(
              categoryInput as DocumentCategory,
            )
              ? (categoryInput as DocumentCategory)
              : DocumentCategory.OTHER;
            return {
              url: doc.url,
              name: doc.name,
              category: category,
              uploadedAt: doc.uploadedAt || new Date(),
              _id: new Types.ObjectId(),
            };
          },
        );
        this.logger.log(
          FILE.TRANSFER +
            `${candidate.firstName} ${candidate.lastName}` +
            candidate.documents.length,
        );
        try {
          if (createdUser?._id) {
            const updatedProfile = await this.profileService.updateProfile(createdUser._id, {
              documents: docsToTransfer,
            });
            this.logger.log(FILE.TRANSFER_SUCCESS);
            if (updatedProfile) {
              if (!createdUser.profile) {
                (createdUser as any).profile = updatedProfile;
              } else {
                (createdUser as any).profile = {
                  ...createdUser.profile,
                  ...updatedProfile,
                };
                (createdUser as any).profile.documents = docsToTransfer;
              }
            }
          } else {
            this.logger.warn(USER.INVALID_DATA);
          }
        } catch (error) {
          this.logger.warn(FILE.UPLOAD_FAILED, error);
        }
      } else {
        this.logger.log(FILE.NOT_FOUND);
      }
      const updatedCandidate = await this.recruitmentRepository.update(candidate._id, {
        hiringStage: HiringStage.ONBOARDED,
        token: null,
        tokenType: null,
        tokenUsageCount: 0,
        tokenExpiresAt: new Date(),
        copyLink: null,
        officialEmail: createUserDto.email,
        onboardedUserId: createdUser._id,
        onboardedProfileId: (createdUser.profile as any)?._id,
        onboardedAt: new Date(),
        updatedBy: recruiterId,
      } as any);
      if (!updatedCandidate) {
        throw new HttpException(RECRUITER.UPDATE_FAILED, HttpStatus.OK);
      }
      return userOperationResult;
    } catch (error) {
      this.logger.error(`Error moving candidate ${candidateId} to onboarding`, error.stack);
      throw error;
    }
  }
  async validateToken(token: string, expectedType?: TokenType): Promise<Candidates> {
    try {
      const candidate = await this.recruitmentRepository.findByToken(token);
      if (!candidate) {
        throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
      }
      /**
       * Check if form is already submitted
       */
      if (
        expectedType === TokenType.CLARIFICATION_FORM &&
        candidate.hiringStage === HiringStage.CLARIFICATION_SUBMITTED
      ) {
        throw new HttpException(RECRUITER.CLARIFICATION_SUBMITTED, HttpStatus.OK);
      }
      if (
        expectedType === TokenType.PERSONAL_INFO_AND_DOCUMENTS &&
        candidate.hiringStage === HiringStage.PERSONAL_INFO_AND_DOCUMENTS_SUBMITTED
      ) {
        throw new HttpException(RECRUITER.PERSONAL_SUBMITTED, HttpStatus.OK);
      }
      if (expectedType && candidate.tokenType !== expectedType) {
        throw new HttpException(RECRUITER.WRONG_LINK_TYPE, HttpStatus.OK);
      }
      return candidate;
    } catch (error) {
      this.logger.error(`Error validating token ${token.substring(0, 8)}...`, error.stack);
      throw error;
    }
  }
  async populateUserBasicInfo(userIds: string[]): Promise<Map<string, any>> {
    if (!userIds || userIds.length === 0) {
      return new Map();
    }
    try {
      const users = await this.userService.getRole(userIds);
      return new Map(
        users.map(user => [
          user._id.toString(),
          {
            _id: user._id,
            email: user.email,
            fullName:
              user.profile?.fullName ||
              `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
            designation: user.profile?.designation || '',
            role: user.role || '',
            displayRole: user.displayRole || '',
            employeeId: user.profile?.employeeId || '',
            status: user.status || 'Active',
            profilePicture: user.profile?.profilePicture,
          },
        ]),
      );
    } catch (error) {
      this.logger.error(USER.USER_FETCH_FAILED, error);
    }
    return new Map();
  }
  async enrichResponse(data: any[] | any): Promise<any> {
    if (!data) return data;
    /**
     * Prevent circular references by creating a visited set
     */
    const visited = new WeakSet();
    const userIds = RecruitmentHelpers.extractUserIdsFromData(data);
    const userMap = await this.populateUserBasicInfo(Array.from(userIds));
    const departmentIds = new Set<string>();
    const extractDepartmentIdsFromNestedData = (obj: any) => {
      if (!obj || typeof obj !== 'object' || visited.has(obj)) return;
      visited.add(obj);
      if (obj.department && Types.ObjectId.isValid(obj.department)) {
        departmentIds.add(obj.department.toString());
      }
      if (Array.isArray(obj)) {
        obj.forEach(item => extractDepartmentIdsFromNestedData(item));
      }
    };
    if (Array.isArray(data)) {
      data.forEach(item => extractDepartmentIdsFromNestedData(item));
    } else {
      extractDepartmentIdsFromNestedData(data);
    }
    const departmentMap = new Map<string, any>();
    if (departmentIds.size > 0 && this.departmentService) {
      try {
        const deptObjectIds = Array.from(departmentIds).map(id => new Types.ObjectId(id));
        const departments = await this.departmentService.getDepartmentsByIdsLean(deptObjectIds);
        departments.forEach(dept => {
          departmentMap.set(dept._id.toString(), dept);
        });
      } catch (error) {
        this.logger.error(RECRUITER.NOT_FOUND, error);
      }
    }
    const enrichObject = async (obj: any): Promise<any> => {
      if (!obj || typeof obj !== 'object') return obj;
      const enriched = { ...obj };
      if (enriched.createdBy && Types.ObjectId.isValid(enriched.createdBy)) {
        const creatorId = enriched.createdBy.toString();
        const userInfo = userMap.get(creatorId);
        if (userInfo) {
          enriched.createdBy = {
            _id: userInfo._id,
            fullName: userInfo.fullName,
            employeeId: userInfo.employeeId,
            email: userInfo.email,
            designation: userInfo.designation,
            role: userInfo.role,
            displayRole: userInfo.displayRole,
            status: userInfo.status,
            profilePicture: userInfo?.profilePicture,
          };
        } else {
          enriched.createdBy = { _id: enriched.createdBy };
        }
      }
      if (enriched.updatedBy && Types.ObjectId.isValid(enriched.updatedBy)) {
        const updaterId = enriched.updatedBy.toString();
        const userInfo = userMap.get(updaterId);
        if (userInfo) {
          enriched.updatedBy = {
            _id: userInfo._id,
            fullName: userInfo.fullName,
            employeeId: userInfo.employeeId,
            email: userInfo.email,
            designation: userInfo.designation,
            role: userInfo.role,
            displayRole: userInfo.displayRole,
            status: userInfo.status,
            profilePicture: userInfo?.profilePicture,
          };
        } else {
          enriched.updatedBy = { _id: enriched.updatedBy };
        }
      }
      if (enriched.user?._id) {
        const userId = enriched.user._id.toString();
        enriched.user = userMap.get(userId) || enriched.user;
      }
      if (enriched.department && Types.ObjectId.isValid(enriched.department)) {
        const deptId = enriched.department.toString();
        const deptInfo = departmentMap.get(deptId);
        if (deptInfo) {
          enriched.department = {
            _id: deptInfo._id,
            name: deptInfo.name,
            description: deptInfo.description,
            isActive: deptInfo.isActive,
            teamLead: deptInfo.teamLead,
            ...(deptInfo.teamLeadDetail && {
              teamLeadDetail: {
                fullName:
                  `${deptInfo.teamLeadDetail.firstName || ''} ${deptInfo.teamLeadDetail.lastName || ''}`.trim(),
                firstName: deptInfo.teamLeadDetail.firstName,
                lastName: deptInfo.teamLeadDetail.lastName,
                designation: deptInfo.teamLeadDetail.designation || '',
                email: deptInfo.teamLeadDetail.email || '',
                role: deptInfo.teamLeadDetail.role || '',
                displayRole: deptInfo.teamLeadDetail.role || '',
                userId: deptInfo.teamLeadDetail.userId,
              },
            }),
          };
        } else {
          enriched.department = { _id: enriched.department };
        }
      }
      if (enriched.documents && Array.isArray(enriched.documents)) {
        enriched.documents = await Promise.all(
          enriched.documents.map(async (doc: any) => {
            if (doc.url) {
              const fileName = uploadingValidator.extractFileNameFromUrl(doc.url);
              if (fileName) {
                const signedUrl = await generateSignedUrl(fileName);
                if (signedUrl) {
                  return { ...doc, url: signedUrl };
                }
              }
            }
            return doc;
          }),
        );
      }
      return enriched;
    };
    if (Array.isArray(data)) {
      return Promise.all(data.map(item => enrichObject(item)));
    }
    return enrichObject(data);
  }
}
