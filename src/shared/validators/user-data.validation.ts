import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { AUTH, DEPARTMENT, PROFILE, USER } from '../../types/constants/error-messages.constants';
import { MAX_ACTIVATION_ATTEMPTS } from '../../types/constants/recruitment.constants';
import { UserStatus } from '../../types/constants/user-status.constants';
import { IdValidation } from './iD.validation';
export class UserValidator {
  static isValidArray(users: any[]): boolean {
    if (!Array.isArray(users)) {
      return false;
    }
    return users.length > 0;
  }
  static validateActive(user: any, code: string): void {
    if (user.status === UserStatus.ACTIVE) {
      throw new HttpException(AUTH.ACCOUNT_ALREADY_ACTIVE, HttpStatus.BAD_REQUEST);
    }
    if (!user.activationCode) {
      throw new HttpException(AUTH.NO_ACTIVATION_CODE, HttpStatus.BAD_REQUEST);
    }
    if (user.activationCodeExpiresAt && new Date() > new Date(user.activationCodeExpiresAt)) {
      throw new HttpException(AUTH.ACTIVATION_CODE_EXPIRED, HttpStatus.BAD_REQUEST);
    }
    if (user.activationAttempts && user.activationAttempts >= MAX_ACTIVATION_ATTEMPTS) {
      throw new HttpException(AUTH.MAX_ACTIVATION_ATTEMPTS_EXCEEDED, HttpStatus.BAD_REQUEST);
    }
    if (user.activationCode.toString().trim() !== code.trim()) {
      throw new HttpException(AUTH.INVALID_CODE, HttpStatus.BAD_REQUEST);
    }
  }
  static UserArray(users: any[]): void {
    if (!users || !Array.isArray(users)) {
      throw new HttpException('Users data must be a valid array', HttpStatus.OK);
    }
    if (users.length === 0) {
      throw new HttpException('No users found for grouping', HttpStatus.OK);
    }
    users.forEach((user, index) => {
      this.validateStructure(user, index);
    });
  }
  static validateStructure(user: any, index?: number): void {
    if (!user || typeof user !== 'object') {
      const context = index !== undefined ? ` at index ${index}` : '';
      throw new HttpException(USER.INVALID_DATA, HttpStatus.BAD_REQUEST);
    }
    if (!user._id) {
      const context = index !== undefined ? ` at index ${index}` : '';
      throw new HttpException(USER.INVALID_ID_FORMAT, HttpStatus.BAD_REQUEST);
    }
    if (!IdValidation.isValidId(user._id)) {
      const context = index !== undefined ? ` at index ${index}` : '';
      throw new HttpException(USER.INVALID_ID_FORMAT, HttpStatus.BAD_REQUEST);
    }
    if (!user.email) {
      const context = index !== undefined ? ` at index ${index}` : '';
      throw new HttpException(USER.EMAIL_CONFLICT, HttpStatus.BAD_REQUEST);
    }
  }
  static validateProfile(profileMap: Map<string, any>): void {
    if (!(profileMap instanceof Map)) {
      throw new HttpException(PROFILE.UPDATE_FAILED, HttpStatus.OK);
    }
  }
  static validateDepartment(departmentMap: Map<string, any>): void {
    if (!(departmentMap instanceof Map)) {
      throw new HttpException(DEPARTMENT.HIERARCHY_INVALID, HttpStatus.OK);
    }
  }
  static extractIds(users: any[]): Types.ObjectId[] {
    this.UserArray(users);
    return users.map(user => {
      this.validateStructure(user);
      return new Types.ObjectId(user._id);
    });
  }
  static extractDepartment(users: any[]): Types.ObjectId[] {
    this.UserArray(users);
    const departmentIds = users
      .map(user => user.department)
      .filter(Boolean)
      .filter(id => IdValidation.isValidId(id))
      .map(id => new Types.ObjectId(id));
    return Array.from(new Set(departmentIds));
  }
}
