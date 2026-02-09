import { Injectable, Logger } from '@nestjs/common';
import { ResumeParserService } from './resume-parser.service';
// import { TimeDoctorService } from './time-doctor.service';
import * as crypto from 'crypto';

@Injectable()
export class N8nWebhookService {
  private readonly logger = new Logger(N8nWebhookService.name);

  constructor(
    private readonly resumeParserService: ResumeParserService,
    // private readonly timeDoctorService: TimeDoctorService,
  ) {}

  async processResumeParsingResult(data: any): Promise<any> {
    try {
      const { candidateId, parsedData, aiScore, workflowId } = data;

      this.logger.log(`Processing resume parsing result for candidate: ${candidateId}`);

      return {
        candidateId,
        processedAt: new Date().toISOString(),
        workflowId,
        aiScore: aiScore?.overallScore || 0,
        skillsExtracted: parsedData?.skills?.length || 0,
        experienceExtracted: parsedData?.experience?.length || 0,
      };
    } catch (error) {
      this.logger.error('Failed to process resume parsing result:', error);
      throw error;
    }
  }

  // async triggerTimeDoctorOnboarding(data: any): Promise<any> {
  //   try {
  //     const { candidateId, userId, companyId, employeeData } = data;

  //     this.logger.log(`Triggering Time Doctor onboarding for candidate: ${candidateId}`);

  //     const timeDoctorAccount = await this.timeDoctorService.createEmployee(
  //       employeeData,
  //       process.env.TIME_DOCTOR_COMPANY_ID,
  //     );

  //     await this.timeDoctorService.assignProjects(
  //       timeDoctorAccount.timeDoctorId,
  //       employeeData.department,
  //       process.env.TIME_DOCTOR_COMPANY_ID,
  //     );

  //     await this.timeDoctorService.setScreenshotRules(
  //       timeDoctorAccount.timeDoctorId,
  //       process.env.TIME_DOCTOR_COMPANY_ID,
  //     );

  //     return {
  //       candidateId,
  //       timeDoctorId: timeDoctorAccount.timeDoctorId,
  //       inviteUrl: timeDoctorAccount.inviteUrl,
  //       onboardedAt: new Date().toISOString(),
  //     };
  //   } catch (error) {
  //     this.logger.error('Failed to trigger Time Doctor onboarding:', error);
  //     throw error;
  //   }
  // }

  async processBusinessLead(data: any): Promise<any> {
    try {
      const { companyName, email, contactPerson, leadScore, priority, assignedTo } = data;

      this.logger.log(`Processing business lead from: ${companyName}`);

      return {
        companyName,
        email,
        contactPerson,
        leadScore,
        priority,
        assignedTo,
        processedAt: new Date().toISOString(),
        nextFollowUp: this.calculateNextFollowUp(priority),
      };
    } catch (error) {
      this.logger.error('Failed to process business lead:', error);
      throw error;
    }
  }

  async processApplicationStageChange(data: any): Promise<any> {
    try {
      const { applicationId, fromStage, toStage, candidateId, jobId } = data;

      this.logger.log(
        `Processing application stage change: ${applicationId} from ${fromStage} to ${toStage}`,
      );

      return {
        applicationId,
        candidateId,
        jobId,
        fromStage,
        toStage,
        changedAt: new Date().toISOString(),
        nextActions: this.getNextStageActions(toStage),
      };
    } catch (error) {
      this.logger.error('Failed to process application stage change:', error);
      throw error;
    }
  }

  async updateWorkflowStatus(data: any): Promise<any> {
    try {
      const { workflowId, status, executionId, result } = data;

      this.logger.log(`Updating workflow status: ${workflowId} - ${status}`);

      return {
        workflowId,
        status,
        executionId,
        result,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to update workflow status:', error);
      throw error;
    }
  }

  verifySignature(body: any, signature: string): boolean {
    try {
      const webhookSecret = process.env.N8N_WEBHOOK_SECRET;
      if (!webhookSecret) {
        this.logger.warn('No webhook secret configured, skipping verification');
        return true;
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(body))
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      this.logger.error('Signature verification failed:', error);
      return false;
    }
  }

  private calculateNextFollowUp(priority: string): Date {
    const now = new Date();
    switch (priority) {
      case 'high':
        return new Date(now.getTime() + 1 * 60 * 60 * 1000);
      case 'medium':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'low':
        return new Date(now.getTime() + 72 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  private getNextStageActions(stage: string): string[] {
    const stageActions = {
      applied: ['Review resume', 'Check qualifications', 'Schedule screening'],
      reviewing: ['Phone screening', 'Skill assessment', 'Reference check'],
      shortlisted: ['Technical interview', 'Team interview', 'Cultural fit assessment'],
      interview: ['Gather feedback', 'Check references', 'Prepare offer'],
      offer: ['Send offer letter', 'Negotiate terms', 'Set start date'],
      hired: ['Prepare onboarding', 'Setup accounts', 'Schedule orientation'],
      rejected: ['Send rejection email', 'Update candidate database', 'Archive application'],
    };

    return stageActions[stage] || [];
  }
}
