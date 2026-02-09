import { System } from '../../types/constants/system.constants';
import { IBaseUrl, IRemarksTag, IRequestTag } from '../../types/constants/url-tags.constants';
import { Requests, RequestStage } from '../../types/enums/request.enums';
import { DisplayRole, Role } from '../../types/enums/role.enums';
import { UserPayload } from '../../types/interfaces/jwt.interface';
import { RoleDisplay } from '../utils/role-display.utils';
import { transformRole } from '../utils/unified-transform.utils';
import { DateHelper } from './format-Dates.helper';
export function creatorRecipients(userRole: string): {
  nextApproverRole: string;
  shouldNotifyTeamLead: boolean;
  shouldNotifyCOO: boolean;
  shouldNotifySuperAdmin: boolean;
  isSelfApproval: boolean;
} {
  const normalizedRole = userRole?.toUpperCase().replace(/\s+/g, '_');
  switch (normalizedRole) {
    case Role.MEMBER:
      return {
        nextApproverRole: Role.TEAM_LEAD,
        shouldNotifyTeamLead: true,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: false,
        isSelfApproval: false,
      };
    case Role.TEAM_LEAD:
    case Role.REPORTING_LINE || DisplayRole.REPORTING_LINE:
      return {
        nextApproverRole: Role.COO,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: true,
        shouldNotifySuperAdmin: false,
        isSelfApproval: false,
      };
    case Role.COO:
      return {
        nextApproverRole: Role.SUPER_ADMIN,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: true,
        isSelfApproval: false,
      };
    default:
      return {
        nextApproverRole: Role.COO,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: true,
        shouldNotifySuperAdmin: false,
        isSelfApproval: false,
      };
  }
}
export function approvalRecipients(
  userRole: string,
  approvedByRole: string,
): {
  shouldNotifyRequester: boolean;
  shouldNotifyTeamLead: boolean;
  shouldNotifyCOO: boolean;
  shouldNotifySuperAdmin: boolean;
  shouldNotifyAdmin: boolean;
} {
  const role = userRole?.toUpperCase();
  const approverRole = approvedByRole?.toUpperCase();
  const shouldNotifyRequester = true;
  const shouldNotifyAdmin = true;
  if (
    (role === Role.TEAM_LEAD || role === Role.REPORTING_LINE) &&
    (approverRole === Role.TEAM_LEAD || approverRole === Role.REPORTING_LINE)
  ) {
    return {
      shouldNotifyRequester,
      shouldNotifyTeamLead: false,
      shouldNotifyCOO: true,
      shouldNotifySuperAdmin: false,
      shouldNotifyAdmin,
    };
  }
  switch (role) {
    case Role.MEMBER:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: true,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: false,
        shouldNotifyAdmin,
      };
    case Role.TEAM_LEAD:
    case Role.REPORTING_LINE:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: true,
        shouldNotifySuperAdmin: false,
        shouldNotifyAdmin,
      };
    case Role.COO:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: true,
        shouldNotifyAdmin,
      };
    default:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: true,
        shouldNotifySuperAdmin: false,
        shouldNotifyAdmin,
      };
  }
}
export function disapprovalRecipients(
  userRole: string,
  disapprovedByRole: string,
): {
  shouldNotifyRequester: boolean;
  shouldNotifyTeamLead: boolean;
  shouldNotifyCOO: boolean;
  shouldNotifySuperAdmin: boolean;
  shouldNotifyAdmin: boolean;
} {
  const role = userRole?.toUpperCase();
  const disapprovalRole = disapprovedByRole?.toUpperCase();
  const shouldNotifyRequester = true;
  if (role === Role.TEAM_LEAD && disapprovalRole === Role.TEAM_LEAD) {
    return {
      shouldNotifyRequester,
      shouldNotifyTeamLead: false,
      shouldNotifyCOO: true,
      shouldNotifySuperAdmin: false,
      shouldNotifyAdmin: true,
    };
  }
  switch (role) {
    case Role.MEMBER:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: true,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: false,
        shouldNotifyAdmin: true,
      };
    case Role.TEAM_LEAD:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: true,
        shouldNotifySuperAdmin: false,
        shouldNotifyAdmin: true,
      };
    case Role.COO:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: true,
        shouldNotifyAdmin: true,
      };
    default:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: true,
        shouldNotifySuperAdmin: false,
        shouldNotifyAdmin: true,
      };
  }
}
export function withdrawalRecipients(
  userRole: string,
  withdrawnByRole: string,
): {
  shouldNotifyRequester: boolean;
  shouldNotifyTeamLead: boolean;
  shouldNotifyCOO: boolean;
  shouldNotifySuperAdmin: boolean;
  shouldNotifyAdmin: boolean;
} {
  const role = userRole?.toUpperCase();
  const withdrawerRole = withdrawnByRole?.toUpperCase();
  const shouldNotifyRequester = true;
  if (
    (role === Role.TEAM_LEAD || role === Role.REPORTING_LINE) &&
    (withdrawerRole === Role.TEAM_LEAD || withdrawerRole === Role.REPORTING_LINE)
  ) {
    return {
      shouldNotifyRequester,
      shouldNotifyTeamLead: false,
      shouldNotifyCOO: true,
      shouldNotifySuperAdmin: false,
      shouldNotifyAdmin: true,
    };
  }
  switch (role) {
    case Role.MEMBER:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: true,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: false,
        shouldNotifyAdmin: true,
      };
    case Role.TEAM_LEAD:
    case Role.REPORTING_LINE:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: true,
        shouldNotifySuperAdmin: false,
        shouldNotifyAdmin: true,
      };
    case Role.COO:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: true,
        shouldNotifyAdmin: true,
      };
    default:
      return {
        shouldNotifyRequester,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: false,
        shouldNotifySuperAdmin: true,
        shouldNotifyAdmin: true,
      };
  }
}
export function validateTemplateVariables(replacements: any): any {
  return {
    ...replacements,
    applicantFullName: replacements.applicantFullName || 'Employee',
    applicantEmail: replacements.applicantEmail,
    applicantDepartment: replacements.applicantDepartment || 'Not specified',
    applicantRole: transformRole(replacements.applicantRole) || 'Employee',
    teamLeadFullName: replacements.teamLeadFullName || 'Team Lead',
    teamLeadEmail: replacements.teamLeadEmail,
    teamLeadRole: transformRole(replacements.teamLeadRole) || 'Team Lead',
    requestType: replacements.requestType || 'Request',
    approverName: replacements.approverName || 'Approver',
    approverRole: transformRole(replacements.approverRole) || 'Approver',
    cooMail: replacements.cooMail,
    cooFullName: replacements.cooFullName || 'COO',
    adminMail: replacements.adminMail,
    adminName: replacements.adminName || 'Admin',
    superAdminEmail: replacements.superAdminEmail,
    superAdminFullName: replacements.superAdminFullName || 'Super Admin',
  };
}
export async function prepareTemplate(
  requestData: any,
  userDetails: any,
  emailExecutives: any,
): Promise<any> {
  const formattedDates = DateHelper.Dates(requestData.requestedDates);
  const actualUser = userDetails.user || userDetails;
  const applicantFirstName: string =
    `${actualUser.profile?.firstName || actualUser.firstName || ''}`.trim();
  const applicantFullName: string =
    actualUser?.fullName || `${actualUser?.profile?.fullName || ''}`.trim();
  const applicantEmail: string = actualUser?.email;
  let approverName = '';
  let approverEmail = '';
  let approverRole = '';
  const isReportingLineUser = RoleDisplay.isReportingLineUser(actualUser);
  const userRole = actualUser?.role?.toUpperCase();
  if (requestData.teamLeadData?.fullName) {
    approverName = requestData.teamLeadData.fullName;
    approverEmail = requestData.teamLeadData.email;
    approverRole =
      requestData.teamLeadData.role ||
      (requestData.currentStage === RequestStage.COO
        ? Role.COO
        : requestData.currentStage === RequestStage.SUPER_ADMIN
          ? Role.SUPER_ADMIN
          : Role.TEAM_LEAD);
    switch (userRole) {
      case Role.MEMBER:
        approverName = actualUser.department?.teamLeadDetail?.fullName || 'Team Lead';
        approverEmail = actualUser.department?.teamLeadDetail?.email;
        approverRole = Role.TEAM_LEAD;
        break;
      case Role.TEAM_LEAD:
      case Role.REPORTING_LINE:
        approverName = emailExecutives.COO?.fullName || System.COO;
        approverEmail = emailExecutives.COO?.email;
        approverRole = Role.COO;
        break;
      case Role.COO:
        approverName = emailExecutives.SUPER_ADMIN?.fullName || System.SUPER_ADMIN;
        approverEmail = emailExecutives.SUPER_ADMIN?.email || System.SUPER_ADMIN_EMAIL;
        approverRole = Role.SUPER_ADMIN;
        break;
      default:
        approverName = emailExecutives.COO?.fullName || System.COO;
        approverEmail = emailExecutives.COO?.email;
        approverRole = Role.COO;
    }
  }
  let teamLeadFullName = '';
  let teamLeadEmail = '';
  let teamLeadRole = '';
  if (userRole === Role.MEMBER) {
    const department = actualUser.department || requestData.department;
    if (department?.teamLeadDetail) {
      teamLeadFullName =
        department.teamLeadDetail.fullName ||
        `${department.teamLeadDetail.firstName || ''} ${department.teamLeadDetail.lastName || ''}`.trim();
      teamLeadEmail = department.teamLeadDetail.email;
      teamLeadRole = RoleDisplay.isReportingLineUser(department.teamLeadDetail)
        ? 'Reporting Line'
        : Role.TEAM_LEAD;
    }
  } else {
    teamLeadFullName = approverName;
    teamLeadEmail = approverEmail;
    teamLeadRole = approverRole;
  }
  if (!teamLeadFullName) {
    const department = actualUser.department || requestData.department;
    if (department?.teamLeadDetail) {
      teamLeadFullName =
        department.teamLeadDetail.fullName ||
        `${department.teamLeadDetail.firstName || ''} ${department.teamLeadDetail.lastName || ''}`.trim();
      teamLeadEmail = department.teamLeadDetail.email;
      teamLeadRole = RoleDisplay.isReportingLineUser(department.teamLeadDetail)
        ? 'Reporting Line'
        : Role.TEAM_LEAD;
    }
  }
  const applicantDepartment = actualUser.department?.name || requestData.department?.name;
  return {
    applicantFullName,
    applicantFirstName,
    applicantEmail,
    applicantRole: transformRole(isReportingLineUser ? 'Reporting Line' : userRole),
    applicantDepartment,
    requestType: Requests(requestData.requestType),
    requestedDates: formattedDates.emailFormat,
    totalDays: requestData.days,
    requestReason: requestData?.reason,
    remarks: requestData?.remarks?.[0]?.remark,
    requestId: requestData._id.toString(),
    approverFullName: approverName,
    approverEmail: approverEmail,
    approverRole: transformRole(approverRole),
    teamLeadFullName: teamLeadFullName,
    teamLeadEmail: teamLeadEmail,
    teamLeadRole: transformRole(teamLeadRole),
    hrFullName: emailExecutives.HR?.fullName,
    hrEmail: emailExecutives.HR?.email,
    cooFullName: emailExecutives.COO?.fullName,
    cooEmail: emailExecutives.COO?.email,
    superAdminFullName: emailExecutives.SUPER_ADMIN?.fullName,
    superAdminEmail: emailExecutives.SUPER_ADMIN?.email,
    adminFullName: emailExecutives.ADMIN?.fullName,
    adminEmail: emailExecutives.ADMIN?.email,
    remarksUrl: IBaseUrl + IRequestTag + `${requestData._id}` + IRemarksTag,
    actionUrl: IBaseUrl + IRequestTag + `${requestData._id}`,
    currentYear: new Date().getFullYear(),
    isReportingLine: isReportingLineUser,
    displayRole: transformRole(actualUser.displayRole) || transformRole(actualUser.role),
    userRole: transformRole(userRole),
    currentStage: requestData.currentStage,
    teamLeadData: requestData.teamLeadData,
  };
}
export async function prepareProcessTemplate(
  requestData: any,
  userDetails: any,
  emailExecutives: any,
  approver: UserPayload,
): Promise<any> {
  const actualUserDetails = userDetails.request?.user || userDetails;
  const baseVariables = await prepareTemplate(requestData, actualUserDetails, emailExecutives);
  const isApproverReportingLine = RoleDisplay.isReportingLineUser(approver);
  const finalApproverRole = isApproverReportingLine ? 'Reporting Line' : approver.role;
  const teamLeadFullName = baseVariables.teamLeadFullName;
  const teamLeadEmail = baseVariables.teamLeadEmail;
  const teamLeadRole = baseVariables.teamLeadRole;
  let applicantDepartment = baseVariables.applicantDepartment;
  if (!applicantDepartment && requestData.department?.name) {
    applicantDepartment = requestData.department.name;
  }
  let applicantFullName = baseVariables.applicantFullName;
  let applicantEmail = baseVariables.applicantEmail;
  if (!applicantFullName && actualUserDetails.fullName) {
    applicantFullName = actualUserDetails.fullName;
  }
  if (!applicantEmail && actualUserDetails.email) {
    applicantEmail = actualUserDetails.email;
  }
  return {
    ...baseVariables,
    applicantFullName: applicantFullName || baseVariables.applicantFullName,
    applicantEmail: applicantEmail || baseVariables.applicantEmail,
    applicantDepartment: applicantDepartment || baseVariables.applicantDepartment,
    approverName: approver.fullName || approver.email,
    approverRole: finalApproverRole,
    approvedDate: new Date().toLocaleDateString(),
    approvedTime: new Date().toLocaleTimeString(),
    finalApproval: requestData.currentStage === RequestStage.COMPLETED,
    currentStage: requestData.currentStage,
    tLName: teamLeadFullName,
    teamLeadFullName: teamLeadFullName,
    teamLeadEmail: teamLeadEmail,
    teamLeadRole: transformRole(teamLeadRole),
    teamMemberName: applicantFullName || baseVariables.applicantFullName,
    actionURL: baseVariables.actionUrl,
    hrMail: baseVariables.hrEmail,
    hrName: baseVariables.hrFullName,
    cooMail: baseVariables.cooEmail,
    cooName: baseVariables.cooFullName,
    adminMail: baseVariables.adminEmail,
    adminName: baseVariables.adminFullName,
    isReportingLineApprover: isApproverReportingLine,
  };
}
export function statementRecipients(submitterRole: string): {
  nextReviewerRole: string;
  shouldNotifyTeamLead: boolean;
  shouldNotifyCOO: boolean;
  shouldNotifyTrainer: boolean;
} {
  const normalizedRole = submitterRole?.toUpperCase().replace(/\s+/g, '_');
  switch (normalizedRole) {
    case Role.MEMBER:
    case DisplayRole.MEMBER:
      return {
        nextReviewerRole: Role.TEAM_LEAD,
        shouldNotifyTeamLead: true,
        shouldNotifyCOO: false,
        shouldNotifyTrainer: true,
      };
    case Role.TEAM_LEAD:
    case DisplayRole.TEAM_LEAD:
    case Role.REPORTING_LINE:
    case DisplayRole.REPORTING_LINE:
    case Role.COO:
    case DisplayRole.COO:
      return {
        nextReviewerRole: Role.TRAINER,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: false,
        shouldNotifyTrainer: false,
      };
    default:
      return {
        nextReviewerRole: Role.TRAINER,
        shouldNotifyTeamLead: false,
        shouldNotifyCOO: false,
        shouldNotifyTrainer: false,
      };
  }
}
export function indicatorsRecipients(
  targetUserRole: string,
  assignerRole: string,
): {
  shouldNotifyTargetUser: boolean;
  shouldNotifyTeamLead: boolean;
  shouldNotifyTrainer: boolean;
  shouldNotifyCOO: boolean;
} {
  const targetRole = targetUserRole?.toUpperCase().replace(/\s+/g, '_');
  const assignerNormalizedRole = assignerRole?.toUpperCase().replace(/\s+/g, '_');
  const shouldNotifyTrainer =
    assignerNormalizedRole !== Role.TRAINER && assignerNormalizedRole !== DisplayRole.TRAINER;
  const shouldNotifyTeamLead =
    (targetRole === Role.MEMBER || targetRole === Role.TEAM_LEAD) &&
    assignerNormalizedRole !== Role.TRAINER &&
    assignerNormalizedRole !== DisplayRole.TRAINER;
  const shouldNotifyCOO =
    ((targetRole === Role.TEAM_LEAD || targetRole === Role.COO) &&
      assignerNormalizedRole === Role.TRAINER) ||
    assignerNormalizedRole === DisplayRole.TRAINER;
  return {
    shouldNotifyTargetUser: true,
    shouldNotifyTeamLead,
    shouldNotifyTrainer,
    shouldNotifyCOO,
  };
}
