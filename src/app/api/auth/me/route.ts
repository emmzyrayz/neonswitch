import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/AuthM";

export async function GET(req: Request) {
  try {
    // Authenticate user
    const { error, user } = await authenticateRequest(req);
    
    if (error) {
      return error;
    }

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}