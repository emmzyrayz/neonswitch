// app/api/auth/refresh/route.ts - IMPROVED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { getClientIp } from "@/lib/upstashLimiter";
import { cookies } from "next/headers";

const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';
const REQUIRE_PHONE_VERIFICATION = process.env.REQUIRE_PHONE_VERIFICATION === 'true';

export async function POST(req: Request) {
  try {
    // ========== 1. GET REFRESH TOKEN ==========
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('refreshToken')?.value;
    const bodyData = await req.json().catch(() => ({}));
    const token = cookieToken || bodyData.refreshToken;

    if (!token) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 401 }
      );
    }

    // ========== 2. VERIFY JWT SIGNATURE ==========
    const decoded = verifyRefreshToken(token);
    
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // ========== 3. CHECK TOKEN TYPE ==========
    if (decoded.type !== 'refresh') {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 }
      );
    }

    await connectDB();

    const ip = getClientIp(req);

    // ========== 4. CHECK TOKEN IN DATABASE ==========
    const storedToken = await RefreshToken.findOne({ token });
    
    if (!storedToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    if (!storedToken.isActive) {
      // Token has been revoked or expired - potential security issue
      // Revoke all tokens for this user (token rotation compromised)
      console.warn(`⚠️ Inactive refresh token used. Revoking all tokens for user: ${storedToken.userId}`);
      
      await RefreshToken.updateMany(
        { userId: storedToken.userId, revokedAt: null },
        { 
          $set: { 
            revokedAt: new Date(), 
            revokedByIp: ip,
            replacedByToken: 'security_breach_detected'
          } 
        }
      );
      
      return NextResponse.json(
        { error: "Refresh token has been revoked. Please log in again." },
        { status: 401 }
      );
    }

    // ========== 5. GET USER WITH TOKEN VERSION ==========
    const user = await User.findById(decoded.userId).select('+tokenVersion');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // ========== 6. VERIFY TOKEN VERSION ==========
    // Check if tokenVersion matches (for instant token invalidation)
    const decodedTokenVersion = decoded.tokenVersion || 0;
    const currentTokenVersion = user.tokenVersion || 0;

    if (decodedTokenVersion !== currentTokenVersion) {
      console.warn(`⚠️ Token version mismatch for user: ${user.email}. Expected ${currentTokenVersion}, got ${decodedTokenVersion}`);
      
      // Revoke this specific token
      await storedToken.revoke(ip, 'token_version_mismatch');
      
      return NextResponse.json(
        { 
          error: "Your session has been invalidated. Please log in again.",
          code: 'TOKEN_VERSION_MISMATCH'
        },
        { status: 401 }
      );
    }

    // ========== 7. CHECK VERIFICATION STATUS ==========
    if (REQUIRE_EMAIL_VERIFICATION && !user.isEmailVerified) {
      return NextResponse.json(
        { 
          error: "Email verification required",
          requiresVerification: true,
          verificationType: 'email',
          email: user.email,
          code: 'EMAIL_NOT_VERIFIED'
        },
        { status: 403 }
      );
    }

    if (REQUIRE_PHONE_VERIFICATION && !user.isPhoneVerified) {
      return NextResponse.json(
        { 
          error: "Phone verification required",
          requiresVerification: true,
          verificationType: 'phone',
          phone: user.phone,
          code: 'PHONE_NOT_VERIFIED'
        },
        { status: 403 }
      );
    }

    // ========== 8. GENERATE NEW TOKENS ==========
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      neonId: user.neonId,
      role: user.role,
      tokenVersion: user.tokenVersion || 0,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // ========== 9. REVOKE OLD TOKEN & CREATE NEW ONE (TOKEN ROTATION) ==========
    await storedToken.revoke(ip, newRefreshToken);

    // Store new refresh token
    await RefreshToken.create({
      token: newRefreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdByIp: ip,
      userAgent: req.headers.get('user-agent') || 'unknown'
    });

    console.log(`✅ Token refreshed successfully for user: ${user.email}`);

    // ========== 10. PREPARE RESPONSE ==========
    const response = NextResponse.json({
      accessToken: newAccessToken,
      message: "Token refreshed successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
        neonId: user.neonId,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        kycTier: user.kycTier,
        kycStatus: user.kycStatus,
      }
    }, { status: 200 });

    // ========== 11. SET NEW REFRESH TOKEN COOKIE ==========
    response.cookies.set({
      name: 'refreshToken',
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });

    return response;

  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    );
  }
}