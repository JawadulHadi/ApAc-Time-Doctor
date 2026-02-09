import { Logger } from '@nestjs/common';
import handlebars from 'handlebars';

import { Mail } from '../../../shared/utils/email.utils';
import {
  htmlAdminApproval,
  htmlRequesterApproval,
  htmlTLApproval,
} from '../../../types/constants/emails/request-approval-emails.constants';
import {
  htmlAdminDisapproval,
  htmlRequesterDisapproved,
  htmlTLRejection,
} from '../../../types/constants/emails/request-disapproval-emails.constants';
import {
  htmlHrRemarks,
  htmlSaAddRequest,
} from '../../../types/constants/emails/request-remarks-emails.constants';
import {
  htmlCooAddRequest,
  htmlRequestAcknowledgment,
  htmlTLAddRequest,
} from '../../../types/constants/emails/request-submission-emails.constants';
import {
  htmlAdminWithdrawn,
  htmlRequesterWithdrawn,
  htmlTLWithdrawn,
} from '../../../types/constants/emails/request-withdrawal-emails.constants';
import { EMAIL_ERROR } from '../../../types/constants/error-messages.constants';
export class EmailRequestTemplatesService {
  static sendRequestAcknowledgment(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlRequestAcknowledgment);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.applicantFirstName,
        applicantDepartment: sanitizedReplacements.applicantDepartment,
        applicantRole: sanitizedReplacements.applicantRole,
      });
      const mail = new Mail(
        sanitizedReplacements.applicantEmail,
        `Request Received - ${sanitizedReplacements.requestType} Request`,
        'Request Received Successfully',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Requester', error);
    }
  }
  static sendRequestTl(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlTLAddRequest);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.teamLeadFullName,
        applicantDepartment: sanitizedReplacements.applicantDepartment,
        applicantRole: sanitizedReplacements.applicantRole,
      });
      const mail = new Mail(
        sanitizedReplacements.teamLeadEmail,
        `Review Required - ${sanitizedReplacements.applicantFirstName} - ${sanitizedReplacements.requestType} Request`,
        'Review Required For Request',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Team Lead', error);
    }
  }
  static sendRequestCoo(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlCooAddRequest);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.cooFullName,
      });
      const mail = new Mail(
        sanitizedReplacements.cooEmail,
        `Review Required - ${sanitizedReplacements.applicantFirstName} - ${sanitizedReplacements.requestType} Request`,
        'Request requires review',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Chief Operating Officer', error);
    }
  }
  static sendRequestSa(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlSaAddRequest);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.superAdminFullName,
      });
      const mail = new Mail(
        sanitizedReplacements.superAdminEmail,
        `Review Required - ${sanitizedReplacements.applicantFirstName} - ${sanitizedReplacements.requestType} Request`,
        'Request requires review',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Administrator Department', error);
    }
  }
  static sendApprovalRequester(sanitizedReplacements: any): void {
    try {
      if (!sanitizedReplacements.applicantEmail) {
        Logger.warn('No applicant email provided, skipping approval email');
        return;
      }
      if (!sanitizedReplacements.applicantFullName) {
        Logger.warn('No applicant full name provided for requester email');
      }
      const template = handlebars.compile(htmlRequesterApproval);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipients: sanitizedReplacements.applicantFullName,
        applicantDepartment: sanitizedReplacements.applicantDepartment || 'Not specified',
        teamLeadFullName: sanitizedReplacements.teamLeadFullName || 'Not assigned',
      });
      const mail = new Mail(
        sanitizedReplacements.applicantEmail,
        `Request Approved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Your request has been approved',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Requester', error);
    }
  }
  static sendApprovalTL(sanitizedReplacements: any): void {
    try {
      if (!sanitizedReplacements.teamLeadEmail) {
        Logger.warn('No team lead email provided, skipping team lead approval email');
        return;
      }
      if (!sanitizedReplacements.applicantFullName) {
        Logger.warn('No applicant full name provided for team lead email');
      }
      const template = handlebars.compile(htmlTLApproval);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName:
          sanitizedReplacements.teamLeadFullName || sanitizedReplacements.tLName || 'Team Lead',
        applicantFullName: sanitizedReplacements.applicantFullName || 'Team Member',
        applicantDepartment: sanitizedReplacements.applicantDepartment || 'Not specified',
        teamLeadFullName: sanitizedReplacements.teamLeadFullName || 'Team Lead',
      });
      const mail = new Mail(
        sanitizedReplacements.teamLeadEmail,
        `Request Approved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Request Has Been Approved',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Team Lead', error);
    }
  }
  static sendApprovalCoo(sanitizedReplacements: any): void {
    try {
      if (!sanitizedReplacements.cooMail) {
        Logger.warn('No COO email provided, skipping COO approval email');
        return;
      }
      const template = handlebars.compile(htmlTLApproval);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.cooFullName || 'COO',
        applicantFullName: sanitizedReplacements.applicantFullName || 'Employee',
        applicantDepartment: sanitizedReplacements.applicantDepartment || 'Not specified',
        teamLeadFullName: sanitizedReplacements.teamLeadFullName || 'Not assigned',
      });
      const mail = new Mail(
        sanitizedReplacements.cooMail,
        `Request Approved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Executive team member request has been approved',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Chief Operating Officer', error);
    }
  }
  static sendApprovalAdmin(sanitizedReplacements: any): void {
    try {
      if (!sanitizedReplacements.adminMail) {
        Logger.warn('No admin email provided, skipping admin approval email');
        return;
      }
      const template = handlebars.compile(htmlAdminApproval);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.adminName || 'Admin',
        applicantFullName: sanitizedReplacements.applicantFullName || 'Employee',
        applicantDepartment: sanitizedReplacements.applicantDepartment || 'Not specified',
        teamLeadFullName: sanitizedReplacements.teamLeadFullName || 'Not assigned',
      });
      const mail = new Mail(
        sanitizedReplacements.adminMail,
        `Request Approved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'A request has been approved please update your records',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Admin Department', error);
    }
  }
  static sendApprovalSa(sanitizedReplacements: any): void {
    try {
      if (!sanitizedReplacements.superAdminEmail) {
        Logger.warn('No super admin email provided, skipping super admin approval email');
        return;
      }
      const template = handlebars.compile(htmlTLApproval);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.superAdminFullName || 'Super Admin',
        applicantFullName: sanitizedReplacements.applicantFullName || 'Executive',
        applicantDepartment: sanitizedReplacements.applicantDepartment || 'Not specified',
        teamLeadFullName: sanitizedReplacements.teamLeadFullName || 'Not applicable',
      });
      const mail = new Mail(
        sanitizedReplacements.superAdminEmail,
        `Request Approved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Executive request has been approved',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Administrator Department', error);
    }
  }
  static sendRejectionRequester(sanitizedReplacements: any): void {
    try {
      if (!sanitizedReplacements.applicantEmail) {
        Logger.warn(' No applicant email provided, skipping disapproval email');
        return;
      }
      const template = handlebars.compile(htmlRequesterDisapproved);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipients: sanitizedReplacements.applicantFullName || sanitizedReplacements.applicantName,
      });
      const mail = new Mail(
        sanitizedReplacements.applicantEmail,
        `Request Disapproved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Your request has been disapproved',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Requester', error);
      throw error;
    }
  }
  static sendRejectionSa(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlTLRejection);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.superAdminFullName || 'Super Admin',
      });
      const mail = new Mail(
        sanitizedReplacements.superAdminEmail,
        `Request Disapproved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Executive request has been disapproved',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Administrator Department', error);
    }
  }
  static sendRejectionTL(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlTLRejection);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.teamLeadFullName || sanitizedReplacements.tLName,
      });
      const mail = new Mail(
        sanitizedReplacements.teamLeadEmail,
        `Request Disapproved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Team member request has been disapproved',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Team Lead', error);
    }
  }
  static sendRejectionCoo(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlTLRejection);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.cooFullName || sanitizedReplacements.cooName || 'COO',
      });
      const mail = new Mail(
        sanitizedReplacements.cooEmail,
        `Request Disapproved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Executive team member request has been disapproved',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Chief Operating Officer', error);
    }
  }
  static sendRejectionAdmin(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlAdminDisapproval);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.adminName,
      });
      const mail = new Mail(
        sanitizedReplacements.adminEmail,
        `Request Disapproved - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'A request has been disapproved - please update your records',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Admin Department', error);
    }
  }
  static sendWithdrawalRequester(sanitizedReplacements: any): void {
    try {
      if (!sanitizedReplacements.applicantEmail) {
        Logger.warn('No applicant email provided, skipping withdrawal email');
        return;
      }
      const template = handlebars.compile(htmlRequesterWithdrawn);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipients: sanitizedReplacements.applicantFullName || sanitizedReplacements.applicantName,
      });
      const mail = new Mail(
        sanitizedReplacements.applicantEmail,
        `Request Withdrawn - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Your request has been withdrawn',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Requester', error);
      throw error;
    }
  }
  static sendWithdrawalSa(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlTLWithdrawn);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.superAdminFullName || 'Super Admin',
      });
      const mail = new Mail(
        sanitizedReplacements.superAdminEmail,
        `Request Withdrawn - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Executive request has been withdrawn',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Administrator Department', error);
    }
  }
  static sendWithdrawalTL(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlTLWithdrawn);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.teamLeadFullName || sanitizedReplacements.tLName,
      });
      const mail = new Mail(
        sanitizedReplacements.teamLeadEmail,
        `Request Withdrawn - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Team member request has been withdrawn',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Team Lead', error);
    }
  }
  static sendWithdrawalCoo(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlTLWithdrawn);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.cooFullName || sanitizedReplacements.cooName || 'COO',
      });
      const mail = new Mail(
        sanitizedReplacements.cooEmail,
        `Request Withdrawn - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'Executive team member request has been withdrawn',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Chief Operating Officer', error);
    }
  }
  static sendWithdrawalAdmin(sanitizedReplacements: any): void {
    try {
      const template = handlebars.compile(htmlAdminWithdrawn);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.adminName,
      });
      const mail = new Mail(
        sanitizedReplacements.adminEmail,
        `Request Withdrawn - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`,
        'A request has been withdrawn - please update your records',
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'Admin Department', error);
    }
  }
  static sendHRRemarks(sanitizedReplacements: any): void {
    try {
      if (!sanitizedReplacements.hrEmail) {
        Logger.warn(EMAIL_ERROR.NOT_FOUND);
        return;
      }
      const template = handlebars.compile(htmlHrRemarks);
      const htmlToSend = template({
        ...sanitizedReplacements,
        recipientName: sanitizedReplacements.hrFullName || 'HR Team Member',
      });
      const emailSubject = `Remarks Added - ${sanitizedReplacements.applicantFullName} - ${sanitizedReplacements.requestType} Request`;
      const mail = new Mail(
        sanitizedReplacements.hrEmail,
        emailSubject,
        `Remarks have been added to ${sanitizedReplacements.applicantFullName}'s ${sanitizedReplacements.requestType} request`,
        htmlToSend,
      );
      mail.sendMail();
    } catch (error) {
      Logger.error(EMAIL_ERROR.SEND_FAILED + 'HR Department', error);
    }
  }
}
