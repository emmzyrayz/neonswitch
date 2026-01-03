// app/api/auth/login/route.ts - UPDATED VERSION
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { verifyPassword } from "@/lib/password";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { isValidEmail, sanitizeEmail } from "@/lib/validator";
import {
  loginRateLimit,
  applyRateLimit,
  getClientIp,
} from "@/lib/upstashLimiter";

const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';
// const MAX_SESSIONS = 1;

export async function POST(req: Request) {
  try {
    // ========== 1. PARSE & VALIDATE INPUT ==========
    const body = await req.json();
    const { email: rawEmail, password, rememberMe = false } = body;

    if (!rawEmail || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const email = sanitizeEmail(rawEmail);
    
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    // ========== 2. RATE LIMITING ==========
    const ip = getClientIp(req);
    const rateLimitKey = `${ip}:${email}`;
    
    const rateLimit = await applyRateLimit(
      rateLimitKey,
      loginRateLimit,
      "Too many login attempts. Please try again later."
    );

    if (!rateLimit.blocked) {
      return rateLimit.response;
    }

    // ========== 3. DATABASE & USER LOOKUP ==========
    await connectDB();

    // Get user with passwordHash field
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      // Constant-time delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ========== 4. VERIFY PASSWORD ==========
    const valid = await verifyPassword(password, user.passwordHash);
    
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ========== 5. CHECK EMAIL VERIFICATION ==========
    if (REQUIRE_EMAIL_VERIFICATION && !user.isEmailVerified) {
      return NextResponse.json(
        { 
          error: "Please verify your email before logging in",
          requiresVerification: true,
          email: user.email,
          code: 'EMAIL_NOT_VERIFIED'
        },
        { status: 403 }
      );
    }

    // ========== 6. REVOKE ALL EXISTING SESSIONS (FINTECH SECURITY) ==========
    try {
      const revokedCount = await RefreshToken.countDocuments({
        userId: user._id,
        revokedAt: null,
        expiresAt: { $gt: new Date() }
      });

      if (revokedCount > 0) {
        // Revoke all existing sessions before creating new one
        await RefreshToken.updateMany(
          { userId: user._id, revokedAt: null },
          { 
            $set: { 
              revokedAt: new Date(), 
              revokedByIp: ip,
              replacedByToken: 'new_login_session'
            } 
          }
        );
        console.log(`🔒 Revoked ${revokedCount} existing session(s) for security`);
      }
    } catch (error) {
      console.error("Failed to revoke old sessions:", error);
      // Continue with login - security over convenience
    }

    // ========== 6. GENERATE TOKENS ==========
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // ========== 7. STORE REFRESH TOKEN ==========
    const refreshTokenExpiry = rememberMe 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // 7 days

    try {
      await RefreshToken.create({
        token: refreshToken,
        userId: user._id,
        expiresAt: refreshTokenExpiry,
        createdByIp: ip,
        userAgent: req.headers.get('user-agent') || 'unknown'
      });
    } catch (error) {
      console.error("Failed to store refresh token:", error);
      // Continue with login even if refresh token storage fails
    }

    // ========== 8. LIMIT ACTIVE SESSIONS ==========
    // const MAX_SESSIONS = 1;
    // try {
    //   const activeTokens = await RefreshToken.countDocuments({
    //     userId: user._id,
    //     revokedAt: null,
    //     expiresAt: { $gt: new Date() }
    //   });

    //   if (activeTokens > MAX_SESSIONS) {
    //     // Revoke oldest tokens
    //     const tokensToRevoke = await RefreshToken.find({
    //       userId: user._id,
    //       revokedAt: null,
    //       expiresAt: { $gt: new Date() }
    //     })
    //     .sort({ createdAt: 1 })
    //     .limit(activeTokens - MAX_SESSIONS);

    //     for (const token of tokensToRevoke) {
    //       await token.revoke(ip, 'max_sessions_exceeded');
    //     }
    //   }
    // } catch (error) {
    //   console.error("Failed to cleanup old sessions:", error);
    // }

    // ========== 9. PREPARE RESPONSE ==========
    const response = NextResponse.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        neonId: user.neonId,
      },
    }, { status: 200 });

    // ========== 10. SET HTTPONLY COOKIE ==========
    response.cookies.set({
      name: 'refreshToken',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    
    return NextResponse.json(
      { 
        error: "An error occurred during login. Please try again.",
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}