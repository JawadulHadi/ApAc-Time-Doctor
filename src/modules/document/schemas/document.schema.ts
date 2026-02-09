import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document as MongoDocument, Types } from 'mongoose';

import { fileCategory, fileType } from '../../../types/enums/doc.enums';
export type DocumentDocument = Doc & MongoDocument;
@Schema({ timestamps: true, strict: true })
export class Doc {
  @ApiProperty({ description: 'Document title', example: 'User Profile Picture' })
  @Prop({ required: true, type: String })
  title: string;
  @ApiProperty({ description: 'Original file name', example: 'profile.png' })
  @Prop({ required: true, type: String })
  originalName: string;
  @ApiProperty({ description: 'Stored file name', example: 'photo_12345.png' })
  @Prop({ required: true, unique: true, type: String })
  fileName: string;
  @ApiProperty({
    description: 'File URL in GCS',
    example: 'https://storage.googleapis.com/bucket/photo_12345.png',
  })
  @Prop({ required: true, type: String })
  fileUrl: string;
  @ApiProperty({
    description: 'MIME type',
    enum: Object.values(fileType),
    example: fileType.PNG,
  })
  @Prop({
    required: true,
    enum: Object.values(fileType),
    type: String,
  })
  mimeType: fileType;
  @ApiProperty({
    description: 'File size in bytes',
    example: 512,
  })
  @Prop({ required: true, type: Number })
  fileSize: number;
  @ApiProperty({
    description: 'Document category',
    enum: Object.values(fileCategory),
    example: fileCategory.PUBLIC,
  })
  @Prop({
    required: true,
    enum: Object.values(fileCategory),
    type: String,
    default: fileCategory.NON_PUBLIC,
  })
  category: fileCategory;
  @ApiProperty({ description: 'Is file public', example: true })
  @Prop({ default: true, type: Boolean })
  isPublic: boolean;
  @ApiProperty({ description: 'Uploaded by user ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  uploadedBy: Types.ObjectId;
  @ApiProperty({ description: 'Is file deleted', example: false })
  @Prop({ default: false })
  isDeleted?: boolean;
  @ApiProperty({ description: 'Deletion timestamp', example: '2023-01-01T00:00:00.000Z' })
  @Prop({ type: Date })
  deletedAt?: Date;
  @ApiProperty({ description: 'Deletion user ID', example: '507f1f77bcf86cd799439011' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy?: Types.ObjectId;
  @ApiProperty({ description: 'Creation timestamp', example: '2023-01-01T00:00:00.000Z' })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @ApiProperty({ description: 'Last update timestamp', example: '2023-01-01T00:00:00.000Z' })
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
export const DocumentSchema = SchemaFactory.createForClass(Doc);
DocumentSchema.pre('save', function (this: any) {
  this.updatedAt = new Date();
});
