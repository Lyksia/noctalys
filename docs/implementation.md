# Plan d'Implémentation Noctalys

**Version:** 1.0 | **Date:** 19 novembre 2025 | **Statut:** En cours  
**Basé sur:** PRD v1.0 + Concept Graphique v1.0

---

## Vue d'Ensemble

Ce document regroupe **toutes les tâches** nécessaires pour développer la plateforme Noctalys, organisées par phase et par domaine fonctionnel. Chaque tâche suit le format :

```
[ ] Tâche : [Titre court]
Description : [Objectif détaillé]
Critères d'acceptation :
- Critère 1
- Critère 2
Estimation : [X jours]
Dépendances : [Tâches prérequises]
```

**Légende :**

- `[ ]` : À faire
- `[x]` : Terminée
- `[~]` : En cours
- `[!]` : Bloquée

---

## PHASE 1 : INFRASTRUCTURE & SETUP (Semaine 1-2)

### 1.1 Initialisation Projet

#### [x] Tâche : Créer le repository GitHub

**Description :** Initialiser le repository Git avec structure de base et configuration CI/CD.  
**Critères d'acceptation :**

- Repository créé sur GitHub (nom: `noctalys`)
- Branches configurées : `main` (production), `develop` (staging)
- `.gitignore` configuré pour Next.js/Node
- README.md initial avec instructions setup
- License MIT ajoutée
  **Estimation :** 0.5 jour  
  **Dépendances :** Aucune

---

#### [x] Tâche : Initialiser Next.js 15 avec TypeScript

**Description :** Créer le projet Next.js avec App Router et configuration TypeScript stricte.  
**Critères d'acceptation :**

- `npx create-next-app@latest` exécuté avec options : TypeScript, App Router, Tailwind, ESLint
- `tsconfig.json` en mode strict (`strict: true`, `noImplicitAny: true`)
- Structure dossiers conforme à CLAUDE.md (features/, ui/, lib/, etc.)
- Script `npm run dev` fonctionnel sur `localhost:3000`
- Pas d'erreurs TypeScript à la compilation
  **Estimation :** 0.5 jour  
  **Dépendances :** Repository GitHub créé

---

#### [x] Tâche : Configurer ESLint et Prettier

**Description :** Mettre en place le linting et le formatage automatique du code.  
**Critères d'acceptation :**

- ESLint configuré avec règles Next.js + custom rules (no-console, no-unused-vars)
- Prettier configuré (semi: true, singleQuote: true, trailingComma: 'es5')
- Script `npm run lint` fonctionnel
- Script `npm run format` fonctionnel
- Fichiers `.eslintrc.json` et `.prettierrc` créés
  **Estimation :** 0.5 jour  
  **Dépendances :** Next.js initialisé

---

#### [ ] Tâche : Configurer GitHub Actions (CI/CD)

**Description :** Automatiser lint, tests et déploiement via GitHub Actions.  
**Critères d'acceptation :**

- Workflow `.github/workflows/ci.yml` créé
- Pipeline exécute : lint → type-check → build → tests
- Pipeline s'exécute sur push `main` et `develop`
- Pipeline s'exécute sur toutes pull requests
- Badge status dans README.md
  **Estimation :** 1 jour  
  **Dépendances :** ESLint/Prettier configurés

---

### 1.2 Base de Données & Backend

#### [ ] Tâche : Provisionner Prisma Postgres

**Description :** Créer la base de données Prisma Postgres et obtenir la connection string.  
**Critères d'acceptation :**

- Compte Prisma Data Platform créé
- Database provisionnée (tier Free, 10GB)
- `DATABASE_URL` récupérée et stockée localement dans `.env.local`
- Test de connexion réussi avec `prisma db pull`
  **Estimation :** 0.5 jour  
  **Dépendances :** Aucune

---

#### [ ] Tâche : Installer et configurer Prisma

**Description :** Installer Prisma ORM et configurer le client.  
**Critères d'acceptation :**

- `npm install prisma @prisma/client` exécuté
- `npx prisma init` exécuté
- `prisma/schema.prisma` configuré avec `provider = "postgresql"`
- `lib/prisma.ts` créé avec singleton PrismaClient
- Script `npm run db:studio` configuré (lance Prisma Studio)
  **Estimation :** 0.5 jour  
  **Dépendances :** Prisma Postgres provisionné

---

#### [ ] Tâche : Définir le schéma Prisma (modèles de données)

**Description :** Créer les modèles Fiction, Chapter, Track, User selon le PRD.  
**Critères d'acceptation :**

- Modèle `Fiction` avec champs : id, slug, title, summary, coverImage, genre, status, publishedAt, timestamps
- Modèle `Chapter` avec relation `Fiction` (cascade delete), champs : chapterNumber, title, content (Text), publishedAt
- Modèle `Track` avec champs : id, slug, title, audioUrl, coverArt, duration, publishedAt
- Modèle `User` avec champs : id, email, sessions, accounts (Better Auth)
- Enums `Genre` et `Status` définis
- Index sur `publishedAt`, `slug` (unique)
- Contrainte unique `[fictionId, chapterNumber]`
  **Estimation :** 1 jour  
  **Dépendances :** Prisma configuré

---

#### [ ] Tâche : Créer et exécuter les migrations initiales

**Description :** Générer et appliquer les migrations pour créer les tables en DB.  
**Critères d'acceptation :**

- `npx prisma migrate dev --name init` exécuté avec succès
- Tables créées en DB (vérifiable via Prisma Studio)
- Fichier migration `prisma/migrations/[timestamp]_init/migration.sql` créé
- `@prisma/client` régénéré avec types TypeScript
- Aucune erreur de migration
  **Estimation :** 0.5 jour  
  **Dépendances :** Schéma Prisma défini

---

#### [ ] Tâche : Créer le script seed (données initiales)

**Description :** Préparer un script pour peupler la DB avec données de test.  
**Critères d'acceptation :**

- Fichier `prisma/seed.ts` créé
- Script `npm run db:seed` configuré dans `package.json`
- Seed crée : 1 utilisateur admin, 3 fictions, 5-10 chapitres, 5 morceaux
- Données réalistes (titres, résumés, genres)
- Exécution idempotente (réexécutable sans erreur)
  **Estimation :** 1 jour  
  **Dépendances :** Migrations appliquées

---

### 1.3 Authentification

#### [ ] Tâche : Installer et configurer Better Auth

**Description :** Mettre en place l'authentification avec Better Auth (email/password).  
**Critères d'acceptation :**

- `npm install better-auth` exécuté
- Fichier `lib/auth.ts` créé avec configuration Better Auth
- Strategy email/password configurée
- Secret `AUTH_SECRET` généré (`openssl rand -base64 32`) et stocké dans `.env.local`
- `AUTH_URL` configuré (local: `http://localhost:3000`)
- Session cookies HTTP-only activés
  **Estimation :** 1 jour  
  **Dépendances :** Prisma configuré, modèle User créé

---

#### [ ] Tâche : Créer les API Routes d'authentification

**Description :** Implémenter les endpoints login, logout, session.  
**Critères d'acceptation :**

- Route `app/api/auth/login/route.ts` créée (POST)
- Route `app/api/auth/logout/route.ts` créée (POST)
- Route `app/api/auth/session/route.ts` créée (GET)
- Validation Zod sur email/password (email valide, password min 8 char)
- Retour JWT token en cas de succès
- Messages d'erreur clairs (401, 400)
  **Estimation :** 1.5 jour  
  **Dépendances :** Better Auth configuré

---

#### [ ] Tâche : Créer le middleware de protection des routes

