// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import RefreshToken from "@/models/RefreshToken";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { getClientIp } from "@/lib/upstashLimiter";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Get refresh token from cookie or body
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get('refreshToken')?.value;
    const bodyData = await req.json().catch(() => ({}));
    const token = cookieToken || bodyData.refreshToken;

    if (!token) {
      return NextResponse.json(
        { error: "Refresh token required" },
        { status: 401 }
      );
    }

    // Verify JWT signature
    const decoded = verifyRefreshToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Check token type
    if (decoded.type !== 'refresh') {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if token exists in database and is active
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
      await RefreshToken.updateMany(
        { userId: storedToken.userId },
        { $set: { revokedAt: new Date(), revokedByIp: getClientIp(req) } }
      );
      
      return NextResponse.json(
        { error: "Refresh token has been revoked. Please login again." },
        { status: 401 }
      );
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // Check if user is still active/verified (if required)
    const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';
    if (REQUIRE_EMAIL_VERIFICATION && !user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email verification required" },
        { status: 403 }
      );
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Revoke old refresh token and create new one (token rotation)
    const ip = getClientIp(req);
    await storedToken.revoke(ip, newRefreshToken);

    // Store new refresh token
    await RefreshToken.create({
      token: newRefreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdByIp: ip,
      userAgent: req.headers.get('user-agent') || 'unknown'
    });

    // Prepare response
    const response = NextResponse.json({
      accessToken: newAccessToken,
      message: "Token refreshed successfully",
      user: {
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        neonId: user.neonId
      }
    }, { status: 200 });

    // Set new refresh token in cookie
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