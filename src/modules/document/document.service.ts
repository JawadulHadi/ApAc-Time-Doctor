import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  PayloadTooLargeException,
} from '@nestjs/common';
import * as fs from 'fs';
import { ClientSession, Types } from 'mongoose';
import * as path from 'path';

import { PaginationHelper } from '../../shared/helpers/pagination.helper';
import { streamFileFromGcs, uploadFileToGcs } from '../../shared/utils/gcs.utils';
import { uploadingValidator } from '../../shared/validators/file.validation';
import { DOCUMENTS } from '../../types/constants/error-messages.constants';
import { IUploadDir } from '../../types/constants/url-tags.constants';
import { PaginationDto } from '../../types/dtos/pagination.dto';
import { Bucket, fileCategory } from '../../types/enums/doc.enums';
import { PaginatedResponse } from '../../types/interfaces/pagination.interface';
import { UpdateDocumentDto, UploadDocumentDto } from '../document/dto/document.dto';
import { Doc } from '../document/schemas/document.schema';
import { DocumentsRepository } from './document.repository';
@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(private readonly documentsRepository: DocumentsRepository) {}
  async uploadDocument(
    file: Express.Multer.File,
    uploadDto: UploadDocumentDto,
    uploadedBy: Types.ObjectId,
  ): Promise<Doc> {
    try {
      await uploadingValidator.ensureGcsInitialized();
      const options = uploadingValidator.validationOptions('documents');
      uploadingValidator.validateFile(file, {
        ...options,
        category: uploadDto.category,
      });
      const result = await uploadingValidator.uploadFile(file, 'document', uploadedBy, {
        makePublic: uploadDto.category === fileCategory.PUBLIC,
        category: uploadDto.category,
      });
      return await this.documentsRepository.create({
        title: uploadDto.title,
        originalName: result.originalName,
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        mimeType: result.mimeType,
        fileSize: result.fileSize,
        category: uploadDto.category || fileCategory.OTHER,
        isPublic: uploadDto.category === fileCategory.PUBLIC,
        uploadedBy,
      });
    } catch (error) {
      if (error instanceof HttpException || error instanceof PayloadTooLargeException) {
        throw error;
      }
      this.logger.error('Document upload failed:', error);
      throw new HttpException(error.message || DOCUMENTS.UPLOAD_FAILED, HttpStatus.OK);
    }
  }
  async updateDocument(
    id: string,
    file: Express.Multer.File | null,
    updateDto: UpdateDocumentDto,
    updatedBy: Types.ObjectId,
  ): Promise<{ document: Doc; message: string }> {
    let tempFilePath: string | null = null;
    try {
      await uploadingValidator.ensureGcsInitialized();
      const existingDocument = await this.documentsRepository.findById(id);
      if (!existingDocument) {
        throw new HttpException(DOCUMENTS.NOT_FOUND, HttpStatus.OK);
      }
      const updateData: any = {
        updatedBy,
      };
      if (updateDto.title) {
        updateData.title = updateDto.title;
      }
      if (updateDto.category) {
        updateData.category = updateDto.category;
        updateData.isPublic = updateDto.category === fileCategory.PUBLIC;
      }
      if (updateDto.isPublic !== undefined) {
        updateData.isPublic = updateDto.isPublic;
      }
      if (file) {
        const validationOptions = uploadingValidator.validationOptions('documents');
        uploadingValidator.validateFile(file, {
          ...validationOptions,
          category: updateDto.category || existingDocument.category,
        });
        const fileExtension = path.extname(file.originalname);
        const newFileName = `doc_${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
        if (!fs.existsSync(IUploadDir)) {
          fs.mkdirSync(IUploadDir, { recursive: true });
        }
        tempFilePath = path.join(IUploadDir, newFileName);
        fs.writeFileSync(tempFilePath, file.buffer);
        const isPublic =
          updateDto.category === fileCategory.PUBLIC ||
          existingDocument.isPublic ||
          updateDto.isPublic;
        const newFileUrl = await uploadFileToGcs(tempFilePath, Bucket.APAC, isPublic);
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
          tempFilePath = null;
        }
        await uploadingValidator.safeDeleteFileFromGcs(existingDocument.fileName, Bucket.APAC);
        updateData.originalName = file.originalname;
        updateData.fileName = newFileName;
        updateData.fileUrl = newFileUrl;
        updateData.mimeType = file.mimetype;
        updateData.fileSize = file.size;
      }
      const updatedDocument = await this.documentsRepository.updateDocumentWithTransaction(
        id,
        updateData,
      );
      if (!updatedDocument) {
        throw new HttpException(DOCUMENTS.UPDATE_FAILED, HttpStatus.OK);
      }
      return {
        document: updatedDocument,
        message: file
          ? 'Document file replaced successfully'
          : 'Document metadata updated successfully',
      };
    } catch (error) {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (cleanupError) {
          this.logger.warn('Failed to cleanup temp file:', cleanupError);
        }
      }
      if (error instanceof HttpException || error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Document update failed:', error);
      throw new HttpException(error.message || DOCUMENTS.UPDATE_FAILED, HttpStatus.OK);
    }
  }
  async getDocumentById(id: string): Promise<Doc> {
    const document = await this.documentsRepository.findById(id);
    if (!document) {
      throw new HttpException(DOCUMENTS.NOT_FOUND, HttpStatus.OK);
    }
    return document;
  }
  async getAllDocuments(): Promise<Doc[]> {
    return this.documentsRepository.findAll({ updatedAt: -1 });
  }
  async getAllPaginated(paginationDto?: PaginationDto): Promise<PaginatedResponse<Doc> | Doc[]> {
    if (paginationDto) {
      const { page, limit, skip } = PaginationHelper.normalizePagination(
        paginationDto.page,
        paginationDto.limit,
      );
      const [documents, total] = await Promise.all([
        this.documentsRepository.findAllPaginated({ updatedAt: -1 }, skip, limit),
        this.documentsRepository.countAll(),
      ]);
      return PaginationHelper.createPaginatedResponse(documents, total, page, limit);
    }
    return this.documentsRepository.findAll({ updatedAt: -1 });
  }
  async getDocumentByFileName(fileName: string): Promise<Doc> {
    const document = await this.documentsRepository.findByFileName(fileName);
    if (!document) {
      throw new HttpException(DOCUMENTS.NOT_FOUND, HttpStatus.OK);
    }
    return document;
  }
  async getDocumentsByCategory(category: fileCategory): Promise<Doc[]> {
    return this.documentsRepository.findByCategory(category);
  }
  async countUserDocuments(userId: string): Promise<number> {
    return this.documentsRepository.countByUser(userId);
  }
  async getBase64FromGcs(fileName: string, bucket: Bucket): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const stream = streamFileFromGcs(fileName, bucket);
      const chunks: Buffer[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        const mimeTypeMap: { [key: string]: string } = {
          pdf: 'application/pdf',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          png: 'image/png',
          jpeg: 'image/jpeg',
          jpg: 'image/jpeg',
          gif: 'image/gif',
        };
        const mimeType = mimeTypeMap[ext] || 'application/octet-stream';
        const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        resolve(base64);
      });
      stream.on('error', err => {
        this.logger.error(DOCUMENTS.ENCRYPTION_FAILED, err);
        reject(err);
      });
    });
  }
  async deleteDocument(id: string, deletedBy: Types.ObjectId): Promise<any> {
    try {
      const document = await this.documentsRepository.findById(id);
      if (!document) {
        throw new HttpException(DOCUMENTS.NOT_FOUND, HttpStatus.OK);
      }
      const softDeletedDocument = await this.documentsRepository.softDeleteById(id, deletedBy);
      if (!softDeletedDocument) {
        throw new HttpException(DOCUMENTS.DELETION_FAILED, HttpStatus.OK);
      }
      return {
        success: true,
        message: 'Document deleted successfully (soft delete)',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(DOCUMENTS.DELETION_FAILED, error.message);
    }
  }
  async getDocumentUpdateHistory(id: string): Promise<
    Array<{
      action: string;
      timestamp: Date;
      updatedBy: string;
      changes: string[];
    }>
  > {
    const document = await this.documentsRepository.findById(id);
    if (!document) {
      throw new HttpException(DOCUMENTS.NOT_FOUND, HttpStatus.OK);
    }
    return [
      {
        action: 'created',
        timestamp: document.createdAt,
        updatedBy: document.uploadedBy.toString(),
        changes: ['Document created'],
      },
      {
        action: 'updated',
        timestamp: document.updatedAt,
        updatedBy: document.uploadedBy.toString(),
        changes: ['Metadata updated'],
      },
    ];
  }
  /**
   * Retrieves a list of deleted documents.
   * @param paginationDto The pagination parameters to be used.
   * @returns A promise that resolves to an object containing the list of deleted documents, the total count of deleted documents, and pagination information.
   * @throws HttpException if there is an error during the operation.
   */
  async getDeletedDocuments(paginationDto?: PaginationDto): Promise<any> {
    const usePagination = paginationDto && (paginationDto.page || paginationDto.limit);
    if (usePagination) {
      const { page, limit, skip } = PaginationHelper.normalizePagination(
        paginationDto.page,
        paginationDto.limit,
      );
      const [documents, total] = await Promise.all([
        this.documentsRepository.findDeletedPaginated({ deletedAt: -1 }, skip, limit),
        this.documentsRepository.countDeleted(),
      ]);
      return {
        documents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }
    const documents = await this.documentsRepository.findDeleted({ deletedAt: -1 });
    return { documents };
  }
  async restoreDocument(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const document = await this.documentsRepository.findByIdIncludingDeleted(id);
      if (!document) {
        throw new HttpException(DOCUMENTS.NOT_FOUND, HttpStatus.OK);
      }
      if (!document.isDeleted) {
        throw new HttpException('Document is not deleted', HttpStatus.OK);
      }
      const restoredDocument = await this.documentsRepository.restoreById(id);
      if (!restoredDocument) {
        throw new HttpException('Failed to restore document', HttpStatus.OK);
      }
      return {
        success: true,
        message: 'Document restored successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to restore document', error.message);
    }
  }
  async permanentlyDeleteDocument(id: string): Promise<{ success: boolean; message: string }> {
    let session: ClientSession | null = null;
    try {
      session = await this.documentsRepository.startSession();
      session.startTransaction();
      const document = await this.documentsRepository.findByIdIncludingDeleted(id);
      if (!document) {
        throw new HttpException(DOCUMENTS.NOT_FOUND, HttpStatus.OK);
      }
      await uploadingValidator.safeDeleteFileFromGcs(document.fileName, Bucket.APAC);
      await this.documentsRepository.deleteByIdWithSession(id, session);
      await session.commitTransaction();
      return {
        success: true,
        message: 'Document permanently deleted',
      };
    } catch (error) {
      if (session) {
        await session.abortTransaction();
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to permanently delete document', error.message);
    } finally {
      if (session) {
        await session.endSession();
      }
    }
  }
}
