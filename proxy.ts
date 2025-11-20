import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy pour protéger les routes admin
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si la requête est pour une route admin (sauf login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/login")) {
    // Récupérer le cookie de session Better Auth
    const sessionToken = request.cookies.get("better-auth.session_token");

    // Si pas de cookie de session, rediriger vers login
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      // Ajouter l'URL de retour comme paramètre pour rediriger après login
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TODO: Valider le token avec Better Auth si nécessaire
    // Pour l'instant, on fait confiance au cookie (Better Auth gère la sécurité)
  }

  return NextResponse.next();
}

/**
 * Configuration du matcher
 * Spécifie sur quelles routes le middleware doit s'exécuter
 */
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|login).*)",
  ],
};
