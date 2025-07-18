export class UserQueryBuilder {
  private query: string;
  private hasWhereClause: boolean = false;

  constructor() {
    this.query = '';
  }

  selectUserFields(): this {
    this.query = `
      SELECT 
        u.id,
        u.username,
        u.full_name,
        u.birth_date,
        u.bio,
        u.long_bio,
        u.profile_json,
        u.address,
        u.phone_number,
        u.created_at,
        u.updated_at,
        a.email,
        ur.role,
        ud.division_name`;
    return this;
  }

  addStatisticsSubqueries(): this {
    this.query += `,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE created_at > u.created_at) as newer_users,
        (SELECT COUNT(*) FROM user_logs WHERE user_id = u.id) as log_count,
        (SELECT COUNT(*) FROM user_roles WHERE user_id = u.id) as role_count,
        (SELECT COUNT(*) FROM user_divisions WHERE user_id = u.id) as division_count,
        (SELECT COUNT(*) FROM user_logs WHERE action = 'login' AND user_id = u.id) as login_count,
        (SELECT COUNT(*) FROM user_logs WHERE action = 'update_profile' AND user_id = u.id) as update_count,
        (SELECT COUNT(*) FROM user_logs ul 
         WHERE ul.user_id = u.id 
         AND ul.created_at > (SELECT MAX(created_at) FROM user_logs WHERE user_id = u.id) - INTERVAL '30 days') as recent_logs`;
    return this;
  }

  addComputedFields(): this {
    this.query += `,
        CONCAT(u.full_name, ' (', COALESCE(ur.role, 'no role'), ')') as display_name,
        CASE 
          WHEN u.bio IS NULL THEN 'No bio available'
          WHEN u.bio = '' THEN 'Empty bio'
          ELSE u.bio
        END as bio_display,
        CASE 
          WHEN u.profile_json IS NOT NULL THEN 
            CASE 
              WHEN u.profile_json->'social_media' IS NOT NULL THEN
                CASE 
                  WHEN u.profile_json->'social_media'->>'instagram' IS NOT NULL THEN
                    u.profile_json->'social_media'->>'instagram'
                  ELSE 'No Instagram'
                END
              ELSE 'No social media'
            END
          ELSE 'No profile data'
        END as instagram_handle`;
    return this;
  }

  fromUserTables(): this {
    this.query += `
      FROM users u
      LEFT JOIN auth a ON u.auth_id = a.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN user_divisions ud ON u.id = ud.user_id`;
    return this;
  }

  addUnnecessaryCrossJoin(): this {
    this.query += `
      CROSS JOIN (SELECT 1 as dummy) d`;
    return this;
  }

  filterByDivision(division: string | null): this {
    if (division && division !== 'all') {
      this.query += ` WHERE ud.division_name = $1`;
      this.hasWhereClause = true;
    }
    return this;
  }

  orderByCreatedDate(): this {
    this.query += ` ORDER BY u.created_at DESC`;
    return this;
  }

  build(): { query: string; hasFilter: boolean } {
    return { 
      query: this.query,
      hasFilter: this.hasWhereClause 
    };
  }

  static createFullQuery(divisionFilter: string | null): { query: string; params: any[] } {
    const builder = new UserQueryBuilder();
    
    const { query, hasFilter } = builder
      .selectUserFields()
      .addStatisticsSubqueries()
      .addComputedFields()
      .fromUserTables()
      .addUnnecessaryCrossJoin()
      .filterByDivision(divisionFilter)
      .orderByCreatedDate()
      .build();

    const params = hasFilter && divisionFilter && divisionFilter !== 'all' 
      ? [divisionFilter] 
      : [];

    return { query, params };
  }
}