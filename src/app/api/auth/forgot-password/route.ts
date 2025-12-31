import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { isValidEmail } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: rawEmail } = body;

    const email = rawEmail?.toLowerCase().trim();

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If your email is registered, you will receive a password reset link." },
        { status: 200 }
      );
    }

    // Generate reset token and code
    const resetPasswordToken = generateToken();
    const resetPasswordCode = generateVerificationCode(8); // 8 digits for extra security
    const resetPasswordExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Update user
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordExpiry = resetPasswordExpiry;
    await user.save();

    // TODO: Send password reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetPasswordToken}&email=${email}`;
    
    // TODO: await sendPasswordResetEmail(email, resetUrl, resetPasswordCode);
    
    console.log("📧 Password Reset URL:", resetUrl);
    console.log("🔢 Reset Code:", resetPasswordCode);

    return NextResponse.json(
      {
        message: "Password reset link sent. Please check your email.",
        // REMOVE IN PRODUCTION
        _dev: {
          resetUrl,
          resetCode: resetPasswordCode,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}