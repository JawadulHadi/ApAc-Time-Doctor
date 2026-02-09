import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../config/database/database.module';
import { ProfileModule } from '../profile/profile.module';
import { UserModule } from '../user/user.module';
import { DepartmentsController } from './department.controller';
import { DepartmentRepository } from './department.repository';
import { DepartmentService } from './department.service';
import { Department, DepartmentSchema } from './schemas/department.schema';
@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ProfileModule),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentService, DepartmentRepository],
  exports: [DepartmentService],
})
export class DepartmentModule {}
