// Lightweight in-memory rate limiter for public, unauthenticated endpoints (e.g. lead
// capture). It is a fixed-window counter keyed by an arbitrary string.
//
// Scope/caveat: state lives in the process memory of a single instance, so it blunts
// casual abuse and form-retry storms but is NOT a distributed limiter. Behind multiple
// instances / serverless functions each replica keeps its own window; swap in a shared
// store (Redis/Upstash) here if stronger guarantees are needed — callers won't change.

export type RateLimitOptions = {
  // Maximum number of requests permitted within the window.
  limit: number;
  // Window length in milliseconds.
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  // Seconds until the current window resets (for a `Retry-After` header). 0 when allowed.
  retryAfterSeconds: number;
};

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count < limit) {
    existing.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

// Best-effort client identity from proxy headers. `x-forwarded-for` may hold a list; the
// first entry is the originating client. Falls back to `x-real-ip`, then a constant so a
// missing header degrades to a shared (still-limited) bucket rather than throwing.
export function clientKeyFromRequest(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
