# Noctalys

[![CI](https://github.com/[username]/noctalys/actions/workflows/ci.yml/badge.svg)](https://github.com/[username]/noctalys/actions/workflows/ci.yml)

> Plateforme de publication de fictions et musiques nocturnes

## 📖 Description

Noctalys est une plateforme web élégante dédiée à la publication et au partage de fictions littéraires et de musiques originales. Le projet offre une expérience utilisateur immersive avec une esthétique nocturne et lunaire.

## 🛠️ Stack Technique

- **Framework**: Next.js 16.0.3 (App Router)
- **Runtime**: React 19.2.0
- **Langage**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS V4
- **UI Components**: Shadcn UI + Radix UI
- **Base de données**: PostgreSQL avec Prisma ORM 6.16.0
- **Authentification**: Better Auth 1.3.34
- **Éditeur de texte**: TipTap avec support Markdown
- **Gestion de fichiers**: Lyksia File Manager 1.2.0
- **Rate limiting**: Upstash Redis
- **Validation**: Zod 4
- **Déploiement**: Vercel

## 🚀 Installation

### Prérequis

- Node.js 18+
- pnpm
- PostgreSQL (ou Prisma Postgres)

### Étapes

1. Cloner le repository

```bash
git clone <repository-url>
cd noctalys
```

2. Installer les dépendances

```bash
pnpm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplissez les variables dans `.env` :

- `DATABASE_URL`: URL de connexion PostgreSQL
- `BETTER_AUTH_SECRET`: Clé secrète pour l'authentification (générer avec `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: URL de l'application (ex: `http://localhost:3003`)
- `FILE_MANAGER_API_KEY`: Clé API Lyksia File Manager
- `UPSTASH_REDIS_REST_URL`: URL Redis pour rate limiting
- `UPSTASH_REDIS_REST_TOKEN`: Token Redis pour rate limiting

4. Initialiser la base de données

```bash
# Générer le Prisma Client
pnpm prisma generate

# Créer les tables
pnpm prisma migrate dev

# (Optionnel) Seed avec des données de test
pnpm prisma db seed
```

5. Créer un compte administrateur

```bash
pnpm create-admin
```

6. Lancer le serveur de développement

```bash
pnpm dev
```

L'application sera disponible sur [http://localhost:3003](http://localhost:3003)

## 📁 Structure du Projet

```
noctalys/
├── app/                    # Next.js App Router
│   ├── (web)/             # Routes publiques (home, fictions, musiques)
│   ├── (backoffice)/      # Routes admin (protégées)
│   └── api/               # API Routes
├── components/            # Composants React partagés
│   └── layout/           # Composants de layout (Header, Footer, MobileMenu)
├── ui/                   # Design system (Shadcn UI + composants custom)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── audio-player.tsx
│   ├── tiptap-editor.tsx
│   ├── card-fiction.tsx
│   ├── card-track.tsx
│   └── file-upload.tsx
├── lib/                  # Librairies externes et configuration
│   ├── prisma.ts         # Prisma Client
│   ├── auth.ts           # Better Auth
│   ├── auth-client.ts    # Better Auth Client
│   ├── file-manager.ts   # Lyksia File Manager
│   ├── rate-limit.ts     # Upstash Rate Limiting
│   ├── markdown.tsx      # Markdown rendering
│   ├── json-ld.ts        # Structured data pour SEO
│   ├── validations/      # Schémas Zod
│   └── use-auto-save.ts  # Hook d'auto-sauvegarde
├── utils/                # Fonctions utilitaires pures
├── config/               # Configuration globale (site.ts)
├── types/                # Types TypeScript globaux
├── scripts/              # Scripts utilitaires
│   └── create-admin.ts   # Création de compte admin
├── prisma/               # Schéma et migrations Prisma
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── docs/                 # Documentation
```

## 🎨 Design System

Le projet utilise une palette de couleurs **monochrome silver** (Moon 50-950) avec des accents désaturés pour une esthétique nocturne élégante. Voir `docs/concept-graphic.md` pour plus de détails.

### Tokens Principaux

- **Palette Moon**: 11 nuances de gris argenté
- **Halos subtils**: Effets de lueur avec opacité 0.2-0.4
- **Typographie**: Inter (sans), Lora (serif), JetBrains Mono (mono)
- **Animations**: glow-pulse, float-subtle, fade-in, slide-up

## 📝 Scripts Disponibles

```bash
# Développement
pnpm dev              # Lancer le serveur de développement (port 3003)
pnpm build            # Build de production
pnpm start            # Serveur de production
pnpm lint             # Linter ESLint
pnpm format           # Formater avec Prettier
pnpm format:check     # Vérifier le formatage

# Base de données
pnpm db:studio        # Interface Prisma Studio
pnpm db:migrate       # Créer une migration
pnpm db:push          # Push le schéma sans migration
pnpm db:generate      # Générer le Prisma Client
pnpm db:seed          # Seed la base avec des données de test
pnpm create-admin     # Créer un compte administrateur
```

## 🔐 Authentification

L'authentification est gérée par **Better Auth** avec la stratégie email/password. Les sessions sont stockées en base de données avec une expiration de 7 jours.

### Rate Limiting

Le système implémente un rate limiting via Upstash Redis pour protéger les routes sensibles :

- **Login** : 5 tentatives par heure
- **Registration** : 3 créations de compte par heure
- **API publiques** : 100 requêtes par minute

## 📤 Upload de Fichiers

L'upload de fichiers est géré par **Lyksia File Manager**, une solution personnalisée :

- **Images** : JPEG, PNG, WebP, GIF (max 5 MB)
- **Audio** : MP3, WAV, OGG, WebM (max 50 MB)
- URLs publiques permanentes sans tokens JWT (isPublic: true)

## 📄 Documentation

- `docs/PRD.md`: Product Requirements Document complet
- `docs/concept-graphic.md`: Guide du design system
- `docs/implementation.md`: Plan d'implémentation détaillé
- `CLAUDE.md`: Directives pour l'IA

## 🌐 Déploiement

Le projet est configuré pour être déployé sur Vercel :

1. Créer un projet Vercel
2. Connecter le repository GitHub
3. Configurer les variables d'environnement
4. Déployer

## 📋 Roadmap

Voir `docs/implementation.md` pour le plan détaillé des tâches.

### Fonctionnalités Implémentées ✅

- [x] Setup infrastructure (Next.js 16, Tailwind CSS V4, Prisma 6)
- [x] Design system complet avec palette Moon
- [x] Layout principal et navigation responsive
- [x] Pages publiques (Home, Fictions, Musiques, À propos)
- [x] Authentification complète (Better Auth avec email/password)
- [x] Rate limiting avec Upstash Redis
- [x] Interface admin complète (Dashboard, CRUD)
- [x] Gestion des fictions et chapitres
- [x] Gestion des musiques
- [x] Upload de fichiers (images, audio) avec Lyksia File Manager
- [x] Éditeur de texte riche (TipTap) avec support Markdown
- [x] Auto-sauvegarde des contenus
- [x] Lecteur audio intégré
- [x] SEO avec métadonnées dynamiques et JSON-LD
- [x] Sitemap et robots.txt
- [x] Build de production réussi

### Améliorations Futures

- Tests automatisés (Vitest)
- Système de commentaires
- Notifications
- Analytics
- Optimisations de performance

## 🤝 Contribution

Ce projet est personnel. Les contributions externes ne sont pas acceptées pour le moment.

## 📄 Licence

Tous droits réservés © 2024 Noctalys

---

**Créé avec ✦ par Noctalys**
