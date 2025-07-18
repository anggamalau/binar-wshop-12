import { executeQuery } from "@/lib/database";

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  birthDate: string;
  bio: string | null;
  longBio: string;
  profileJson: any;
  address: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  division: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  seniorUsers: number;
  usersWithCompleteProfiles: number;
  usersByDivision: Record<string, number>;
}

export interface UsersResponse {
  users: User[];
  stats: UserStats;
  filteredBy: string;
  message: string;
}

export class UsersService {
  private static buildOptimizedQuery(divisionFilter?: string): string {
    const baseQuery = `
      SELECT 
        u.id,
        u.username,
        u.full_name,
        u.birth_date,
        u.bio,
        u.long_bio,
        u.profile_json,
        u.address,
        u.phone_number,
        u.created_at,
        u.updated_at,
        a.email,
        ur.role,
        ud.division_name
      FROM users u
      LEFT JOIN auth a ON u.auth_id = a.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN user_divisions ud ON u.id = ud.user_id
    `;

    const whereClause = divisionFilter && divisionFilter !== "all" 
      ? ` WHERE ud.division_name = $1` 
      : "";

    const orderClause = ` ORDER BY u.created_at DESC`;

    return baseQuery + whereClause + orderClause;
  }

  private static async executeUsersQuery(divisionFilter?: string): Promise<any[]> {
    const query = this.buildOptimizedQuery(divisionFilter);
    const params = divisionFilter && divisionFilter !== "all" ? [divisionFilter] : [];
    
    const result = await executeQuery(query, params);
    return result.rows;
  }

  private static transformUserData(rawUser: any): User {
    return {
      id: rawUser.id,
      username: rawUser.username,
      fullName: rawUser.full_name,
      email: rawUser.email,
      birthDate: rawUser.birth_date,
      bio: rawUser.bio,
      longBio: rawUser.long_bio,
      profileJson: rawUser.profile_json,
      address: rawUser.address,
      phoneNumber: rawUser.phone_number,
      createdAt: rawUser.created_at,
      updatedAt: rawUser.updated_at,
      role: rawUser.role,
      division: rawUser.division_name,
    };
  }

  private static calculateStats(users: User[]): UserStats {
    const stats = users.reduce((acc, user) => {
      const isActive = user.role === "admin" || user.role === "moderator";
      const isSenior = user.role === "admin" || user.role === "moderator";
      const hasCompleteProfile = !!(user.bio && user.address && user.phoneNumber && user.profileJson);

      if (isActive) acc.activeUsers++;
      if (isSenior) acc.seniorUsers++;
      if (hasCompleteProfile) acc.usersWithCompleteProfiles++;

      if (user.division) {
        acc.usersByDivision[user.division] = (acc.usersByDivision[user.division] || 0) + 1;
      }

      return acc;
    }, {
      totalUsers: users.length,
      activeUsers: 0,
      seniorUsers: 0,
      usersWithCompleteProfiles: 0,
      usersByDivision: {} as Record<string, number>
    });

    return stats;
  }

  public static async getUsers(divisionFilter?: string): Promise<UsersResponse> {
    const rawUsers = await this.executeUsersQuery(divisionFilter);
    const users = rawUsers.map(this.transformUserData);
    const stats = this.calculateStats(users);

    return {
      users,
      stats,
      filteredBy: divisionFilter || "all",
      message: "Users retrieved successfully"
    };
  }
}