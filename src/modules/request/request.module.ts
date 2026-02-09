import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '../../config/database/database.module';
import { RequestController } from './request.controller';
import { RequestRepository } from './request.repository';
import { RequestService } from './request.service';
import { RequestSchema } from './schemas/request.schema';
@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
  ],
  providers: [RequestService, RequestRepository],
  controllers: [RequestController],
  exports: [RequestService, RequestRepository],
})
export class RequestModule {}
