// app/api/auth/register/route.ts - UPDATED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";
import { generateNeonId } from "@/lib/neonId";
import { isValidEmail, isValidPassword, sanitizeEmail } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import {
  registerRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

interface RegistrationResponse {
  message: string;
  user: {
    id: string;
    neonId: string;
    email: string;
    isEmailVerified: boolean;
  };
  _dev?: {
    verificationUrl: string;
    verificationToken: string;
    verificationCode: string;
    note: string;
  };
}

export async function POST(req: Request) {
  try {
    // ========== 1. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const { email: rawEmail, password } = body;

    if (!rawEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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
      registerRateLimit,
      "Too many registration attempts. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    // ========== 3. VALIDATE EMAIL & PASSWORD ==========
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // ========== 4. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 5. CHECK IF USER EXISTS ==========
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Generic message to prevent user enumeration
      return NextResponse.json(
        { error: "Registration failed. Please check your details." },
        { status: 400 }
      );
    }

    // ========== 6. HASH PASSWORD ==========
    const passwordHash = await hashPassword(password);

    // ========== 7. GENERATE UNIQUE NEONID ==========
    let neonId = generateNeonId();
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while ((await User.findOne({ neonId })) && attempts < MAX_ATTEMPTS) {
      neonId = generateNeonId();
      attempts++;
    }

    if (attempts >= MAX_ATTEMPTS) {
      console.error("Failed to generate unique neonId after max attempts");
      return NextResponse.json(
        { error: "Failed to generate unique identifier. Please try again." },
        { status: 500 }
      );
    }

    // ========== 8. GENERATE VERIFICATION TOKEN & CODE ==========
    const verifyToken = generateToken();
    const verifyCode = generateVerificationCode(6);
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // ========== 9. CREATE USER ==========
    const user = await User.create({
      email,
      passwordHash,
      neonId,
      verifyToken,
      verifyCode,
      verifyTokenExpiry,
      lastVerificationSentAt: new Date(),
    });

    // ========== 10. BUILD VERIFICATION URL ==========
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/auth/verify?token=${verifyToken}&email=${encodeURIComponent(email)}`;

    // ========== 11. SEND VERIFICATION EMAIL ==========
    try {
      await sendVerificationEmail(email, verificationUrl, verifyCode);
      console.log("✅ Verification email sent to:", email);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail registration if email fails - user can resend later
    }

    // ========== 12. PREPARE RESPONSE ==========
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const response: RegistrationResponse = {
      message: "Registration successful. Please check your email to verify your account.",
      user: {
        id: user._id.toString(),
        neonId: user.neonId,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };

    // Only include dev info in development mode
    if (isDevelopment) {
      response._dev = {
        verificationUrl,
        verificationToken: verifyToken,
        verificationCode: verifyCode,
        note: "This _dev object is only visible in development mode",
      };
      
      console.log("📧 [DEV] Verification URL:", verificationUrl);
      console.log("🔑 [DEV] Verification Token:", verifyToken);
      console.log("🔢 [DEV] Verification Code:", verifyCode);
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    const mongoError = error as MongoError;

    // Handle duplicate key errors
    if (mongoError.code === 11000) {
      const field = Object.keys(mongoError.keyPattern || {})[0];
      const message =
        field === "neonId"
          ? "Failed to generate unique identifier. Please try again."
          : "Registration failed. Please check your details.";

      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}