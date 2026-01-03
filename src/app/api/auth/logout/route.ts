// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RefreshToken from "@/models/RefreshToken";
import { verifyToken } from "@/lib/jwt";
import { getClientIp } from "@/lib/upstashLimiter";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Get tokens
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('refreshToken')?.value;
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    const ip = getClientIp(req);

    await connectDB();

    // If we have a refresh token, revoke it
    if (cookieToken) {
      const token = await RefreshToken.findOne({ token: cookieToken });
      if (token) {
        await token.revoke(ip);
      }
    }

    // Optional: Revoke all refresh tokens for this user
    // (useful for "logout from all devices")
    if (accessToken) {
      const decoded = verifyToken(accessToken);
      if (decoded && typeof decoded !== 'string') {
        const logoutAll = req.headers.get('x-logout-all') === 'true';
        
        if (logoutAll) {
          await RefreshToken.updateMany(
            { userId: decoded.userId, revokedAt: null },
            { $set: { revokedAt: new Date(), revokedByIp: ip } }
          );
        }
      }
    }

    // Clear refresh token cookie
    const response = NextResponse.json({
      message: "Logged out successfully"
    }, { status: 200 });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return response;

  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    
    // Even if logout fails, clear the cookie
    const response = NextResponse.json({
      message: "Logged out"
    }, { status: 200 });
    
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });
    
    return response;
  }
}

// Optional: GET endpoint to logout from all devices
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authorization required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(accessToken);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const ip = getClientIp(req);

    // Revoke ALL refresh tokens for this user
    const result = await RefreshToken.updateMany(
      { userId: decoded.userId, revokedAt: null },
      { $set: { revokedAt: new Date(), revokedByIp: ip } }
    );

     const response = NextResponse.json({
      message: "Logged out from all devices",
      devicesLoggedOut: result.modifiedCount
    }, { status: 200 });


    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error("LOGOUT ALL ERROR:", error);
    return NextResponse.json(
      { error: "Failed to logout from all devices" },
      { status: 500 }
    );
  }
}