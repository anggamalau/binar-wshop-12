import { DatabaseUser, TransformedUser, ProfileJson } from './types';

export class UserTransformer {
  static transformUser(user: DatabaseUser): TransformedUser {
    const profileJson = user.profile_json || null;
    const socialMedia = profileJson?.social_media || {};
    const preferences = profileJson?.preferences || {};
    const skills = profileJson?.skills || [];
    const interests = profileJson?.interests || [];

    const daysSinceCreated = this.calculateDaysSinceCreated(user.created_at);
    const isActive = this.isUserActive(user.log_count);
    const isSenior = this.isUserSenior(user.role);
    const profileCompleteness = this.calculateProfileCompleteness(user);

    return {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      birthDate: user.birth_date,
      bio: user.bio,
      longBio: user.long_bio,
      profileJson,
      address: user.address,
      phoneNumber: user.phone_number,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      role: user.role,
      division: user.division_name,
      displayName: user.display_name,
      bioDisplay: user.bio_display,
      instagramHandle: user.instagram_handle,
      totalUsers: user.total_users,
      newerUsers: user.newer_users,
      logCount: user.log_count,
      roleCount: user.role_count,
      divisionCount: user.division_count,
      loginCount: user.login_count,
      updateCount: user.update_count,
      recentLogs: user.recent_logs,
      daysSinceCreated,
      isActive,
      isSenior,
      socialMedia,
      preferences,
      skills,
      interests,
      hasProfile: !!user.profile_json,
      hasBio: !!user.bio,
      hasAddress: !!user.address,
      hasPhone: !!user.phone_number,
      profileCompleteness,
    };
  }

  static transformUsers(users: DatabaseUser[]): TransformedUser[] {
    return users.map(user => this.transformUser(user));
  }

  private static calculateDaysSinceCreated(createdAt: string): number {
    return Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  private static isUserActive(logCount: number): boolean {
    return logCount > 5;
  }

  private static isUserSenior(role: string | null): boolean {
    return role === 'admin' || role === 'moderator';
  }

  private static calculateProfileCompleteness(user: DatabaseUser): number {
    const completedFields = [
      !!user.bio,
      !!user.address,
      !!user.phone_number,
      !!user.profile_json,
    ].filter(Boolean).length;

    return (completedFields / 4) * 100;
  }
}