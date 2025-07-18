import { TransformedUser, UserStatisticsData } from './types';

export class UserStatistics {
  static calculateStatistics(users: TransformedUser[]): UserStatisticsData {
    const activeUsers = this.countActiveUsers(users);
    const seniorUsers = this.countSeniorUsers(users);
    const usersWithCompleteProfiles = this.countUsersWithCompleteProfiles(users);
    const usersByDivision = this.groupUsersByDivision(users);

    return {
      total: users.length,
      activeUsers,
      seniorUsers,
      usersWithCompleteProfiles,
      usersByDivision,
    };
  }

  private static countActiveUsers(users: TransformedUser[]): number {
    return users.filter(user => user.isActive).length;
  }

  private static countSeniorUsers(users: TransformedUser[]): number {
    return users.filter(user => user.isSenior).length;
  }

  private static countUsersWithCompleteProfiles(users: TransformedUser[]): number {
    const PROFILE_COMPLETENESS_THRESHOLD = 75;
    return users.filter(user => user.profileCompleteness > PROFILE_COMPLETENESS_THRESHOLD).length;
  }

  private static groupUsersByDivision(users: TransformedUser[]): Record<string, number> {
    return users.reduce((acc, user) => {
      const division = user.division || 'unassigned';
      acc[division] = (acc[division] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}