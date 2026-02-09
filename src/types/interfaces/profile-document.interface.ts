import { Types } from 'mongoose';

import { DocumentCategory } from '../enums/doc.enums';
export interface IProfileDocumentFile {
  _id: Types.ObjectId;
  url: string;
  name?: string;
  category?: DocumentCategory;
  uploadedAt: Date;
}
export interface IProfileDocumentFileCreate {
  url: string;
  name?: string;
  category?: DocumentCategory;
}
export interface IProfileDocumentFileUpdate {
  url?: string;
  name?: string;
  category?: DocumentCategory;
}
