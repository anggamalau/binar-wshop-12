export class SingleUserQueryBuilder {
  private static readonly USER_FIELDS = [
    'u.id',
    'u.username',
    'u.full_name',
    'u.birth_date',
    'u.bio',
    'u.long_bio',
    'u.profile_json',
    'u.address',
    'u.phone_number',
    'u.created_at',
    'u.updated_at',
  ];

  private static readonly AUTH_FIELDS = ['a.email'];
  
  private static readonly ROLE_FIELDS = ['ur.role'];
  
  private static readonly DIVISION_FIELDS = ['ud.division_name'];

  static buildGetUserByIdQuery(): string {
    const allFields = [
      ...this.USER_FIELDS,
      ...this.AUTH_FIELDS,
      ...this.ROLE_FIELDS,
      ...this.DIVISION_FIELDS,
    ];

    return `
      SELECT 
        ${allFields.join(',\n        ')}
      FROM users u
      LEFT JOIN auth a ON u.auth_id = a.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN user_divisions ud ON u.id = ud.user_id
      WHERE u.id = $1
    `;
  }
}