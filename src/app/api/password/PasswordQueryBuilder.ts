export class PasswordQueryBuilder {
  static buildGetPasswordHashQuery(): string {
    return `
      SELECT password_hash 
      FROM users 
      WHERE id = $1
    `;
  }

  static buildUpdatePasswordQuery(): string {
    return `
      UPDATE users 
      SET 
        password_hash = $1, 
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
  }

  static buildLogPasswordChangeQuery(): string {
    return `
      INSERT INTO user_logs (user_id, action, created_at) 
      VALUES ($1, $2, CURRENT_TIMESTAMP)
    `;
  }
}