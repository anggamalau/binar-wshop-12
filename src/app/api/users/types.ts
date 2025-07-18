export interface DatabaseUser {
  id: number;
  username: string;
  full_name: string;
  birth_date: string;
  bio: string | null;
  long_bio: string | null;
  profile_json: ProfileJson | null;
  address: string | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
  auth_id: number;
  email: string;
  role: string | null;
  division_name: string | null;
  total_users: number;
  newer_users: number;
  log_count: number;
  role_count: number;
  division_count: number;
  login_count: number;
  update_count: number;
  recent_logs: number;
  display_name: string;
  bio_display: string;
  instagram_handle: string;
}

export interface ProfileJson {
  social_media?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  preferences?: Record<string, any>;
  skills?: string[];
  interests?: string[];
}

export interface TransformedUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  birthDate: string;
  bio: string | null;
  longBio: string | null;
  profileJson: ProfileJson | null;
  address: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  role: string | null;
  division: string | null;
  displayName: string;
  bioDisplay: string;
  instagramHandle: string;
  totalUsers: number;
  newerUsers: number;
  logCount: number;
  roleCount: number;
  divisionCount: number;
  loginCount: number;
  updateCount: number;
  recentLogs: number;
  daysSinceCreated: number;
  isActive: boolean;
  isSenior: boolean;
  socialMedia: ProfileJson['social_media'];
  preferences: ProfileJson['preferences'];
  skills: string[];
  interests: string[];
  hasProfile: boolean;
  hasBio: boolean;
  hasAddress: boolean;
  hasPhone: boolean;
  profileCompleteness: number;
}

export interface UserStatisticsData {
  total: number;
  activeUsers: number;
  seniorUsers: number;
  usersWithCompleteProfiles: number;
  usersByDivision: Record<string, number>;
}

export interface UsersApiResponse {
  users: TransformedUser[];
  total: number;
  activeUsers: number;
  seniorUsers: number;
  usersWithCompleteProfiles: number;
  usersByDivision: Record<string, number>;
  filteredBy: string;
  message: string;
}