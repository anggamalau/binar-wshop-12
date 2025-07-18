export interface SingleUserDatabase {
  id: number;
  username: string;
  full_name: string;
  birth_date: string;
  bio: string | null;
  long_bio: string | null;
  profile_json: any;
  address: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
  email: string;
  role: string | null;
  division_name: string | null;
}

export interface SingleUserResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  birthDate: string;
  bio: string | null;
  longBio: string | null;
  profileJson: any;
  address: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  role: string | null;
  division: string | null;
}

export interface UserApiResponse {
  user: SingleUserResponse;
}

export interface ErrorResponse {
  message: string;
}