**Description :** Protéger les routes `/admin/*` avec vérification session.  
**Critères d'acceptation :**

- Fichier `middleware.ts` créé à la racine
- Matcher sur `/admin/:path*`
- Redirection vers `/admin/login` si non authentifié
- Header `x-user-id` ajouté si authentifié (pour usage dans routes)
- Pas d'impact performance (< 50ms)
  **Estimation :** 1 jour  
  **Dépendances :** API Routes auth créées

---

### 1.4 Infrastructure Vercel

#### [ ] Tâche : Créer le projet Vercel

**Description :** Configurer le déploiement automatique sur Vercel.  
**Critères d'acceptation :**

- Projet Vercel créé et lié au repository GitHub
- Déploiement automatique activé sur branche `main`
- Preview deployments activés sur toutes branches
- URL production : `noctalys.vercel.app` (temporaire)
- Tier Hobby sélectionné
  **Estimation :** 0.5 jour  
  **Dépendances :** Repository GitHub créé

---

#### [ ] Tâche : Configurer les variables d'environnement Vercel

**Description :** Ajouter toutes les variables d'environnement nécessaires en production.  
**Critères d'acceptation :**

- `DATABASE_URL` ajoutée (Prisma Postgres)
- `AUTH_SECRET` ajoutée (même valeur que local ou régénérée)
- `AUTH_URL` ajoutée (`https://noctalys.vercel.app`)
- `BLOB_READ_WRITE_TOKEN` ajoutée (auto-générée par Vercel Blob)
- Variables disponibles en production ET preview
  **Estimation :** 0.5 jour  
  **Dépendances :** Projet Vercel créé, Prisma Postgres provisionné

---

#### [ ] Tâche : Configurer le domaine personnalisé

**Description :** Pointer `noctalys.lyksia.com` vers Vercel.  
**Critères d'acceptation :**

