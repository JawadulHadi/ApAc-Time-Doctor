import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../config/database/database.module';
import { DepartmentModule } from '../department/departments.module';
import { ProfileModule } from '../profile/profile.module';
import { RequestModule } from '../request/request.module';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
@Module({
  imports: [
    forwardRef(() => RequestModule),
    forwardRef(() => DepartmentModule),
    forwardRef(() => ProfileModule),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
