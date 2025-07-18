import { NextResponse } from "next/server";
import { LoginValidator } from "./LoginValidator";
import { AuthService } from "./AuthService";
import { UserMapper } from "./UserMapper";
import { LoginInput, LoginResponse } from "./types";

export async function POST(request: Request): Promise<NextResponse<LoginResponse | { message: string }>> {
  console.time("Login API Execution");

  try {
    const body: LoginInput = await request.json();
    
    const validationError = LoginValidator.validate(body);
    if (validationError) {
      console.timeEnd("Login API Execution");
      return NextResponse.json(
        { message: validationError.message },
        { status: 400 }
      );
    }

    const sanitizedEmail = LoginValidator.sanitizeEmail(body.email);
    
    const authResult = await AuthService.authenticate(sanitizedEmail, body.password);

    if (!authResult.success || !authResult.user || !authResult.token) {
      console.timeEnd("Login API Execution");
      return NextResponse.json(
        { message: authResult.error || "Authentication failed." },
        { status: 401 }
      );
    }

    const userResponse = UserMapper.mapToUserResponse(authResult.user);

    const response: LoginResponse = {
      message: "Login successful!",
      token: authResult.token,
      user: userResponse
    };

    console.timeEnd("Login API Execution");
    return NextResponse.json(response);
  } catch (error) {
    console.error("Login error:", error);
    console.timeEnd("Login API Execution");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}