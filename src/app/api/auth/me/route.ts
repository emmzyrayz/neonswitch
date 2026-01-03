// app/api/auth/me/route.ts - UPDATED VERSION
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/AuthM";

export async function GET(req: Request) {
  try {
    // ========== 1. AUTHENTICATE USER ==========
    const { error, user } = await authenticateRequest(req);
    
    if (error || !user) {
      return error || NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // ========== 2. RETURN USER DATA FROM TOKEN ==========
    return NextResponse.json(
      {
        user: {
          userId: user.userId,
          email: user.email,
          neonId: user.neonId,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user data. Please try again." },
      { status: 500 }
    );
  }
}