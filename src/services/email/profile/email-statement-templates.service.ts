import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import handlebars from 'handlebars';

import { DateHelper } from '../../../shared/helpers/format-Dates.helper';
import { Mail } from '../../../shared/utils/email.utils';
import { CamelCase, transformRole } from '../../../shared/utils/unified-transform.utils';
import {
  htmlAcknowledgement,
  htmlReviewRequest,
  htmlStatusApproved,
  htmlStatusApprovedLAndD,
  htmlStatusSuggestChanges,
  htmlStatusSuggestChangesLAndD,
  htmlSubmitted,
} from '../../../types/constants/emails/mission-statement-emails.constants';

@Injectable()
export class EmailStatementTemplatesService {
  static logger = new Logger(EmailStatementTemplatesService.name);
  constructor(private configService: ConfigService) {}
  /**
   * Send mission statement acknowledgement email to applicant
   * @param recipientEmail - Email address of the recipient
   * @param recipientName - Full name of the recipient
   * @param missionStatement - Mission statement content
   * @param statementUrl - URL to access the mission statement
   * @param additionalData - Additional information for email template
   * @param additionalData.applicantRole - Role of the applicant
   * @param additionalData.applicantDepartment - Department of the applicant
   * @param additionalData.submissionDate - Date of submission
   * @param additionalData.reviewerName - Name of the reviewer
   * @param additionalData.reviewerRole - Role of the reviewer
   * @param additionalData.applicantDesignation - Designation of the applicant
   * @param additionalData.reviewerDesignation - Designation of the reviewer
   * @param configService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when email sending fails
   */
  static async sendStatementAcknowledgement(
    recipientEmail: string,
    recipientName: string,
    missionStatement: string,
    statementUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
      submissionDate?: string;
      reviewerName?: string;
      reviewerRole?: string;
      applicantDesignation?: string;
      reviewerDesignation?: string;
    },
    configService?: ConfigService,
  ) {
    try {
      const emailConfig = configService?.get('email');
      const companyName = emailConfig?.companyName || 'APAC Management System';
      const template = handlebars.compile(htmlAcknowledgement);
      const subject = '✓ Mission Statement Received | In Review';
      const sanitizedReplacements = {
        recipientName,
        missionStatement,
        statementUrl: statementUrl,
        submissionDate: DateHelper.Dates([new Date()]).individual,
        currentYear: new Date().getFullYear(),
        companyName,
        reviewerName: additionalData?.reviewerName || '',
        reviewerRole: CamelCase(additionalData?.reviewerRole),
        applicantRole: CamelCase(additionalData?.applicantRole),
        applicantDepartment: additionalData?.applicantDepartment || '',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(`Mission statement acknowledgement sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.log('Failed to send acknowledgement email', error);
    }
  }
  /**
   * Send mission statement review request email to reviewer
   * @param recipientEmail - Email address of the reviewer
   * @param recipientName - Full name of the reviewer
   * @param applicantName - Name of the applicant who submitted the statement
   * @param missionStatement - Mission statement content to review
   * @param statementUrl - URL to access the mission statement for review
   * @param additionalData - Additional information for email template
   * @param additionalData.applicantRole - Role of the applicant
   * @param additionalData.applicantDepartment - Department of the applicant
   * @param additionalData.submissionDate - Date of submission
   * @param configService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when email sending fails
   */
  static async sendStatementReviewRequest(
    recipientEmail: string,
    recipientName: string,
    applicantName: string,
    missionStatement: string,
    statementUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
      submissionDate?: string;
    },
    configService?: ConfigService,
  ) {
    try {
      const emailConfig = configService?.get('email');
      const companyName = emailConfig?.companyName || 'APAC Management System';
      const template = handlebars.compile(htmlReviewRequest);
      const subject = `✓ APAC Mission Statement | Review Required | ${applicantName}`;
      const sanitizedReplacements = {
        recipientName,
        applicantName,
        applicantRole: CamelCase(additionalData?.applicantRole),
        applicantDepartment: additionalData?.applicantDepartment || '',
        submissionDate: DateHelper.Dates([new Date()]).individual,
        missionStatement,
        statementUrl: statementUrl,
        currentYear: new Date().getFullYear(),
        companyName,
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(
        `Mission statement review request sent to ${recipientEmail}  ${recipientName}`,
      );
    } catch (error) {
      this.logger.log('Failed to send review request email', error);
    }
  }
  /**
   * Send mission statement submitted notification email
   * @param recipientEmail - Email address of the recipient
   * @param recipientName - Full name of the recipient
   * @param applicantName - Name of the applicant who submitted the statement
   * @param missionStatement - Mission statement content
   * @param statementUrl - URL to access the mission statement
   * @param additionalData - Additional information for email template
   * @param additionalData.applicantRole - Role of the applicant
   * @param additionalData.applicantDepartment - Department of the applicant
   * @param additionalData.submissionDate - Date of submission
   * @param additionalData.reviewerName - Name of the reviewer
   * @param additionalData.reviewerRole - Role of the reviewer
   * @param configService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when email sending fails
   */
  static async sendStatementSubmitted(
    recipientEmail: string,
    recipientName: string,
    applicantName: string,
    missionStatement: string,
    statementUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
      submissionDate?: string;
      reviewerName?: string;
      reviewerRole?: string;
    },
    configService?: ConfigService,
  ) {
    try {
      const emailConfig = configService?.get('email');
      const companyName = emailConfig?.companyName || 'APAC Management System';
      const template = handlebars.compile(htmlSubmitted);
      const subject = `APAC Mission Statement | Submitted | ${applicantName}`;
      const sanitizedReplacements = {
        recipientName,
        applicantName,
        applicantRole: CamelCase(additionalData?.applicantRole),
        applicantDepartment: additionalData?.applicantDepartment || '',
        submissionDate: DateHelper.Dates([new Date()]).individual,
        missionStatement,
        statementUrl: statementUrl,
        currentYear: new Date().getFullYear(),
        companyName,
        reviewerName: additionalData?.reviewerName || '',
        reviewerRole: CamelCase(additionalData?.reviewerRole),
        isRecordKeeper: true,
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(
        `Mission statement record sent to ${recipientEmail} for ${applicantName} ${recipientName}`,
      );
    } catch (error) {
      this.logger.log('Failed to send submission email', error);
    }
  }
  /**
   * Send mission statement approved notification to applicant
   * @param recipientEmail - Email address of the applicant
   * @param applicantName - Name of the applicant
   * @param finalContent - Final approved mission statement content
   * @param approverName - Name of the person who approved the statement
   * @param approverRole - Role of the approver
   * @param reviewDate - Date when the statement was reviewed and approved
   * @param profileUrl - URL to access the profile
   * @param additionalData - Additional information for email template
   * @param additionalData.applicantRole - Role of the applicant
   * @param additionalData.applicantDepartment - Department of the applicant
   * @param configService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when email sending fails
   */
  static async sendMissionStatementApproved(
    recipientEmail: string,
    applicantName: string,
    finalContent: string,
    approverName: string,
    approverRole: string,
    reviewDate: string,
    profileUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
    },
    configService?: ConfigService,
  ) {
    try {
      const emailConfig = configService?.get('email');
      const companyName = emailConfig?.companyName || 'APAC Management System';
      const template = handlebars.compile(htmlStatusApproved);
      const subject = `APAC Mission Statement | Approved | ${applicantName}`;
      const sanitizedReplacements = {
        applicantName,
        finalContent,
        approverName,
        approverRole: transformRole(approverRole),
        reviewDate,
        profileUrl: profileUrl,
        currentYear: new Date().getFullYear(),
        companyName,
        applicantRole: transformRole(additionalData?.applicantRole || ''),
        applicantDepartment: additionalData?.applicantDepartment || '',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(`Mission statement approved sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.log('Failed to send approved email', error);
    }
  }
  /**
   * Send mission statement approved notification to L&D team
   * @param recipientEmail - Email address of the L&D recipient
   * @param applicantName - Name of the applicant
   * @param finalContent - Final approved mission statement content
   * @param approverName - Name of the person who approved the statement
   * @param approverRole - Role of the approver
   * @param reviewDate - Date when the statement was reviewed and approved
   * @param profileUrl - URL to access the profile
   * @param additionalData - Additional information for email template
   * @param additionalData.applicantRole - Role of the applicant
   * @param additionalData.applicantDepartment - Department of the applicant
   * @param configService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when email sending fails
   */
  static async sendMissionStatementApprovedLAndD(
    recipientEmail: string,
    applicantName: string,
    finalContent: string,
    approverName: string,
    approverRole: string,
    reviewDate: string,
    profileUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
    },
    configService?: ConfigService,
  ) {
    try {
      const emailConfig = configService?.get('email');
      const companyName = emailConfig?.companyName || 'APAC Management System';
      const template = handlebars.compile(htmlStatusApprovedLAndD);
      const subject = `APAC Mission Statement | Approved | ${applicantName}`;
      const sanitizedReplacements = {
        applicantName,
        finalContent,
        approverName,
        approverRole: transformRole(approverRole),
        reviewDate,
        profileUrl: profileUrl,
        currentYear: new Date().getFullYear(),
        companyName,
        applicantRole: transformRole(additionalData?.applicantRole || ''),
        applicantDepartment: additionalData?.applicantDepartment || '',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(`Mission statement approved record sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.log('Failed to send approved record email', error);
    }
  }
  /**
   * Send mission statement changes required notification to applicant
   * @param recipientEmail - Email address of the applicant
   * @param applicantName - Name of the applicant
   * @param finalContent - Current mission statement content
   * @param reviewerFeedback - Feedback and suggested changes from reviewer
   * @param approverName - Name of the person who reviewed the statement
   * @param approverRole - Role of the reviewer
   * @param reviewDate - Date when the statement was reviewed
   * @param profileUrl - URL to access the profile
   * @param additionalData - Additional information for email template
   * @param additionalData.applicantRole - Role of the applicant
   * @param additionalData.applicantDepartment - Department of the applicant
   * @param configService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when email sending fails
   */
  static async sendMissionStatementSuggestChanges(
    recipientEmail: string,
    applicantName: string,
    finalContent: string,
    reviewerFeedback: string,
    approverName: string,
    approverRole: string,
    reviewDate: string,
    profileUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
    },
    configService?: ConfigService,
  ) {
    try {
      const emailConfig = configService?.get('email');
      const companyName = emailConfig?.companyName || 'APAC Management System';
      const template = handlebars.compile(htmlStatusSuggestChanges);
      const subject = `APAC Mission Statement | Requires Changes | ${applicantName}`;
      const sanitizedReplacements = {
        applicantName,
        finalContent,
        reviewerFeedback,
        approverName,
        approverRole: transformRole(approverRole),
        reviewDate,
        profileUrl: profileUrl,
        currentYear: new Date().getFullYear(),
        companyName,
        applicantRole: transformRole(additionalData?.applicantRole || ''),
        applicantDepartment: additionalData?.applicantDepartment || '',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(`Mission statement suggest changes sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.log('Failed to send suggest changes email', error);
    }
  }
  /**
   * Send mission statement changes required notification to L&D team
   * @param recipientEmail - Email address of the L&D recipient
   * @param applicantName - Name of the applicant
   * @param finalContent - Current mission statement content
   * @param reviewerFeedback - Feedback and suggested changes from reviewer
   * @param approverName - Name of the person who reviewed the statement
   * @param approverRole - Role of the reviewer
   * @param reviewDate - Date when the statement was reviewed
   * @param profileUrl - URL to access the profile
   * @param additionalData - Additional information for email template
   * @param additionalData.applicantRole - Role of the applicant
   * @param additionalData.applicantDepartment - Department of the applicant
   * @param configService - Configuration service for email settings
   * @returns Promise<void>
   * @throws Error when email sending fails
   */
  static async sendMissionStatementSuggestChangesLAndD(
    recipientEmail: string,
    applicantName: string,
    finalContent: string,
    reviewerFeedback: string,
    approverName: string,
    approverRole: string,
    reviewDate: string,
    profileUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
    },
    configService?: ConfigService,
  ) {
    try {
      const emailConfig = configService?.get('email');
      const companyName = emailConfig?.companyName || 'APAC Management System';
      const template = handlebars.compile(htmlStatusSuggestChangesLAndD);
      const subject = `APAC Mission Statement | Requires Changes | ${applicantName}`;
      const sanitizedReplacements = {
        applicantName,
        finalContent,
        reviewerFeedback,
        approverName,
        approverRole: transformRole(approverRole),
        reviewDate,
        profileUrl: profileUrl,
        currentYear: new Date().getFullYear(),
        companyName,
        applicantRole: transformRole(additionalData?.applicantRole || ''),
        applicantDepartment: additionalData?.applicantDepartment || '',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(
        `Mission statement suggest changes record sent to ${recipientEmail} ${approverName}`,
      );
    } catch (error) {
      this.logger.log('Failed to send suggest changes record email', error);
    }
  }
}
