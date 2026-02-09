import { BadRequestException, Logger } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { RequestDocument } from '../../modules/request/schemas/request.schema';
import { RequestStatus, RequestType } from '../../types/enums/request.enums';

/**
 * RequestValidationHelper - Centralized validation logic for request operations
 *
 * Purpose: Provide reusable validation methods to ensure data integrity
 * and business rule compliance across the request module
 */
export class RequestValidationHelper {
  /**
   * Validate MongoDB ObjectId format
   * @param id - Request ID to validate
   * @throws BadRequestException if ID is invalid
   */
  static validateRequestId(id: string): void {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid request ID format');
    }
  }

  /**
   * Validate user ID format
   * @param userId - User ID to validate
   * @throws BadRequestException if user ID is invalid
   */
  static validateUserId(userId: string | Types.ObjectId): void {
    const id = userId?.toString();
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID format');
    }
  }

  /**
   * Validate that a date is not in the past
   * @param date - Date to validate
   * @returns true if date is today or future, false otherwise
   */
  static validateFutureDate(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj >= today;
  }

  /**
   * Validate dates for a request
   * @param requestedDates - Array of requested dates
   * @param requestType - Type of request
   * @returns Validation result with isValid flag and optional error message
   */
  static validateRequestDates(
    requestedDates: string[],
    requestType: RequestType,
  ): { isValid: boolean; error?: string } {
    if (!requestedDates || requestedDates.length === 0) {
      return { isValid: false, error: 'At least one date must be selected' };
    }

    return { isValid: true };
  }

  /**
   * Check if user already has a request for the given dates
   * @param userId - User ID to check for duplicates
   * @param requestedDates - Array of requested dates
   * @param requestModel - Mongoose model for requests
   * @returns true if duplicate request exists, false otherwise
   */
  static async checkDuplicateRequest(
    userId: string,
    requestedDates: string[],
    requestModel: Model<RequestDocument>,
  ): Promise<boolean> {
    if (!userId || !requestedDates?.length) {
      return false;
    }

    try {
      const existingRequests = await requestModel
        .find({
          user: new Types.ObjectId(userId),
          status: {
            $in: [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.IN_PROCESS],
          },
        })
        .select('requestedDates')
        .lean()
        .exec();

      if (!existingRequests || existingRequests.length === 0) {
        return false;
      }

      const requestedDateSet = new Set(requestedDates.map(d => new Date(d).toISOString()));

      for (const existingRequest of existingRequests) {
        const existingDates = existingRequest.requestedDates || [];
        for (const existingDate of existingDates) {
          if (requestedDateSet.has(new Date(existingDate).toISOString())) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      Logger.error('Error checking duplicate requests:', error);
      return false;
    }
  }

  /**
   * Validate request type
   * @param type - Request type to validate
   * @returns true if valid request type, false otherwise
   */
  static validateRequestType(type: string): boolean {
    return Object.values(RequestType).includes(type as RequestType);
  }

  /**
   * Validate if status transition is allowed
   * @param currentStatus - Current request status
   * @param newStatus - New status to transition to
   * @returns Object with allowed flag and optional reason message
   */
  static canTransitionStatus(
    currentStatus: RequestStatus,
    newStatus: RequestStatus,
  ): { allowed: boolean; reason?: string } {
    const transitions: Record<RequestStatus, RequestStatus[]> = {
      [RequestStatus.PENDING]: [
        RequestStatus.IN_PROCESS,
        RequestStatus.APPROVED,
        RequestStatus.DISAPPROVED,
        RequestStatus.WITHDRAWN,
        RequestStatus.REJECTED,
      ],
      [RequestStatus.IN_PROCESS]: [
        RequestStatus.APPROVED,
        RequestStatus.DISAPPROVED,
        RequestStatus.REJECTED,
      ],
      [RequestStatus.APPROVED]: [RequestStatus.COMPLETED],
      [RequestStatus.DISAPPROVED]: [RequestStatus.COMPLETED],
      [RequestStatus.REJECTED]: [RequestStatus.COMPLETED],
      [RequestStatus.WITHDRAWN]: [RequestStatus.COMPLETED],
      [RequestStatus.COMPLETED]: [],
    };

    const allowedTransitions = transitions[currentStatus] || [];

    if (!allowedTransitions.includes(newStatus)) {
      return {
        allowed: false,
        reason: `Cannot transition from ${currentStatus} to ${newStatus}. This transition is not allowed.`,
      };
    }

    return { allowed: true };
  }

  /**
   * Validate remark content
   * @param remark - Remark text to validate
   * @returns Validation result with valid flag and optional error message
   */
  static validateRemark(remark: string): { valid: boolean; error?: string } {
    if (!remark || remark.trim().length === 0) {
      return { valid: false, error: 'Remark cannot be empty' };
    }

    const trimmedRemark = remark.trim();

    if (trimmedRemark.length > 1000) {
      return { valid: false, error: 'Remark cannot exceed 1000 characters' };
    }

    if (trimmedRemark.length < 1) {
      return { valid: false, error: 'Remark must be at least 1 character' };
    }

    const suspiciousPatterns = [
      /<script[^>]*>/i,
      /javascript:/i,
      /onerror\s*=/i,
      /onclick\s*=/i,
      /onload\s*=/i,
      /<iframe/i,
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(trimmedRemark))) {
      return { valid: false, error: 'Remark contains invalid content' };
    }

    return { valid: true };
  }

  /**
   * Calculate working days between dates (excluding weekends)
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Number of working days
   */
  static calculateWorkingDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }

  /**
   * Validate reason text
   * @param reason - Reason text to validate
   * @returns Validation result with valid flag and optional error message
   */
  static validateReason(reason: string): { valid: boolean; error?: string } {
    if (!reason || reason.trim().length === 0) {
      return { valid: false, error: 'Reason cannot be empty' };
    }

    const trimmedReason = reason.trim();

    if (trimmedReason.length < 1) {
      return { valid: false, error: 'Reason must be at least 1 character' };
    }

    if (trimmedReason.length > 500) {
      return { valid: false, error: 'Reason cannot exceed 500 characters' };
    }

    return { valid: true };
  }

  /**
   * Check if request can be withdrawn
   * @param status - Current request status
   * @returns Object with allowed flag and optional reason message
   */
  static canWithdraw(status: RequestStatus): { allowed: boolean; reason?: string } {
    if (status === RequestStatus.APPROVED) {
      return {
        allowed: false,
        reason: 'Cannot withdraw an approved request. Please contact HR.',
      };
    }

    if (status === RequestStatus.DISAPPROVED) {
      return {
        allowed: false,
        reason: 'Cannot withdraw a disapproved request.',
      };
    }

    if (status === RequestStatus.WITHDRAWN) {
      return {
        allowed: false,
        reason: 'Request is already withdrawn.',
      };
    }

    return { allowed: true };
  }
}
