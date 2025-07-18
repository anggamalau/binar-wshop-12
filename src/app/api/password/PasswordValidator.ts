import { PasswordUpdateInput, PasswordValidationError } from './types';

export class PasswordValidator {
  private static readonly MIN_PASSWORD_LENGTH = 6;
  private static readonly MAX_PASSWORD_LENGTH = 128;
  private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  static validate(input: PasswordUpdateInput): PasswordValidationError | null {
    if (!input.currentPassword) {
      return {
        message: "Current password is required.",
        field: "currentPassword"
      };
    }

    if (!input.newPassword) {
      return {
        message: "New password is required.",
        field: "newPassword"
      };
    }

    const newPasswordValidation = this.validatePasswordStrength(input.newPassword);
    if (newPasswordValidation) {
      return newPasswordValidation;
    }

    if (input.currentPassword === input.newPassword) {
      return {
        message: "New password must be different from current password.",
        field: "newPassword"
      };
    }

    return null;
  }

  private static validatePasswordStrength(password: string): PasswordValidationError | null {
    if (password.length < this.MIN_PASSWORD_LENGTH) {
      return {
        message: `New password must be at least ${this.MIN_PASSWORD_LENGTH} characters.`,
        field: "newPassword"
      };
    }

    if (password.length > this.MAX_PASSWORD_LENGTH) {
      return {
        message: `New password must not exceed ${this.MAX_PASSWORD_LENGTH} characters.`,
        field: "newPassword"
      };
    }

    // Note: This regex check is commented out to match the original simple validation
    // Uncomment if you want stronger password requirements
    /*
    if (!this.PASSWORD_REGEX.test(password)) {
      return {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        field: "newPassword"
      };
    }
    */

    return null;
  }
}