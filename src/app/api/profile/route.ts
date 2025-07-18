import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/jwt";
import { ProfileService } from "./ProfileService";
import { ProfileValidator } from "./ProfileValidator";
import { ProfileUpdateInput, ProfileApiResponse, AuthenticatedRequest } from "./types";

async function getProfile(request: Request): Promise<NextResponse<ProfileApiResponse | { message: string }>> {
  console.time("Profile Get Execution");

  try {
    const user = (request as AuthenticatedRequest).user;
    const profile = await ProfileService.getProfile(user.userId);

    if (!profile) {
      console.timeEnd("Profile Get Execution");
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    const response: ProfileApiResponse = {
      success: true,
      user: profile,
    };

    console.timeEnd("Profile Get Execution");
    return NextResponse.json(response);
  } catch (error) {
    console.error("Profile get error:", error);
    console.timeEnd("Profile Get Execution");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

async function updateProfile(request: Request): Promise<NextResponse<ProfileApiResponse | { message: string; errors?: any }>> {
  console.time("Profile Update Execution");

  try {
    const profileData: ProfileUpdateInput = await request.json();
    const validationErrors = ProfileValidator.validate(profileData);

    if (ProfileValidator.hasErrors(validationErrors)) {
      console.timeEnd("Profile Update Execution");
      return NextResponse.json(
        { message: "Validation failed", errors: validationErrors },
        { status: 400 }
      );
    }

    const user = (request as AuthenticatedRequest).user;
    const updatedProfile = await ProfileService.updateProfile(user.userId, profileData);

    if (!updatedProfile) {
      console.timeEnd("Profile Update Execution");
      return NextResponse.json(
        { message: "Failed to update profile." },
        { status: 500 }
      );
    }

    const response: ProfileApiResponse = {
      success: true,
      user: updatedProfile,
    };

    console.timeEnd("Profile Update Execution");
    return NextResponse.json(response);
  } catch (error) {
    console.error("Profile update error:", error);
    console.timeEnd("Profile Update Execution");
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(getProfile);
export const PUT = authMiddleware(updateProfile);