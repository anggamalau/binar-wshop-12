export class ProfileQueryBuilder {
  static buildGetProfileQuery(): string {
    return `
      SELECT 
        u.*,
        a.email,
        ur.role,
        ud.division_name,
        (SELECT COUNT(*) FROM user_logs WHERE user_id = u.id) as log_count,
        (SELECT COUNT(*) FROM user_roles WHERE user_id = u.id) as role_count,
        (SELECT COUNT(*) FROM user_divisions WHERE user_id = u.id) as division_count
      FROM users u
      LEFT JOIN auth a ON u.auth_id = a.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN user_divisions ud ON u.id = ud.user_id
      WHERE u.id = $1
    `;
  }

  static buildUpdateProfileQuery(): string {
    return `
      UPDATE users 
      SET 
        username = $1, 
        full_name = $2, 
        bio = $3, 
        long_bio = $4, 
        address = $5, 
        phone_number = $6, 
        profile_json = $7, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
    `;
  }

  static buildGetUpdatedProfileQuery(): string {
    return `
      SELECT 
        u.*,
        ur.role,
        ud.division_name,
        (SELECT COUNT(*) FROM user_logs WHERE user_id = u.id) as log_count,
        (SELECT COUNT(*) FROM user_roles WHERE user_id = u.id) as role_count
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN user_divisions ud ON u.id = ud.user_id
      WHERE u.id = $1
    `;
  }

  static buildLogProfileUpdateQuery(): string {
    return "INSERT INTO user_logs (user_id, action) VALUES ($1, $2)";
  }
}