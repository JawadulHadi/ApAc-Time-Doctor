import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ResumeParserService } from './services/resume-parser.service';
// import { TimeDoctorService } from './services/time-doctor.service';
import { N8nWebhookService } from './services/n8n-webhook.service';
import { N8nWebhookController } from './controllers/n8n-webhook.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [N8nWebhookController],
  providers: [ResumeParserService,/*  TimeDoctorService */, N8nWebhookService],
  exports: [ResumeParserService,/*  TimeDoctorService */, N8nWebhookService],
})
export class IntegrationsModule {}
