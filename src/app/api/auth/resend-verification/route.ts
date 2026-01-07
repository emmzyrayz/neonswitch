// app/api/auth/resend-verification/route.ts - IMPROVED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { isValidEmail, sanitizeEmail } from "@/lib/validator";
import { generateToken, generateVerificationCode } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";
import { sendSms, generateSMSVerificationCode, smsTemplates } from "@/lib/sms";
import {
  resendVerificationRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";

const EMAIL_TOKEN_EXPIRY_HOURS = 24;
const PHONE_CODE_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_MINUTES = 2;

type VerificationType = "email" | "phone";

export async function POST(req: Request) {
  try {
    // ========== 1. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const { email: rawEmail, type = "email" } = body;

    if (!rawEmail) {
      return NextResponse.json(
        { error: "Email is required" },
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
    const rateLimitKey = `${ip}:${email}:${verificationType}`;
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      resendVerificationRateLimit,
      `Too many ${verificationType} verification requests. Please try again later.`
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    // ========== 4. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 5. FIND USER ==========
    const selectFields = verificationType === "email" 
      ? "+verifyToken +verifyCode"
      : "+phoneVerifyCode";
    
    const user = await User.findOne({ email }).select(selectFields);

    // Generic response for security
    const genericResponse = NextResponse.json(
      {
        message: `If your account is registered, you will receive a ${verificationType} verification.`,
      },
      { status: 200 }
    );

    if (!user) {
      // Add timing delay to prevent user enumeration
      await new Promise(resolve => setTimeout(resolve, 100));
      return genericResponse;
    }

    // ========== 6. CHECK IF ALREADY VERIFIED ==========
    if (verificationType === "email" && user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 200 }
      );
    }

    if (verificationType === "phone" && user.isPhoneVerified) {
      return NextResponse.json(
        { message: "Phone number is already verified" },
        { status: 200 }
      );
    }

    // ========== 7. CHECK TIME-BASED RATE LIMIT ==========
    const now = Date.now();
    const cooldownMs = RESEND_COOLDOWN_MINUTES * 60 * 1000;

    const lastSentAt = verificationType === "email" 
      ? user.lastVerificationSentAt 
      : user.lastPhoneVerificationSentAt;

    if (lastSentAt && now - lastSentAt.getTime() < cooldownMs) {
      const waitTime = Math.ceil((cooldownMs - (now - lastSentAt.getTime())) / 1000);
      return NextResponse.json(
        { 
          error: `Please wait before requesting another ${verificationType} verification.`,
          retryAfter: waitTime
        },
        { status: 429 }
      );
    }

    // ========== 8. HANDLE EMAIL VERIFICATION ==========
    if (verificationType === "email") {
      // Generate new token & code
      const verifyToken = generateToken();
      const verifyCode = generateVerificationCode(6);
      const verifyTokenExpiry = new Date(Date.now() + EMAIL_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Update user
      user.verifyToken = verifyToken;
      user.verifyCode = verifyCode;
      user.verifyTokenExpiry = verifyTokenExpiry;
      user.lastVerificationSentAt = new Date();
      await user.save();

      // Build verification URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const verificationUrl = `${baseUrl}/auth/verify?token=${verifyToken}&email=${encodeURIComponent(email)}`;

      // Send email
      try {
        await sendVerificationEmail(email, verificationUrl, verifyCode);
        console.log("✅ Verification email resent to:", email);
      } catch (mailError) {
        console.error("Failed to send verification email:", mailError);
        // Continue - user can try again later
      }

      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📧 [DEV] Email Verification Details");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("👤 Email:", email);
        console.log("🔗 URL:", verificationUrl);
        console.log("🔑 Token:", verifyToken);
        console.log("🔢 Code:", verifyCode);
        console.log(`⏰ Expires in: ${EMAIL_TOKEN_EXPIRY_HOURS} hour(s)`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
    }

    // ========== 9. HANDLE PHONE VERIFICATION ==========
    if (verificationType === "phone") {
      if (!user.phone) {
        return NextResponse.json(
          { error: "No phone number associated with this account" },
          { status: 400 }
        );
      }

      // Generate new phone verification code
      const phoneVerifyCode = generateSMSVerificationCode(6);
      const phoneVerifyCodeExpiry = new Date(Date.now() + PHONE_CODE_EXPIRY_MINUTES * 60 * 1000);

      // Update user
      user.phoneVerifyCode = phoneVerifyCode;
      user.phoneVerifyCodeExpiry = phoneVerifyCodeExpiry;
      user.lastPhoneVerificationSentAt = new Date();
      await user.save();

      // Send SMS
      try {
        const appName = process.env.NEXT_PUBLIC_APP_NAME || "YourApp";
        const smsMessage = smsTemplates.phoneVerification(phoneVerifyCode, appName);
        const smsResult = await sendSms(user.phone, smsMessage);

        if (smsResult.success) {
          console.log("✅ Verification SMS resent to:", user.phone);
        } else {
          console.error("Failed to send SMS:", smsResult.error);
        }
      } catch (smsError) {
        console.error("SMS service error:", smsError);
        // Continue - user can try again later
      }

      // Development logging
      if (process.env.NODE_ENV === 'development') {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📱 [DEV] Phone Verification Details");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("👤 Email:", email);
        console.log("📞 Phone:", user.phone);
        console.log("🔢 Code:", phoneVerifyCode);
        console.log(`⏰ Expires in: ${PHONE_CODE_EXPIRY_MINUTES} minute(s)`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
    }

    // ========== 10. RETURN SUCCESS RESPONSE ==========
    return NextResponse.json(
      {
        message: `${verificationType === "email" ? "Email" : "SMS"} verification sent. Please check your ${verificationType === "email" ? "inbox" : "phone"}.`,
        type: verificationType
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("RESEND VERIFICATION ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while sending verification. Please try again." },
      { status: 500 }
    );
  }
}


// API Usage:
// Resend Email Verification:
// bashcurl -X POST /api/auth/resend-verification \
//   -H "Content-Type: application/json" \
//   -d '{
//     "email": "user@example.com",
//     "type": "email"
//   }'
// Resend Phone Verification:
// bashcurl -X POST /api/auth/resend-verification \
//   -H "Content-Type: application/json" \
//   -d '{
//     "email": "user@example.com",
//     "type": "phone"
//   }'
// Backward Compatible (defaults to email):
// bashcurl -X POST /api/auth/resend-verification \
//   -H "Content-Type: application/json" \
//   -d '{
//     "email": "user@example.com"
//   }'