import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';

import { RECRUITER } from '../../types/constants/error-messages.constants';
import { Candidates } from './schemas/candidate.schema';
@Injectable()
export class RecruitmentRepository {
  constructor(@InjectModel(Candidates.name) private readonly candidateModel: Model<Candidates>) {}
  async create(candidateData: Partial<Candidates>): Promise<Candidates> {
    const candidate = new this.candidateModel(candidateData);
    const saved = await candidate.save();
    return saved.toObject();
  }
  async findAll(): Promise<Candidates[] | null> {
    const candidates = await this.candidateModel.find().lean().exec();
    if (!candidates || candidates.length === 0) {
      throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
    }
    return candidates;
  }
  async findWithPagination(
    filter: any = {},
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    data: Candidates[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [candidates, total] = await Promise.all([
      this.candidateModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.candidateModel.countDocuments(filter).exec(),
    ]);
    const totalPages = limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
    return { data: candidates, total, page, limit, totalPages };
  }
  async findById(id: string | Types.ObjectId): Promise<Candidates> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(RECRUITER.INVALID_ID_FORMAT, HttpStatus.OK);
    }
    const candidates = await this.candidateModel
      .find({ _id: new Types.ObjectId(id) })
      .limit(1)
      .lean()
      .exec();
    if (!candidates || candidates.length === 0) {
      throw new HttpException(RECRUITER.NOT_FOUND, HttpStatus.OK);
    }
    return candidates[0];
  }
  async findByEmail(email: string): Promise<Candidates | null> {
    return this.candidateModel.findOne({ email: email.toLowerCase() }).lean().exec();
  }
  async findByToken(token: string): Promise<Candidates | null> {
    const candidates = await this.candidateModel
      .findOne({
        token,
        tokenExpiresAt: { $gt: new Date() },
      })
      .lean()
      .exec();
    return candidates;
  }
  async update(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<Candidates>,
  ): Promise<Candidates | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return this.candidateModel
      .findByIdAndUpdate(objectId, updateData, { new: true, runValidators: true })
      .exec();
  }
  async updateRecords(
    id: string | Types.ObjectId,
    updateData: UpdateQuery<Candidates>,
  ): Promise<Candidates | null> {
    return this.candidateModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();
  }
  async archiveCandidate(id: string | Types.ObjectId): Promise<Candidates | null> {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    return this.candidateModel.findByIdAndDelete(objectId).exec();
  }
  async emailExists(email: string, excludeId?: Types.ObjectId): Promise<boolean> {
    const filter: any = { email: email.toLowerCase() };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const count = await this.candidateModel.countDocuments(filter).exec();
    return count > 0;
  }
  async validateUniqueEmail(email: string, excludeId?: Types.ObjectId): Promise<void> {
    const exists = await this.emailExists(email, excludeId);
    if (exists) {
      throw new HttpException(RECRUITER.EMAIL_EXISTS, HttpStatus.OK);
    }
  }
  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.candidateModel.aggregate(pipeline).exec();
  }
}
