// app/api/auth/register/route.ts - UPDATED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User, { IUser } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { generateNeonId } from "@/lib/neonId";
import { isValidEmail, isValidPassword, sanitizeEmail } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { sendSms, generateSMSVerificationCode, smsTemplates } from "@/lib/sms";
import {
  registerRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";
import { getCountryCallingCode, parsePhoneNumber } from "@/lib/phone";

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
    phone: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    nationality: string;
  };
  _dev?: {
    verificationUrl: string;
    verificationToken: string;
    verificationCode: string;
    phoneVerificationCode: string;
    note: string;
  };
}

export async function POST(req: Request) {
  try {
    // ========== 1. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const {
      email: rawEmail,
      password,
      phone: rawPhone,
      nationality, // ISO country code (e.g., "NG", "US", "GB")
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

    // ========== 5. DETERMINE COUNTRY CODE FOR PHONE FORMATTING ==========
    let countryCodeForPhone = nationality?.toUpperCase();

     // If nationality not provided, try to infer from phone number or default to Nigeria
    if (!countryCodeForPhone) {
      // If phone starts with +, we can try to detect country, otherwise default to NG
      if (!rawPhone.startsWith("+")) {
        countryCodeForPhone = "NG"; // Default fallback
        console.warn(
          "No nationality provided and phone doesn't have country code. Defaulting to Nigeria (NG)."
        );
      }
    }

    // ========== 6. VALIDATE & PARSE PHONE NUMBER ==========
    const phoneResult = parsePhoneNumber(rawPhone, countryCodeForPhone);
    if (!phoneResult.valid) {
      return NextResponse.json(
        { error: phoneResult.error || "Invalid phone number" },
        { status: 400 }
      );
    }
    const phone = phoneResult.formatted!; // E.164 format

    // If nationality was provided, validate it's a supported country
    if (nationality) {
      const callingCode = getCountryCallingCode(nationality);
      if (!callingCode) {
        return NextResponse.json(
          {
            error: `Unsupported country code: ${nationality}. Please provide a valid ISO 3166-1 alpha-2 country code (e.g., NG, US, GB).`,
          },
          { status: 400 }
        );
      }
    }

    // ========== 4. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 5. CHECK IF USER EXISTS ==========
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

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

    // ========== 12. GENERATE PHONE VERIFICATION CODE ==========
    const phoneVerifyCode = generateSMSVerificationCode(6);
    const phoneVerifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes


    // ========== 9. CREATE USER ==========
    const userData: IUser = {
      email,
      phone,
      passwordHash,
      neonId,
      verifyToken,
      verifyCode,
      verifyTokenExpiry,
      phoneVerifyCode,
      phoneVerifyCodeExpiry,
      lastVerificationSentAt: new Date(),
      lastPhoneVerificationSentAt: new Date(),
      role: "user",
      isEmailVerified: false,
      isPhoneVerified: false,
      kycTier: 0,
      kycStatus: "pending",
      profile: {
        firstName: undefined,
        lastName: undefined,
        dateOfBirth: new Date(dateOfBirth),
        nationality: nationality,
        gender: gender
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add optional profile data if provided
    if (firstName || lastName || dateOfBirth || nationality || gender) {
      userData.profile = {};
      if (firstName) userData.profile.firstName = firstName;
      if (lastName) userData.profile.lastName = lastName;
      if (dateOfBirth) userData.profile.dateOfBirth = new Date(dateOfBirth);
      if (nationality) userData.profile.nationality = nationality.toUpperCase();
      if (gender && ["male", "female", "other"].includes(gender)) {
        userData.profile.gender = gender;
      }
    }

     // ========== 14. CREATE USER ==========
    const user = await User.create(userData);


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

    // ========== 17. SEND PHONE VERIFICATION SMS ==========
    try {
      const appName = process.env.NEXT_PUBLIC_APP_NAME || "YourApp";
      const smsMessage = smsTemplates.phoneVerification(
        phoneVerifyCode,
        appName
      );
      const smsResult = await sendSms(phone, smsMessage);

      if (smsResult.success) {
        console.log("✅ Verification SMS sent to:", phone);
      } else {
        console.error("Failed to send SMS:", smsResult.error);
        // Don't fail registration if SMS fails - user can resend later
      }
    } catch (smsError) {
      console.error("SMS service error:", smsError);
      // Don't fail registration if SMS fails
    }

    // ========== 12. PREPARE RESPONSE ==========
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const response: RegistrationResponse = {
      message: "Registration successful. Please check your email and phone to verify your account.",
      user: {
        id: user._id.toString(),
        neonId: user.neonId,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        nationality: user.profile.nationality,
      },
    };

    // Only include dev info in development mode
    if (isDevelopment) {
      response._dev = {
        verificationUrl,
        verificationToken: verifyToken,
        verificationCode: verifyCode,
        phoneVerificationCode: phoneVerifyCode,
        note: "This _dev object is only visible in development mode",
      };
      
      console.log("📧 [DEV] Verification URL:", verificationUrl);
      console.log("🔑 [DEV] Verification Token:", verifyToken);
      console.log("🔢 [DEV] Verification Code:", verifyCode);
    console.log("📱 [DEV] Phone Verification Code:", phoneVerifyCode);
      console.log("🌍 [DEV] Phone formatted as:", phone);
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    const mongoError = error as MongoError;

    // Handle duplicate key errors
    if (mongoError.code === 11000) {
      const field = Object.keys(mongoError.keyPattern || {})[0];
       let message = "Registration failed. Please check your details.";
      if (field === "neonId") {
        message = "Failed to generate unique identifier. Please try again.";
      }

      return NextResponse.json({ error: message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}