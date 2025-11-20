import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";
import { loginRateLimiter, getClientIp, checkRateLimit } from "@/lib/rate-limit";

/**
 * Better Auth handler avec rate limiting intégré
 *
 * Applique le rate limiting uniquement sur les endpoints de connexion
 */
const handler = toNextJsHandler(auth);

/**
 * Wrapper pour ajouter le rate limiting aux routes d'authentification
 */
async function withRateLimit(
  request: NextRequest,
  context: { params: Promise<{ all: string[] }> }
) {
  const params = await context.params;
  const endpoint = params.all?.[0];

  // Appliquer le rate limiting uniquement sur les endpoints de connexion
  if (endpoint === "sign-in" && request.method === "POST") {
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimit(clientIp, loginRateLimiter);

    if (!rateLimitResult.success) {
      const minutesRemaining = Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 60000);

      return NextResponse.json(
        {
          error: `Trop de tentatives de connexion. Veuillez réessayer dans ${minutesRemaining} minute${minutesRemaining > 1 ? "s" : ""}.`,
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
  }

  // Passer à Better Auth en fonction de la méthode
  if (request.method === "GET") {
    return handler.GET(request);
  } else if (request.method === "POST") {
    return handler.POST(request);
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export const GET = withRateLimit;
export const POST = withRateLimit;
