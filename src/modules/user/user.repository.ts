import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';

import { USER } from '../../types/constants/error-messages.constants';
import { UserStatus } from '../../types/constants/user-status.constants';
import { UserFilter } from '../../types/interfaces/filters.interface';
import { CombinedUserProfile } from '../../types/interfaces/user.interface';
import { User } from './schemas/user.schema';
@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}
  async startSession(): Promise<ClientSession> {
    return this.userModel.startSession();
  }
  async create(userData: Partial<User>, session?: ClientSession): Promise<User> {
    const user = new this.userModel(userData);
    return user.save({ session });
  }
  async find(filter: UserFilter): Promise<User[]> {
    return this.userModel.find(filter).exec();
  }
  async findLean(filter: UserFilter, session?: ClientSession): Promise<User[]> {
    return this.userModel.find(filter, null, { session }).lean<User[]>().exec();
  }
  async findOne(filter: any): Promise<User | null> {
    return this.userModel.findOne(filter).exec();
  }
  async findById(id: string | Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async findByRoles(roles: string[]): Promise<User[]> {
    return this.userModel.find({ role: { $in: roles }, status: UserStatus.ACTIVE }).exec();
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
  async findUserForAuthentication(email: string): Promise<User | CombinedUserProfile | null> {
    return this.userModel.findOne({ email }).select('+password').lean<User>().exec();
  }
  async update(
    userId: Types.ObjectId | string,
    updateData: Partial<User> | Record<string, any>,
  ): Promise<User | any> {
    return this.userModel.findByIdAndUpdate(userId, updateData).exec();
  }
  async updateUserSession(
    userId: Types.ObjectId | string,
    updateData: Partial<User> | Record<string, any>,
    session?: ClientSession,
  ): Promise<User | any> {
    try {
      const objectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
      const updatedUser = await this.userModel
        .findByIdAndUpdate(objectId, { $set: updateData }, { new: true, session })
        .exec();
      if (updatedUser) {
        const resultWithValidation = await this.userModel
          .findByIdAndUpdate(
            objectId,
            { $set: updateData },
            {
              new: true,
              runValidators: true,
              context: 'query',
              session,
            },
          )
          .exec();
        return resultWithValidation;
      } else {
        return updatedUser;
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
  async validateExisting(email: any, existingUser: any): Promise<any> {
    if (email && email !== existingUser.email) {
      const emailExists = await this.findByEmail(email);
      if (emailExists) {
        throw new ConflictException(USER.ALREADY_EXISTS);
      }
    }
  }
  async delete(userId: Types.ObjectId, session?: ClientSession): Promise<void> {
    const userObjectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    await this.userModel.findByIdAndDelete(userObjectId, { session }).exec();
  }
}
