import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../config/database/database.module';
import { EmailstatementService } from '../../services/email/profile/email-statement-process.service';
import { EmailStatementTemplatesService } from '../../services/email/profile/email-statement-templates.service';
import { AuthModule } from '../auth/auth.module';
import { DepartmentModule } from '../department/departments.module';
import { UserModule } from '../user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';
import { Profiles, ProfilesSchema } from './schemas/profiles.schema';
@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => DepartmentModule),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Profiles.name, schema: ProfilesSchema }]),
  ],
  providers: [
    ProfileService,
    ProfileRepository,
    EmailstatementService,
    EmailStatementTemplatesService,
  ],
  controllers: [ProfileController],
  exports: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
