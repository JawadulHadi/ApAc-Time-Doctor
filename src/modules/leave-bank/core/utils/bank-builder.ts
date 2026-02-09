import { InputValidation } from '../../../../shared/validators/input.validation';
import { MonthField } from '../../../../types/enums/leave-bank.enums';
import { Role } from '../../../../types/enums/role.enums';
import { UserPayload } from '../../../../types/interfaces/jwt.interface';
export class BankBuilder {
  static buildQuery(
    user?: UserPayload,
    year?: string,
    department?: string,
    employeeId?: string,
    email?: string,
    hasRemainingLeaves?: string,
    month?: string,
    monthField?: MonthField,
    monthMinValue?: string,
    role?: string,
  ): Record<string, any> {
    const filters: Record<string, any> = {};
    if (user) {
      const canViewAll = [Role.SUPER_ADMIN, Role.ADMIN, Role.COO].includes(user.role as Role);
      const isTeamLead = user.role === Role.TEAM_LEAD;
      if (!canViewAll && !isTeamLead) {
        filters.$or = [
          { userId: user._id },
          { profileId: user.profile?._id },
          { employeeId: user.profile?.employeeId },
          { email: user.email },
        ];
      }
    }
    if (month && year && year !== 'all') {
      const yearNum = parseInt(year);
      filters[`monthlyData.${yearNum}.months.${month}`] = { $exists: true };
    }
    if (monthField && monthMinValue && year && year !== 'all') {
      const yearNum = parseInt(year);
      const minValue = parseFloat(monthMinValue);
      filters[`monthlyData.${yearNum}.months.${month}.${monthField}`] = { $gte: minValue };
    }
    if (department && department !== 'all') {
      filters.department = new RegExp(department, 'i');
    }
    if (employeeId) {
      filters.employeeId = new RegExp(employeeId, 'i');
    }
    if (role) {
      filters.role = new RegExp(role, 'i');
    }
    if (email) {
      InputValidation.validateEmail(email);
      filters.email = new RegExp(email, 'i');
    }
    if (hasRemainingLeaves !== undefined && hasRemainingLeaves !== 'all') {
      const hasRemaining = hasRemainingLeaves === 'true';
      const currentYear = new Date().getFullYear().toString();
      const remainingLeavesFilter = hasRemaining
        ? {
            $or: [
              { [`monthlyData.${currentYear}.summary.remainingCL`]: { $gt: 0 } },
              { [`monthlyData.${currentYear}.summary.remainingSL`]: { $gt: 0 } },
            ],
          }
        : {
            $and: [
              { [`monthlyData.${currentYear}.summary.remainingCL`]: { $lte: 0 } },
              { [`monthlyData.${currentYear}.summary.remainingSL`]: { $lte: 0 } },
            ],
          };
      if (filters.$or) {
        filters.$and = [{ $or: filters.$or }, remainingLeavesFilter];
        delete filters.$or;
      } else {
        Object.assign(filters, remainingLeavesFilter);
      }
    }
    return filters;
  }
  static buildSort(sort?: string): Record<string, -1 | 1> {
    const sortCriteria: Record<string, -1 | 1> = { year: -1, createdAt: 1 };
    if (sort) {
      const sortFields = sort.split(',');
      for (const field of sortFields) {
        if (field.startsWith('-')) {
          sortCriteria[field.substring(1)] = 1;
        } else {
          sortCriteria[field] = -1;
        }
      }
    }
    return sortCriteria;
  }
}
