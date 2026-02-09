import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentsController } from './document.controller';
import { DocumentsRepository } from './document.repository';
import { DocumentService } from './document.service';
import { Doc, DocumentSchema } from './schemas/document.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Doc.name, schema: DocumentSchema }])],
  controllers: [DocumentsController],
  providers: [DocumentService, DocumentsRepository],
  exports: [DocumentService],
})
export class DocumentsModule {}
