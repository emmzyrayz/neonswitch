// app/api/auth/verify/route.ts - IMPROVED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/lib/mail";
import {
  applyRateLimit,
  getClientIp,
  verifyRateLimit,
} from "@/lib/upstashLimiter";
import { isValidEmail, sanitizeEmail } from "@/lib/validator";

type VerificationType = "email" | "phone";

interface VerifyEmailQuery {
  email: string;
  verifyCode?: string;
  verifyToken?: string;
}

interface VerifyPhoneQuery {
  email: string;
  phoneVerifyCode: string;
}

/**
 * POST /api/auth/verify
 * Verifies email or phone using token/code
 */
export async function POST(req: Request) {
  try {
    // ========== 1. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const { email: rawEmail, token, code, type = "email" } = body;

    if (!rawEmail || (!token && !code)) {
      return NextResponse.json(
        { error: "Email and verification token or code are required" },
        { status: 400 }
      );
    }

    // Validate verification type
    const verificationType = type as VerificationType;
    if (!["email", "phone"].includes(verificationType)) {
      return NextResponse.json(
        { error: "Invalid verification type. Must be 'email' or 'phone'" },
        { status: 400 }
      );
    }

    // Sanitize email
    const email = sanitizeEmail(rawEmail);

    // ========== 2. VALIDATE EMAIL ==========
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);

    // ========== 3. RATE LIMITING ==========
    const rateLimitKey = `${ip}:${email}:verify`;
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      verifyRateLimit,
      "Too many verification attempts. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    await connectDB();

    // ========== 4. HANDLE EMAIL VERIFICATION ==========
    if (verificationType === "email") {
      // Build query - search by either token or code
      const query: VerifyEmailQuery = { email };
      
      if (code) {
        query.verifyCode = code.toUpperCase().trim();
      } else if (token) {
        query.verifyToken = token.trim();
      }

      // Find user
      const user = await User.findOne(query).select("+verifyToken +verifyCode");

      if (!user) {
        return NextResponse.json(
          { error: "Invalid or expired verification credentials" },
          { status: 400 }
        );
      }

      // Check if already verified
      if (user.isEmailVerified) {
        return NextResponse.json(
          { message: "Email is already verified. You can now log in." },
          { status: 200 }
        );
      }

      // Check if token is expired
      if (user.verifyTokenExpiry && new Date() > user.verifyTokenExpiry) {
        // Clear expired token
        user.verifyToken = undefined;
        user.verifyCode = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json(
          { error: "Verification token has expired. Please request a new one." },
          { status: 400 }
        );
      }

      // Update user - mark email as verified
      user.isEmailVerified = true;
      user.verifyToken = undefined;
      user.verifyCode = undefined;
      user.verifyTokenExpiry = undefined;
      await user.save();

      console.log("✅ Email verified successfully for:", user.email);

      // Send welcome email
      try {
        await sendWelcomeEmail(user.email, user.neonId);
        console.log("✅ Welcome email sent to:", user.email);
      } catch (mailError) {
        console.error("Failed to send welcome email:", mailError);
        // Continue - verification was successful
      }

      return NextResponse.json(
        {
          message: "Email verified successfully! You can now log in.",
          user: {
            email: user.email,
            neonId: user.neonId,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
          },
        },
        { status: 200 }
      );
    }

    // ========== 5. HANDLE PHONE VERIFICATION ==========
    if (verificationType === "phone") {
      if (!code) {
        return NextResponse.json(
          { error: "Verification code is required for phone verification" },
          { status: 400 }
        );
      }

      const query: VerifyPhoneQuery = {
        email,
        phoneVerifyCode: code.toUpperCase().trim(),
      };

      // Find user
      const user = await User.findOne(query).select("+phoneVerifyCode");

      if (!user) {
        return NextResponse.json(
          { error: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      // Check if already verified
      if (user.isPhoneVerified) {
        return NextResponse.json(
          { message: "Phone number is already verified." },
          { status: 200 }
        );
      }

      // Check if code is expired
      if (user.phoneVerifyCodeExpiry && new Date() > user.phoneVerifyCodeExpiry) {
        // Clear expired code
        user.phoneVerifyCode = undefined;
        user.phoneVerifyCodeExpiry = undefined;
        await user.save();

        return NextResponse.json(
          { error: "Verification code has expired. Please request a new one." },
          { status: 400 }
        );
      }

      // Update user - mark phone as verified
      user.isPhoneVerified = true;
      user.phoneVerifyCode = undefined;
      user.phoneVerifyCodeExpiry = undefined;
      await user.save();

      console.log("✅ Phone verified successfully for:", user.email);

      return NextResponse.json(
        {
          message: "Phone number verified successfully!",
          user: {
            email: user.email,
            phone: user.phone,
            neonId: user.neonId,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
          },
        },
        { status: 200 }
      );
    }

    // Should never reach here
    return NextResponse.json(
      { error: "Invalid verification type" },
      { status: 400 }
    );

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/verify?email=...&token=...&type=email
 * URL-based verification (typically from email links)
 */
export async function GET(req: Request) {
  try {
    // ========== 1. PARSE QUERY PARAMETERS ==========
    const { searchParams } = new URL(req.url);
    const rawEmail = searchParams.get("email");
    const token = searchParams.get("token");
    const type = searchParams.get("type") || "email";

    if (!rawEmail || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    // Validate verification type
    const verificationType = type as VerificationType;
    if (!["email", "phone"].includes(verificationType)) {
      return NextResponse.json(
        { error: "Invalid verification type" },
        { status: 400 }
      );
    }

    // Sanitize email
    const email = sanitizeEmail(rawEmail);

    // ========== 2. VALIDATE EMAIL ==========
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);

    // ========== 3. RATE LIMITING ==========
    const rateLimitKey = `${ip}:${email}:verify`;
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      verifyRateLimit,
      "Too many verification attempts. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    await connectDB();

    // ========== 4. FIND USER BY TOKEN ==========
    const user = await User.findOne({
      email,
      verifyToken: token.trim(),
    }).select("+verifyToken");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // ========== 5. CHECK IF ALREADY VERIFIED ==========
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified. You can now log in." },
        { status: 200 }
      );
    }

    // ========== 6. CHECK TOKEN EXPIRY ==========
    if (!user.verifyTokenExpiry || new Date() > user.verifyTokenExpiry) {
      // Clear expired token
      user.verifyToken = undefined;
      user.verifyCode = undefined;
      user.verifyTokenExpiry = undefined;
      await user.save();

      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // ========== 7. VERIFY EMAIL ==========
    user.isEmailVerified = true;
    user.verifyToken = undefined;
    user.verifyCode = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    console.log("✅ Email verified successfully (via URL) for:", user.email);

    // ========== 8. SEND WELCOME EMAIL ==========
    try {
      await sendWelcomeEmail(user.email, user.neonId);
      console.log("✅ Welcome email sent to:", user.email);
    } catch (mailError) {
      console.error("Failed to send welcome email:", mailError);
      // Continue - verification was successful
    }

    // ========== 9. RETURN SUCCESS ==========
    return NextResponse.json(
      {
        message: "Email verified successfully! You can now log in.",
        user: {
          email: user.email,
          neonId: user.neonId,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("VERIFY ERROR (GET):", error);
    return NextResponse.json(
      { error: "An error occurred while verifying your email. Please try again." },
      { status: 500 }
    );
  }
}