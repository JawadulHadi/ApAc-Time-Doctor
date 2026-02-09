import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ILeaveBankFilter, ILeaveBankSort } from '../../types/interfaces/leave-bank.interface';
import { BankValidator } from './core/validators/leave-bank.validator';
import { CreateLeaveBankDto, UpdateLeaveBankDto } from './dto/leave-bank.dto';
import { LeaveBank, LeaveBankDocument } from './schemas/leave-bank.schema';
@Injectable()
export class LeaveBankRepository {
  private readonly logger = new Logger(LeaveBankRepository.name);
  constructor(
    @InjectModel(LeaveBank.name)
    private readonly leaveBankModel: Model<LeaveBankDocument>,
  ) {}
  async create(createDto: CreateLeaveBankDto): Promise<LeaveBank> {
    BankValidator.validateCreateLeaveBankDto(createDto);
    const record = new this.leaveBankModel({
      ...createDto,
      _id: new Types.ObjectId(),
    });
    return record.save();
  }
  async bulkUpsert(operations: any[]): Promise<any> {
    try {
      if (operations.length === 0) {
        return { upsertCount: 0, modifiedCount: 0 };
      }
      const result = await this.leaveBankModel.bulkWrite(operations, {
        ordered: false,
      });
      return {
        upsertCount: result.upsertedCount,
        modifiedCount: result.modifiedCount,
        result,
      };
    } catch (error) {
      throw error;
    }
  }
  async findById(id: string | Types.ObjectId): Promise<LeaveBank | null> {
    try {
      const objectId = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
      const record = await this.leaveBankModel.findById(objectId).exec();
      return record;
    } catch (error) {
      return null;
    }
  }
  async findByUserId(userId: string | Types.ObjectId): Promise<LeaveBank | null> {
    return this.leaveBankModel.findOne({ userId }).sort({ year: -1 }).exec();
  }
  async findByEmployeeId(employeeId: string): Promise<LeaveBank | null> {
    return this.leaveBankModel.findOne({ employeeId }).exec();
  }
  async findOrUpdate(userId: Types.ObjectId): Promise<LeaveBankDocument> {
    return this.leaveBankModel.findOneAndUpdate(
      { userId },
      {},
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }
  async updateById(
    id: string | Types.ObjectId,
    updateDto: UpdateLeaveBankDto,
  ): Promise<LeaveBank | any> {
    try {
      const objectId = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
      const updatedRecord = await this.leaveBankModel
        .findByIdAndUpdate(
          objectId,
          {
            ...updateDto,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .exec();
      if (!updatedRecord) {
        this.logger.warn(`No record found to update with ID: ${id}`);
        return null;
      }
      this.logger.log(`Successfully updated record: ${updatedRecord.employeeId}`);
      return updatedRecord;
    } catch (error) {
      this.logger.error(`Error updating record with ID ${id}:`, error);
      throw error;
    }
  }
  async updateAndReturn(id: string | Types.ObjectId, updateDto: any): Promise<LeaveBank | null> {
    try {
      const objectId = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
      const updatedRecord = await this.leaveBankModel
        .findByIdAndUpdate(
          objectId,
          {
            ...updateDto,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
          },
        )
        .select(
          '+userId +profileId +year +employeeId +name +email +department +isUpdatedRecord +notified +lastNotifiedDate +isNewMonthData +newlyAddedMonth +discrepancyResolved +cancellationDate +isNewRecord +lastUploadDate +uploadBatchId +monthlyData +createdAt +updatedAt',
        )
        .exec();
      if (!updatedRecord) {
        this.logger.warn(`No record found to update with ID: ${id}`);
        return null;
      }
      this.logger.log(`Successfully updated and returned record: ${updatedRecord.employeeId}`);
      return updatedRecord;
    } catch (error) {
      this.logger.error(`Error updating and returning record with ID ${id}:`, error);
      throw error;
    }
  }
  async findByYear(year: number): Promise<LeaveBank[]> {
    return this.leaveBankModel.find({ year }).sort({ name: 1 }).exec();
  }
  async countAll(): Promise<number> {
    return this.leaveBankModel.countDocuments().exec();
  }
  async countByUserId(userId: string | Types.ObjectId): Promise<number> {
    return this.leaveBankModel.countDocuments({ userId }).exec();
  }
  async bulkInsert(operations: any[]): Promise<void> {
    try {
      if (operations.length === 0) {
        this.logger.warn('Bulk insert called with empty operations array');
        return;
      }
      this.logger.log(`Executing bulk insert with ${operations.length} operations`);
      const result = await this.leaveBankModel.bulkWrite(operations, {
        ordered: false,
      });
      this.logger.log(`Bulk insert completed: ${result.insertedCount} records inserted`);
      if (result.hasWriteErrors()) {
        this.logger.warn(`Bulk insert had ${result.getWriteErrorCount()} errors`);
        result.getWriteErrors().forEach(error => {
          this.logger.error(`Write error: ${error.err}`);
        });
      }
    } catch (error) {
      this.logger.error('Bulk insert operation failed:', error);
      throw new Error(`Bulk insert failed: ${error.message}`);
    }
  }
  async findByUserIdS(userIds: Types.ObjectId[]): Promise<LeaveBank[]> {
    return this.leaveBankModel.find({ userId: { $in: userIds } }).exec();
  }
  async findAllRecords(
    filters: ILeaveBankFilter = {},
    sort: ILeaveBankSort = { year: -1, createdAt: -1 },
  ): Promise<any[]> {
    const query: any = {};
    if (filters.year) {
      query.year = filters.year;
    }
    if (filters.department) query.department = filters.department;
    if (filters.employeeId) query.employeeId = filters.employeeId;
    if (filters.email) query.email = filters.email;
    if (filters.userId) query.userId = filters.userId;
    if (filters.month) query.month = filters.month;
    return this.leaveBankModel.find(filters).sort(sort).exec();
  }
  async findAll(
    filters: Record<string, any> = {},
    sort: Record<string, 1 | -1> = { year: 1, createdAt: 1 },
  ): Promise<any[]> {
    return this.leaveBankModel.find(filters).sort(sort).exec();
  }
  async findByEmployeeIdAndYear(employeeId: string, year: number): Promise<LeaveBank | any> {
    return this.leaveBankModel.findOne({ employeeId, year }).exec();
  }
  async countByYear(year: number): Promise<number> {
    try {
      return await this.leaveBankModel.countDocuments({ year }).exec();
    } catch (error) {
      throw error;
    }
  }
  async deleteByYear(year: number): Promise<number> {
    try {
      const result = await this.leaveBankModel.deleteMany({ year }).exec();
      return result.deletedCount || 0;
    } catch (error) {
      throw error;
    }
  }
  async deleteAllRecords(): Promise<number> {
    try {
      this.logger.log('Erasing Process Started');
      const result = await this.leaveBankModel.deleteMany({}).exec();
      this.logger.log('Records Erased');
      return result.deletedCount || 0;
    } catch (error: any) {
      this.logger.error('Erasing Process Failed', error);
      throw error;
    }
  }
}
