import { LoginInput, LoginValidationError } from './types';

export class LoginValidator {
  private static readonly MIN_PASSWORD_LENGTH = 6;
  private static readonly EMAIL_REGEX = /^\S+@\S+\.\S+$/;

  static validate(input: LoginInput): LoginValidationError | null {
    if (!input.email) {
      return {
        message: "Email is required.",
        field: "email"
      };
    }

    if (!input.password) {
      return {
        message: "Password is required.",
        field: "password"
      };
    }

    if (!this.isValidEmail(input.email)) {
      return {
        message: "Please enter a valid email address.",
        field: "email"
      };
    }

    if (input.password.length < this.MIN_PASSWORD_LENGTH) {
      return {
        message: `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters.`,
        field: "password"
      };
    }

    return null;
  }

  private static isValidEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }
}