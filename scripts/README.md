# Scripts Noctalys

Ce dossier contient les scripts utilitaires pour l'administration et la maintenance du projet.

## 📋 Scripts Disponibles

### `create-admin.ts`

**Description:** Script interactif pour créer un compte administrateur ou promouvoir un utilisateur existant.

**Usage:**
```bash
pnpm create-admin
# ou directement
pnpm tsx scripts/create-admin.ts
```

**Fonctionnalités:**
- ✅ Création interactive d'un compte admin
- ✅ Validation email (format valide)
- ✅ Validation mot de passe (min. 8 caractères)
- ✅ Confirmation du mot de passe
- ✅ Hash sécurisé avec scrypt (compatible Better Auth)
- ✅ Détection des utilisateurs existants
- ✅ Promotion d'un utilisateur existant en admin
- ✅ Masquage du mot de passe lors de la saisie
- ✅ Messages d'erreur clairs et informatifs

**Exemple d'exécution:**
```
╔════════════════════════════════════════════╗
║   Création d'un compte administrateur      ║
╚════════════════════════════════════════════╝

Email de l'admin: admin@noctalys.com
Nom complet: John Doe
Mot de passe (min. 8 caractères): ********
Confirmez le mot de passe: ********

⏳ Création du compte...

╔════════════════════════════════════════════╗
║        ✅ Compte admin créé avec succès!   ║
╚════════════════════════════════════════════╝

ID:    cm123456789
Email: admin@noctalys.com
Nom:   John Doe
Rôle:  ADMIN

Vous pouvez maintenant vous connecter avec ces identifiants.
```

**Cas d'usage:**
- **Premier déploiement:** Créer le compte admin initial
- **Nouveau membre:** Ajouter un administrateur supplémentaire
- **Promotion:** Promouvoir un utilisateur existant au rôle ADMIN

**Compatibilité:**
- ✅ Better Auth (credential provider)
- ✅ Prisma ORM
- ✅ Hash scrypt (standard moderne, recommandé)
- ✅ PostgreSQL / MySQL / SQLite

**Sécurité:**
- Utilise `auth.api.signUpEmail()` de Better Auth (hash automatique)
- Better Auth gère le hashing sécurisé du mot de passe
- Validation stricte des entrées
- Aucun affichage du mot de passe en clair
- Aucun logging des mots de passe

---

## 🔧 Réutilisation dans d'autres projets

Le script `create-admin.ts` est **générique** et peut être copié dans n'importe quel projet Next.js utilisant **Better Auth + Prisma**.

### Prérequis

1. **Prisma configuré** avec les modèles `User` et `Account`
2. **Better Auth** avec credential provider
3. **Champs requis dans le schéma Prisma:**

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  role          String   @default("USER") // ADMIN, USER, etc.
  emailVerified Boolean  @default(false)
  accounts      Account[]
  createdAt     DateTime @default(now())
}

model Account {
  id         String  @id @default(cuid())
  userId     String
  accountId  String
  providerId String  // "credential" pour Better Auth
  password   String?  // Format: "salt:hash"
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, accountId])
}
```

### Adaptation

Si votre schéma Prisma diffère, modifiez les lignes suivantes dans `create-admin.ts`:

```typescript
// Ligne ~145: Création de l'utilisateur avec Better Auth
const result = await auth.api.signUpEmail({
  body: {
    email,
    password,
    name,
  },
});

// Ligne ~154: Promotion en ADMIN
const updatedUser = await prisma.user.update({
  where: { id: result.user.id },
  data: { 
    role: "ADMIN", // ← Adapter selon votre schéma (ex: "admin", "ADMINISTRATOR", etc.)
    emailVerified: true,
  },
});
```

**Important:** Le script utilise `auth.api.signUpEmail()` qui gère automatiquement:
- Le hashing du mot de passe
- La création de l'entrée `User`
- La création de l'entrée `Account` avec le bon provider
- La validation des données

### Installation dans un autre projet

1. **Copier le fichier:**
```bash
mkdir -p scripts
cp create-admin.ts /path/to/other-project/scripts/
```

2. **Ajouter le script npm:**
```json
// package.json
{
  "scripts": {
    "create-admin": "npx tsx scripts/create-admin.ts"
  }
}
```

3. **Exécuter:**
```bash
pnpm create-admin
```

---

## 📚 Ressources

- [Better Auth Documentation](https://better-auth.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Node.js Crypto (scrypt)](https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback)
