// app/api/auth/change-password/route.ts - IMPROVED VERSION
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/AuthM";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { verifyPassword, hashPassword } from "@/lib/password";
import { isValidPassword } from "@/lib/validator";
import { sendPasswordChangedEmail } from "@/lib/mail";
import {
  changePasswordRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";

export async function POST(req: Request) {
  try {
    // ========== 1. AUTHENTICATE USER ==========
    const { error, user: authUser } = await authenticateRequest(req);
    
    if (error || !authUser) {
      return error || NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // ========== 2. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: "Invalid password format" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
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
    const rateLimitKey = `${ip}:${authUser.userId}`;
    
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      changePasswordRateLimit,
      "Too many password change attempts. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    // ========== 4. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 5. GET USER WITH PASSWORD ==========
    const user = await User.findById(authUser.userId).select("+passwordHash");
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ========== 6. VERIFY CURRENT PASSWORD ==========
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // ========== 7. HASH AND SAVE NEW PASSWORD ==========
    user.passwordHash = await hashPassword(newPassword);
    // Increment tokenVersion to invalidate all existing JWTs
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    console.log(`🔐 Password changed successfully for user: ${user.email}`);

    // ========== 8. REVOKE ALL REFRESH TOKENS ==========
    // Force re-login on all devices for security
    try {
      const result = await RefreshToken.updateMany(
        { userId: user._id, revokedAt: null },
        { 
          $set: { 
            revokedAt: new Date(), 
            revokedByIp: ip,
            replacedByToken: 'password_changed'
          } 
        }
      );
      
      console.log(`🔒 Revoked ${result.modifiedCount} active session(s) after password change`);
    } catch (tokenError) {
      console.error("Failed to revoke refresh tokens:", tokenError);
      // Continue - password was changed successfully
    }

    // ========== 9. SEND PASSWORD CHANGED EMAIL ==========
    try {
      await sendPasswordChangedEmail(user.email, ip);
      console.log("✅ Password changed notification sent to:", user.email);
    } catch (mailError) {
      console.error("Failed to send password change email:", mailError);
      // Continue - password was changed successfully
    }

    // ========== 10. LOG FOR DEVELOPMENT ==========
    if (process.env.NODE_ENV === 'development') {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔐 [DEV] Password Change Completed");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👤 User:", user.email);
      console.log("🆔 User ID:", user._id.toString());
      console.log("📍 IP:", ip);
      console.log("🔢 New Token Version:", user.tokenVersion);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    // ========== 11. RETURN SUCCESS RESPONSE ==========
    return NextResponse.json(
      {
        message: "Password changed successfully. Please log in again on all devices.",
        sessionsInvalidated: true,
        tokenVersion: user.tokenVersion,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return NextResponse.json(
      { error: "An error occurred while changing your password. Please try again." },
      { status: 500 }
    );
  }
}