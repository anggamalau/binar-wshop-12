import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/jwt";
import { PasswordValidator } from "./PasswordValidator";
import { PasswordService } from "./PasswordService";
import { 
  PasswordUpdateInput, 
  PasswordUpdateResponse, 
  AuthenticatedRequest 
} from "./types";

async function updatePassword(
  request: Request
): Promise<NextResponse<PasswordUpdateResponse>> {
  console.time("Password Update Execution");

  try {
    const body: PasswordUpdateInput = await request.json();
    
    const validationError = PasswordValidator.validate(body);
    if (validationError) {
      console.timeEnd("Password Update Execution");
      return NextResponse.json(
        { message: validationError.message },
        { status: 400 }
      );
    }

    const user = (request as AuthenticatedRequest).user;
    
    const result = await PasswordService.changePassword(
      user.userId,
      body.currentPassword,
      body.newPassword
    );

    console.timeEnd("Password Update Execution");

    if (!result.success) {
      const statusCode = result.error === "User not found." ? 404 : 401;
      return NextResponse.json(
        { message: result.error || "Failed to update password." },
        { status: statusCode }
      );
    }

    return NextResponse.json({
      message: "Password updated successfully!"
    });
  } catch (error) {
    console.error("Password update error:", error);
    console.timeEnd("Password Update Execution");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export const POST = authMiddleware(updatePassword);