import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, DeleteResult, Model, Types, UpdateQuery } from 'mongoose';

import { Request, RequestDocument } from './schemas/request.schema';
@Injectable()
export class RequestRepository {
  constructor(@InjectModel(Request.name) private RequestModel: Model<RequestDocument>) {}
  async create(createData: Partial<Request>): Promise<Request> {
    const request = new this.RequestModel(createData);
    const result = await request.save();
    return result;
  }
  async findOne(filter: Record<string, unknown>): Promise<Request | null> {
    return await this.RequestModel.findOne(filter).exec();
  }
  async updateWithOperator(
    id: Types.ObjectId,
    updateData: UpdateQuery<Request>,
  ): Promise<Request | null> {
    try {
      const objectId = new Types.ObjectId(id);
      const result = await this.RequestModel.findByIdAndUpdate(objectId, updateData, { new: true })
        .populate('user', 'email username role status cell permissions')
        .populate('approvedBy', 'email username role')
        .populate('rejectedBy', 'email username role')
        .populate('remarks.by', 'email username role')
        .populate('createdBy', 'email username role')
        .populate('updatedBy', 'email username role')
        .populate('department', 'name description teamLead teamLeadDetail')
        .exec();
      return result;
    } catch (error) {
      Logger.error('Error in updateWithOperator:', error);
      throw error;
    }
  }
  async deleteByUserId(userId: Types.ObjectId, session?: ClientSession): Promise<DeleteResult> {
    const objectId = new Types.ObjectId(userId);
    return this.RequestModel.deleteMany({ user: objectId }, { session }).exec();
  }
}
