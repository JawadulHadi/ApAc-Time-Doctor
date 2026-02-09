import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { VALIDATION } from '../../types/constants/error-messages.constants';
export class IdValidation {
  static isValidId(id: any): boolean {
    if (!id) return false;
    try {
      const idString = id.toString();
      if (idString.length !== 24) return false;
      const isHexString = /^[0-9a-fA-F]{24}$/.test(idString);
      if (!isHexString) return false;
      const mongoIsValid = Types.ObjectId.isValid(idString);
      return mongoIsValid === true;
    } catch {
      return false;
    }
  }
  static validateId(id: Types.ObjectId | string, fieldName: string = 'ID'): string {
    if (!id) {
      throw new HttpException(VALIDATION.INVALID_OBJECT_ID, HttpStatus.OK);
    }
    const idString = id.toString();
    if (!this.isValidId(idString)) {
      throw new HttpException(VALIDATION.INVALID_COORDINATES, HttpStatus.OK);
    }
    return idString;
  }
  static createId(id: string | Types.ObjectId): Types.ObjectId | any {
    if (!this.isValidId(id)) return null;
    try {
      return typeof id === 'string' ? new Types.ObjectId(id) : id;
    } catch {
      return null;
    }
  }
  static filterIds(ids: any[]): Types.ObjectId[] {
    return ids.map(id => this.createId(id)).filter((id): id is Types.ObjectId => id !== null);
  }
}
