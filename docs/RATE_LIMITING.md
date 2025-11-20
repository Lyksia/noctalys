# Rate Limiting avec Upstash Redis

## Vue d'ensemble

Le rate limiting est implémenté pour protéger l'application contre les abus, notamment les tentatives de force brute sur le login.

**Stack utilisée :**
- `@upstash/ratelimit` - Bibliothèque de rate limiting
- `@upstash/redis` - Client Redis optimisé pour serverless
- Algorithme : **Sliding Window** (fenêtre glissante)

---

## Configuration

### 1. Créer une base Redis sur Upstash

1. Créez un compte sur [Upstash](https://upstash.com)
2. Créez une nouvelle base de données Redis
3. Choisissez une région proche de votre déploiement Vercel
4. Copiez les credentials :
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 2. Ajouter les variables d'environnement

**Localement (`.env`) :**
```bash
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXXXxxxXXXxxx"
```

**Sur Vercel :**
1. Allez dans Settings → Environment Variables
2. Ajoutez `UPSTASH_REDIS_REST_URL`
3. Ajoutez `UPSTASH_REDIS_REST_TOKEN`
4. Redéployez l'application

---

## Limites configurées

### Login (authentification)
- **Limite :** 5 tentatives par 10 minutes par IP
- **Algorithme :** Sliding Window
- **Fichier :** `lib/rate-limit.ts`
- **Endpoint protégé :** `/api/auth/[...all]` (sign-in)

```typescript
loginRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
  prefix: "@upstash/ratelimit:login",
});
```

### API générale
- **Limite :** 100 requêtes par minute par IP
- **Algorithme :** Sliding Window
- **Utilisation future :** Routes API admin

```typescript
apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit:api",
});
```

---

## Fonctionnement

### 1. Protection au niveau de la page de login

La page `/login` vérifie le rate limit **avant** d'envoyer les credentials :

```typescript
// Vérifier le rate limit
const rateLimitResponse = await fetch("/api/auth/check-rate-limit", {
  method: "POST",
});

if (!rateLimitData.allowed) {
  setError(rateLimitData.error);
  return;
}

// Tenter la connexion uniquement si rate limit OK
await signIn.email({ email, password });
```

### 2. Protection au niveau des routes Better Auth

Le handler Better Auth inclut aussi le rate limiting :

```typescript
// app/api/auth/[...all]/route.ts
if (endpoint === "sign-in" && request.method === "POST") {
  const rateLimitResult = await checkRateLimit(clientIp, loginRateLimiter);
  
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: "..." }, { status: 429 });
  }
}
```

### 3. Détection de l'IP client

L'IP est extraite des headers Vercel :

```typescript
function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  
  return "127.0.0.1"; // Fallback local
}
```

---

## Mode développement (sans Redis)

Si Redis n'est pas configuré (développement local), le rate limiting est **désactivé** automatiquement :

```typescript
if (!process.env.UPSTASH_REDIS_REST_URL) {
  loginRateLimiter = null; // Pas de rate limiting
}

// Les checks retournent toujours success: true
if (!rateLimiter) {
  return { success: true, limit: 999, remaining: 999 };
}
```

**Avantage :** Pas besoin de Redis pour développer localement.

---

## Headers de réponse

Toutes les réponses incluent les headers standard de rate limiting :

```
X-RateLimit-Limit: 5          # Limite totale
X-RateLimit-Remaining: 3      # Crédits restants
X-RateLimit-Reset: 2025-11-19T18:30:00.000Z  # Date de reset
```

En cas de dépassement (429 Too Many Requests) :

```
Retry-After: 600  # Secondes avant retry
```

---

## Monitoring

### Upstash Dashboard

Upstash fournit un dashboard avec :
- Nombre de requêtes
- Taux de blocage
- Latence
- Utilisation mémoire

### Analytics

Le flag `analytics: true` active le tracking des métriques dans Upstash.

---

## Ajuster les limites

Pour modifier les limites, éditez `lib/rate-limit.ts` :

```typescript
// Plus strict : 3 tentatives / 15 minutes
loginRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
});

// Plus permissif : 10 tentatives / 5 minutes
loginRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "5 m"),
});
```

### Algorithmes disponibles

- **slidingWindow(n, window)** - Recommandé, précis
- **fixedWindow(n, window)** - Plus simple, peut avoir des pics
- **tokenBucket(refillRate, interval, capacity)** - Permet des bursts

---

## Sécurité

✅ **Protection contre :**
- Force brute sur login
- Credential stuffing
- Attaques distribuées (par IP)

⚠️ **Limitations :**
- Les attaquants peuvent changer d'IP (VPN, proxies)
- Pour une protection avancée, combiner avec :
  - CAPTCHA après N échecs
  - 2FA obligatoire
  - Détection d'anomalies (patterns)

---

## Ressources

- [Documentation Upstash Ratelimit](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Algorithmes de rate limiting](https://upstash.com/blog/nextjs-ratelimiting)
- [Vercel Edge Middleware](https://vercel.com/docs/functions/edge-middleware)
