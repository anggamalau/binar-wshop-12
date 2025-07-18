import { SingleUserDatabase, SingleUserResponse } from './types';

export class SingleUserTransformer {
  static transform(databaseUser: SingleUserDatabase): SingleUserResponse {
    return {
      id: databaseUser.id,
      username: databaseUser.username,
      fullName: databaseUser.full_name,
      email: databaseUser.email,
      birthDate: databaseUser.birth_date,
      bio: databaseUser.bio,
      longBio: databaseUser.long_bio,
      profileJson: databaseUser.profile_json,
      address: databaseUser.address,
      phoneNumber: databaseUser.phone_number,
      createdAt: databaseUser.created_at,
      updatedAt: databaseUser.updated_at,
      role: databaseUser.role,
      division: databaseUser.division_name,
    };
  }
}