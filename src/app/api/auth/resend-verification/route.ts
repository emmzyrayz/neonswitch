// app/api/auth/resend-verification/route.ts - UPDATED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { isValidEmail, sanitizeEmail } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import {
  resendVerificationRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";

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
    const ip = getClientIp(req);

    // ========== 2. RATE LIMITING ==========
    const rateLimitKey = `${ip}:${email}`;
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      resendVerificationRateLimit,
      "Too many verification requests. Please try again later."
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
      "+verifyToken +verifyCode"
    );

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        {
          message: "If your email is registered, you will receive a verification link.",
        },
        { status: 200 }
      );
    }

    // ========== 6. CHECK IF ALREADY VERIFIED ==========
    if (user.isEmailVerified) {
      return NextResponse.json(
        {
          message: "If your email is registered, you will receive a verification link.",
        },
        { status: 200 }
      );
    }

    // ========== 7. CHECK TIME-BASED RATE LIMIT ==========
    const now = Date.now();
    const TWO_MINUTES = 2 * 60 * 1000;

    if (
      user.lastVerificationSentAt &&
      now - user.lastVerificationSentAt.getTime() < TWO_MINUTES
    ) {
      const waitTime = Math.ceil(
        (TWO_MINUTES - (now - user.lastVerificationSentAt.getTime())) / 1000
      );
      return NextResponse.json(
        { 
          error: "Please wait before requesting another verification email.",
          retryAfter: waitTime
        },
        { status: 429 }
      );
    }

    // ========== 8. GENERATE NEW TOKEN & CODE ==========
    const verifyToken = generateToken();
    const verifyCode = generateVerificationCode(6);
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // ========== 9. UPDATE USER ==========
    user.verifyToken = verifyToken;
    user.verifyCode = verifyCode;
    user.verifyTokenExpiry = verifyTokenExpiry;
    user.lastVerificationSentAt = new Date();
    await user.save();

    // ========== 10. BUILD VERIFICATION URL ==========
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/auth/verify?token=${verifyToken}&email=${encodeURIComponent(email)}`;

    // ========== 11. SEND VERIFICATION EMAIL ==========
    try {
      await sendVerificationEmail(email, verificationUrl, verifyCode);
      console.log("✅ Verification email resent to:", email);
    } catch (mailError) {
      console.error("Failed to send verification email:", mailError);
      // Continue - user can try again later
    }

    // ========== 12. LOG FOR DEVELOPMENT ==========
    if (process.env.NODE_ENV === 'development') {
      console.log("📧 [DEV] Verification URL:", verificationUrl);
      console.log("🔢 [DEV] Verification Code:", verifyCode);
      console.log("🔑 [DEV] Verification Token:", verifyToken);
    }

    // ========== 13. RETURN SUCCESS RESPONSE ==========
    return NextResponse.json(
      {
        message: "Verification email sent. Please check your inbox.",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while sending verification email. Please try again." },
      { status: 500 }
    );
  }
}