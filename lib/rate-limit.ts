import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiter configuration using Upstash Redis
 *
 * Utilise l'algorithme Sliding Window pour une limitation précise.
 * En développement local, si Redis n'est pas configuré, on désactive le rate limiting.
 */

// Configuration Redis
let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

/**
 * Rate limiter pour les tentatives de connexion
 * Limite : 5 tentatives par 10 minutes par IP
 */
export const loginRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
      prefix: "@upstash/ratelimit:login",
    })
  : null;

/**
 * Rate limiter pour l'API générale
 * Limite : 100 requêtes par minute par IP
 */
export const apiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "@upstash/ratelimit:api",
    })
  : null;

/**
 * Helper function pour obtenir l'IP du client
 */
export function getClientIp(request: Request): string {
  // Essayer d'obtenir l'IP depuis les headers Vercel
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // Essayer d'obtenir l'IP depuis le header real-ip
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback pour développement local
  return "127.0.0.1";
}

/**
 * Helper function pour vérifier le rate limit
 * Retourne { success: boolean, limit: number, remaining: number, reset: Date }
 */
export async function checkRateLimit(
  identifier: string,
  rateLimiter: Ratelimit | null
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}> {
  // Si pas de Redis configuré (dev local), on autorise toutes les requêtes
  if (!rateLimiter) {
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: new Date(Date.now() + 60000),
    };
  }

  const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset: new Date(reset),
  };
}
