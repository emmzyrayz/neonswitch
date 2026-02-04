// app/api/auth/register/route.ts - WITH LEDGER INTEGRATION
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { generateNeonId } from "@/lib/neonId";
import { isValidEmail, isValidPassword, sanitizeEmail } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { sendOtp, smsTemplates } from "@/lib/sms";
import {
  registerRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";
import { getCountryCallingCode, parsePhoneNumber } from "@/lib/phone";
import { LedgerService } from "@/lib/finance/ledger.service";

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

interface RegistrationResponse {
  message: string;
  user: {
    id: string;
    neonId: string;
    ledgerId: string; // Added ledger ID to response
    email: string;
    phone: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    nationality: string;
  };
  phonePinId?: string;
  _dev?: {
    verificationUrl: string;
    verificationToken: string;
    verificationCode: string;
    phonePinId?: string;
    ledgerId: string; // Added for dev visibility
    note: string;
  };
}

export async function POST(req: Request) {
  let session: mongoose.ClientSession | null = null;

  try {
    // ========== 1. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const {
      email: rawEmail,
      password,
      phone: rawPhone,
      nationality,
      firstName,
      lastName,
      dateOfBirth,
      gender,
    } = body;

    if (!rawEmail || !password) {
      return NextResponse.json(
        { error: "Email, password, and phone are required" },
        { status: 400 }
      );
    }

    // Validate required profile fields
    if (!dateOfBirth || !nationality || !gender) {
      return NextResponse.json(
        { error: "Date of birth, nationality, and gender are required" },
        { status: 400 }
      );
    }

    // Validate gender
    if (!["male", "female", "other"].includes(gender)) {
      return NextResponse.json(
        { error: "Gender must be male, female, or other" },
        { status: 400 }
      );
    }

    // Sanitize email
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

    // ========== 4. DETERMINE COUNTRY CODE FOR PHONE ==========
    let countryCodeForPhone = nationality?.toUpperCase();

    if (!countryCodeForPhone) {
      if (!rawPhone.startsWith("+")) {
        countryCodeForPhone = "NG";
        console.warn(
          "No nationality provided and phone doesn't have country code. Defaulting to Nigeria (NG)."
        );
      }
    }

    // ========== 5. VALIDATE & PARSE PHONE NUMBER ==========
    const phoneResult = parsePhoneNumber(rawPhone, countryCodeForPhone);
    if (!phoneResult.valid) {
      return NextResponse.json(
        { error: phoneResult.error || "Invalid phone number" },
        { status: 400 }
      );
    }
    const phone = phoneResult.formatted!;

    // Validate nationality is supported
    const callingCode = getCountryCallingCode(nationality);
    if (!callingCode) {
      return NextResponse.json(
        {
          error: `Unsupported country code: ${nationality}. Please provide a valid ISO 3166-1 alpha-2 country code (e.g., NG, US, GB).`,
        },
        { status: 400 }
      );
    }

    // ========== 6. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 7. START ATOMIC TRANSACTION ==========
    session = await mongoose.startSession();
    session.startTransaction();

    try {
      // ========== 8. CHECK IF USER EXISTS ==========
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      }).session(session);

      if (existingUser) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: "Registration failed. Please check your details." },
          { status: 400 }
        );
      }

      // ========== 9. HASH PASSWORD ==========
      const passwordHash = await hashPassword(password);

      // ========== 10. GENERATE UNIQUE NEONID ==========
      let neonId = generateNeonId();
      let attempts = 0;
      const MAX_ATTEMPTS = 5;

      while (
        (await User.findOne({ neonId }).session(session)) &&
        attempts < MAX_ATTEMPTS
      ) {
        neonId = generateNeonId();
        attempts++;
      }

      if (attempts >= MAX_ATTEMPTS) {
        await session.abortTransaction();
        console.error("Failed to generate unique neonId after max attempts");
        return NextResponse.json(
          { error: "Failed to generate unique identifier. Please try again." },
          { status: 500 }
        );
      }

      // ========== 11. GENERATE VERIFICATION TOKENS ==========
      const verifyToken = generateToken();
      const verifyCode = generateVerificationCode(6);
      const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // ========== 12. SEND PHONE OTP (NON-BLOCKING) ==========
      const appName = process.env.NEXT_PUBLIC_APP_NAME || "YourApp";
      const phoneMessage = smsTemplates.phoneVerification(appName, 6);

      let phonePinId: string | undefined;

      try {
        const smsResult = await sendOtp(phone, 6, phoneMessage);

        if (smsResult.success && smsResult.pinId) {
          phonePinId = smsResult.pinId;
          console.log("✅ Phone OTP sent via Termii:", phone);
        } else {
          console.error("Failed to send phone OTP:", smsResult.error);
        }
      } catch (smsError) {
        console.error("SMS service error:", smsError);
      }

      // ========== 13. CREATE USER (ATOMIC) ==========
      const userData: Partial<IUser> = {
        email,
        phone,
        passwordHash,
        neonId,
        verifyToken,
        verifyCode,
        verifyTokenExpiry,
        phonePinId,
        phoneVerifyCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
        lastVerificationSentAt: new Date(),
        lastPhoneVerificationSentAt: new Date(),
        role: "user",
        isEmailVerified: false,
        isPhoneVerified: false,
        kycTier: 0,
        kycStatus: "pending",
        profile: {
          dateOfBirth: new Date(dateOfBirth),
          nationality: nationality.toUpperCase(),
          gender: gender as "male" | "female" | "other",
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
        },
      };

      const [user] = await User.create([userData], { session });

      // ========== 14. CREATE LEDGER ACCOUNT (ATOMIC) ==========
      const ledgerId = await LedgerService.createLedgerAccount(
        user._id,
        session
      );

      await User.findByIdAndUpdate(
        user._id,
        { $set: { ledgerId: ledgerId } },
        {session}
      )

      console.log(`✅ Ledger created for user ${user._id}: ${ledgerId}`);

      

      // ========== 15. COMMIT TRANSACTION ==========
      await session.commitTransaction();
      console.log("✅ User and ledger created atomically");

      // ========== 16. SEND VERIFICATION EMAIL (POST-COMMIT) ==========
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const verificationUrl = `${baseUrl}/auth/verify?token=${verifyToken}&email=${encodeURIComponent(
        email
      )}`;

      try {
        await sendVerificationEmail(email, verificationUrl, verifyCode);
        console.log("✅ Verification email sent to:", email);
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
      }

      // ========== 17. PREPARE RESPONSE ==========
      const isDevelopment = process.env.NODE_ENV === "development";

      const response: RegistrationResponse = {
        message:
          "Registration successful. Please check your email and phone to verify your account.",
        user: {
          id: user._id.toString(),
          neonId: user.neonId,
          ledgerId, // Include ledger ID in response
          email: user.email,
          phone: user.phone,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          nationality: user.profile.nationality,
        },
        phonePinId,
      };

      // Development-only debugging info
      if (isDevelopment) {
        response._dev = {
          verificationUrl,
          verificationToken: verifyToken,
          verificationCode: verifyCode,
          phonePinId: phonePinId || "not-generated",
          ledgerId,
          note: "This _dev object is only visible in development mode",
        };

        console.log("📧 [DEV] Verification URL:", verificationUrl);
        console.log("🔑 [DEV] Verification Token:", verifyToken);
        console.log("🔢 [DEV] Verification Code:", verifyCode);
        console.log("📱 [DEV] Phone PIN ID:", phonePinId);
        console.log("💰 [DEV] Ledger ID:", ledgerId);
        console.log("🌍 [DEV] Phone formatted as:", phone);
      }

      return NextResponse.json(response, { status: 201 });
    } catch (transactionError) {
      // Rollback transaction on any error
      await session.abortTransaction();
      throw transactionError;
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    const mongoError = error as MongoError;

    // Handle duplicate key errors
    if (mongoError.code === 11000) {
      const field = Object.keys(mongoError.keyPattern || {})[0];
      let message = "Registration failed. Please check your details.";

      if (field === "neonId") {
        message = "Failed to generate unique identifier. Please try again.";
      } else if (field === "ledgerId") {
        message = "Ledger creation failed. Please try again.";
      }

      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  } finally {
    // Always end the session
    if (session) {
      await session.endSession();
    }
  }
}
