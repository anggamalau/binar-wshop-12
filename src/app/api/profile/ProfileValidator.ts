import { ProfileUpdateInput, ValidationErrors } from './types';

export class ProfileValidator {
  private static readonly USERNAME_MIN_LENGTH = 6;
  private static readonly BIO_MAX_LENGTH = 160;
  private static readonly LONG_BIO_MAX_LENGTH = 2000;
  private static readonly PHONE_REGEX = /^\d{10,15}$/;
  private static readonly EMAIL_REGEX = /^\S+@\S+\.\S+$/;

  static validate(input: ProfileUpdateInput): ValidationErrors {
    const errors: ValidationErrors = {};

    this.validateUsername(input.username, errors);
    this.validateFullName(input.fullName, errors);
    this.validateEmail(input.email, errors);
    this.validatePhone(input.phone, errors);
    this.validateBirthDate(input.birthDate, errors);
    this.validateBio(input.bio, errors);
    this.validateLongBio(input.longBio, errors);

    return errors;
  }

  private static validateUsername(username: string, errors: ValidationErrors): void {
    if (!username || username.length < this.USERNAME_MIN_LENGTH) {
      errors.username = `Username must be at least ${this.USERNAME_MIN_LENGTH} characters.`;
    }
  }

  private static validateFullName(fullName: string, errors: ValidationErrors): void {
    if (!fullName) {
      errors.fullName = "Full name is required.";
    }
  }

  private static validateEmail(email: string, errors: ValidationErrors): void {
    if (!email || !this.EMAIL_REGEX.test(email)) {
      errors.email = "Must be a valid email format.";
    }
  }

  private static validatePhone(phone: string, errors: ValidationErrors): void {
    if (!phone || !this.PHONE_REGEX.test(phone)) {
      errors.phone = "Phone must be 10-15 digits.";
    }
  }

  private static validateBirthDate(birthDate: string, errors: ValidationErrors): void {
    if (birthDate) {
      const date = new Date(birthDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date > today) {
        errors.birthDate = "Birth date cannot be in the future.";
      }
    }
  }

  private static validateBio(bio: string | undefined, errors: ValidationErrors): void {
    if (bio && bio.length > this.BIO_MAX_LENGTH) {
      errors.bio = `Bio must be ${this.BIO_MAX_LENGTH} characters or less.`;
    }
  }

  private static validateLongBio(longBio: string | undefined, errors: ValidationErrors): void {
    if (longBio && longBio.length > this.LONG_BIO_MAX_LENGTH) {
      errors.longBio = `Long bio must be ${this.LONG_BIO_MAX_LENGTH} characters or less.`;
    }
  }

  static hasErrors(errors: ValidationErrors): boolean {
    return Object.keys(errors).length > 0;
  }
}