import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

import { USER } from '../../types/constants/error-messages.constants';
import { Permissions } from '../../types/enums/permissions.enum';
import { Role } from '../../types/enums/role.enums';
import { CombinedUserProfile } from '../../types/interfaces/user.interface';
export class InputValidation {
  /**
   * Validate email format and return normalized email
   * @param email - Email address to validate
   * @returns Normalized email in lowercase
   * @throws HttpException if email is invalid or missing
   */
  static validateEmail(email: string): string {
    if (!email) {
      throw new HttpException(USER.EMAIL_REQUIRED, HttpStatus.OK);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException(USER.INVALID_EMAIL, HttpStatus.OK);
    }
    return email.toLowerCase().trim();
  }
  /**
   * Validate user role and permissions
   * @param role - Role to validate
   * @param creatorRole - Role of the user creating this role (optional)
   * @returns Validated role
   * @throws HttpException if role is invalid or creation not permitted
   */
  static validateRole(role: string, creatorRole?: string): any {
    if (!role) {
      throw new HttpException(USER.ROLE_REQUIRED, HttpStatus.OK);
    }
    if (role === Role.SUPER_ADMIN && creatorRole !== Role.SUPER_ADMIN) {
      throw new HttpException(USER.FORBIDDEN_SUPER_ADMIN_CREATION, HttpStatus.OK);
    }
    return role;
  }

  /**
   * Validate user status
   * @param status - Status to validate
   * @returns Validated status
   * @throws HttpException if status is invalid
   */
  static validateStatus(status: string): any {
    if (status && !Object.values(status).includes(status)) {
      throw new HttpException(USER.INVALID_STATUS, HttpStatus.OK);
    }
    return status;
  }

  /**
   * Validate name format and length
   * @param name - Name to validate
   * @param fieldName - Field name for error messages
   * @returns Trimmed name
   * @throws HttpException if name is invalid or too long
   */
  static validateName(name: string, fieldName: string): string {
    if (!name || name.trim().length === 0) {
      throw new HttpException(USER.FIRST_NAME_INVALID, HttpStatus.OK);
    }
    if (name.length > 100) {
      throw new HttpException(USER.FIRST_NAME_LENGTH_EXCEEDED, HttpStatus.OK);
    }
    const nameRegex = /^[a-zA-Z\s\-'.]+$/;
    if (!nameRegex.test(name.trim())) {
      throw new HttpException(USER.FIRST_NAME_LENGTH_EXCEEDED, HttpStatus.OK);
    }
    return name.trim();
  }

  /**
   * Validate user permissions for adding/updating users
   * @param creator - User profile to check permissions for
   * @throws NotFoundException if creator not found
   * @throws HttpException if insufficient permissions
   */
  static validatePermissions(creator: CombinedUserProfile): void {
    if (!creator) {
      throw new NotFoundException(USER.NOT_FOUND);
    }
    const creatorPermissions = creator.permissions || [];
    const hasAddUserPermission = creatorPermissions.includes(Permissions.CAN_ADD_USER);
    const hasUpdateUserPermission = creatorPermissions.includes(Permissions.CAN_UPDATE_USER);
    if (!hasAddUserPermission && !hasUpdateUserPermission) {
      throw new HttpException(USER.UNAUTHORIZED_ACCESS, HttpStatus.OK);
    }
  }

  /**
   * Validate create user DTO data
   * @param createUserDto - User creation data
   * @throws HttpException if validation fails
   */
  static validateCreateUser(createUserDto: any): void {
    if (!createUserDto) {
      throw new HttpException(USER.INVALID_DATA, HttpStatus.OK);
    }
    const { email, firstName, lastName, role } = createUserDto;
    this.validateEmail(email);
    this.validateName(firstName, 'First name');
    this.validateName(lastName, 'Last name');
    this.validateRole(role);
  }

  /**
   * Validate update user DTO data
   * @param updateUserDto - User update data
   * @throws HttpException if validation fails
   */
  static validateUpdateDto(updateUserDto: any): void {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new HttpException(USER.UPDATE_FAILED, HttpStatus.OK);
    }
    if (updateUserDto.email) {
      this.validateEmail(updateUserDto.email);
    }
    if (updateUserDto.role) {
      this.validateRole(updateUserDto.role);
    }
    if (updateUserDto.status) {
      this.validateStatus(updateUserDto.status);
    }
    if (updateUserDto.firstName) {
      this.validateName(updateUserDto.firstName, 'First name');
    }
    if (updateUserDto.lastName) {
      this.validateName(updateUserDto.lastName, 'Last name');
    }
  }
}
