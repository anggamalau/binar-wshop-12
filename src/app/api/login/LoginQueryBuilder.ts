export class LoginQueryBuilder {
  static buildGetUserByEmailQuery(): string {
    return `
      SELECT 
        a.id as auth_id,
        a.email,
        a.password,
        u.id as user_id,
        u.username,
        u.full_name,
        u.birth_date,
        u.bio,
        u.long_bio,
        u.profile_json,
        u.address,
        u.phone_number,
        ur.role,
        ud.division_name,
        (SELECT COUNT(*) FROM user_logs WHERE user_id = u.id) as log_count,
        (SELECT COUNT(*) FROM user_roles WHERE user_id = u.id) as role_count
      FROM auth a
      LEFT JOIN users u ON a.id = u.auth_id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN user_divisions ud ON u.id = ud.user_id
      WHERE a.email = $1
    `;
  }

  static buildLogLoginQuery(): string {
    return `
      INSERT INTO user_logs (user_id, action, created_at) 
      VALUES ($1, $2, CURRENT_TIMESTAMP)
    `;
  }

  static buildUpdateLastLoginQuery(): string {
    return `
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = $1
    `;
  }
}