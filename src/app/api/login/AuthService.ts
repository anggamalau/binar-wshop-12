import { comparePassword } from "@/lib/crypto";
import { executeQuery } from "@/lib/database";
import { generateToken } from "@/lib/jwt";
import { LoginQueryBuilder } from "./LoginQueryBuilder";
import { DatabaseUser, TokenPayload } from "./types";

export class AuthService {
  static async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const query = LoginQueryBuilder.buildGetUserByEmailQuery();
    const result = await executeQuery(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as DatabaseUser;
  }

  static async verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    return comparePassword(inputPassword, storedPassword);
  }

  static createTokenPayload(user: DatabaseUser): TokenPayload {
    return {
      userId: user.user_id,
      authId: user.auth_id,
      email: user.email,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
    };
  }

  static generateAuthToken(payload: TokenPayload): string {
    return generateToken(payload);
  }

  static async logUserLogin(userId: number): Promise<void> {
    const logQuery = LoginQueryBuilder.buildLogLoginQuery();
    await executeQuery(logQuery, [userId, "login"]);
  }

  static async updateLastLogin(userId: number): Promise<void> {
    const updateQuery = LoginQueryBuilder.buildUpdateLastLoginQuery();
    await executeQuery(updateQuery, [userId]);
  }

  static async authenticate(email: string, password: string): Promise<{
    success: boolean;
    user?: DatabaseUser;
    token?: string;
    error?: string;
  }> {
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      return { success: false, error: "Invalid credentials." };
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, error: "Invalid credentials." };
    }

    const tokenPayload = this.createTokenPayload(user);
    const token = this.generateAuthToken(tokenPayload);

    await Promise.all([
      this.logUserLogin(user.user_id),
      this.updateLastLogin(user.user_id)
    ]);

    return { success: true, user, token };
  }
}