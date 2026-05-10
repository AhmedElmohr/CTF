interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store: IP_CHALLENGE_ID -> RateLimitRecord
const rateLimits = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000; // 1 minute

export function checkRateLimit(ip: string, challengeId: string): { allowed: boolean; retryAfter?: number } {
  const key = `${ip}:${challengeId}`;
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record) {
    rateLimits.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true };
  }

  if (now > record.resetTime) {
    // Window expired, reset
    rateLimits.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    // Rate limit exceeded
    return { 
      allowed: false, 
      retryAfter: Math.ceil((record.resetTime - now) / 1000) 
    };
  }

  // Increment count
  record.count += 1;
  return { allowed: true };
}

// Optional cleanup interval to prevent memory leaks in a long-running server
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimits.entries()) {
    if (now > record.resetTime) {
      rateLimits.delete(key);
    }
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes
