import { ArgumentMetadata, Injectable, ValidationPipe as NestValidationPipe } from '@nestjs/common';
import { Types } from 'mongoose';
@Injectable()
export class ValidationPipe extends NestValidationPipe {
  protected toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype } = metadata;
    const types: Function[] = [String, Boolean, Number, Array, Object, Types.ObjectId];
    if (metatype && types.includes(metatype)) {
      return false;
    }
    if (metatype?.name === 'ObjectId') {
      return false;
    }
    return super.toValidate(metadata);
  }
  async transform(value: any, metadata: ArgumentMetadata) {
    return super.transform(value, metadata);
  }
}
