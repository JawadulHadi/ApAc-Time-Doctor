import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { LeaveBankEmailService } from '../../../services/email/leave-bank/leave-bank-email.service';
import { ATTENDANCE } from '../../../types/constants/error-messages.constants';
import { IBaseUrl, ILeaveBankTag } from '../../../types/constants/url-tags.constants';
import {
  IBatchUserProfilesResult,
  ILeaveBankFilter,
  ILeaveBankSort,
} from '../../../types/interfaces/leave-bank.interface';
import { LeaveBankRepository } from '../leave-bank.repository';
@Injectable()
export class LeaveBankActionHelper {
  constructor(
    private readonly leaveBankRepository: LeaveBankRepository,
    private readonly leaveBankEmailService: LeaveBankEmailService,
  ) {}
  async processAction(
    record: any,
    geUsersBank: (
      filters: ILeaveBankFilter,
      sort: ILeaveBankSort,
      month?: string,
    ) => Promise<IBatchUserProfilesResult>,
    baseUrl?: string,
    month?: string,
    year?: string,
  ): Promise<{ message: string; data?: any }> {
    try {
      const emailResult = await this.leaveBankEmailService.emailToEmployee(
        record.employeeId,
        [record],
        baseUrl || IBaseUrl + ILeaveBankTag,
        month,
        year,
      );
      const updateData = this.prepareNotificationUpdateData(true);
      const updatedRecord = await this.leaveBankRepository.updateAndReturn(
        record._id.toString(),
        updateData,
      );
      if (!updatedRecord) {
        throw new HttpException(
          `${ATTENDANCE.UPDATE_FAILED}: Failed to update notification status`,
          HttpStatus.OK,
        );
      }
      const transformedRecord = await this.fetchTransformedRecord(
        record.employeeId,
        geUsersBank,
        month,
      );
      return {
        message: `Email sent successfully to ${record.name}${month ? ` for ${month}` : ''}`,
        data: {
          emailResult,
          updatedRecord: transformedRecord,
        },
      };
    } catch (error) {
      if (error instanceof HttpException || error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`${ATTENDANCE.UPDATE_FAILED}: ${error.message}`, HttpStatus.OK);
    }
  }
  async processCancelAction(
    record: any,
    geUsersBank: (
      filters: ILeaveBankFilter,
      sort: ILeaveBankSort,
      month?: string,
    ) => Promise<IBatchUserProfilesResult>,
    month?: string,
  ): Promise<{ message: string; data?: any }> {
    try {
      const updateData = this.prepareNotificationUpdateData(false);
      await this.leaveBankRepository.updateById(record._id.toString(), updateData);
      const transformedRecord = await this.fetchTransformedRecord(
        record.employeeId,
        geUsersBank,
        month,
      );
      return {
        message: `Action cancelled for ${record.name}${month ? ` for ${month}` : ''}`,
        data: {
          updatedRecord: transformedRecord,
        },
      };
    } catch (error) {
      if (error instanceof HttpException || error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Failed to process cancellation: ${error.message}`, HttpStatus.OK);
    }
  }
  private prepareNotificationUpdateData(isEmailAction: boolean): any {
    const baseData = {
      isNewRecord: false,
      isUpdatedRecord: false,
      discrepancyResolved: true,
      updatedAt: new Date(),
    };
    if (isEmailAction) {
      return {
        ...baseData,
        notified: true,
        lastNotifiedDate: new Date(),
      };
    } else {
      return {
        ...baseData,
        notified: false,
        cancellationDate: new Date(),
      };
    }
  }
  private async fetchTransformedRecord(
    employeeId: string,
    geUsersBank: (
      filters: ILeaveBankFilter,
      sort: ILeaveBankSort,
      month?: string,
    ) => Promise<IBatchUserProfilesResult>,
    month?: string,
  ): Promise<any> {
    const filters = { employeeId };
    const freshUserBankResult = await geUsersBank(filters, { year: -1 }, month);
    if (!freshUserBankResult.records || freshUserBankResult.records.length === 0) {
      throw new HttpException(
        `${ATTENDANCE.FETCH_ALL_FAILED}: No records found for employee ${employeeId}`,
        HttpStatus.OK,
      );
    }
    return freshUserBankResult.records[0];
  }
}
