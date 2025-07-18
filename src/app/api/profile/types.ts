export interface ProfileUpdateInput {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  bio?: string;
  longBio?: string;
  address?: string;
  profileJson?: any;
}

export interface DatabaseProfile {
  id: number;
  auth_id: number;
  username: string;
  full_name: string;
  email: string;
  bio: string | null;
  long_bio: string | null;
  profile_json: any;
  address: string | null;
  phone_number: string | null;
  birth_date: string;
  created_at: string;
  updated_at: string;
  role: string | null;
  division_name: string | null;
  log_count: number;
  role_count: number;
  division_count?: number;
}

export interface ProfileResponse {
  id: number;
  authId: number;
  username: string;
  fullName: string;
  email: string;
  bio: string | null;
  longBio: string | null;
  profileJson: any;
  address: string | null;
  phoneNumber: string | null;
  birthDate: string;
  role: string | null;
  division: string | null;
  logCount: number;
  roleCount: number;
  divisionCount?: number;
}

export interface ProfileApiResponse {
  success: boolean;
  user: ProfileResponse;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
  };
}