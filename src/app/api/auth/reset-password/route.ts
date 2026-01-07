// app/api/auth/reset-password/route.ts - IMPROVED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { hashPassword, verifyPassword } from "@/lib/password";
import { isValidEmail, isValidPassword, sanitizeEmail } from "@/lib/validator";
import { sendPasswordChangedEmail } from "@/lib/mail";
import {
  resetPasswordRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";

interface ResetPasswordQuery {
  email: string;
  resetPasswordCode?: string;
  resetPasswordToken?: string;
}

export async function POST(req: Request) {
  try {
    // ========== 1. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const { email: rawEmail, token, code, newPassword } = body;

    if (!rawEmail || (!token && !code) || !newPassword) {
      return NextResponse.json(
        { error: "Email, reset token or code, and new password are required" },
        { status: 400 }
      );
    }

    // Sanitize email
    const email = sanitizeEmail(rawEmail);

    // ========== 2. VALIDATE EMAIL & PASSWORD ==========
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
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

    const ip = getClientIp(req);

    // ========== 3. RATE LIMITING ==========
    const rateLimitKey = `${ip}:${email}`;
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      resetPasswordRateLimit,
      "Too many password reset attempts. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    // ========== 4. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 5. BUILD QUERY & FIND USER ==========
    const query: ResetPasswordQuery = { email };
    
    if (code) {
      query.resetPasswordCode = code.toUpperCase().trim();
    } else if (token) {
      query.resetPasswordToken = token.trim();
    }

    // Find user with matching email and reset token/code
    const user = await User.findOne(query).select(
      "+passwordHash +resetPasswordToken +resetPasswordCode"
    );

    if (!user) {
      // Generic error message to prevent enumeration
      return NextResponse.json(
        { error: "Invalid or expired reset credentials" },
        { status: 400 }
      );
    }

    // ========== 6. CHECK TOKEN EXPIRY ==========
    if (!user.resetPasswordExpiry || new Date() > user.resetPasswordExpiry) {
      // Clear expired token
      user.resetPasswordToken = undefined;
      user.resetPasswordCode = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();

      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // ========== 7. CHECK IF NEW PASSWORD IS SAME AS OLD ==========
    const isSamePassword = await verifyPassword(newPassword, user.passwordHash);

    if (isSamePassword) {
      return NextResponse.json(
        { error: "New password must be different from your current password" },
        { status: 400 }
      );
    }

    // ========== 8. HASH NEW PASSWORD ==========
    const passwordHash = await hashPassword(newPassword);

    // ========== 9. UPDATE USER ==========
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    // Increment tokenVersion to invalidate all existing JWTs
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    console.log(`🔐 Password reset successful for user: ${user.email}`);

    // ========== 10. REVOKE ALL REFRESH TOKENS ==========
    // Force re-login on all devices for security
    try {
      const result = await RefreshToken.updateMany(
        { userId: user._id, revokedAt: null },
        { 
          $set: { 
            revokedAt: new Date(), 
            revokedByIp: ip,
            replacedByToken: 'password_reset'
          } 
        }
      );
      
      console.log(`🔒 Revoked ${result.modifiedCount} active session(s) after password reset`);
    } catch (tokenError) {
      console.error("Failed to revoke refresh tokens:", tokenError);
      // Continue - password was reset successfully
    }

    // ========== 11. SEND PASSWORD CHANGED EMAIL ==========
    try {
      await sendPasswordChangedEmail(user.email, ip);
      console.log("✅ Password changed notification sent to:", user.email);
    } catch (mailError) {
      console.error("Failed to send password changed email:", mailError);
      // Continue - password was reset successfully
    }

    // ========== 12. LOG FOR DEVELOPMENT ==========
    if (process.env.NODE_ENV === 'development') {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔐 [DEV] Password Reset Completed");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👤 Email:", email);
      console.log("📍 IP:", ip);
      console.log("🔢 Token Version:", user.tokenVersion);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    // ========== 13. RETURN SUCCESS RESPONSE ==========
    return NextResponse.json(
      {
        message: "Password reset successfully. Please log in with your new password.",
        sessionInvalidated: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while resetting your password. Please try again." },
      { status: 500 }
    );
  }
}