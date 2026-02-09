import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LeaveBankEmailService } from '../../services/email/leave-bank/leave-bank-email.service';
import { ProfileModule } from '../profile/profile.module';
import { UserModule } from '../user/user.module';
import { LeaveBankActionHelper } from './helpers/leave-bank-action.helper';
import { LeaveBankController } from './leave-bank.controller';
import { LeaveBankRepository } from './leave-bank.repository';
import { LeaveBankService } from './leave-bank.service';
import { BankRecordService } from './process/leave-bank-processor.service';
import { LeaveBank, LeaveBankSchema } from './schemas/leave-bank.schema';
@Module({
  imports: [
    forwardRef(() => ProfileModule),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: LeaveBank.name, schema: LeaveBankSchema }]),
  ],
  controllers: [LeaveBankController],
  providers: [
    LeaveBankRepository,
    LeaveBankService,
    LeaveBankActionHelper,
    BankRecordService,
    LeaveBankEmailService,
    LeaveBankActionHelper,
  ],
  exports: [LeaveBankService, LeaveBankRepository],
})
export class LeaveBankModule {}
