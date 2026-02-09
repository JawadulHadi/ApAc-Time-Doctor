import { Injectable, Logger } from '@nestjs/common';
import handlebars from 'handlebars';

import { Mail } from '../../../shared/utils/email.utils';
import {
  htmlClarificationSubmittedToRecruiter,
  htmlPersonalInfoCompletedCandidate,
  htmlPersonalInfoSubmittedToRecruiter,
} from '../../../types/constants/emails/recruitment-emails.constants';
import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
@Injectable()
export class EmailRecruitmentService {
  static sendClarificationSubmittedToRecruiter(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlClarificationSubmittedToRecruiter);
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(
        sanitizedReplacements.recruiterEmail,
        `Clarification Form Submitted - ${sanitizedReplacements.candidateName} - ${sanitizedReplacements.jobTitle}`,
        'Candidate has submitted clarification form',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, error);
    }
  }
  static sendPersonalInfoSubmittedToRecruiter(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlPersonalInfoSubmittedToRecruiter);
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(
        sanitizedReplacements.recruiterEmail,
        `Personal Info & Documents Submitted - ${sanitizedReplacements.candidateName} - ${sanitizedReplacements.jobTitle}`,
        'Candidate has submitted personal info and documents',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, error);
    }
  }
  static sendPersonalInfoRequestedToCandidate(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlPersonalInfoCompletedCandidate);
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(
        sanitizedReplacements.candidateEmail,
        `Action Required: Complete Your Information - ${sanitizedReplacements.candidateName} - ${sanitizedReplacements.jobTitle}`,
        'Please complete or update your personal information and documents',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED, error);
    }
  }
}
