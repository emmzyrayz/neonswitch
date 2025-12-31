import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";
import { isValidPassword } from "@/lib/validator";

interface ResetPasswordQuery {
  email: string;
  resetPasswordCode?: string;
  resetPasswordToken?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: rawEmail, token, code, newPassword } = body;

    const email = rawEmail?.toLowerCase().trim();

    // Validation - need email, new password, and either token OR code
    if (!email || (!token && !code) || !newPassword) {
      return NextResponse.json(
        { error: "Email, reset token or code, and new password are required" },
        { status: 400 }
      );
    }

    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    await connectDB();

    // Build query - search by either token or code
    const query: ResetPasswordQuery = { email };
    
    if (code) {
      query.resetPasswordCode = code.toUpperCase();
    } else if (token) {
      query.resetPasswordToken = token;
    }

    // Find user with matching email and reset token/code
    const user = await User.findOne(query);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (user.resetPasswordExpiry && new Date() > user.resetPasswordExpiry) {
      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json(
      {
        message: "Password reset successfully. You can now log in with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}