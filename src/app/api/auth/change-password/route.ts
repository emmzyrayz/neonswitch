import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/AuthM";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, hashPassword } from "@/lib/password";
import { isValidPassword } from "@/lib/validator";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { error, user: authUser } = await authenticateRequest(req);
    
    if (error) {
      return error;
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
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

    // Get user with password
    const user = await User.findById(authUser!.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash and save new password
    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json(
      {
        message: "Password changed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}