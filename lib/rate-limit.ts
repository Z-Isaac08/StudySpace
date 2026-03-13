import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new Redis instance.
// This requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your .env
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Creates a rate limiter.
 * 
 * @param requests number of allowed requests
 * @param window time window string (e.g., '10 s', '1 m', '1 h')
 * @returns Ratelimit instance
 */
export const createRateLimiter = (
  requests: number,
  window: `${number} ms` | `${number} s` | `${number} m` | `${number} h` | `${number} d`
) => {
  return new Ratelimit({
    redis: redis,
    // Use a sliding window to prevent traffic bursts right at the reset boundary
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    // Optional: add prefix to differentiate from other keys in Redis
    prefix: '@upstash/ratelimit/study-space',
  });
};

// Example predefined limiters:
// Useful for general endpoints (e.g., 20 requests per 10 seconds)
export const apiLimiter = createRateLimiter(20, '10 s');

// Stricter limiter for expensive operations like file uploads (e.g., 5 per minute)
export const uploadLimiter = createRateLimiter(5, '1 m');
