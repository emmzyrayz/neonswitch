import { NextRequest } from "next/server";

/**
 * Type for request objects that might have IP information
 */
type RequestWithIp = Request | NextRequest | {
  headers: Headers | Record<string, string | string[]>;
  ip?: string;
  socket?: { remoteAddress?: string };
  connection?: { remoteAddress?: string };
};

/**
 * Get client IP address from request - ROBUST VERSION
 * Works across all Next.js contexts (Route Handlers, Middleware, Server Components, Pages)
 */
export function getClientIp(req: RequestWithIp): string {
  try {
    // For Next.js 13+ Route Handlers and Middleware with NextRequest
    if ('ip' in req && req.ip) {
      return req.ip;
    }

    // Standard headers approach (works in most contexts)
    const headers = 'headers' in req ? req.headers : undefined;
    
    if (!headers) {
      return process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'unknown';
    }

    // If headers is a Headers object (Route Handlers)
    if (headers instanceof Headers) {
      // Try multiple header options in order of reliability
      const forwardedFor = headers.get('x-forwarded-for');
      if (forwardedFor) {
        const ips = forwardedFor.split(',').map((ip: string) => ip.trim());
        if (ips[0] && ips[0] !== 'unknown') {
          return ips[0];
        }
      }

      const realIp = headers.get('x-real-ip');
      if (realIp && realIp !== 'unknown') {
        return realIp;
      }

      const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
      if (cfConnectingIp && cfConnectingIp !== 'unknown') {
        return cfConnectingIp;
      }

      const trueClientIp = headers.get('true-client-ip'); // Akamai and Cloudflare
      if (trueClientIp && trueClientIp !== 'unknown') {
        return trueClientIp;
      }

      const xClientIp = headers.get('x-client-ip');
      if (xClientIp && xClientIp !== 'unknown') {
        return xClientIp;
      }
    } 
    // For Pages Router (Legacy) - Record style headers
    else if (typeof headers === 'object') {
      const headerRecord = headers as Record<string, string | string[]>;
      
      const forwardedFor = headerRecord['x-forwarded-for'];
      if (forwardedFor) {
        const ipString = typeof forwardedFor === 'string' ? forwardedFor : forwardedFor[0];
        if (ipString) {
          const ips = ipString.split(',').map((ip: string) => ip.trim());
          if (ips[0] && ips[0] !== 'unknown') {
            return ips[0];
          }
        }
      }

      const realIp = headerRecord['x-real-ip'];
      if (realIp && realIp !== 'unknown') {
        return typeof realIp === 'string' ? realIp : realIp[0];
      }

      const cfConnectingIp = headerRecord['cf-connecting-ip'];
      if (cfConnectingIp && cfConnectingIp !== 'unknown') {
        return typeof cfConnectingIp === 'string' ? cfConnectingIp : cfConnectingIp[0];
      }

      const trueClientIp = headerRecord['true-client-ip'];
      if (trueClientIp && trueClientIp !== 'unknown') {
        return typeof trueClientIp === 'string' ? trueClientIp : trueClientIp[0];
      }

      const xClientIp = headerRecord['x-client-ip'];
      if (xClientIp && xClientIp !== 'unknown') {
        return typeof xClientIp === 'string' ? xClientIp : xClientIp[0];
      }
    }

    // Check for socket/connection info (Pages Router)
    if ('socket' in req && req.socket?.remoteAddress) {
      const socketIp = req.socket.remoteAddress;
      if (socketIp && socketIp !== '::1' && socketIp !== '127.0.0.1') {
        // Remove IPv6 prefix if present
        return socketIp.replace('::ffff:', '');
      }
    }

    if ('connection' in req && req.connection?.remoteAddress) {
      const connIp = req.connection.remoteAddress;
      if (connIp && connIp !== '::1' && connIp !== '127.0.0.1') {
        return connIp.replace('::ffff:', '');
      }
    }

    // Log for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Could not determine client IP, using fallback');
    }

    // Fallback to localhost for development
    return process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'unknown';

  } catch (error) {
    console.error('Error getting client IP:', error);
    return process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'unknown';
  }
}

/**
 * Get detailed IP information for logging/debugging
 */
export function getClientIpInfo(req: RequestWithIp): {
  ip: string;
  source: string;
  allHeaders: Record<string, string | null>;
} {
  const ip = getClientIp(req);
  let source = 'unknown';
  const allHeaders: Record<string, string | null> = {};

  try {
    const headers = 'headers' in req ? req.headers : undefined;

    if (headers instanceof Headers) {
      // Collect all relevant headers
      const headerNames = [
        'x-forwarded-for',
        'x-real-ip',
        'cf-connecting-ip',
        'true-client-ip',
        'x-client-ip',
      ];

      headerNames.forEach(name => {
        const value = headers.get(name);
        if (value) {
          allHeaders[name] = value;
          if (!source || source === 'unknown') {
            source = name;
          }
        }
      });
    }

    if ('ip' in req && req.ip) {
      source = 'req.ip';
    }
  } catch (error) {
    console.error('Error collecting IP info:', error);
  }

  return { ip, source, allHeaders };
}