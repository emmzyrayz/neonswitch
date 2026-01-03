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

interface VerifyQuery {
  email: string;
  verifyCode?: string;
  verifyToken?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email: rawEmail, token, code } = body;

    if (!rawEmail || (!token && !code)) {
      return NextResponse.json(
        { error: "Email and verification token or code are required" },
        { status: 400 }
      );
    }

    // Sanitize email using validator function
    const email = sanitizeEmail(rawEmail);

     if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const ip = getClientIp(req);
    const rateLimitKey = `${ip}:${email}`;
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      verifyRateLimit,
      "Too many verification attempts. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    // Validation - need email and either token OR code
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectDB();

    // Build query - search by either token or code
    const query: VerifyQuery = { email };
    
    if (code) {
      query.verifyCode = code.toUpperCase().trim();
    } else if (token) {
      query.verifyToken = token.trim();
    }

    // Find user
    const user = await User.findOne(query).select(
      "+verifyToken +verifyCode"
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification token/code" },
        { status: 400 }
      );
    }

     // ========== 6. CHECK IF ALREADY VERIFIED ==========
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


    // Update user
    user.isEmailVerified = true;
    user.verifyToken = undefined;
    user.verifyCode = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

   console.log("✅ Email verified successfully for:", user.email);

    // ========== 9. SEND WELCOME EMAIL ==========
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
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while verifying your email. Please try again." },
      { status: 500 }
    );
  }
}

// Optional: GET method for URL-based verification
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawEmail = searchParams.get("email");
    const token = searchParams.get("token");

    if (!rawEmail || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
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
    const rateLimitKey = `${ip}:${email}`;
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      verifyRateLimit,
      "Too many verification attempts. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response!;
    }


    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    await connectDB();

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

    // ========== 6. CHECK IF ALREADY VERIFIED ==========
    if (user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified. You can now log in." },
        { status: 200 }
      );
    }

    // ========== 7. CHECK TOKEN EXPIRY ==========
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

    user.isEmailVerified = true;
    user.verifyToken = undefined;
    user.verifyCode = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    // After verifying email
    try {
      await sendWelcomeEmail(user.email, user.neonId);
    } catch (mailError) {
      console.error("WELCOME EMAIL FAILED:", mailError);
    }

    // Redirect to success page or return JSON
    return NextResponse.json(
      {
        message: "Email verified successfully! You can now log in.",
        user: {
          email: user.email,
          neonId: user.neonId,
          isEmailVerified: user.isEmailVerified,
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
