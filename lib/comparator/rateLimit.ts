/**
 * Sliding-window rate limiter keyed by client IP.
 *
 * Defaults (overridable via env vars):
 *   RATE_LIMIT_MAX      = 60   requests
 *   RATE_LIMIT_WINDOW_S = 60   seconds
 *
 * For production at scale, replace the in-memory store with Redis
 * using the INCR + EXPIRE pattern.
 */

const MAX = parseInt(process.env.RATE_LIMIT_MAX ?? "60", 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_S ?? "60", 10) * 1_000;

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // unix ms
}

/**
 * Records a hit for `ip` and returns whether it is allowed.
 */
export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  let w = windows.get(ip);

  if (!w || now >= w.resetAt) {
    w = { count: 0, resetAt: now + WINDOW_MS };
    windows.set(ip, w);
  }

  w.count++;

  return {
    allowed: w.count <= MAX,
    remaining: Math.max(0, MAX - w.count),
    resetAt: w.resetAt,
  };
}

/** Extract client IP from Next.js request headers (Edge + Node) */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Periodic cleanup to prevent unbounded growth */
export function purgeExpiredWindows(): void {
  const now = Date.now();
  for (const [ip, w] of windows.entries()) {
    if (now >= w.resetAt) windows.delete(ip);
  }
}
