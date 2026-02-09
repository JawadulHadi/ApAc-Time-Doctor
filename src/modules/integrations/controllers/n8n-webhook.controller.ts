import { Controller, Post, Body, Headers, BadRequestException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { N8nWebhookService } from '../services/n8n-webhook.service';

@ApiTags('n8n-integrations')
@Controller('n8n-webhooks')
export class N8nWebhookController {
  private readonly logger = new Logger(N8nWebhookController.name);

  constructor(private readonly n8nWebhookService: N8nWebhookService) {}

  @Post('resume-upload')
  @ApiOperation({ summary: 'Handle resume parsing completion from n8n' })
  @ApiHeader({ name: 'x-n8n-signature', description: 'Webhook signature for verification' })
  async handleResumeUpload(@Body() body: any, @Headers('x-n8n-signature') signature: string) {
    try {
      this.logger.log('Resume upload webhook received');

      const isValid = this.n8nWebhookService.verifySignature(body, signature);
      if (!isValid) {
        throw new BadRequestException('Invalid webhook signature');
      }

      const result = await this.n8nWebhookService.processResumeParsingResult(body);

      return {
        success: true,
        message: 'Resume processing completed',
        data: result,
      };
    } catch (error) {
      this.logger.error('Resume upload webhook error:', error);
      throw new BadRequestException(error.message);
    }
  }

  // @Post('candidate-hired')
  // @ApiOperation({ summary: 'Trigger Time Doctor onboarding for new hire' })
  // async handleCandidateHired(@Body() body: any) {
  //   try {
  //     this.logger.log('Candidate hired webhook received');

  //     const result = await this.n8nWebhookService.triggerTimeDoctorOnboarding(body);

  //     return {
  //       success: true,
  //       message: 'Time Doctor onboarding triggered',
  //       data: result,
  //     };
  //   } catch (error) {
  //     this.logger.error('Candidate hired webhook error:', error);
  //     throw new BadRequestException(error.message);
  //   }
  // }

  @Post('business-lead')
  @ApiOperation({ summary: 'Process new business development lead' })
  async handleBusinessLead(@Body() body: any) {
    try {
      this.logger.log('Business lead webhook received');

      const result = await this.n8nWebhookService.processBusinessLead(body);

      return {
        success: true,
        message: 'Business lead processed',
        data: result,
      };
    } catch (error) {
      this.logger.error('Business lead webhook error:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('application-stage-change')
  @ApiOperation({ summary: 'Handle application stage changes' })
  async handleApplicationStageChange(@Body() body: any) {
    try {
      this.logger.log('Application stage change webhook received');

      const result = await this.n8nWebhookService.processApplicationStageChange(body);

      return {
        success: true,
        message: 'Application stage change processed',
        data: result,
      };
    } catch (error) {
      this.logger.error('Application stage change webhook error:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Post('workflow-status')
  @ApiOperation({ summary: 'Receive workflow status updates from n8n' })
  async handleWorkflowStatus(@Body() body: any) {
    try {
      this.logger.log('Workflow status webhook received');

      const result = await this.n8nWebhookService.updateWorkflowStatus(body);

      return {
        success: true,
        message: 'Workflow status updated',
        data: result,
      };
    } catch (error) {
      this.logger.error('Workflow status webhook error:', error);
      throw new BadRequestException(error.message);
    }
  }
}
