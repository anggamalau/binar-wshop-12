import { DatabaseUser, UserResponse } from './types';

export class UserMapper {
  static mapToUserResponse(databaseUser: DatabaseUser): UserResponse {
    return {
      id: databaseUser.user_id,
      authId: databaseUser.auth_id,
      username: databaseUser.username,
      fullName: databaseUser.full_name,
      email: databaseUser.email,
      role: databaseUser.role,
      division: databaseUser.division_name,
      bio: databaseUser.bio,
      longBio: databaseUser.long_bio,
      profileJson: databaseUser.profile_json,
      address: databaseUser.address,
      phoneNumber: databaseUser.phone_number,
      birthDate: databaseUser.birth_date,
    };
  }
}