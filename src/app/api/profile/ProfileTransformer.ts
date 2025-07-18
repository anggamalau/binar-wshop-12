import { DatabaseProfile, ProfileResponse } from './types';

export class ProfileTransformer {
  static transform(databaseProfile: DatabaseProfile): ProfileResponse {
    return {
      id: databaseProfile.id,
      authId: databaseProfile.auth_id,
      username: databaseProfile.username,
      fullName: databaseProfile.full_name,
      email: databaseProfile.email,
      bio: databaseProfile.bio,
      longBio: databaseProfile.long_bio,
      profileJson: databaseProfile.profile_json,
      address: databaseProfile.address,
      phoneNumber: databaseProfile.phone_number,
      birthDate: databaseProfile.birth_date,
      role: databaseProfile.role,
      division: databaseProfile.division_name,
      logCount: databaseProfile.log_count,
      roleCount: databaseProfile.role_count,
      divisionCount: databaseProfile.division_count,
    };
  }
}