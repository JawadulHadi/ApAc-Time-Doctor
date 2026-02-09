import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  PayloadTooLargeException,
} from '@nestjs/common';
import * as fs from 'fs';
import { Types } from 'mongoose';
import * as path from 'path';

import { Bucket, fileCategory, fileType } from '@/types/enums/doc.enums';

import { CandidateDocumentaries } from '../../modules/recruitment/schemas/candidate.schema';
import { FILE } from '../../types/constants/error-messages.constants';
import { IUploadDir } from '../../types/constants/url-tags.constants';
import {
  DocumentFileData,
  FileUploadOptions,
  UploadResult,
} from '../../types/interfaces/fileValidation.interface';
import { ICandidateDocument } from '../../types/interfaces/recruitment.interface';
import {
  deleteFileFromGcs,
  ensureGcsInitialized,
  generateSignedUrl,
  uploadFileToGcs,
} from '../utils/gcs.utils';
@Injectable()
export class uploadingValidator {
  static validateFile(file: Express.Multer.File, options: FileUploadOptions = {}): void {
    const {
      allowedMime = Object.values(fileType),
      maxFileSize = 5 * 1024 * 1024, // Default 5MB
      category,
    } = options;
    if (!file?.buffer || file.size === 0) {
      throw new HttpException(FILE.INVALID_TYPE, HttpStatus.OK);
    }
    if (file.size > maxFileSize) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      throw new PayloadTooLargeException(FILE.SIZE_EXCEEDED);
    }
    if (!allowedMime.includes(file.mimetype as fileType)) {
      const allowedTypes = allowedMime.join(', ');
      throw new HttpException(FILE.INVALID_TYPE, HttpStatus.OK);
    }
    this.validateCategory(file.mimetype, category);
  }
  static validateCategory(mimeType: string, category?: fileCategory): void {
    const validatedCategory = category || fileCategory.OTHER;
    const categoryRestrictions: Partial<Record<fileCategory, fileType[]>> = {
      [fileCategory.CONTRACT]: [fileType.PDF, fileType.DOCX],
      [fileCategory.NON_PUBLIC]: [fileType.PDF, fileType.DOCX],
    };
    const restrictedTypes = categoryRestrictions[validatedCategory];
    if (restrictedTypes && !restrictedTypes.includes(mimeType as fileType)) {
      throw new HttpException(FILE.INVALID_TYPE, HttpStatus.OK);
    }
  }
  static async uploadFile(
    file: Express.Multer.File,
    prefix: string,
    entityId: Types.ObjectId | string,
    options: FileUploadOptions = {},
  ): Promise<UploadResult> {
    const { bucket = Bucket.APAC, makePublic = false } = options;
    if (!fs.existsSync(IUploadDir)) {
      fs.mkdirSync(IUploadDir, { recursive: true });
    }
    const fileExtension = path.extname(file.originalname);
    const safeFileName = this.sanitizeName(path.basename(file.originalname, fileExtension));
    const timestamp = Date.now();
    const uniqueFileName = `${prefix}_${entityId}_${safeFileName}_${timestamp}${fileExtension}`;
    const tempFilePath = path.join(IUploadDir, uniqueFileName);
    try {
      fs.writeFileSync(tempFilePath, file.buffer);
      const fileUrl = await uploadFileToGcs(tempFilePath, bucket, makePublic);
      this.cleanupTemp(tempFilePath);
      return {
        fileUrl,
        fileName: uniqueFileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
      };
    } catch (error) {
      this.cleanupTemp(tempFilePath);
      throw error;
    }
  }
  static async uploadFileWithRetry(
    file: Express.Multer.File,
    prefix: string,
    entityId: Types.ObjectId | string,
    options: FileUploadOptions = {},
    maxRetries: number = 3,
  ): Promise<UploadResult | any> {
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.uploadFile(file, prefix, entityId, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        Logger.warn(FILE.UPLOAD_FAILED, lastError.message);
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }
    throw lastError || new Error(FILE.UPLOAD_FAILED);
  }
  static async deleteFileFromGcsByUrl(url: string, bucket: Bucket = Bucket.APAC): Promise<void> {
    const fileName = this.extractFileNameFromUrl(url);
    if (fileName) {
      try {
        await deleteFileFromGcs(fileName, bucket);
      } catch (error) {
        Logger.warn(FILE.PROCESSING_FAILED, `(${fileName}): ${error.message}`);
      }
    }
  }
  static async safeDeleteFileFromGcs(
    fileName: string,
    bucket: Bucket = Bucket.APAC,
  ): Promise<void> {
    try {
      await deleteFileFromGcs(fileName, bucket);
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }
  }
  static createFile(
    file: Express.Multer.File,
    fileUrl: string,
    additionalData: Partial<DocumentFileData> = {},
  ): CandidateDocumentaries {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = path.basename(file.originalname, fileExtension);
    const documentTypeMap: Record<string, string> = {
      [fileType.PDF]: 'Document',
      [fileType.DOCX]: 'Document',
      [fileType.JPEG]: 'Image',
      [fileType.PNG]: 'Image',
      [fileType.JPG]: 'Image',
    };
    const fileTypes = documentTypeMap[file.mimetype] || 'Unknown';
    return {
      _id: new Types.ObjectId(),
      url: fileUrl,
      name: file.originalname,
      fileName: fileName,
      fileExtension: fileExtension.replace('.', ''),
      fileType: fileTypes,
      mimeType: file.mimetype,
      size: file.size,
      category: additionalData.category || 'other',
      uploadedAt: new Date(),
    };
  }
  static createProfileFile(file: Express.Multer.File, fileUrl: string, category?: string): any {
    return {
      _id: new Types.ObjectId(),
      url: fileUrl,
      name: file.originalname,
      category,
      uploadedAt: new Date(),
    };
  }
  static extractFileNameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return path.basename(urlObj.pathname);
    } catch (error) {
      return null;
    }
  }
  static async createFileUrl(
    file: Express.Multer.File,
    fileUrl: string,
    metadata?: any,
  ): Promise<ICandidateDocument> {
    const fileName = fileUrl.split('/').pop();
    const signedUrl = await generateSignedUrl(fileName, Bucket.APAC, 60 * 24 * 7);
    return {
      _id: new Types.ObjectId(),
      url: signedUrl || fileUrl,
      name: file.originalname,
      fileName: path.parse(file.originalname).name,
      fileExtension: path.extname(file.originalname).replace('.', ''),
      fileType: file.mimetype.split('/')[0],
      mimeType: file.mimetype,
      size: file.size,
      category: metadata?.category || 'other',
      uploadedAt: new Date(),
    };
  }
  static sanitizeName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9\s\-_.]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 100);
  }
  static cleanupTemp(tempFilePath: any): void {
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    } catch (error) {
      Logger.warn(FILE.PROCESSING_FAILED, `${tempFilePath}:`, error);
    }
  }
  static async ensureGcsInitialized(): Promise<void> {
    try {
      await ensureGcsInitialized();
    } catch (error) {
      throw new HttpException(FILE.FILE_STORAGE_ERROR, HttpStatus.OK);
    }
  }
  static validateFiles(files: Express.Multer.File[], options: FileUploadOptions = {}): void {
    if (!files || files.length === 0) {
      throw new HttpException(FILE.FILE_ID_REQUIRED, HttpStatus.OK);
    }
    for (const file of files) {
      this.validateFile(file, options);
    }
  }
  static validationOptions(useCase: string): FileUploadOptions {
    const options: Record<string, FileUploadOptions> = {
      profilePicture: {
        allowedMime: [fileType.JPEG, fileType.PNG, fileType.JPG],
      },
      idProof: {
        allowedMime: [fileType.PDF, fileType.JPEG, fileType.PNG, fileType.JPG],
      },
      resume: {
        allowedMime: [fileType.PDF, fileType.DOCX],
      },
      cnic: {
        allowedMime: [fileType.PDF, fileType.JPEG, fileType.PNG, fileType.JPG],
      },
      photograph: {
        allowedMime: [fileType.JPEG, fileType.PNG, fileType.JPG],
      },
      documents: {
        allowedMime: [fileType.PDF, fileType.JPEG, fileType.PNG, fileType.JPG, fileType.DOCX],
      },
      candidateDocuments: {
        allowedMime: [fileType.PDF, fileType.JPEG, fileType.PNG, fileType.JPG],
      },
      contract: {
        allowedMime: [fileType.PDF, fileType.DOCX],
        category: fileCategory.CONTRACT,
      },
      educationalDocs: {
        allowedMime: [fileType.PDF, fileType.JPEG, fileType.PNG, fileType.JPG],
        maxFileSize: 10 * 1024 * 1024,
      },
      experienceLetter: {
        allowedMime: [fileType.PDF, fileType.JPEG, fileType.PNG, fileType.JPG],
        maxFileSize: 10 * 1024 * 1024,
      },
      salarySlip: {
        allowedMime: [fileType.PDF, fileType.JPEG, fileType.PNG, fileType.JPG],
        maxFileSize: 10 * 1024 * 1024,
      },
    };
    return options[useCase] || {};
  }
}
