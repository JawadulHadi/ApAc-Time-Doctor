import { Types } from 'mongoose';

import { Bucket, fileCategory, fileType } from '../enums/doc.enums';
export interface FileUploadOptions {
  allowedMime?: fileType[];
  maxFileSize?: number;
  category?: fileCategory;
  bucket?: Bucket;
  makePublic?: boolean;
}
export interface UploadResult {
  fileUrl: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
}
export interface DocumentFileData {
  _id: Types.ObjectId;
  url: string;
  name: string;
  uploadedAt: Date;
  mimeType?: string;
  fileSize?: number;
  fileType?: string;
  category?: string;
}
