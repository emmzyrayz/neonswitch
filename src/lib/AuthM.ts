import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    neonId: string;
    role: string;
  };
}

export async function authenticateRequest(req: Request) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        error: NextResponse.json(
          { error: "No token provided" },
          { status: 401 }
        ),
        user: null,
      };
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded || typeof decoded === "string") {
      return {
        error: NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        ),
        user: null,
      };
    }

    // Connect to DB and verify user still exists
    await connectDB();
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return {
        error: NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        ),
        user: null,
      };
    }

    return {
      error: null,
      user: {
        userId: user._id.toString(),
        email: user.email,
        neonId: user.neonId,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return {
      error: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ),
      user: null,
    };
  }
}