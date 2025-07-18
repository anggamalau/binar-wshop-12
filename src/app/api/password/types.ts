export interface PasswordUpdateInput {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordUpdateResponse {
  message: string;
}

export interface PasswordValidationError {
  message: string;
  field?: 'currentPassword' | 'newPassword';
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}

export interface UserPasswordData {
  password_hash: string;
}