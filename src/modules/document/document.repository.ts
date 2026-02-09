import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';

import { fileCategory } from '../../types/enums/doc.enums';
import { Doc } from '../document/schemas/document.schema';
@Injectable()
export class DocumentsRepository {
  constructor(
    @InjectModel(Doc.name)
    private readonly documentModel: Model<Doc>,
  ) {}
  async create(data: {
    title: string;
    originalName: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
    fileSize: number;
    category?: fileCategory;
    isPublic?: boolean;
    uploadedBy: Types.ObjectId;
  }): Promise<Doc> {
    const created = new this.documentModel(data);
    return created.save();
  }
  async findAll(sort?: any): Promise<Doc[]> {
    if (sort) {
      return this.documentModel.find().sort(sort).exec();
    }
    return this.documentModel.find().exec();
  }
  async findAllPaginated(sort?: any, skip?: number, limit?: number): Promise<Doc[]> {
    let query = this.documentModel.find();
    if (sort) {
      query = query.sort(sort);
    }
    if (skip !== undefined) {
      query = query.skip(skip);
    }
    if (limit !== undefined) {
      query = query.limit(limit);
    }
    return query.exec();
  }
  async countAll(): Promise<number> {
    return this.documentModel.countDocuments().exec();
  }
  async updateDocumentWithTransaction(
    id: string,
    updateData: Partial<{
      title: string;
      originalName: string;
      fileName: string;
      fileUrl: string;
      mimeType: string;
      fileSize: number;
      category: fileCategory;
      isPublic: boolean;
      updatedBy: string;
    }>,
    session?: ClientSession,
  ): Promise<Doc | null> {
    const options = session ? { session, new: true } : { new: true };
    return this.documentModel
      .findByIdAndUpdate(
        id,
        {
          $set: updateData,
          $currentDate: { updatedAt: true },
        },
        options,
      )
      .exec();
  }
  async findByIdWithSession(id: string, session?: ClientSession): Promise<Doc | null> {
    const options = session ? { session } : {};
    return this.documentModel.findById(id, null, options).exec();
  }
  async deleteByIdWithSession(id: string, session?: ClientSession): Promise<Doc | null> {
    const options = session ? { session } : {};
    return this.documentModel.findByIdAndDelete(id, options).exec();
  }
  async startSession(): Promise<ClientSession> {
    return this.documentModel.db.startSession();
  }
  async findById(id: string): Promise<Doc | null> {
    return this.documentModel.findById(id).exec();
  }
  async findByFileName(fileName: string): Promise<Doc | null> {
    return this.documentModel.findOne({ fileName }).exec();
  }
  async findByUserId(userId: string): Promise<Doc[]> {
    return this.documentModel.find({ userId }).exec();
  }
  async findByProfileId(profileId: string): Promise<Doc[]> {
    return this.documentModel.find({ profileId }).exec();
  }
  async findByCategory(category: fileCategory): Promise<Doc[]> {
    return this.documentModel.find({ category }).exec();
  }
  async findByUploadedBy(uploadedBy: string): Promise<Doc[]> {
    return this.documentModel.find({ uploadedBy }).exec();
  }
  async updateByFileName(
    fileName: string,
    updateData: Partial<{
      title: string;
      originalName: string;
      fileUrl: string;
      mimeType: string;
      fileSize: number;
      category: fileCategory;
      userId: string;
      profileId: string;
      isPublic: boolean;
    }>,
  ): Promise<Doc | null> {
    return this.documentModel
      .findOneAndUpdate({ fileName }, { $set: updateData }, { new: true })
      .exec();
  }
  async updateById(
    id: string,
    updateData: Partial<{
      title: string;
      originalName: string;
      fileName: string;
      fileUrl: string;
      mimeType: string;
      fileSize: number;
      category: fileCategory;
      userId: string;
      profileId: string;
      isPublic: boolean;
    }>,
  ): Promise<Doc | null> {
    return this.documentModel.findByIdAndUpdate(id, { $set: updateData }, { new: true }).exec();
  }
  async deleteByFileName(fileName: string): Promise<Doc | null> {
    return this.documentModel.findOneAndDelete({ fileName }).exec();
  }
  async deleteById(id: string): Promise<Doc | null> {
    return this.documentModel.findByIdAndDelete(id).exec();
  }
  async deleteByUserId(userId: string): Promise<{ deletedCount: number }> {
    const result = await this.documentModel.deleteMany({ userId }).exec();
    return { deletedCount: result.deletedCount || 0 };
  }
  async deleteByProfileId(profileId: string): Promise<{ deletedCount: number }> {
    const result = await this.documentModel.deleteMany({ profileId }).exec();
    return { deletedCount: result.deletedCount || 0 };
  }
  async countDocuments(): Promise<number> {
    return this.documentModel.countDocuments().exec();
  }
  async countByUser(userId: string): Promise<number> {
    return this.documentModel.countDocuments({ userId }).exec();
  }
  async countByCategory(category: fileCategory): Promise<number> {
    return this.documentModel.countDocuments({ category }).exec();
  }
  async softDeleteById(id: string, deletedBy: Types.ObjectId): Promise<Doc | null> {
    return this.documentModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy,
          },
        },
        { new: true },
      )
      .exec();
  }
  async restoreById(id: string): Promise<Doc | null> {
    return this.documentModel
      .findByIdAndUpdate(
        id,
        {
          $unset: {
            isDeleted: 1,
            deletedAt: 1,
            deletedBy: 1,
          },
        },
        { new: true },
      )
      .exec();
  }
  async findDeleted(sort?: any): Promise<Doc[]> {
    const filter = { isDeleted: true };
    if (sort) {
      return this.documentModel.find(filter).sort(sort).exec();
    }
    return this.documentModel.find(filter).exec();
  }
  async findDeletedPaginated(sort?: any, skip?: number, limit?: number): Promise<Doc[]> {
    let query = this.documentModel.find({ isDeleted: true });
    if (sort) {
      query = query.sort(sort);
    }
    if (skip !== undefined) {
      query = query.skip(skip);
    }
    if (limit !== undefined) {
      query = query.limit(limit);
    }
    return query.exec();
  }
  async countDeleted(): Promise<number> {
    return this.documentModel.countDocuments({ isDeleted: true }).exec();
  }
  async findAllWithFilter(filter: any, sort?: any, skip?: number, limit?: number): Promise<Doc[]> {
    let query = this.documentModel.find(filter);
    if (sort) {
      query = query.sort(sort);
    }
    if (skip !== undefined) {
      query = query.skip(skip);
    }
    if (limit !== undefined) {
      query = query.limit(limit);
    }
    return query.exec();
  }
  async findByIdIncludingDeleted(id: string): Promise<Doc | null> {
    return this.documentModel.findById(id).exec();
  }
}
