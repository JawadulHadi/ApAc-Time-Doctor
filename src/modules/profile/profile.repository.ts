import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types, UpdateQuery } from 'mongoose';

import { Profiles, ProfilesDocument } from './schemas/profiles.schema';
@Injectable()
export class ProfileRepository {
  constructor(
    @InjectModel(Profiles.name) private readonly profilesModel: Model<ProfilesDocument>,
  ) {}
  async createProfile(createProfileDto: Partial<Profiles>): Promise<Profiles> {
    const createProfile = new this.profilesModel(createProfileDto);
    return createProfile.save();
  }
  async createUserProfile(
    profileData: Partial<Profiles>,
    session: ClientSession,
  ): Promise<Profiles> {
    const profile = new this.profilesModel(profileData);
    return await profile.save({ session });
  }
  async getAllProfiles(): Promise<any[]> {
    return this.profilesModel.find().exec();
  }
  async getProfilesByUserIds(
    userIds: Types.ObjectId[],
    session?: ClientSession,
  ): Promise<Profiles[]> {
    if (!userIds || userIds.length === 0) {
      return [];
    }
    return this.profilesModel
      .find(
        {
          userId: { $in: userIds },
        },
        null,
        { session },
      )
      .lean()
      .exec();
  }
  async updateProfile(
    userId: Types.ObjectId | string,
    updateProfileDto: Partial<Profiles>,
  ): Promise<Profiles | null> {
    return this.profilesModel.findByIdAndUpdate(userId, updateProfileDto, { new: true }).exec();
  }
  async updateProfileSession(
    userId: Types.ObjectId | string,
    updateProfileDto: Partial<Profiles>,
    session?: ClientSession,
    arrayFilters?: Record<string, any>[],
  ): Promise<Profiles | null> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    const updateData = { ...updateProfileDto };
    const updateDataAsAny = updateData as Record<string, unknown>;
    delete updateDataAsAny._id;
    delete updateDataAsAny.buffer;
    delete updateDataAsAny.__v;
    const options: any = { new: true, session };
    if (arrayFilters) {
      options.arrayFilters = arrayFilters;
    }
    return (await this.profilesModel
      .findOneAndUpdate(
        { userId: userObjectId },
        { $set: updateData as UpdateQuery<ProfilesDocument> },
        options,
      )
      .exec()) as unknown as Profiles | null;
  }
  async updateProfileByUserId(
    userId: Types.ObjectId | string,
    updateData: UpdateQuery<ProfilesDocument>,
  ): Promise<Profiles | null> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    return this.profilesModel
      .findOneAndUpdate({ userId: userObjectId }, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();
  }
  async updateProfileByUserIdWithArrayFilters(
    userId: Types.ObjectId | string,
    updateData: UpdateQuery<ProfilesDocument>,
    arrayFilters: any[],
  ): Promise<Profiles | null> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    return this.profilesModel
      .findOneAndUpdate({ userId: userObjectId }, updateData, {
        new: true,
        runValidators: true,
        arrayFilters,
      })
      .exec();
  }
  async updateStatement(
    userId: Types.ObjectId | string,
    updateData: UpdateQuery<ProfilesDocument>,
  ): Promise<Profiles | null> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    return this.profilesModel
      .findOneAndUpdate({ userId: userObjectId }, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();
  }
  async getProfileByUserId(userId: Types.ObjectId | string): Promise<Profiles | null> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    return this.profilesModel.findOne({ userId: userObjectId }).exec();
  }
  async find({ userId }: { userId: Types.ObjectId[] }): Promise<Profiles[]> {
    return this.profilesModel.find({ userId: { $in: userId } }).exec();
  }
  async findOne(userId: Types.ObjectId | string): Promise<Profiles | null> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    return this.profilesModel.findOne({ userId: userObjectId }).exec();
  }
  async findProfilesByUserIds(userIds: string[]): Promise<Profiles[]> {
    return this.profilesModel.find({ userId: { $in: userIds } }).exec();
  }
  async getProfileById(userId: Types.ObjectId | string): Promise<Profiles | null> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    return this.profilesModel.findById(userObjectId).exec();
  }
  async findProfile(query: any): Promise<Profiles | null> {
    return this.profilesModel.findOne(query).exec();
  }
  async findAll(query: any = {}, options: { limit?: number } = {}): Promise<Profiles[]> {
    return this.profilesModel
      .find(query)
      .limit(options.limit || 100)
      .exec();
  }
  async generateEmployeeId(departmentCode: string = 'APAC'): Promise<string> {
    try {
      const prefix = `EMP-${departmentCode}-`;
      const lastProfile = (await this.profilesModel
        /**
         * eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         * MongoDB regex query requires unsafe argument type for dynamic pattern matching
         */
        .findOne({
          employeeId: {
            $regex: `^${prefix}\\d+$`,
            $exists: true,
          },
        } as any)
        .sort({ employeeId: -1 })
        .select('employeeId')
        .lean()
        .exec()) as Profiles | null;
      let nextNumber = 1;
      if (lastProfile?.employeeId) {
        const lastId = lastProfile.employeeId;
        const numberPart = lastId.replace(prefix, '');
        const lastNumber = parseInt(numberPart, 10);
        if (!isNaN(lastNumber) && lastNumber > 0) {
          nextNumber = lastNumber + 1;
        }
      }
      let attempts = 0;
      let newEmployeeId = '';
      while (attempts < 5) {
        newEmployeeId = `${prefix}${nextNumber.toString().padStart(4, '0')}`;
        const existing = await this.profilesModel
          .findOne({
            employeeId: newEmployeeId,
          })
          .exec();
        if (!existing) {
          break;
        }
        nextNumber++;
        attempts++;
      }
      if (attempts >= 5) {
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        newEmployeeId = `${prefix}${randomSuffix}`;
      }
      return newEmployeeId;
    } catch (_error) {
      const timestamp = Date.now().toString(36).toUpperCase();
      return `EMP-${departmentCode}-F${timestamp.slice(-6)}`;
    }
  }
  async findProfilesByEmails(emails: string[]): Promise<Profiles[]> {
    if (!emails || emails.length === 0) {
      return [];
    }
    const profiles = await this.profilesModel
      .find({
        email: { $in: emails },
      })
      .exec();
    return profiles;
  }
  async findProfilesByEmployeeIds(employeeIds: string[]): Promise<Profiles[]> {
    if (!employeeIds || employeeIds.length === 0) {
      return [];
    }
    const profiles = await this.profilesModel
      .find({
        employeeId: { $in: employeeIds },
      })
      .exec();
    return profiles;
  }
  async deleteByUserId(userId: Types.ObjectId | string, session?: ClientSession): Promise<any> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    return this.profilesModel.findOneAndDelete({ userId: userObjectId }, { session }).exec();
  }
}
