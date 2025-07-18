import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { authMiddleware } from "@/lib/jwt";
import { SingleUserQueryBuilder } from "./SingleUserQueryBuilder";
import { SingleUserTransformer } from "./SingleUserTransformer";
import { UserIdValidator } from "./UserIdValidator";
import { UserApiResponse, ErrorResponse, SingleUserDatabase } from "./types";

async function getUserById(request: Request): Promise<NextResponse<UserApiResponse | ErrorResponse>> {
  console.time("Get User by ID Execution");

  try {
    const validation = UserIdValidator.extractAndValidateUserId(request.url);
    
    if (!validation.isValid) {
      console.timeEnd("Get User by ID Execution");
      return NextResponse.json(
        { message: validation.error || "Invalid user ID." },
        { status: 400 }
      );
    }

    const query = SingleUserQueryBuilder.buildGetUserByIdQuery();
    const result = await executeQuery(query, [validation.userId]);

    if (result.rows.length === 0) {
      console.timeEnd("Get User by ID Execution");
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const databaseUser = result.rows[0] as SingleUserDatabase;
    const transformedUser = SingleUserTransformer.transform(databaseUser);

    const response: UserApiResponse = {
      user: transformedUser,
    };

    console.timeEnd("Get User by ID Execution");
    return NextResponse.json(response);
  } catch (error) {
    console.error("Get user by ID error:", error);
    console.timeEnd("Get User by ID Execution");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(getUserById);