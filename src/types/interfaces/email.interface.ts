export interface EmailResult {
  successCount: number;
  failedCount: number;
  failedEmails: string[];
  totalProcessed: number;
  message?: string;
}
export interface EmailRecipients {
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  department?: string;
  teamLeadDetails?: any;
  designation?: string;
  role?: string;
  displayRole?: string;
}
export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
export interface EmailResponse {
  status: string;
  message?: string;
}
