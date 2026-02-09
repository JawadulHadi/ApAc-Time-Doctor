import { Injectable, Logger } from '@nestjs/common';
import handlebars from 'handlebars';

import { DateHelper } from '../../../shared/helpers/format-Dates.helper';
import { Mail } from '../../../shared/utils/email.utils';
import { CamelCase, transformRole } from '../../../shared/utils/unified-transform.utils';
import {
  htmlSuccessIndicatorAdded,
  htmlSuccessIndicatorDeleted,
  htmlSuccessIndicatorDuplicated,
  htmlSuccessIndicatorMoved,
} from '../../../types/constants/emails/success-indicators-emails.constants';
@Injectable()
export class EmailIndicatorTemplatesService {
  static logger = new Logger(EmailIndicatorTemplatesService.name);
  static async sendSuccessIndicatorsAdded(
    recipientEmail: string,
    recipientName: string,
    employeeName: string,
    indicators: any[],
    indicatorsUrl: string,
    additionalData?: {
      employeeRole?: string;
      quarter?: string;
      year?: string;
      addedByName?: string;
      addedByRole?: string;
      dateAdded?: string;
      newIndicatorsCount?: number;
      indicatorsList?: any[];
    },
  ) {
    try {
      const template = handlebars.compile(htmlSuccessIndicatorAdded);
      const subject = `APAC Success Indicators Added: ${employeeName}`;
      const sanitizedReplacements = {
        recipientName,
        employeeName,
        employeeRole: CamelCase(additionalData?.employeeRole || ''),
        quarter: additionalData?.quarter || '',
        year: additionalData?.year || new Date().getFullYear(),
        addedByName: additionalData?.addedByName || '',
        addedByRole: CamelCase(additionalData?.addedByRole || ''),
        dateAdded:
          additionalData?.dateAdded || DateHelper.Dates([new Date().toDateString()]).individual,
        newIndicatorsCount: additionalData?.newIndicatorsCount || 0,
        indicatorsList: additionalData?.indicatorsList || [],
        indicatorsUrl: indicatorsUrl,
        currentYear: new Date().getFullYear(),
        companyName: 'APAC Management System',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(
        `Success indicators added email sent to ${recipientEmail} for ${employeeName}`,
      );
    } catch (error) {
      this.logger.error('Failed to send success indicators added email', error);
    }
  }
  static async sendSuccessIndicatorsMoved(
    recipientEmail: string,
    recipientName: string,
    employeeName: string,
    indicators: any[],
    indicatorsUrl: string,
    additionalData?: {
      employeeRole?: string;
      fromQuarter?: string;
      toQuarter?: string;
      year?: string;
      movedByName?: string;
      movedByRole?: string;
      dateMoved?: string;
      movedIndicatorsCount?: number;
      movedIndicatorsList?: any[];
    },
  ) {
    try {
      const template = handlebars.compile(htmlSuccessIndicatorMoved);
      const subject = `APAC Success Indicators Moved: ${employeeName}`;
      const sanitizedReplacements = {
        recipientName,
        employeeName,
        employeeRole: CamelCase(additionalData?.employeeRole || ''),
        fromQuarter: additionalData?.fromQuarter || '',
        toQuarter: additionalData?.toQuarter || '',
        year: additionalData?.year || new Date().getFullYear(),
        movedByName: additionalData?.movedByName || '',
        movedByRole: CamelCase(additionalData?.movedByRole || ''),
        dateMoved:
          additionalData?.dateMoved || DateHelper.Dates([new Date().toDateString()]).individual,
        movedIndicatorsCount: additionalData?.movedIndicatorsCount || 0,
        movedIndicatorsList: additionalData?.movedIndicatorsList || [],
        indicatorsUrl: indicatorsUrl,
        currentYear: new Date().getFullYear(),
        companyName: 'APAC Management System',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(
        `Success indicators moved email sent to ${recipientEmail} for ${employeeName}`,
      );
    } catch (error) {
      this.logger.error('Failed to send success indicators moved email', error);
    }
  }
  static async sendSuccessIndicatorsDeleted(
    recipientEmail: string,
    recipientName: string,
    employeeName: string,
    indicators: any[],
    indicatorsUrl: string,
    additionalData?: {
      employeeRole?: string;
      quarter?: string;
      year?: string;
      deletedByName?: string;
      deletedByRole?: string;
      dateDeleted?: string;
      deletedIndicatorsCount?: number;
      deletedIndicatorsList?: any[];
    },
  ) {
    try {
      const template = handlebars.compile(htmlSuccessIndicatorDeleted);
      const subject = `APAC Success Indicators Deleted: ${employeeName}`;
      const sanitizedReplacements = {
        recipientName,
        employeeName,
        employeeRole: CamelCase(additionalData?.employeeRole || ''),
        quarter: additionalData?.quarter || '',
        year: additionalData?.year || new Date().getFullYear(),
        deletedByName: additionalData?.deletedByName || '',
        deletedByRole: CamelCase(additionalData?.deletedByRole || ''),
        dateDeleted:
          additionalData?.dateDeleted || DateHelper.Dates([new Date().toDateString()]).individual,
        deletedIndicatorsCount: additionalData?.deletedIndicatorsCount || 0,
        deletedIndicatorsList: additionalData?.deletedIndicatorsList || [],
        indicatorsUrl: indicatorsUrl,
        currentYear: new Date().getFullYear(),
        companyName: 'APAC Management System',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(
        `Success indicators deleted email sent to ${recipientEmail} for ${employeeName}`,
      );
    } catch (error) {
      this.logger.error('Failed to send success indicators deleted email', error);
    }
  }
  static async sendSuccessIndicatorsDuplicated(
    recipientEmail: string,
    recipientName: string,
    employeeName: string,
    indicators: any[],
    indicatorsUrl: string,
    additionalData?: {
      employeeRole?: string;
      fromQuarter?: string;
      toQuarter?: string;
      year?: string;
      duplicatedByName?: string;
      duplicatedByRole?: string;
      dateDuplicated?: string;
      duplicatedIndicatorsCount?: number;
      originalIndicatorsList?: any[];
      duplicatedIndicatorsList?: any[];
    },
  ) {
    try {
      const template = handlebars.compile(htmlSuccessIndicatorDuplicated);
      const subject = `APAC Success Indicators Duplicated: ${employeeName}`;
      const sanitizedReplacements = {
        recipientName,
        employeeName,
        employeeRole: CamelCase(additionalData?.employeeRole || ''),
        fromQuarter: additionalData?.fromQuarter || '',
        toQuarter: additionalData?.toQuarter || '',
        year: additionalData?.year || new Date().getFullYear(),
        duplicatedByName: additionalData?.duplicatedByName || '',
        duplicatedByRole: CamelCase(additionalData?.duplicatedByRole || ''),
        dateDuplicated:
          additionalData?.dateDuplicated ||
          DateHelper.Dates([new Date().toDateString()]).individual,
        duplicatedIndicatorsCount: additionalData?.duplicatedIndicatorsCount || 0,
        originalIndicatorsList: additionalData?.originalIndicatorsList || [],
        duplicatedIndicatorsList: additionalData?.duplicatedIndicatorsList || [],
        indicatorsUrl: indicatorsUrl,
        currentYear: new Date().getFullYear(),
        companyName: 'APAC Management System',
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(
        `Success indicators duplicated email sent to ${recipientEmail} for ${employeeName}`,
      );
    } catch (error) {
      this.logger.error('Failed to send success indicators duplicated email', error);
    }
  }
  static async sendSuccessIndicatorsSubmitted(
    recipientEmail: string,
    recipientName: string,
    applicantName: string,
    indicators: any[],
    indicatorsUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
      submissionDate?: string;
      assignerName?: string;
      assignerRole?: string;
    },
  ) {
    return this.sendSuccessIndicatorsAdded(
      recipientEmail,
      recipientName,
      applicantName,
      indicators,
      indicatorsUrl,
      {
        employeeRole: additionalData?.applicantRole,
        addedByName: additionalData?.assignerName,
        addedByRole: additionalData?.assignerRole,
        dateAdded: additionalData?.submissionDate,
        newIndicatorsCount: Array.isArray(indicators) ? indicators.length : 0,
        indicatorsList: indicators,
      },
    );
  }
  static async sendSuccessIndicatorsTeamNotification(
    recipientEmail: string,
    recipientName: string,
    applicantName: string,
    indicators: any[],
    indicatorsUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
      submissionDate?: string;
      assignerName?: string;
      assignerRole?: string;
    },
  ) {
    return this.sendSuccessIndicatorsAdded(
      recipientEmail,
      recipientName,
      applicantName,
      indicators,
      indicatorsUrl,
      {
        employeeRole: additionalData?.applicantRole,
        addedByName: additionalData?.assignerName,
        addedByRole: additionalData?.assignerRole,
        dateAdded: additionalData?.submissionDate,
        newIndicatorsCount: Array.isArray(indicators) ? indicators.length : 0,
        indicatorsList: indicators,
      },
    );
  }
  static async sendSuccessIndicatorsUpdated(
    recipientEmail: string,
    recipientName: string,
    applicantName: string,
    indicators: any[],
    updatedQuarters: number[],
    indicatorsUrl: string,
    additionalData?: {
      applicantRole?: string;
      applicantDepartment?: string;
      updateDate?: string;
      assignerName?: string;
      assignerRole?: string;
    },
  ) {
    return this.sendSuccessIndicatorsMoved(
      recipientEmail,
      recipientName,
      applicantName,
      indicators,
      indicatorsUrl,
      {
        employeeRole: additionalData?.applicantRole,
        movedByName: additionalData?.assignerName,
        movedByRole: additionalData?.assignerRole,
        dateMoved: additionalData?.updateDate,
        movedIndicatorsCount: Array.isArray(indicators) ? indicators.length : 0,
        movedIndicatorsList: indicators,
        fromQuarter: updatedQuarters[0]?.toString() || '',
        toQuarter: updatedQuarters[updatedQuarters.length - 1]?.toString() || '',
      },
    );
  }
  static async sendSuccessIndicatorsNotification(
    recipientEmail: string,
    recipientName: string,
    applicantName: string,
    indicators: any[],
    statementUrl: string,
    additionalData?: {
      applicantRole?: string;
      indicatorAction?: string;
      actionBy?: string;
      actionByRole?: string;
      date?: string;
      count?: number;
      details?: any[];
    },
  ) {
    try {
      const action = additionalData?.indicatorAction || 'updated';
      const subject = `APAC Success Indicators ${action.charAt(0).toUpperCase() + action.slice(1)}: ${applicantName}`;
      let template;
      if (action === 'added') {
        template = handlebars.compile(htmlSuccessIndicatorAdded);
      } else if (action === 'moved') {
        template = handlebars.compile(htmlSuccessIndicatorMoved);
      } else if (action === 'deleted') {
        template = handlebars.compile(htmlSuccessIndicatorDeleted);
      } else if (action === 'duplicated') {
        template = handlebars.compile(htmlSuccessIndicatorDuplicated);
      } else {
        template = handlebars.compile(htmlSuccessIndicatorAdded);
      }
      const sanitizedReplacements = {
        recipientName,
        employeeName: applicantName,
        employeeRole: transformRole(additionalData?.applicantRole || ''),
        indicatorsUrl: statementUrl,
        currentYear: new Date().getFullYear(),
        companyName: 'APAC Management System',

        quarter: additionalData?.details?.[0]?.quarter || '',
        year: new Date().getFullYear().toString(),
        addedByName: additionalData?.actionBy || '',
        addedByRole: transformRole(additionalData?.actionByRole || ''),
        dateAdded: additionalData?.date || DateHelper.Dates([new Date().toDateString()]).individual,
        newIndicatorsCount: additionalData?.count || 0,
        indicatorsList: additionalData?.details || [],
      };
      const htmlToSend = template(sanitizedReplacements);
      const mail = new Mail(recipientEmail, subject, subject, htmlToSend);
      mail.sendMail();
      this.logger.log(`Success indicators ${action} notification sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send success indicators ${additionalData?.indicatorAction} email`,
        error,
      );
    }
  }
}
