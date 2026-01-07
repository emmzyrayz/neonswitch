// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RefreshToken from "@/models/RefreshToken";
import { verifyToken } from "@/lib/jwt";
import { getClientIp } from "@/lib/upstashLimiter";
import { cookies } from "next/headers";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    // Get tokens
   const cookieStore = await cookies();
    const cookieToken = cookieStore.get('refreshToken')?.value;
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    const logoutAll = req.headers.get('x-logout-all') === 'true';

    const ip = getClientIp(req);

    await connectDB();

     let userId: string | null = null;
    let revokedCount = 0;

    // ========== 2. REVOKE REFRESH TOKEN FROM COOKIE ==========
    if (cookieToken) {
      const token = await RefreshToken.findOne({ token: cookieToken });
      if (token && !token.revokedAt) {
        await token.revoke(ip);
        userId = token.userId.toString();
        revokedCount++;
        console.log("✅ Revoked refresh token from cookie");
      }
    }

   // ========== 3. HANDLE LOGOUT FROM ALL DEVICES ==========
    if (accessToken) {
      try {
        const decoded = verifyToken(accessToken);
        
        if (decoded && typeof decoded !== 'string') {
          userId = decoded.userId;

          if (logoutAll) {
            // Revoke all refresh tokens for this user
            const result = await RefreshToken.updateMany(
              { userId: decoded.userId, revokedAt: null },
              { 
                $set: { 
                  revokedAt: new Date(), 
                  revokedByIp: ip,
                  replacedByToken: 'logout_all_devices'
                } 
              }
            );
            
            revokedCount = result.modifiedCount;

            // Increment tokenVersion to invalidate all existing JWTs
             const userIdToUpdate = decoded.userId || userId;
            if (userIdToUpdate) {
              await User.findByIdAndUpdate(
                userIdToUpdate,
                { $inc: { tokenVersion: 1 } }
              );
            }

            console.log(`🔒 Logged out from all devices (${revokedCount} sessions)`);
          }
        }
      } catch (tokenError) {
        console.warn("Invalid access token during logout:", tokenError);
        // Continue with logout even if token is invalid
      }
    }

     // ========== 3B. HANDLE LOGOUT ALL WITHOUT ACCESS TOKEN ==========
    // If logoutAll was requested but we only have refresh token
    if (logoutAll && !accessToken && userId) {
      try {
        const result = await RefreshToken.updateMany(
          { userId, revokedAt: null },
          { 
            $set: { 
              revokedAt: new Date(), 
              revokedByIp: ip,
              replacedByToken: 'logout_all_devices'
            } 
          }
        );
        
        revokedCount = result.modifiedCount;

        // Increment tokenVersion
        await User.findByIdAndUpdate(
          userId,
          { $inc: { tokenVersion: 1 } }
        );

        console.log(`🔒 Logged out from all devices via refresh token (${revokedCount} sessions)`);
      } catch (error) {
        console.error("Error logging out all devices via refresh token:", error);
      }
    }

  // ========== 4. PREPARE RESPONSE ==========
    const message = logoutAll 
      ? `Logged out from all devices (${revokedCount} session${revokedCount !== 1 ? 's' : ''})` 
      : "Logged out successfully";

    const response = NextResponse.json({
      message,
      ...(logoutAll && { sessionsRevoked: revokedCount })
    }, { status: 200 });

     // ========== 5. CLEAR REFRESH TOKEN COOKIE ==========
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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

    // ========== 2. REVOKE ALL REFRESH TOKENS ==========
    const result = await RefreshToken.updateMany(
      { userId: decoded.userId, revokedAt: null },
      { 
        $set: { 
          revokedAt: new Date(), 
          revokedByIp: ip,
          replacedByToken: 'logout_all_devices'
        } 
      }
    );

    // ========== 3. INCREMENT TOKEN VERSION ==========
    // This invalidates ALL existing JWTs for this user
    await User.findByIdAndUpdate(
      decoded.userId,
      { $inc: { tokenVersion: 1 } }
    );

    console.log(`🔒 User ${decoded.userId} logged out from all devices (${result.modifiedCount} sessions)`);


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