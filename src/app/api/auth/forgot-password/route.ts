// app/api/auth/forgot-password/route.ts - UPDATED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { isValidEmail, sanitizeEmail } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/mail";
import {
  forgotPasswordRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";

const RESET_TOKEN_EXPIRY_HOURS = 1;

export async function POST(req: Request) {
  try {
    // ========== 1. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const { email: rawEmail } = body;

    if (!rawEmail) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Sanitize email using validator function
    const email = sanitizeEmail(rawEmail);

    // ========== 2. VALIDATE EMAIL ==========
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);

    // ========== 2. RATE LIMITING ==========
    const rateLimitKey = `${ip}:${email}`;
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      forgotPasswordRateLimit,
      "Too many password reset requests. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    // ========== 3. VALIDATE EMAIL ==========
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ========== 4. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 5. FIND USER ==========
    const user = await User.findOne({ email }).select(
      "+resetPasswordToken +resetPasswordCode"
    );

     // Generic response message (security: don't reveal if user exists)
    const genericResponse = NextResponse.json(
      {
        message: "If your email is registered, you will receive a password reset link.",
      },
      { status: 200 }
    );

    if (!user) {
      // Add constant-time delay to prevent user enumeration via timing
      await new Promise(resolve => setTimeout(resolve, 100));
      return genericResponse;
    }

    const REQUIRE_VERIFIED_EMAIL = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';
    
    if (REQUIRE_VERIFIED_EMAIL && !user.isEmailVerified) {
      // Still return generic message for security
      console.warn(`Password reset attempted for unverified email: ${email}`);
      return genericResponse;
    }

    // ========== 6. GENERATE RESET TOKEN & CODE ==========
    const resetPasswordToken = generateToken();
    const resetPasswordCode = generateVerificationCode(8);
    const resetPasswordExpiry = new Date(
      Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    // ========== 7. UPDATE USER WITH RESET INFO ==========
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordExpiry = resetPasswordExpiry;
    await user.save();

    // ========== 8. BUILD RESET URL ==========
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetPasswordToken}&email=${encodeURIComponent(email)}`;

    // ========== 9. SEND PASSWORD RESET EMAIL ==========
    try {
      await sendPasswordResetEmail(email, resetUrl, resetPasswordCode);
      console.log("✅ Password reset email sent to:", email);
    } catch (mailError) {
      console.error("Failed to send password reset email:", mailError);
    }

    // ========== 10. LOG FOR DEVELOPMENT ==========
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📧 [DEV] Password Reset Details");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👤 Email:", email);
      console.log("🔗 Reset URL:", resetUrl);
      console.log("🔑 Reset Token:", resetPasswordToken);
      console.log("🔢 Reset Code:", resetPasswordCode);
      console.log(`⏰ Expires in: ${RESET_TOKEN_EXPIRY_HOURS} hour(s)`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    // ========== 12. RETURN SUCCESS RESPONSE ==========
    return genericResponse;

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}