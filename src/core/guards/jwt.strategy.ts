import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../modules/user/user.service';
import { AUTH, USER } from '../../types/constants/error-messages.constants';
import { UserStatus } from '../../types/constants/user-status.constants';
import { UserPayload } from '../../types/interfaces/jwt.interface';
import { TransformedProfile } from '../../types/interfaces/profile.interface';
/**
 * JWT Strategy for Passport authentication
 *
 * This strategy validates JWT tokens and extracts user information.
 * It checks user status, verification, and loads complete user details
 * including profile and department information.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }
  /**
   * Validates the JWT payload and returns the user information
   *
   * This method is called by Passport after the JWT is verified.
   * It fetches the full user details and validates the user's status.
   *
   * @param payload - The decoded JWT payload
   * @returns UserPayload with complete user information
   * @throws Error if user is not found, inactive, suspended, or deleted
   */
  async validate(payload: any): Promise<UserPayload> {
    try {
      const userDetails = await this.userService.getUserById(payload.sub);
      if (!userDetails) {
        this.logger.warn(`⚠ User not found in JWT validation: ${payload.sub}`);
        throw new Error(USER.NOT_FOUND);
      }
      if (userDetails.status === UserStatus.INACTIVE) {
        this.logger.warn(`⚠ Inactive user attempted access: ${payload.sub}`);
        throw new Error(USER.INACTIVE);
      }
      if (userDetails.status === UserStatus.SUSPENDED) {
        this.logger.warn(`⚠ Suspended user attempted access: ${payload.sub}`);
        throw new Error(USER.SUSPENDED);
      }
      if (userDetails.status === UserStatus.DISABLED) {
        this.logger.warn(`⚠ Deleted user attempted access: ${payload.sub}`);
        throw new Error(USER.DELETED);
      }
      if (!userDetails.isVerified) {
        this.logger.warn(`⚠ Unverified user attempted access: ${payload.sub}`);
        throw new Error(AUTH.UN_VERIFIED);
      }
      const profile = userDetails.profile
        ? this.transformProfile(userDetails.profile, userDetails._id.toString())
        : undefined;
      const department = userDetails.department
        ? this.transformDepartment(userDetails.department)
        : undefined;
      const userPayload: UserPayload = {
        fullName: profile?.fullName || '',
        _id: userDetails._id.toString(),
        employeeId: profile?.employeeId || '',
        email: userDetails.email,
        role: userDetails.role,
        displayRole: userDetails.displayRole || userDetails.role,
        designation: userDetails.profile?.designation,
        status: userDetails.status,
        cell: userDetails.cell,
        isVerified: userDetails.isVerified,
        profile: profile,
        department: department,
        permissions: userDetails.permissions || [],
      };
      return userPayload;
    } catch (error) {
      this.logger.error(`JWT validation failed: ${error.message}`);
      throw error;
    }
  }
  private transformProfile(profile: any, userId: string): TransformedProfile {
    return {
      employeeId: profile.employeeId || '',
      _id: profile._id?.toString() || new Types.ObjectId().toString(),
      userId: userId,
      fullName: profile.fullName || '',
      email: profile.email || '',
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      designation: profile.designation,
      role: profile.role,
      status: profile.status,
      dateOfBirth: profile.dateOfBirth,
      profilePicture: profile.profilePicture,
      resume: profile.resume,
      idProof: profile.idProof,
      salary: profile.salary,
      documents: profile.documents || [],
      contactNumber: profile.contactNumber,
      emergencyContact: profile.emergencyContact,
      currentAddress: profile.currentAddress,
      permanentAddress: profile.permanentAddress,
      dateOfJoining: profile.dateOfJoining,
      skills: profile.skills || [],
      achievements: profile.achievements || [],
    };
  }
  private transformDepartment(department: any): any {
    if (typeof department === 'string') {
      return {
        _id: department,
        name: '',
        description: '',
        teamLead: null,
        teamLeadDetail: null,
      };
    }
    return {
      _id: department._id?.toString() || new Types.ObjectId().toString(),
      name: department.name || '',
      description: department.description || '',
      teamLead: department.teamLead?.toString() || null,
      teamLeadDetail: department.teamLeadDetail
        ? {
            fullName: department.teamLeadDetail.fullName,
            firstName: department.teamLeadDetail.firstName || '',
            lastName: department.teamLeadDetail.lastName || '',
            designation: department.teamLeadDetail.designation || '',
            email: department.teamLeadDetail.email || '',
            role: department.teamLeadDetail.role || '',
            displayRole: department.teamLeadDetail.displayRole || '',
            userId: department.teamLeadDetail.userId?.toString(),
          }
        : null,
    };
  }
}