- Domaine ajouté dans Vercel Dashboard
- DNS configuré (A record ou CNAME pointant vers Vercel)
- SSL/TLS automatique activé (Let's Encrypt)
- Site accessible via `https://noctalys.lyksia.com`
- Redirection automatique `http → https` et `www → apex`
  **Estimation :** 0.5 jour  
  **Dépendances :** Projet Vercel créé

---

#### [ ] Tâche : Configurer Vercel Blob Storage

**Description :** Activer le stockage de fichiers (images et audio).  
**Critères d'acceptation :**

- Vercel Blob activé dans projet
- `npm install @vercel/blob` exécuté
- Fichier `lib/blob.ts` créé avec helpers upload/delete
- Token `BLOB_READ_WRITE_TOKEN` accessible
- Test upload local réussi (image 1MB)
  **Estimation :** 0.5 jour  
  **Dépendances :** Projet Vercel créé

---

## PHASE 2 : DESIGN SYSTEM (Semaine 1-2)

### 2.1 Tailwind CSS V4

#### [ ] Tâche : Installer Tailwind CSS V4

**Description :** Configurer Tailwind CSS avec les design tokens Noctalys.  
**Critères d'acceptation :**

- `npm install tailwindcss@next` exécuté
- Fichier `app/globals.css` créé avec `@import "tailwindcss"`
- Design tokens définis dans `@theme {}` (colors, shadows, fonts)
- Palette moon (50-950) configurée
- Accents (primary, glow, muted) configurés
- Shadows (glow-sm, glow, glow-lg, moonlight) configurées
  **Estimation :** 1 jour  
  **Dépendances :** Next.js initialisé

---

#### [ ] Tâche : Installer les fonts (Inter, Lora, JetBrains Mono)

**Description :** Configurer les polices via `@next/font` pour performance optimale.  
**Critères d'acceptation :**

- `@next/font/google` utilisé pour Inter et Lora
- JetBrains Mono ajouté
- Variables CSS créées : `--font-sans`, `--font-serif`, `--font-mono`
- Fonts appliquées globalement dans `layout.tsx`
- Preload des fonts critiques
- Pas de FOUT (Flash Of Unstyled Text)
  **Estimation :** 0.5 jour  
  **Dépendances :** Tailwind installé

---

#### [ ] Tâche : Créer la texture noise (grain)

**Description :** Générer le SVG de texture grain pour le background.  
**Critères d'acceptation :**

- Fichier `public/noise.svg` créé avec filter `feTurbulence`
- Noise appliqué sur `body::before` avec `opacity: 0.05`
- Texture subtile visible mais non intrusive
- Fixed position, pointer-events: none
  **Estimation :** 0.5 jour  
  **Dépendances :** Tailwind installé

---

#### [ ] Tâche : Créer les animations CSS (@keyframes)

**Description :** Implémenter les animations signature Noctalys.  
**Critères d'acceptation :**

- Animation `glow-pulse` créée (opacity + shadow)
- Animation `float-subtle` créée (translateY ±3px)
- Animation `fade-in` créée
- Animation `slide-up` créée
- Animation `shimmer` créée (background-position)
- Classes utilitaires `.animate-*` disponibles
  **Estimation :** 0.5 jour  
  **Dépendances :** Tailwind installé

---

### 2.2 Shadcn UI

#### [ ] Tâche : Initialiser Shadcn UI

**Description :** Configurer Shadcn UI avec le thème Noctalys.  
**Critères d'acceptation :**

- `npx shadcn@latest init` exécuté
- Config dans `components.json` avec style "default", baseColor "slate"
- Dossier `ui/` créé pour composants
- Fichier `lib/utils.ts` créé avec fonction `cn()`
- Thème adapté dans `app/globals.css` (colors moon)
  **Estimation :** 0.5 jour  
  **Dépendances :** Tailwind installé

---

#### [ ] Tâche : Installer et configurer Button

**Description :** Créer le composant Button avec variants Noctalys.  
**Critères d'acceptation :**

- `npx shadcn add button` exécuté
- Variants créés : `primary`, `secondary`, `ghost`, `destructive`
- Sizes : `sm`, `md` (default), `lg`, `icon`
- Hover effects (glow-sm sur tous variants)
- Border-radius `rounded-lg`
- Transitions `300ms cubic-bezier(0.4, 0, 0.2, 1)`
  **Estimation :** 1 jour  
  **Dépendances :** Shadcn UI initialisé

---

#### [ ] Tâche : Installer et configurer Card

**Description :** Créer le composant Card avec variants.  
**Critères d'acceptation :**

- `npx shadcn add card` exécuté
- Variants : `default`, `elevated`, `flat`, `featured`
- Border-radius `rounded-2xl`
- Hover effect cliquable : `translateY(-4px) + shadow-moonlight`
- Padding `p-6` par défaut
- Transitions `400ms ease-out`
  **Estimation :** 1 jour  
  **Dépendances :** Shadcn UI initialisé

---

#### [ ] Tâche : Installer Input, Textarea, Label

**Description :** Créer les composants de formulaire.  
**Critères d'acceptation :**

- `npx shadcn add input textarea label` exécuté
- Background `moon-900`, border `moon-700`
- Focus state : border `accent-glow`, shadow `glow-sm`, ring `accent-glow/20`
- Error state : border `status-error/60`
- Placeholder color `moon-500`
- Label sans text-transform uppercase
  **Estimation :** 1 jour  
  **Dépendances :** Shadcn UI initialisé

---

#### [ ] Tâche : Installer Badge

**Description :** Créer le composant Badge pour statuts.  
**Critères d'acceptation :**

- `npx shadcn add badge` exécuté
- Variants : `default`, `success`, `warning`, `error`, `info`
- Colors désaturées (status-success/20 background)
- Border `1px solid` avec couleur/40
- Padding `px-2 py-1`, rounded-full
- Font `sans 12px medium`
  **Estimation :** 0.5 jour  
  **Dépendances :** Shadcn UI initialisé

---

#### [ ] Tâche : Installer Dialog (Modal)

**Description :** Créer le composant Modal/Dialog.  
**Critères d'acceptation :**

- `npx shadcn add dialog` exécuté
- Backdrop : background `overlay-dark`, blur `4px`
- Content : background `moon-800`, border `accent-glow/20`, rounded `3xl`
- Shadow `moonlight-lg`
- Animation fade-in + scale (0.95 → 1)
- Max-width `600px`, padding `p-8`
  **Estimation :** 1 jour  
  **Dépendances :** Shadcn UI initialisé

---

#### [ ] Tâche : Installer Toast (Notifications)

**Description :** Créer le système de notifications.  
**Critères d'acceptation :**

- `npx shadcn add toast` exécuté
- Position `top-right`
- Auto-dismiss après 5s
- Variants : `default`, `success`, `error`
- Animation slide-in from right
- Max 3 toasts simultanés
  **Estimation :** 0.5 jour  
  **Dépendances :** Shadcn UI initialisé

---

### 2.3 Composants Custom Noctalys

#### [ ] Tâche : Créer le logo Noctalys SVG

**Description :** Intégrer le logo avec animation float.  
**Critères d'acceptation :**

- Fichier `ui/logo.tsx` créé avec composant `<Logo />`
- SVG croissant de lune intégré
- Props : `size` (sm, md, lg), `className`
- Animation `float-subtle` appliquée
- Drop-shadow `glow-sm` permanent
- Hover : shadow upgrade vers `glow`
  **Estimation :** 0.5 jour  
  **Dépendances :** Animations CSS créées

---

#### [ ] Tâche : Créer le composant CardFiction

**Description :** Card spécifique pour afficher une fiction.  
**Critères d'acceptation :**

- Fichier `ui/card-fiction.tsx` créé
- Props : `fiction` (type Fiction), `onClick`
- Structure : Image (3:4) + badges (genre, status) + title + summary (3 lines clamp) + meta (chapters, date)
- Hover : lift effect + shadow-moonlight
- Image lazy-loaded
- Responsive (full width mobile, grid desktop)
  **Estimation :** 1 jour  
  **Dépendances :** Card créé

---

#### [ ] Tâche : Créer le composant CardTrack

**Description :** Card spécifique pour afficher un morceau musical.  
**Critères d'acceptation :**

- Fichier `ui/card-track.tsx` créé
- Props : `track` (type Track), `onPlay`
- Structure : Pochette + titre + durée + bouton play
- Hover : glow effect
- Bouton play avec icône (triangle)
- Animation pulse sur pochette si playing
  **Estimation :** 1 jour  
  **Dépendances :** Card créé, Button créé

---

## PHASE 3 : LAYOUT & NAVIGATION (Semaine 2)

### 3.1 Layout Principal

#### [ ] Tâche : Créer le layout root

**Description :** Configurer le layout principal avec fonts et metadata.  
**Critères d'acceptation :**

- Fichier `app/layout.tsx` complété
- Metadata SEO de base (title, description, OG tags)
- Favicon configuré (croissant de lune)
- Fonts appliquées via className
- Analytics Vercel intégré (script)
- Background gradient page appliqué
  **Estimation :** 1 jour  
  **Dépendances :** Fonts installées

---

#### [ ] Tâche : Créer le Header sticky

**Description :** Header avec logo et navigation principale.  
**Critères d'acceptation :**

- Fichier `ui/header.tsx` créé
- Position sticky top-0, z-index 50
- Background `moon-900/95`, backdrop-blur `12px`
- Border-bottom `moon-800`
- Shadow `moonlight` visible au scroll (state)
- Logo cliquable → home
- Navigation : Accueil | Fictions | Musiques | À propos
- Responsive : burger menu mobile (à implémenter Phase 2)
  **Estimation :** 1.5 jour  
  **Dépendances :** Logo créé

---

#### [ ] Tâche : Créer le Footer

**Description :** Footer minimaliste avec liens et copyright.  
**Critères d'acceptation :**

- Fichier `ui/footer.tsx` créé
- Background `moon-950`, border-top `moon-800`
- Padding `py-12`
- Liens : À propos | Contact | Mentions légales (Phase 2)
- Copyright © 2025 Noctalys
- Text color `moon-400`, links `moon-300` hover `moon-100`
  **Estimation :** 0.5 jour  
  **Dépendances :** Aucune

---

#### [ ] Tâche : Implémenter le burger menu mobile

**Description :** Menu responsive pour navigation mobile.  
**Critères d'acceptation :**

- Bouton burger visible uniquement < 768px
- Icône hamburger → X animée
- Menu overlay fullscreen : background `moon-900/98`, backdrop-blur
- Navigation verticale avec gap généreux
- Animation slide-in from right
- Fermeture sur clic lien ou outside
  **Estimation :** 1 jour  
  **Dépendances :** Header créé, Dialog installé

---

## PHASE 4 : PAGES PUBLIQUES (Semaine 3-4)

### 4.1 Page d'Accueil

#### [ ] Tâche : Créer la page d'accueil

**Description :** Landing page avec hero et dernières publications.  
**Critères d'acceptation :**

- Fichier `app/page.tsx` créé
- Hero section : titre + tagline + illustration lunaire (SVG ou image)
- Animation fade-in au chargement
- Section "Dernières publications" : fetch 6 derniers items (mix fictions + musiques)
- Grid responsive (1 col mobile, 2 tablet, 3 desktop)
- Skeleton screens pendant chargement
- Metadata SEO optimisées
  **Estimation :** 2 jours  
  **Dépendances :** CardFiction, CardTrack, Header, Footer créés

---

#### [ ] Tâche : Créer l'API Route fictions list

**Description :** Endpoint pour récupérer la liste des fictions publiées.  
**Critères d'acceptation :**

- Fichier `app/api/fictions/route.ts` créé (GET)
- Retourne toutes fictions avec `status: PUBLISHED`
- Triées par `publishedAt DESC`
- Include `chaptersCount` (via `_count`)
- Pagination optionnelle (query params `page`, `limit`)
- Cache ISR : revalidate 60s
  **Estimation :** 1 jour  
  **Dépendances :** Prisma configuré, modèles créés

---

#### [ ] Tâche : Créer l'API Route tracks list

**Description :** Endpoint pour récupérer la liste des morceaux musicaux.  
**Critères d'acceptation :**

- Fichier `app/api/music/route.ts` créé (GET)
- Retourne tous tracks publiés
- Triés par `publishedAt DESC`
- Champs : id, slug, title, audioUrl, coverArt, duration, publishedAt
- Cache ISR : revalidate 60s
  **Estimation :** 0.5 jour  
  **Dépendances :** Prisma configuré, modèles créés

---

### 4.2 Section Fictions

#### [ ] Tâche : Créer la page liste fictions

**Description :** Page affichant toutes les fictions.  
**Critères d'acceptation :**

- Fichier `app/fictions/page.tsx` créé
- Titre "Fictions"
- Fetch via API `/api/fictions` avec SWR
- Grid responsive avec CardFiction
- Loading state (skeletons)
- Error state (message + retry)
- Empty state si aucune fiction
- Metadata SEO
  **Estimation :** 1.5 jour  
  **Dépendances :** API fictions, CardFiction créés

---

#### [ ] Tâche : Créer la page détail fiction

**Description :** Page fiction avec liste des chapitres.  
**Critères d'acceptation :**

- Fichier `app/fictions/[slug]/page.tsx` créé
- Route dynamique avec `generateStaticParams`
- Header fiction : couverture + titre + résumé + métadonnées (genre, status, date)
- Liste chapitres : table élégante (numéro, titre, date)
- Bouton "Commencer la lecture" → chapitre 1
- Parallax subtil sur couverture au scroll (optionnel)
- Metadata dynamiques (OG image = couverture)
- 404 si slug invalide
  **Estimation :** 2 jours  
  **Dépendances :** API fiction detail (à créer)

---

#### [ ] Tâche : Créer l'API Route fiction detail

**Description :** Endpoint pour récupérer une fiction avec ses chapitres.  
**Critères d'acceptation :**

- Fichier `app/api/fictions/[slug]/route.ts` créé (GET)
- Retourne fiction par slug avec `chapters` inclus
- Chapitres triés par `chapterNumber ASC`
- 404 si slug inexistant
- Cache ISR : revalidate 60s
  **Estimation :** 1 jour  
  **Dépendances :** API fictions list créée

---

#### [ ] Tâche : Créer la page chapitre (lecture)

**Description :** Page de lecture immersive pour un chapitre.  
**Critères d'acceptation :**

- Fichier `app/fictions/[slug]/[chapterNumber]/page.tsx` créé
- UI minimaliste : header discret (logo + titre fiction sticky)
- Titre chapitre (H1, serif)
- Contenu Markdown → HTML avec `react-markdown`
- Prose Noctalys appliqué (serif 18px, line-height 1.8, max-width 70ch)
- Navigation sticky bottom : "← Précédent" | "Chapitre X/Y" | "Suivant →"
- Boutons disabled si premier/dernier chapitre
- Syntax highlighting code (rehype-highlight)
- Images responsive
- Metadata dynamiques
  **Estimation :** 2.5 jours  
  **Dépendances :** API chapter detail (à créer), react-markdown installé

---

#### [ ] Tâche : Créer l'API Route chapter detail

**Description :** Endpoint pour récupérer le contenu d'un chapitre.  
**Critères d'acceptation :**

- Fichier `app/api/chapters/[id]/route.ts` créé (GET)
- Retourne chapitre avec `fiction` (titre, slug)
- Champs : title, content (markdown), chapterNumber
- Calcul chapitres précédent/suivant (IDs)
- 404 si ID invalide
- Cache ISR : revalidate 300s (5min)
  **Estimation :** 1 jour  
  **Dépendances :** Prisma configuré

---

#### [ ] Tâche : Installer et configurer react-markdown

**Description :** Configurer le rendu Markdown avec plugins.  
**Critères d'acceptation :**

- `npm install react-markdown remark-gfm rehype-sanitize rehype-highlight` exécuté
- Fichier `lib/markdown.tsx` créé avec composant `<Markdown />`
- Plugins appliqués : remark-gfm (tables, strikethrough), rehype-sanitize (XSS), rehype-highlight (syntax)
- Custom components pour : headings (anchors), links (target \_blank), code blocks
- Prose styling Noctalys appliqué
  **Estimation :** 1.5 jour  
  **Dépendances :** react-markdown packages installés

---

### 4.3 Section Musiques

#### [ ] Tâche : Créer la page liste musiques

**Description :** Page affichant tous les morceaux.  
**Critères d'acceptation :**

- Fichier `app/music/page.tsx` créé
- Titre "Musiques"
- Fetch via API `/api/music` avec SWR
- Grid responsive (2-3 cols) avec CardTrack
- Clic sur Play → ouvre lecteur audio sticky + démarre lecture
- Loading/error/empty states
- Metadata SEO
  **Estimation :** 1.5 jour  
  **Dépendances :** API music, CardTrack créés, AudioPlayer (à créer)

---

#### [ ] Tâche : Créer le contexte AudioPlayer

**Description :** State global pour gérer la lecture audio.  
**Critères d'acceptation :**

- Fichier `lib/audio-context.tsx` créé avec `AudioPlayerProvider`
- State : `currentTrack`, `isPlaying`, `volume`, `currentTime`, `duration`
- Actions : `play()`, `pause()`, `seek()`, `setVolume()`, `next()`, `previous()`
- Playlist automatique (array de tracks)
- Persistance volume en localStorage
- Audio HTML5 `<audio>` géré en interne
  **Estimation :** 2 jours  
  **Dépendances :** React Context

---

#### [ ] Tâche : Créer le lecteur audio sticky

**Description :** Player audio en bas de page, toujours visible.  
**Critères d'acceptation :**

- Fichier `ui/audio-player.tsx` créé
- Position fixed bottom-0, full width, height 80px
- Background `moon-800/95`, backdrop-blur, border-top `moon-700`
- Elements : pochette (48x48), titre, temps (current/total), controls (prev, play/pause, next), progress bar, volume slider
- Progress bar cliquable (seek)
- Volume slider avec mute/unmute
- Animation pulse pochette si playing
- Responsive mobile (controls simplifiés)
- Z-index 40
  **Estimation :** 2.5 jours  
  **Dépendances :** AudioContext créé

---

#### [ ] Tâche : Implémenter la lecture séquentielle

**Description :** Auto-play du morceau suivant à la fin.  
**Critères d'acceptation :**

- Event listener `onEnded` sur `<audio>`
- Appelle `next()` automatiquement
- Si dernier morceau → pause + toast "Playlist terminée"
- Bouton "Réécouter" visible dans toast
- Préchargement metadata du morceau suivant (optionnel)
  **Estimation :** 1 jour  
  **Dépendances :** AudioPlayer créé

---

## PHASE 5 : INTERFACE ADMIN (Semaine 4-5)

### 5.1 Authentification Admin

#### [ ] Tâche : Créer la page login admin

**Description :** Formulaire de connexion pour accès admin.  
**Critères d'acceptation :**

- Fichier `app/admin/login/page.tsx` créé
- Layout centré, design Noctalys adapté (contraste amélioré)
- Formulaire : email, password
- Validation Zod (email valide, password min 8 char)
- Bouton "Se connecter" avec loading state
- Messages d'erreur clairs (401, 400)
- Rate limiting : 5 tentatives / 15min (à implémenter backend)
- Redirection vers `/admin` si déjà connecté
  **Estimation :** 1.5 jour  
  **Dépendances :** API auth créées, Input/Button créés

---

#### [ ] Tâche : Implémenter le rate limiting login

**Description :** Limiter les tentatives de connexion.  
**Critères d'acceptation :**

- Fichier `lib/rate-limit.ts` créé avec logique rate limiting
- Stockage en mémoire (Map) ou Redis (Phase 2)
- Limite : 5 tentatives par IP / 15min
- Retour 429 Too Many Requests si dépassé
- Message explicite "Trop de tentatives, réessayez dans X minutes"
  **Estimation :** 1 jour  
  **Dépendances :** API auth login créée

---

### 5.2 Dashboard Admin

#### [ ] Tâche : Créer le layout admin

**Description :** Layout avec sidebar pour toutes pages admin.  
**Critères d'acceptation :**

- Fichier `app/admin/layout.tsx` créé
- Sidebar fixe gauche (width 240px desktop)
- Logo Noctalys en haut
- Menu : Dashboard | Fictions | Musiques | Paramètres | Déconnexion
- Active state sur lien actuel (background + glow)
- Responsive : sidebar collapse en drawer mobile
- Background admin légèrement différent (moon-900)
  **Estimation :** 2 jours  
  **Dépendances :** Logo créé, middleware auth

---

#### [ ] Tâche : Créer la page dashboard

**Description :** Vue d'ensemble avec stats.  
**Critères d'acceptation :**

- Fichier `app/admin/page.tsx` créé
- Cards stats : Total fictions, Total chapitres, Total morceaux, Vues (si analytics)
- Section "Dernières publications" (5 derniers items)
- Actions rapides : "Nouvelle fiction" | "Upload musique" (buttons)
- Grid responsive
- Fetch stats via API `/api/admin/stats`
  **Estimation :** 1.5 jour  
  **Dépendances :** Layout admin créé, API stats (à créer)

---

#### [ ] Tâche : Créer l'API Route stats admin

**Description :** Endpoint pour statistiques dashboard.  
**Critères d'acceptation :**

- Fichier `app/api/admin/stats/route.ts` créé (GET)
- Auth required (middleware)
- Retourne : `fictionsCount`, `chaptersCount`, `tracksCount`
- Optionnel : vues (Vercel Analytics API, Phase 2)
- Cache : 5min
  **Estimation :** 0.5 jour  
  **Dépendances :** Middleware auth créé

---

### 5.3 Gestion Fictions

#### [ ] Tâche : Créer la page liste fictions admin

**Description :** Table de gestion des fictions.  
**Critères d'acceptation :**

- Fichier `app/admin/fictions/page.tsx` créé
- Table : Titre | Genre | Statut | Chapitres | Actions
- Actions : Éditer (icône crayon) | Supprimer (icône poubelle) | Voir (icône œil)
- Filtres : Statut (tous, draft, published)
- Recherche par titre (input debounced)
- Bouton "+ Nouvelle fiction" (top right)
- Fetch via `/api/admin/fictions` avec SWR
  **Estimation :** 2 jours  
  **Dépendances :** Layout admin créé, API admin fictions (à créer)

---

#### [ ] Tâche : Créer l'API Route admin fictions (CRUD)

**Description :** Endpoints pour gérer fictions.  
**Critères d'acceptation :**

- Fichier `app/api/admin/fictions/route.ts` créé
- GET : liste toutes fictions (incluant drafts)
- POST : créer fiction (validation Zod)
- PATCH : modifier fiction (validation Zod)
- DELETE : supprimer fiction (cascade chapters)
- Auth required sur toutes routes
- Retour 400 si validation échoue
  **Estimation :** 2 jours  
  **Dépendances :** Middleware auth créé

---

#### [ ] Tâche : Créer le schéma Zod fiction

**Description :** Validation des données fiction.  
**Critères d'acceptation :**

- Fichier `lib/validations/fiction.ts` créé
- Schema `fictionCreateSchema` : title (3-200 char), summary (50-500 char), coverImage (url), genre (enum), status (enum)
- Schema `fictionUpdateSchema` (partial)
- Slug généré automatiquement via helper (slugify)
- Export types TypeScript via `z.infer<>`
  **Estimation :** 0.5 jour  
  **Dépendances :** Zod installé

---

#### [ ] Tâche : Créer la page création fiction

**Description :** Formulaire pour créer une fiction.  
**Critères d'acceptation :**

- Fichier `app/admin/fictions/new/page.tsx` créé
- Formulaire : Titre, Slug (auto-généré, éditable), Résumé (textarea), Genre (select), Statut (select), Couverture (upload)
- Validation temps réel (Zod)
- Preview image si uploadée
- Boutons : "Sauvegarder draft" | "Publier" | "Annuler"
- Toast succès/erreur après soumission
- Redirection vers `/admin/fictions/[id]` après création
  **Estimation :** 2.5 jours  
  **Dépendances :** API admin fictions, schema Zod, Input/Button/Textarea créés

---

#### [ ] Tâche : Créer la page édition fiction

**Description :** Formulaire pour modifier une fiction.  
**Critères d'acceptation :**

- Fichier `app/admin/fictions/[id]/edit/page.tsx` créé
- Pré-rempli avec données existantes (fetch via API)
- Identique à création + bouton "Supprimer" (bottom left)
- Modal confirmation avant suppression
- Update via PATCH `/api/admin/fictions/[id]`
- Invalidation cache SWR après update
  **Estimation :** 2 jours  
  **Dépendances :** Page création fiction, Dialog créé

---

#### [ ] Tâche : Implémenter l'upload d'image (couverture)

**Description :** Upload de fichier image vers Vercel Blob.  
**Critères d'acceptation :**

- Fichier `lib/upload-image.ts` créé avec fonction `uploadImage(file)`
- Validation : formats jpg/png/webp, max 2MB
- Upload vers Vercel Blob via `put()`
- Retourne URL publique
- Preview image après upload (avant save form)
- Gestion erreurs (taille, format)
  **Estimation :** 1.5 jour  
  **Dépendances :** Vercel Blob configuré

---

### 5.4 Gestion Chapitres

#### [ ] Tâche : Créer la page vue fiction (chapitres)

**Description :** Page fiction dans admin avec liste chapitres.  
**Critères d'acceptation :**

- Fichier `app/admin/fictions/[id]/page.tsx` créé
- Header : infos fiction + bouton "Éditer fiction"
- Table chapitres : Numéro | Titre | Statut | Actions (Éditer, Supprimer)
- Bouton "+ Nouveau chapitre"
- Fetch fiction + chapters via API
- Modal confirmation avant suppression chapitre
  **Estimation :** 2 jours  
  **Dépendances :** Layout admin créé, API admin chapters (à créer)

---

#### [ ] Tâche : Créer l'API Route admin chapters (CRUD)

**Description :** Endpoints pour gérer chapitres.  
**Critères d'acceptation :**

- Fichier `app/api/admin/chapters/route.ts` créé
- POST : créer chapitre (validation Zod)
- PATCH : modifier chapitre
- DELETE : supprimer chapitre
- GET (optionnel) : récupérer un chapitre
- Auth required
- Validation : chapterNumber unique par fiction
  **Estimation :** 1.5 jour  
  **Dépendances :** Middleware auth créé

---

#### [ ] Tâche : Créer le schéma Zod chapter

**Description :** Validation des données chapitre.  
**Critères d'acceptation :**

- Fichier `lib/validations/chapter.ts` créé
- Schema `chapterCreateSchema` : fictionId (cuid), chapterNumber (int > 0), title (3-200 char), content (min 100 char)
- Schema `chapterUpdateSchema` (partial)
- Export types TypeScript
  **Estimation :** 0.5 jour  
  **Dépendances :** Zod installé

---

#### [ ] Tâche : Créer l'éditeur Markdown (split-screen)

**Description :** Éditeur avec preview temps réel.  
**Critères d'acceptation :**

- Fichier `ui/markdown-editor.tsx` créé
- Layout split : Gauche (textarea Markdown) | Droite (preview HTML)
- Toolbar : Boutons Gras, Italique, Titre, Liste, Lien, Image, Code
- Raccourcis clavier (Ctrl+B, Ctrl+I, etc.)
- Preview update avec debounce 300ms
- Scroll synchronisé (optionnel)
- Prose Noctalys appliqué sur preview
  **Estimation :** 3 jours  
  **Dépendances :** Markdown renderer créé

---

#### [ ] Tâche : Implémenter l'auto-save (draft)

**Description :** Sauvegarde automatique du contenu chapitre.  
**Critères d'acceptation :**

- Auto-save toutes les 30s si contenu modifié
- Indicateur "Sauvegardé il y a X min" visible
- Sauvegarde en localStorage (backup si déconnexion)
- Restauration auto si reload page
- Toast discret "Brouillon sauvegardé"
  **Estimation :** 1.5 jour  
  **Dépendances :** Markdown editor créé

---

#### [ ] Tâche : Créer la page création chapitre

**Description :** Formulaire pour créer un chapitre.  
**Critères d'acceptation :**

- Fichier `app/admin/fictions/[id]/chapters/new/page.tsx` créé
- Champs : Numéro (auto-incrémenté, éditable), Titre, Contenu (Markdown editor)
- Boutons : "Sauvegarder draft" | "Publier" | "Annuler"
- Preview disponible (bouton toggle ou split)
- POST vers `/api/admin/chapters`
- Redirection vers `/admin/fictions/[id]` après création
  **Estimation :** 2 jours  
  **Dépendances :** API admin chapters, Markdown editor, schema Zod

---

#### [ ] Tâche : Créer la page édition chapitre

**Description :** Formulaire pour modifier un chapitre.  
**Critères d'acceptation :**

- Fichier `app/admin/fictions/[fictionId]/chapters/[id]/edit/page.tsx` créé
- Pré-rempli avec contenu existant
- Identique à création + bouton "Supprimer"
- Modal confirmation suppression
- PATCH vers `/api/admin/chapters/[id]`
- Auto-save activé
  **Estimation :** 1.5 jour  
  **Dépendances :** Page création chapitre

---

### 5.5 Gestion Musiques

#### [ ] Tâche : Créer la page liste musiques admin

**Description :** Table de gestion des morceaux.  
**Critères d'acceptation :**

- Fichier `app/admin/music/page.tsx` créé
- Table : Titre | Durée | Date | Actions (Éditer, Supprimer, Écouter)
- Bouton "+ Upload musique"
- Fetch via `/api/admin/music` avec SWR
- Modal confirmation suppression
  **Estimation :** 1.5 jour  
  **Dépendances :** Layout admin créé, API admin music (à créer)

---

#### [ ] Tâche : Créer l'API Route admin music (CRUD)

**Description :** Endpoints pour gérer morceaux.  
**Critères d'acceptation :**

- Fichier `app/api/admin/music/route.ts` créé
- GET : liste tous tracks
- POST : créer track (validation Zod)
- PATCH : modifier track
- DELETE : supprimer track (+ delete fichier audio Blob)
- Auth required
  **Estimation :** 1.5 jour  
  **Dépendances :** Middleware auth créé

---

#### [ ] Tâche : Créer le schéma Zod track

**Description :** Validation des données track.  
**Critères d'acceptation :**

- Fichier `lib/validations/track.ts` créé
- Schema `trackCreateSchema` : title (3-200 char), audioUrl (url), coverArt (url optionnel), duration (int > 0)
- Schema `trackUpdateSchema` (partial)
- Slug généré automatiquement
  **Estimation :** 0.5 jour  
  **Dépendances :** Zod installé

---

#### [ ] Tâche : Implémenter l'upload audio (MP3)

**Description :** Upload de fichier audio vers Vercel Blob.  
**Critères d'acceptation :**

- Fichier `lib/upload-audio.ts` créé avec fonction `uploadAudio(file)`
- Validation : format mp3, max 10MB
- Progress bar pendant upload (state)
- Extraction durée via `Audio()` API browser
- Upload vers Vercel Blob
- Retourne URL + duration
- Gestion erreurs (taille, format)
  **Estimation :** 2 jours  
  **Dépendances :** Vercel Blob configuré

---

#### [ ] Tâche : Créer la page upload musique

**Description :** Formulaire pour uploader un morceau.  
**Critères d'acceptation :**

- Fichier `app/admin/music/new/page.tsx` créé
- Upload fichier MP3 : drag & drop ou clic
- Progress bar pendant upload
- Champs : Titre (pré-rempli depuis nom fichier), Slug (auto), Pochette (upload optionnel)
- Preview lecteur audio (teste le morceau)
- Extraction auto durée affichée
- Boutons : "Publier" | "Sauvegarder draft" | "Annuler"
- POST vers `/api/admin/music`
  **Estimation :** 2.5 jours  
  **Dépendances :** API admin music, upload audio, schema Zod

---

#### [ ] Tâche : Créer la page édition musique

**Description :** Formulaire pour modifier un morceau.  
**Critères d'acceptation :**

- Fichier `app/admin/music/[id]/edit/page.tsx` créé
- Pré-rempli avec données existantes
- Possibilité changer fichier audio (re-upload)
- Bouton "Supprimer" avec confirmation
- PATCH vers `/api/admin/music/[id]`
  **Estimation :** 1.5 jour  
  **Dépendances :** Page upload musique

---

## PHASE 6 : OPTIMISATIONS & TESTS (Semaine 5-6)

### 6.1 Performance

#### [ ] Tâche : Optimiser les images (next/image)

**Description :** Remplacer toutes balises `<img>` par `<Image>` Next.js.  
**Critères d'acceptation :**

- Toutes images utilisent `next/image`
- Formats WebP/AVIF automatiques
- Lazy loading activé (sauf above-the-fold)
- Sizes définis pour responsive
- Placeholder blur (data URL ou couleur)
- Alt texts présents et descriptifs
  **Estimation :** 1 jour  
  **Dépendances :** Images utilisées dans projet

---

#### [ ] Tâche : Configurer ISR (Incremental Static Regeneration)

**Description :** Optimiser les pages statiques avec revalidation.  
**Critères d'acceptation :**

- Pages fictions : `revalidate: 60` (1min)
- Pages chapitres : `revalidate: 300` (5min)
- Page home : `revalidate: 60`
- `generateStaticParams` pour fictions et chapitres (top 10)
- Build time < 2min pour 30 fictions
  **Estimation :** 1 jour  
  **Dépendances :** Pages publiques créées

---

#### [ ] Tâche : Optimiser le bundle JavaScript

**Description :** Réduire la taille du bundle.  
**Critères d'acceptation :**

- Analyze bundle avec `@next/bundle-analyzer`
- Code splitting automatique vérifié
- Dynamic imports pour composants lourds (Markdown editor, Audio player si gros)
- Tree shaking activé
- Bundle JS total < 200KB (first load)
- Rapport bundle généré et analysé
  **Estimation :** 1 jour  
  **Dépendances :** Application fonctionnelle

---

#### [ ] Tâche : Optimiser les Core Web Vitals

**Description :** Atteindre scores Lighthouse > 90.  
**Critères d'acceptation :**

- LCP < 2.5s (optimiser images hero, fonts preload)
- FID < 100ms (minimiser JS bloquant)
- CLS < 0.1 (réserver espace images, skeletons)
- Lighthouse Performance > 90 sur 3 pages clés (home, fiction, chapitre)
- Tests desktop ET mobile
  **Estimation :** 2 jours  
  **Dépendances :** Application fonctionnelle

---

### 6.2 SEO

#### [ ] Tâche : Implémenter les metadata dynamiques

**Description :** Configurer SEO pour toutes pages.  
**Critères d'acceptation :**

- `metadata` ou `generateMetadata` dans toutes pages
- Open Graph tags (title, description, image, url)
- Twitter Card tags
- Canonical URLs
- Images OG : couverture fiction (ou default Noctalys)
- Description < 160 char, titre < 60 char
  **Estimation :** 1.5 jour  
  **Dépendances :** Pages créées

---

#### [ ] Tâche : Générer le sitemap.xml

**Description :** Sitemap automatique pour SEO.  
**Critères d'acceptation :**

- Fichier `app/sitemap.ts` créé (Next.js 15 convention)
- Inclut : home, /fictions, toutes fictions, tous chapitres, /music
- Priorités : home (1.0), fictions (0.8), chapitres (0.6)
- Changefreq appropriées (weekly, monthly)
- lastmod depuis `updatedAt` en DB
- Accessible via `/sitemap.xml`
  **Estimation :** 1 jour  
  **Dépendances :** Pages publiques créées

---

#### [ ] Tâche : Créer le robots.txt

**Description :** Configurer l'accès crawlers.  
**Critères d'acceptation :**

- Fichier `app/robots.ts` créé
- Allow all crawlers
- Disallow `/admin/*`
- Sitemap URL incluse
- Accessible via `/robots.txt`
  **Estimation :** 0.5 jour  
  **Dépendances :** Sitemap créé

---

#### [ ] Tâche : Implémenter le JSON-LD (structured data)

**Description :** Ajouter les données structurées pour Google.  
**Critères d'acceptation :**

- Schema.org types : WebSite (home), Article (fictions), MusicRecording (tracks)
- JSON-LD dans `<script type="application/ld+json">`
- Validation via Google Rich Results Test
- Inclus : name, description, author, datePublished, image
  **Estimation :** 1 jour  
  **Dépendances :** Pages publiques créées

---

### 6.3 Accessibilité

#### [ ] Tâche : Audit accessibilité WCAG AAA

**Description :** Vérifier et corriger les problèmes a11y.  
**Critères d'acceptation :**

- Lighthouse Accessibility > 95 sur toutes pages
- Tous contrastes validés (WCAG AAA : 7:1 texte normal, 4.5:1 large)
- Navigation clavier complète (Tab, Enter, Esc)
- Focus visible sur tous éléments interactifs
- Skip links fonctionnels ("Skip to main content")
- ARIA labels sur icons/buttons sans texte
- Landmarks HTML5 (<nav>, <main>, <footer>)
  **Estimation :** 2 jours  
  **Dépendances :** UI complète

---

#### [ ] Tâche : Tester avec lecteur d'écran

**Description :** Vérifier expérience NVDA/VoiceOver.  
**Critères d'acceptation :**

- Navigation complète possible avec NVDA (Windows) ou VoiceOver (Mac)
- Tous textes lus correctement
- Forms accessibles (labels associés)
- Liens descriptifs (pas "cliquez ici")
- Images avec alt texts pertinents
- Corrections appliquées si problèmes détectés
  **Estimation :** 1 jour  
  **Dépendances :** Audit a11y complété

---

### 6.4 Tests Unitaires

#### [ ] Tâche : Configurer Vitest

**Description :** Setup du framework de tests unitaires.  
**Critères d'acceptation :**

- `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom` exécuté
- Fichier `vitest.config.ts` créé
- Script `npm run test:unit` fonctionnel
- Script `npm run test:coverage` fonctionnel
- Environnement jsdom configuré
  **Estimation :** 0.5 jour  
  **Dépendances :** Aucune

---

#### [ ] Tâche : Tester les fonctions utilitaires

**Description :** Tests unitaires pour `lib/` et `utils/`.  
**Critères d'acceptation :**

- Tests pour slugify (si custom)
- Tests pour validation Zod (schemas)
- Tests pour helpers upload (mocks)
- Coverage > 80% sur `lib/` et `utils/`
- Tous tests passent (`npm run test:unit`)
  **Estimation :** 1.5 jour  
  **Dépendances :** Vitest configuré

---

#### [ ] Tâche : Tester les composants UI

**Description :** Tests unitaires pour `ui/`.  
**Critères d'acceptation :**

- Tests Button (render, variants, onClick)
- Tests Card (render, hover classes)
- Tests Input (validation, error states)
- Tests Badge (variants, colors)
- Coverage > 70% sur `ui/`
  **Estimation :** 2 jours  
  **Dépendances :** Vitest configuré, composants UI créés

---

### 6.5 Tests E2E

#### [ ] Tâche : Configurer Playwright

**Description :** Setup du framework de tests E2E.  
**Critères d'acceptation :**

- `npm install -D @playwright/test` exécuté
- `npx playwright install` exécuté (browsers)
- Fichier `playwright.config.ts` créé
- Tests sur 3 navigateurs : Chromium, Firefox, Webkit
- Script `npm run test:e2e` fonctionnel
  **Estimation :** 0.5 jour  
  **Dépendances :** Aucune

---

#### [ ] Tâche : Écrire les tests E2E critiques

**Description :** Tester les parcours utilisateurs principaux.  
**Critères d'acceptation :**

- Test 1 : Visiteur → Home → Liste fictions → Fiction → Chapitre (lecture)
- Test 2 : Visiteur → Musiques → Clic Play → Lecteur audio fonctionne
- Test 3 : Admin → Login → Dashboard → Créer fiction → Créer chapitre → Publier
- Test 4 : Admin → Upload musique → Publier
- Test 5 : Navigation clavier complète (Tab, Enter)
- Tous tests passent sur 3 navigateurs
  **Estimation :** 3 jours  
  **Dépendances :** Playwright configuré, application fonctionnelle

---

## PHASE 7 : CONTENU & LANCEMENT (Semaine 6)

### 7.1 Migration Contenu

#### [ ] Tâche : Formater le contenu initial en Markdown

**Description :** Convertir les fictions existantes en Markdown.  
**Critères d'acceptation :**

- 3 fictions minimum formatées
- 5-10 chapitres par fiction
- Markdown valide (headings, paragraphes, listes)
- Métadonnées préparées (titres, résumés, genres)
- Images de couverture sélectionnées (3 min)
  **Estimation :** 2 jours  
  **Dépendances :** Contenu initial disponible (PRD confirmé ✅)

---

#### [ ] Tâche : Importer le contenu via admin

**Description :** Publier les fictions via interface admin.  
**Critères d'acceptation :**

- 3 fictions créées avec couvertures
- 15-30 chapitres publiés au total
- 5 morceaux uploadés avec pochettes
- Tous contenus publiés (status = PUBLISHED)
- Preview validation sur site public
  **Estimation :** 1 jour  
  **Dépendances :** Interface admin fonctionnelle, contenu formaté

---

### 7.2 Documentation

#### [ ] Tâche : Rédiger le README.md

**Description :** Documentation pour développeurs.  
**Critères d'acceptation :**

- Sections : Description, Features, Tech Stack, Setup, Scripts, Deployment
- Instructions setup claires (clone, install, env, migrate, seed, run)
- Liste scripts npm (dev, build, test, lint, etc.)
- Badges : CI status, License, Deploy status
- Screenshots (optionnel)
  **Estimation :** 1 jour  
  **Dépendances :** Application fonctionnelle

---

#### [ ] Tâche : Rédiger l'ARCHITECTURE.md

**Description :** Documentation architecture technique.  
**Critères d'acceptation :**

- Diagramme architecture (Next.js → Prisma → Postgres, Vercel Blob)
- Structure dossiers expliquée
- Patterns utilisés (Server Components, ISR, SWR)
- Décisions techniques justifiées
- Flow authentification
  **Estimation :** 1 jour  
  **Dépendances :** Application fonctionnelle

---

#### [ ] Tâche : Rédiger l'ADMIN_GUIDE.md

**Description :** Guide utilisateur pour l'interface admin.  
**Critères d'acceptation :**

- Comment se connecter
- Comment créer/éditer/supprimer fictions et chapitres
- Comment uploader musiques
- Screenshots annotés
- Troubleshooting commun (upload échoue, session expire, etc.)
  **Estimation :** 1 jour  
  **Dépendances :** Interface admin fonctionnelle

---

### 7.3 Pre-Launch

#### [ ] Tâche : Tests de charge (optionnel)

**Description :** Vérifier performance sous trafic.  
**Critères d'acceptation :**

- Outil : k6 ou Artillery
- Simulation : 100 users simultanés
- Pages testées : Home, Fiction detail, Chapitre
- Temps réponse moyen < 500ms
- Aucune erreur 5xx
  **Estimation :** 1 jour  
  **Dépendances :** Application déployée

---

#### [ ] Tâche : Audit sécurité

**Description :** Vérifier les vulnérabilités.  
**Critères d'acceptation :**

- Validation input (Zod) partout
- XSS prevention (rehype-sanitize sur Markdown)
- CSRF protection (Better Auth)
- SQL injection impossible (Prisma parameterized queries)
- Rate limiting login actif
- Headers sécurité (CSP, X-Frame-Options, etc.) configurés
  **Estimation :** 1 jour  
  **Dépendances :** Application fonctionnelle

---

#### [ ] Tâche : Configurer les headers de sécurité

**Description :** Headers HTTP pour protection.  
**Critères d'acceptation :**

- Fichier `next.config.js` avec `headers()` configuré
- CSP (Content-Security-Policy) défini
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy configuré
  **Estimation :** 0.5 jour  
  **Dépendances :** Application fonctionnelle

---

#### [ ] Tâche : Tester sur devices réels

**Description :** Validation multi-devices.  
**Critères d'acceptation :**

- Tests iPhone (Safari iOS)
- Tests Android (Chrome)
- Tests iPad/tablette
- Tests desktop (Chrome, Firefox, Safari)
- Responsive impeccable
- Touch targets > 44px mobile
- Pas de bug visuel
  **Estimation :** 1 jour  
  **Dépendances :** Application déployée

---

#### [ ] Tâche : Configuration monitoring production

**Description :** Activer le monitoring erreurs et performance.  
**Critères d'acceptation :**

- Vercel Analytics activé
- Sentry installé (optionnel, Phase 2)
- Alerts configurées (uptime, erreurs 5xx)
- Dashboard monitoring accessible
  **Estimation :** 0.5 jour  
  **Dépendances :** Application déployée

---

### 7.4 Lancement

#### [ ] Tâche : Déploiement production final

**Description :** Merge `develop` → `main` et deploy.  
**Critères d'acceptation :**

- Pull Request `develop` → `main` créée
- Review code complétée
- CI/CD passe (lint, tests, build)
- Merge effectué
- Deploy automatique sur `noctalys.lyksia.com`
- Vérification manuelle post-deploy
  **Estimation :** 0.5 jour  
  **Dépendances :** Tous tests passent, contenu publié

---

#### [ ] Tâche : Vérification post-lancement

**Description :** Checklist finale après mise en ligne.  
**Critères d'acceptation :**

- Site accessible via domaine custom
- SSL actif (HTTPS)
- Toutes pages publiques accessibles
- Admin login fonctionnel
- Lecteur audio fonctionne
- Lighthouse > 90 en production
- Aucune erreur console browser
- Sitemap indexable
  **Estimation :** 0.5 jour  
  **Dépendances :** Déploiement production effectué

---

## PHASE 8 : POST-LANCEMENT (Optionnel - Phase 2)

### 8.1 Fonctionnalités SHOULD HAVE

#### [ ] Tâche : Implémenter les bookmarks (progression lecture)

**Description :** Sauvegarder la position de lecture.  
**Critères d'acceptation :**

- State localStorage : `{ fictionId: chapterId }`
- Badge "Continuer la lecture" sur homepage
- Indicateur "Lu" sur chapitres terminés
- Bouton "Reprendre" sur page fiction → dernier chapitre lu
  **Estimation :** 2 jours  
  **Dépendances :** Pages lecture fonctionnelles

---

#### [ ] Tâche : Implémenter le système de commentaires

**Description :** Permettre commentaires modérés sur chapitres et morceaux.  
**Critères d'acceptation :**

- Modèle Prisma `Comment` créé
- Formulaire commentaire (nom, email, message)
- Modération pré-publication (admin valide)
- Interface modération dans admin
- Notifications email nouveaux commentaires (optionnel)
  **Estimation :** 3 jours  
  **Dépendances :** Application fonctionnelle

---

#### [ ] Tâche : Générer le flux RSS

**Description :** Feed RSS pour nouvelles publications.  
**Critères d'acceptation :**

- Fichier `app/feed.xml/route.ts` créé
- RSS 2.0 valide
- Inclut dernières 20 publications (fictions + musiques)
- Métadonnées complètes (title, description, link, pubDate)
- Accessible via `/feed.xml`
- Validation via W3C Feed Validator
  **Estimation :** 1 jour  
  **Dépendances :** Pages publiques créées

---

#### [ ] Tâche : Implémenter le mode lecture ajustable

**Description :** Panel settings pour personnaliser lecture.  
**Critères d'acceptation :**

- Toggle panel (icône settings dans header chapitre)
- Options : Taille police (S/M/L), Espacement (normal/large), Luminosité (slider optionnel)
- Sauvegarde préférences localStorage
- Application immédiate des changements
- Design Noctalys cohérent
  **Estimation :** 2 jours  
  **Dépendances :** Pages lecture fonctionnelles

---

#### [ ] Tâche : Ajouter les boutons de partage social

**Description :** Faciliter le partage de contenu.  
**Critères d'acceptation :**

- Boutons : Twitter/X, Mastodon, Copy link
- Open Graph optimisé (image, titre, description)
- Copy link : copie URL + toast "Lien copié"
- Tracking clicks (analytics event)
  **Estimation :** 1 jour  
  **Dépendances :** Metadata OG configurées

---

#### [ ] Tâche : Dashboard analytics admin

**Description :** Visualiser les stats dans admin.  
**Critères d'acceptation :**

- Graphiques vues par fiction/morceau (chart.js ou recharts)
- Temps de lecture moyen
- Taux de complétion chapitres
- Données depuis Vercel Analytics API
- Période sélectionnable (7j, 30j, 90j)
  **Estimation :** 3 jours  
  **Dépendances :** Vercel Analytics API accessible

---

## RÉCAPITULATIF PAR PHASE

**Phase 1 - Infrastructure (Semaine 1-2) :** 13 tâches, ~11 jours  
**Phase 2 - Design System (Semaine 1-2) :** 12 tâches, ~10 jours  
**Phase 3 - Layout & Navigation (Semaine 2) :** 4 tâches, ~4 jours  
**Phase 4 - Pages Publiques (Semaine 3-4) :** 13 tâches, ~18 jours  
**Phase 5 - Interface Admin (Semaine 4-5) :** 24 tâches, ~32 jours  
**Phase 6 - Optimisations & Tests (Semaine 5-6) :** 16 tâches, ~21 jours  
**Phase 7 - Contenu & Lancement (Semaine 6) :** 12 tâches, ~11 jours  
**Phase 8 - Post-Lancement (Optionnel) :** 6 tâches, ~12 jours

**TOTAL MVP (Phases 1-7) :** 94 tâches  
**TOTAL avec Phase 2 :** 100 tâches

---

## LÉGENDE DES PRIORITÉS

- 🔴 **Critique** : Bloquant pour MVP
- 🟠 **Haute** : Important pour qualité MVP
- 🟡 **Moyenne** : Nice to have MVP
- 🟢 **Basse** : Phase 2+

---

## SUIVI DE PROGRESSION

**Dernière mise à jour :** 19 novembre 2025  
**Tâches complétées :** 0 / 94 (MVP)  
**Pourcentage :** 0%

**Prochaines tâches prioritaires :**

1. Créer le repository GitHub
2. Initialiser Next.js 15
3. Provisionner Prisma Postgres
4. Installer Tailwind CSS V4
5. Configurer Shadcn UI

---

**Document prêt pour exécution. Bon développement ! 🌙**
