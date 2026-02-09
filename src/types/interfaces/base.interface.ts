import { Types } from 'mongoose';
export interface BaseDocument {
  _id: Types.ObjectId;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface BaseDocumentFile {
  _id: Types.ObjectId;
  url: string;
  name?: string;
  uploadedAt: Date;
}
export interface MongoConfig {
  host: string;
  db: string;
  user: string;
  pass: string;
}
export interface EmailConfig {
  companyName: string;
  supportEmail: string;
  maxRetries: number;
  retryDelayMs: number;
}
export interface Config {
  mongo: MongoConfig;
  app: {
    port: number;
    env: string;
  };
}
