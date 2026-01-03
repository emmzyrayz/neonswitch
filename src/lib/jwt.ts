import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;


if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in .env");
}

export interface TokenPayload {
  userId: string;
  email: string;
  type?: "access" | "refresh";
}

export function generateAccessToken(payload: Omit<TokenPayload, "type">): string {
  return jwt.sign(
    { ...payload, type: "access" },
    JWT_SECRET,
    { expiresIn: "1h" } // Short-lived access token
  );
}

export function generateRefreshToken(payload: Omit<TokenPayload, "type">): string {
  const secret = JWT_REFRESH_SECRET || JWT_SECRET;
  return jwt.sign(
    { ...payload, type: "refresh" },
    secret,
    { expiresIn: "7d" } // Longer-lived refresh token
  );
}

export function generateToken(
  payload: object,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): string | JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): string | JwtPayload | null {
  try {
    const secret = JWT_REFRESH_SECRET || JWT_SECRET;
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}