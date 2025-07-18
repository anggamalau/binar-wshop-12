import { executeQuery } from "@/lib/database";
import { ProfileQueryBuilder } from "./ProfileQueryBuilder";
import { ProfileTransformer } from "./ProfileTransformer";
import { DatabaseProfile, ProfileResponse, ProfileUpdateInput } from "./types";

export class ProfileService {
  static async getProfile(userId: number): Promise<ProfileResponse | null> {
    const query = ProfileQueryBuilder.buildGetProfileQuery();
    const result = await executeQuery(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const databaseProfile = result.rows[0] as DatabaseProfile;
    return ProfileTransformer.transform(databaseProfile);
  }

  static async updateProfile(userId: number, profileData: ProfileUpdateInput): Promise<ProfileResponse | null> {
    const updateQuery = ProfileQueryBuilder.buildUpdateProfileQuery();
    
    const updateParams = [
      profileData.username,
      profileData.fullName,
      profileData.bio || null,
      profileData.longBio || null,
      profileData.address || null,
      profileData.phone,
      profileData.profileJson ? JSON.stringify(profileData.profileJson) : null,
      userId,
    ];

    await executeQuery(updateQuery, updateParams);

    const selectQuery = ProfileQueryBuilder.buildGetUpdatedProfileQuery();
    const result = await executeQuery(selectQuery, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    await this.logProfileUpdate(userId);

    const databaseProfile = result.rows[0] as DatabaseProfile;
    return ProfileTransformer.transform(databaseProfile);
  }

  private static async logProfileUpdate(userId: number): Promise<void> {
    const logQuery = ProfileQueryBuilder.buildLogProfileUpdateQuery();
    await executeQuery(logQuery, [userId, "update_profile"]);
  }
}