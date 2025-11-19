# Noctalys

> Plateforme de publication de fictions et musiques nocturnes

## 📖 Description

Noctalys est une plateforme web élégante dédiée à la publication et au partage de fictions littéraires et de musiques originales. Le projet offre une expérience utilisateur immersive avec une esthétique nocturne et lunaire.

## 🛠️ Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Langage**: TypeScript (strict mode)
- **Styling**: Tailwind CSS V4
- **UI Components**: Shadcn UI
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: Better Auth
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
- `AUTH_SECRET`: Clé secrète pour l'authentification
- `NEXT_PUBLIC_APP_URL`: URL de l'application

4. Initialiser la base de données

```bash
# Générer le Prisma Client
pnpm prisma generate

# Créer les tables
pnpm prisma migrate dev

# (Optionnel) Seed avec des données de test
pnpm prisma db seed
```

5. Lancer le serveur de développement

```bash
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
noctalys/
├── app/                    # Next.js App Router
│   ├── (public)/          # Routes publiques
│   ├── (admin)/           # Routes admin (protégées)
│   └── api/               # API Routes
├── components/            # Composants React partagés
│   └── layout/           # Composants de layout (Header, Footer)
├── features/             # Features (feature-first architecture)
│   ├── fiction/
│   ├── track/
│   └── auth/
├── ui/                   # Design system (Shadcn UI)
├── lib/                  # Librairies externes (Prisma, Auth)
├── utils/                # Fonctions utilitaires pures
├── config/               # Configuration globale
├── types/                # Types TypeScript globaux
├── data/                 # Données statiques
├── services/             # Services API (Axios)
├── hooks/                # Hooks React personnalisés
└── prisma/               # Schéma et migrations Prisma
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
pnpm dev              # Lancer le serveur de développement
pnpm build            # Build de production
pnpm start            # Serveur de production
pnpm lint             # Linter ESLint
pnpm format           # Formater avec Prettier
pnpm format:check     # Vérifier le formatage

# Base de données
pnpm prisma studio    # Interface Prisma Studio
pnpm prisma migrate dev    # Créer une migration
pnpm prisma generate  # Générer le Prisma Client
```

## 🔐 Authentification

L'authentification est gérée par **Better Auth** avec la stratégie email/password. Les sessions sont stockées en base de données avec une expiration de 7 jours.

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

### Phase 1 (En cours)

- [x] Setup infrastructure (Next.js, Tailwind, Prisma)
- [x] Design system et composants UI de base
- [x] Layout principal et navigation
- [ ] Pages publiques (Fictions, Musiques)
- [ ] Interface admin
- [ ] Authentification

### Phases Suivantes

- Gestion de contenu (CRUD fictions/chapitres/musiques)
- Upload de fichiers (images, audio)
- Lecteur audio sticky
- Tests et optimisations
- Lancement

## 🤝 Contribution

Ce projet est personnel. Les contributions externes ne sont pas acceptées pour le moment.

## 📄 Licence

Tous droits réservés © 2024 Noctalys

---

**Créé avec ✦ par Noctalys**
