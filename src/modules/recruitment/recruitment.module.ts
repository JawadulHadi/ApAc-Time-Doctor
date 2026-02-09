import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DepartmentModule } from '../department/departments.module';
import { ProfileModule } from '../profile/profile.module';
import { UserModule } from '../user/user.module';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentPublicController } from './recruitment.public.controller';
import { RecruitmentRepository } from './recruitment.repository';
import { RecruitmentService } from './recruitment.service';
import { Candidates, CandidateSchema } from './schemas/candidate.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Candidates.name, schema: CandidateSchema }]),
    UserModule,
    DepartmentModule,
    ProfileModule,
  ],
  controllers: [RecruitmentController, RecruitmentPublicController],
  providers: [RecruitmentService, RecruitmentRepository],
  exports: [RecruitmentService, RecruitmentRepository],
})
export class RecruitmentModule {}
