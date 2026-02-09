import { Types } from 'mongoose';

import { fileCategory, fileType } from '../enums/doc.enums';
import { BaseDocument } from './base.interface';
export interface IDocument extends BaseDocument {
  summary: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  mimeType: fileType;
  fileSize: number;
  category: fileCategory;
  isPublic: boolean;
  uploadedBy: Types.ObjectId;
}
export interface IDocumentCreate {
  summary: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  mimeType: fileType;
  fileSize: number;
  category: fileCategory;
  isPublic?: boolean;
  uploadedBy: Types.ObjectId;
}
export interface IDocumentUpdate {
  title?: string;
  originalName?: string;
  fileName?: string;
  fileUrl?: string;
  mimeType?: fileType;
  fileSize?: number;
  category?: fileCategory;
  isPublic?: boolean;
  updatedBy?: Types.ObjectId;
}
export interface ITransformedDocument {
  _id: string;
  summary: string;
  originalName: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  category: string;
  isPublic: boolean;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
