import { Injectable } from '@nestjs/common';

/**
 * Helper class for password strength validation and security policies
 */
@Injectable()
export class PasswordStrengthHelper {
  /**
   * Password validation configuration
   */
  static readonly PASSWORD_POLICY = {
    minLength: 8,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
    maxConsecutiveChars: 2,
    preventCommonPasswords: false,
  };

  /**
   * List of common passwords to prevent
   */
  private static readonly COMMON_PASSWORDS = [
    'password',
    '123456',
    '123456789',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    '1234567890',
    'password1',
    'qwerty123',
    'admin123',
    'root',
    'toor',
  ];

  /**
   * Validates password strength against security policies
   * @param password - Password to validate
   * @returns Validation result with isValid flag and errors array
   */
  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.PASSWORD_POLICY;

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    if (
      policy.maxConsecutiveChars &&
      this.hasConsecutiveChars(password, policy.maxConsecutiveChars)
    ) {
      errors.push(
        `Password cannot contain more than ${policy.maxConsecutiveChars} consecutive identical characters`,
      );
    }

    if (policy.preventCommonPasswords && this.isCommonPassword(password)) {
      errors.push('Password is too common and easily guessable');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks if password contains consecutive characters
   * @param password - Password to check
   * @param maxAllowed - Maximum allowed consecutive characters
   * @returns True if consecutive characters exceed limit
   */
  private static hasConsecutiveChars(password: string, maxAllowed: number): boolean {
    for (let i = 0; i < password.length - maxAllowed; i++) {
      const char = password[i];
      let consecutiveCount = 1;

      for (let j = i + 1; j < password.length; j++) {
        if (password[j] === char) {
          consecutiveCount++;
          if (consecutiveCount > maxAllowed) {
            return true;
          }
        } else {
          break;
        }
      }
    }
    return false;
  }

  /**
   * Checks if password is in the common passwords list
   * @param password - Password to check
   * @returns True if password is common
   */
  private static isCommonPassword(password: string): boolean {
    const lowerPassword = password.toLowerCase();
    return this.COMMON_PASSWORDS.some(
      common => lowerPassword.includes(common) || common.includes(lowerPassword),
    );
  }

  /**
   * Generates a strong password based on security policies
   * @param length - Desired password length (minimum 8)
   * @returns Generated strong password
   */
  static generateStrongPassword(length: number = 12): string {
    if (length < this.PASSWORD_POLICY.minLength) {
      length = this.PASSWORD_POLICY.minLength;
    }

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*(),.?":{}|<>';
    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = '';

    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
