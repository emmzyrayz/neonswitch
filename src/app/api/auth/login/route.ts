import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword } from "@/lib/password";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  // TODO: Add rate limiting to prevent brute force attacks
  try {
    const body = await req.json();
    const { email: rawEmail, password, rememberMe } = body;

    const email = rawEmail?.toLowerCase().trim();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password first (before email verification check)
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Optional: Check email verification (only after password is valid)
    // Remove this block if email verification isn't implemented yet
    const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';
    if (REQUIRE_EMAIL_VERIFICATION && !user.isEmailVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 403 }
      );
    }

    // Generate JWT with appropriate expiration
    const expiresIn = rememberMe ? "30d" : "7d";
    const token = generateToken(
      { 
        userId: user._id.toString(), 
        neonId: user.neonId,
        email: user.email,
        role: user.role 
      },
      expiresIn
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        neonId: user.neonId,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}