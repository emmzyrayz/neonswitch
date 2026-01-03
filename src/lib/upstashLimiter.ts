import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// Create Redis instance
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiters
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

export const registerRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "1 h"),
  analytics: true,
  prefix: "ratelimit:register",
});

export const forgotPasswordRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:forgot-password",
});

export const verifyRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:verify",
});

export const resendVerificationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:resend",
});

export const resetPasswordRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:reset-password",
});

export const changePasswordRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:change-password",
});

/**
 * Apply rate limit and return response if exceeded
 */
export async function applyRateLimit(
  identifier: string,
  ratelimiter: Ratelimit,
  customMessage?: string
): Promise<{ blocked: boolean; response?: NextResponse }> {
  const { success, limit, remaining, reset } = await ratelimiter.limit(identifier);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    
    return {
      blocked: false,
      response: NextResponse.json(
        {
          error: customMessage || "Too many requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": new Date(reset).toISOString(),
          },
        }
      ),
    };
  }

  return { blocked: true };
}

// Usage example in route:
// const clientIp = getClientIp(req);
// const result = await applyRateLimit(clientIp, loginRateLimit, "Too many login attempts");
// if (!result.success) return result.response;

export { getClientIp, getClientIpInfo } from "./ip";