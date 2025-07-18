export interface LoginInput {
  email: string;
  password: string;
}

export interface DatabaseUser {
  auth_id: number;
  email: string;
  password: string;
  user_id: number;
  username: string;
  full_name: string;
  birth_date: string;
  bio: string | null;
  long_bio: string | null;
  profile_json: any;
  address: string | null;
  phone_number: string | null;
  role: string | null;
  division_name: string | null;
  log_count: number;
  role_count: number;
}

export interface TokenPayload {
  userId: number;
  authId: number;
  email: string;
  username: string;
  fullName: string;
  role: string | null;
}

export interface UserResponse {
  id: number;
  authId: number;
  username: string;
  fullName: string;
  email: string;
  role: string | null;
  division: string | null;
  bio: string | null;
  longBio: string | null;
  profileJson: any;
  address: string | null;
  phoneNumber: string | null;
  birthDate: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserResponse;
}

export interface LoginValidationError {
  message: string;
  field?: 'email' | 'password';
}