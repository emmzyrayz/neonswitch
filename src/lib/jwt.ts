// lib/jwt.ts - IMPROVED VERSION
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in .env");
}

// ========== INTERFACES ==========

export interface TokenPayload {
  userId: string;
  email: string;
  neonId?: string;
  role?: "user" | "admin";
  tokenVersion?: number;
  type?: "access" | "refresh";
}

export interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
  neonId?: string;
  role?: "user" | "admin";
  tokenVersion?: number;
  type: "access" | "refresh";
}

// ========== TOKEN GENERATION ==========

/**
 * Generates a short-lived access token (1 hour)
 * Used for authenticating API requests
 */
export function generateAccessToken(
  payload: Omit<TokenPayload, "type">
): string {
  return jwt.sign(
    {
      ...payload,
      type: "access",
      tokenVersion: payload.tokenVersion || 0,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

/**
 * Generates a long-lived refresh token (7 days)
 * Used for obtaining new access tokens
 */
export function generateRefreshToken(
  payload: Omit<TokenPayload, "type">
): string {
  const secret = JWT_REFRESH_SECRET || JWT_SECRET;
  return jwt.sign(
    {
      ...payload,
      type: "refresh",
      tokenVersion: payload.tokenVersion || 0,
    },
    secret,
    { expiresIn: "7d" }
  );
}

/**
 * Generic token generator for other use cases (email verification, etc.)
 */
export function generateToken(
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// ========== TOKEN VERIFICATION ==========

/**
 * Verifies an access token
 * Returns decoded token or null if invalid
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Verifies a refresh token
 * Returns decoded token or null if invalid
 */
export function verifyRefreshToken(token: string): DecodedToken | null {
  try {
    const secret = JWT_REFRESH_SECRET || JWT_SECRET;
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch  {
    return null;
  }
}

/**
 * Decodes a token without verifying signature
 * Useful for debugging or extracting expired token data
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch {
    return null;
  }
}

// ========== TOKEN VALIDATION ==========

/**
 * Validates if a token is an access token
 */
export function isAccessToken(decoded: DecodedToken): boolean {
  return decoded.type === "access";
}

/**
 * Validates if a token is a refresh token
 */
export function isRefreshToken(decoded: DecodedToken): boolean {
  return decoded.type === "refresh";
}

/**
 * Checks if token version matches current user version
 * Used to invalidate all tokens when user changes password
 */
export function isTokenVersionValid(
  decodedVersion: number | undefined,
  currentVersion: number | undefined
): boolean {
  const tokenVer = decodedVersion || 0;
  const currentVer = currentVersion || 0;
  return tokenVer === currentVer;
}
