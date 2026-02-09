import { RoleDisplay } from '../../../../shared/utils/role-display.utils';
import { transformRoleEnum } from '../../../../shared/utils/unified-transform.utils';
import { BankHelper } from './bank-helper';
export class BankTransformer {
  static transformDefaultRecords(userDetails: any): any {
    const transformedUser = RoleDisplay.applyRoleDisplay(userDetails);
    const emptyMonthData = BankHelper.emptyMonth();
    return {
      userId: transformedUser.userId,
      profileId: transformedUser.profileId,
      name: transformedUser.name,
      email: transformedUser.email,
      department: transformedUser.department,
      employeeId: transformedUser.employeeId || '',
      role: transformRoleEnum(transformedUser.role),
      displayRole: transformedUser.displayRole,
      originalRole: transformedUser.originalRole,
      isReportingLineUser: transformedUser.isReportingLineUser,
      designation: transformedUser.designation,
      pictureUrl: transformedUser.pictureUrl || '',
      teamLeadDetail: transformedUser.teamLeadDetail,
      monthlyData: { emptyMonthData },
      summary: BankHelper.emptySummary(),
    };
  }
  static transformMonthlyDataForUpdate(monthlyData: any, existingRecord: any): any {
    const updateData: any = {};
    const validMonths = BankHelper.validMonths();
    for (const data of monthlyData) {
      const monthKey = data.month.toLowerCase();
      if (!validMonths.includes(monthKey)) {
        throw new Error(`Invalid month: ${data.month}`);
      }
      updateData[monthKey] = {
        workingDays: data.workingDays ?? existingRecord[monthKey]?.workingDays ?? 0,
        shortHours: data.shortHours ?? existingRecord[monthKey]?.shortHours ?? 0,
        casualLeave: data.casualLeave ?? existingRecord[monthKey]?.casualLeave ?? 0,
        sickLeave: data.sickLeave ?? existingRecord[monthKey]?.sickLeave ?? 0,
        absent: data.absent ?? existingRecord[monthKey]?.absent ?? 0,
        extraHours: data.extraHours ?? existingRecord[monthKey]?.extraHours ?? 0,
        netHoursWorked: data.netHoursWorked ?? existingRecord[monthKey]?.netHoursWorked ?? 0,
      };
    }
    return updateData;
  }
  static transformedUserRecord(record: any): any {
    const cleanRecord = record.toObject ? record.toObject() : { ...record };
    const userObject = {
      ...cleanRecord,
      role: transformRoleEnum(cleanRecord.role || cleanRecord.profile?.role),
      displayRole: cleanRecord.displayRole,
      originalRole: cleanRecord.originalRole,
      isReportingLineUser: cleanRecord.isReportingLineUser,
    };
    const transformedUser = RoleDisplay.applyRoleDisplay(userObject);
    return {
      employeeId: transformedUser.employeeId,
      year: cleanRecord.year?.toString(),
      name: transformedUser.name,
      email: transformedUser.email,
      department: transformedUser.department,
      role: transformedUser.role,
      displayRole: transformedUser.displayRole,
      originalRole: transformedUser.originalRole,
      isReportingLineUser: transformedUser.isReportingLineUser,
      designation: transformedUser.designation,
      isNewRecord: cleanRecord.isNewRecord,
      isUpdatedRecord: cleanRecord.isUpdatedRecord,
      isNewMonthData: cleanRecord.isNewMonthData,
      discrepancyResolved: cleanRecord.discrepancyResolved,
      newlyAddedMonth: cleanRecord.newlyAddedMonth,
      notified: cleanRecord.notified,
      pictureUrl: transformedUser.pictureUrl || '',
      teamLeadDetail: transformedUser.teamLeadDetail,
      recordId: cleanRecord._id,
      userId: transformedUser.userId,
      profileId: transformedUser.profileId,
      lastUploadDate: cleanRecord.lastUploadDate,
      uploadBatchId: cleanRecord.uploadBatchId,
      cancellationDate: cleanRecord.cancellationDate,
      lastNotifiedDate: cleanRecord.lastNotifiedDate,
      createdAt: cleanRecord.createdAt,
      updatedAt: cleanRecord.updatedAt,
      monthlyData: cleanRecord.monthlyData || {},
    };
  }
}
