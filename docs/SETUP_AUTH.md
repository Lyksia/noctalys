# Configuration Better Auth - Noctalys

Ce guide explique comment configurer Better Auth pour Noctalys.

## Prérequis

- Base de données PostgreSQL provisionnée
- Variable `DATABASE_URL` configurée dans `.env.local`

## Étapes de configuration

### 1. Configurer les variables d'environnement

Copier le fichier d'exemple :

```bash
cp .env.local.example .env.local
```

Générer le secret Better Auth :

```bash
openssl rand -base64 32
```

Éditer `.env.local` :

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
BETTER_AUTH_SECRET="votre_secret_généré"
BETTER_AUTH_URL="http://localhost:3000"
```

### 2. Appliquer les migrations Prisma

```bash
npm run db:migrate
```

Cela créera les tables nécessaires :
- `users`
- `sessions`
- `accounts`
- `fictions`
- `chapters`
- `tracks`

### 3. Peupler la base de données

Le script seed créera automatiquement l'utilisateur admin via `auth.api.signUpEmail` :

```bash
npm run db:seed
```

Cela créera :
- ✅ 1 utilisateur admin (email: `admin@noctalys.com`, password: `ChangeMe123!`)
- ✅ 3 fictions publiées
- ✅ 7 chapitres
- ✅ 5 morceaux musicaux

### 4. Vérifier la configuration

Ouvrir Prisma Studio pour vérifier que tout est créé :

```bash
npm run db:studio
```

Vous devriez voir :
- 1 utilisateur dans la table `users`
- 3 fictions dans `fictions`
- 7 chapitres dans `chapters`
- 5 morceaux dans `tracks`

## Utilisation de Better Auth

### Créer un utilisateur (programmatique)

```typescript
import { auth } from "@/lib/auth";

const user = await auth.api.signUpEmail({
  body: {
    name: "John Doe",
    email: "john@example.com",
    password: "SecurePassword123!",
  },
});
```

### Se connecter

```typescript
const session = await auth.api.signInEmail({
  body: {
    email: "admin@noctalys.com",
    password: "ChangeMe123!",
  },
});
```

### Vérifier la session

```typescript
const session = await auth.api.getSession({
  headers: request.headers,
});

if (session) {
  console.log("Utilisateur connecté:", session.user);
}
```

## Prochaines étapes

1. ✅ Créer l'API Route Better Auth (`app/api/auth/[...all]/route.ts`)
2. ✅ Créer la page de login admin (`app/admin/login/page.tsx`)
3. ✅ Créer le middleware de protection (`middleware.ts`)
4. ✅ Créer les API Routes pour fictions, chapitres, musiques

## Sécurité

⚠️ **Important en production** :

1. Changer le mot de passe admin après le premier déploiement
2. Activer la vérification email : `requireEmailVerification: true`
3. Utiliser un `BETTER_AUTH_SECRET` unique et sécurisé
4. Configurer HTTPS pour `BETTER_AUTH_URL`

## Références

- [Documentation Better Auth](https://www.better-auth.com/docs)
- [Prisma Adapter](https://www.better-auth.com/docs/integrations/prisma)
- [Email & Password](https://www.better-auth.com/docs/authentication/email-password)
