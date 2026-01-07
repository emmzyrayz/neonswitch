// lib/AuthM.ts - IMPROVED VERSION
import { NextResponse } from "next/server";
import { verifyToken, isTokenVersionValid } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// ========== INTERFACES ==========

export interface AuthenticatedUser {
  userId: string;
  email: string;
  phone: string;
  neonId: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  kycTier: 0 | 1 | 2;
  kycStatus: "pending" | "approved" | "rejected";
  tokenVersion: number;
}

export interface AuthResult {
  error: NextResponse | null;
  user: AuthenticatedUser | null;
}

// ========== AUTHENTICATION ==========

/**
 * Authenticates a request by verifying the JWT token
 * Also validates token version and user status
 *
 * @param req - The incoming request
 * @returns Object with error response or authenticated user data
 */
export async function authenticateRequest(req: Request): Promise<AuthResult> {
  try {
    // ========== 1. GET TOKEN FROM HEADER ==========
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        error: NextResponse.json(
          { error: "No token provided" },
          { status: 401 }
        ),
        user: null,
      };
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // ========== 2. VERIFY TOKEN SIGNATURE ==========
    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        error: NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        ),
        user: null,
      };
    }

    // ========== 3. CHECK TOKEN TYPE ==========
    if (decoded.type !== "access") {
      return {
        error: NextResponse.json(
          { error: "Invalid token type" },
          { status: 401 }
        ),
        user: null,
      };
    }

    // ========== 4. CONNECT TO DATABASE ==========
    await connectDB();

    // ========== 5. GET USER & VERIFY TOKEN VERSION ==========
    const user = await User.findById(decoded.userId).select(
      "-passwordHash -verifyToken -verifyCode -resetPasswordToken -resetPasswordCode -phoneVerifyCode"
    );

    if (!user) {
      return {
        error: NextResponse.json({ error: "User not found" }, { status: 401 }),
        user: null,
      };
    }

    // ========== 6. VALIDATE TOKEN VERSION ==========
    if (!isTokenVersionValid(decoded.tokenVersion, user.tokenVersion)) {
      console.warn(
        `⚠️ Token version mismatch for user ${user.email}. ` +
          `Expected: ${user.tokenVersion || 0}, Got: ${
            decoded.tokenVersion || 0
          }`
      );

      return {
        error: NextResponse.json(
          {
            error: "Your session has been invalidated. Please log in again.",
            code: "TOKEN_VERSION_MISMATCH",
          },
          { status: 401 }
        ),
        user: null,
      };
    }

    // ========== 7. RETURN AUTHENTICATED USER ==========
    return {
      error: null,
      user: {
        userId: user._id.toString(),
        email: user.email,
        phone: user.phone,
        neonId: user.neonId,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        kycTier: user.kycTier,
        kycStatus: user.kycStatus,
        tokenVersion: user.tokenVersion || 0,
      },
    };
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return {
      error: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ),
      user: null,
    };
  }
}

/**
 * Middleware helper to require authentication
 * Returns early with error response if authentication fails
 *
 * @param req - The incoming request
 * @returns Authenticated user data or throws error response
 */
export async function requireAuth(req: Request): Promise<AuthenticatedUser> {
  const { error, user } = await authenticateRequest(req);

  if (error || !user) {
    throw (
      error ||
      NextResponse.json({ error: "Authentication required" }, { status: 401 })
    );
  }

  return user;
}

/**
 * Middleware helper to require admin role
 *
 * @param req - The incoming request
 * @returns Authenticated admin user data or throws error response
 */
export async function requireAdmin(req: Request): Promise<AuthenticatedUser> {
  const user = await requireAuth(req);

  if (user.role !== "admin") {
    throw NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  return user;
}

/**
 * Middleware helper to require email verification
 *
 * @param req - The incoming request
 * @returns Authenticated verified user data or throws error response
 */
export async function requireEmailVerified(
  req: Request
): Promise<AuthenticatedUser> {
  const user = await requireAuth(req);

  if (!user.isEmailVerified) {
    throw NextResponse.json(
      {
        error: "Email verification required",
        code: "EMAIL_NOT_VERIFIED",
        email: user.email,
      },
      { status: 403 }
    );
  }

  return user;
}

/**
 * Middleware helper to require phone verification
 *
 * @param req - The incoming request
 * @returns Authenticated verified user data or throws error response
 */
export async function requirePhoneVerified(
  req: Request
): Promise<AuthenticatedUser> {
  const user = await requireAuth(req);

  if (!user.isPhoneVerified) {
    throw NextResponse.json(
      {
        error: "Phone verification required",
        code: "PHONE_NOT_VERIFIED",
        phone: user.phone,
      },
      { status: 403 }
    );
  }

  return user;
}

/**
 * Middleware helper to require specific KYC tier
 *
 * @param req - The incoming request
 * @param minTier - Minimum required KYC tier (0, 1, or 2)
 * @returns Authenticated KYC-verified user data or throws error response
 */
export async function requireKycTier(
  req: Request,
  minTier: 0 | 1 | 2
): Promise<AuthenticatedUser> {
  const user = await requireAuth(req);

  if (user.kycTier < minTier) {
    throw NextResponse.json(
      {
        error: `KYC Tier ${minTier} or higher required`,
        code: "INSUFFICIENT_KYC_TIER",
        currentTier: user.kycTier,
        requiredTier: minTier,
      },
      { status: 403 }
    );
  }

  if (user.kycStatus !== "approved") {
    throw NextResponse.json(
      {
        error: "KYC verification must be approved",
        code: "KYC_NOT_APPROVED",
        kycStatus: user.kycStatus,
      },
      { status: 403 }
    );
  }

  return user;
}
