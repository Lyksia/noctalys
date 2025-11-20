import { NextRequest, NextResponse } from "next/server";
import { loginRateLimiter, getClientIp, checkRateLimit } from "@/lib/rate-limit";

/**
 * API Route pour vérifier et consommer un crédit de rate limit
 * POST /api/auth/check-rate-limit
 *
 * Utilisée avant chaque tentative de connexion pour s'assurer
 * que le client n'a pas dépassé la limite de tentatives.
 */
export async function POST(request: NextRequest) {
  try {
    // Obtenir l'IP du client
    const clientIp = getClientIp(request);

    // Vérifier le rate limit (consomme 1 crédit)
    const rateLimitResult = await checkRateLimit(clientIp, loginRateLimiter);

    // Si rate limit dépassé
    if (!rateLimitResult.success) {
      const minutesRemaining = Math.ceil(
        (rateLimitResult.reset.getTime() - Date.now()) / 60000
      );

      return NextResponse.json(
        {
          allowed: false,
          error: `Trop de tentatives de connexion. Veuillez réessayer dans ${minutesRemaining} minute${minutesRemaining > 1 ? "s" : ""}.`,
          resetAt: rateLimitResult.reset.toISOString(),
          limit: rateLimitResult.limit,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.reset.toISOString(),
          },
        }
      );
    }

    // Rate limit OK
    return NextResponse.json(
      {
        allowed: true,
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        resetAt: rateLimitResult.reset.toISOString(),
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toISOString(),
        },
      }
    );
  } catch (error) {
    console.error("Rate limit check error:", error);
    // En cas d'erreur, on autorise la tentative (fail open)
    return NextResponse.json(
      {
        allowed: true,
        error: "Erreur lors de la vérification du rate limit",
      },
      { status: 200 }
    );
  }
}
