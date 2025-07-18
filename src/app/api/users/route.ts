import { NextResponse } from "next/server";
import { UsersService } from "@/lib/users-service";
import { QueryParamsParser } from "@/lib/query-params";
import { PerformanceLogger } from "@/lib/performance-logger";

export async function GET(request: Request) {
  const timerLabel = "Users API Execution";
  PerformanceLogger.start(timerLabel);

  try {
    const searchParams = QueryParamsParser.parseUrl(request);
    const divisionFilter = QueryParamsParser.getDivisionFilter(searchParams);
    
    const response = await UsersService.getUsers(divisionFilter);
    
    PerformanceLogger.end(timerLabel);
    return NextResponse.json({
      users: response.users,
      total: response.stats.totalUsers,
      activeUsers: response.stats.activeUsers,
      seniorUsers: response.stats.seniorUsers,
      usersWithCompleteProfiles: response.stats.usersWithCompleteProfiles,
      usersByDivision: response.stats.usersByDivision,
      filteredBy: response.filteredBy,
      message: response.message,
    });
  } catch (error) {
    console.error("Users API error:", error);
    PerformanceLogger.end(timerLabel);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
