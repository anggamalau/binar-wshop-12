import { comparePassword, hashPassword } from "@/lib/crypto";
import { executeQuery } from "@/lib/database";
import { PasswordQueryBuilder } from "./PasswordQueryBuilder";
import { UserPasswordData } from "./types";

export class PasswordService {
  static async getCurrentPasswordHash(userId: number): Promise<string | null> {
    const query = PasswordQueryBuilder.buildGetPasswordHashQuery();
    const result = await executeQuery(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const userData = result.rows[0] as UserPasswordData;
    return userData.password_hash;
  }

  static async verifyCurrentPassword(currentPassword: string, storedPasswordHash: string): Promise<boolean> {
    return comparePassword(currentPassword, storedPasswordHash);
  }

  static async updatePassword(userId: number, newPassword: string): Promise<void> {
    const newPasswordHash = hashPassword(newPassword);
    const updateQuery = PasswordQueryBuilder.buildUpdatePasswordQuery();
    
    await executeQuery(updateQuery, [newPasswordHash, userId]);
    await this.logPasswordChange(userId);
  }

  private static async logPasswordChange(userId: number): Promise<void> {
    const logQuery = PasswordQueryBuilder.buildLogPasswordChangeQuery();
    await executeQuery(logQuery, [userId, "password_change"]);
  }

  static async changePassword(
    userId: number, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    const currentPasswordHash = await this.getCurrentPasswordHash(userId);
    
    if (!currentPasswordHash) {
      return { success: false, error: "User not found." };
    }

    const isPasswordValid = await this.verifyCurrentPassword(currentPassword, currentPasswordHash);
    
    if (!isPasswordValid) {
      return { success: false, error: "Current password is incorrect." };
    }

    await this.updatePassword(userId, newPassword);
    
    return { success: true };
  }
}