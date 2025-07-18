import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/database";
import { UserQueryBuilder } from "./UserQueryBuilder";
import { UserTransformer } from "./UserTransformer";
import { UserStatistics } from "./UserStatistics";
import { UsersApiResponse, DatabaseUser } from "./types";

export async function GET(request: Request): Promise<NextResponse<UsersApiResponse | { message: string }>> {
  console.time("Users API Execution");

  try {
    const url = new URL(request.url);
    const divisionFilter = url.searchParams.get("division");

    const { query, params } = UserQueryBuilder.createFullQuery(divisionFilter);
    
    const result = await executeQuery(query, params);
    
    const transformedUsers = UserTransformer.transformUsers(result.rows as DatabaseUser[]);
    
    const statistics = UserStatistics.calculateStatistics(transformedUsers);

    const response: UsersApiResponse = {
      users: transformedUsers,
      total: statistics.total,
      activeUsers: statistics.activeUsers,
      seniorUsers: statistics.seniorUsers,
      usersWithCompleteProfiles: statistics.usersWithCompleteProfiles,
      usersByDivision: statistics.usersByDivision,
      filteredBy: divisionFilter || "all",
      message: "Users retrieved successfully",
    };

    console.timeEnd("Users API Execution");
    return NextResponse.json(response);
  } catch (error) {
    console.error("Users API error:", error);
    console.timeEnd("Users API Execution");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}