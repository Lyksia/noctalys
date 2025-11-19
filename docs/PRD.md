# Product Requirements Document (PRD)

## Noctalys - Plateforme de Publication Creative

**Version:** 1.0 | **Date:** 19 novembre 2025 | **Auteur:** Lovely | **Statut:** Validé
**Domaine:** noctalys.lyksia.com | **DB:** Prisma Postgres | **Contenu initial:** ✅ Prêt

---

## DÉCISIONS VALIDÉES

✅ **Base de données:** Prisma Postgres  
✅ **Domaine:** noctalys.lyksia.com  
✅ **Logo:** Noctalys (croissant de lune avec halo lumineux)  
✅ **Contenu initial:** Disponible (fictions + musiques)  
✅ **Esthétique:** Thème sombre élégant, halo lumineux, pas de néon agressif

---

## 1. RÉSUMÉ EXÉCUTIF

### 1.1 Vision du produit

Créer **Noctalys**, plateforme web personnelle incarnant l'esthétique nocturne et lunaire pour publier fictions littéraires et compositions musicales. Le nom "Noctalys" évoque à la fois la nuit (nocturne) et l'analyse/la lumière, créant une identité forte autour d'un univers contemplatif et élégant.

### 1.2 Problème adressé

Les plateformes existantes (Medium, Wattpad, SoundCloud) imposent :

- Des templates génériques sans personnalisation esthétique
- Des contraintes éditoriales et de monétisation
- Une perte de contrôle sur les données et l'expérience
- Un manque d'identité visuelle distinctive
- Une séparation entre différents types de contenus (texte vs audio)

L'auteur souhaite un espace 100% personnalisé reflétant son identité créative avec l'esthétique Noctalys : **thème sombre élégant, halo lumineux subtil, branding cohérent**.

### 1.3 Proposition de valeur

- **Contrôle total** sur le design, l'UX et les données
- **Esthétique distinctive Noctalys** : thème sombre + halo lumineux (pas de néon agressif)
- **Unification** : fictions et musiques sur une seule plateforme cohérente
- **Performance optimale** : temps de chargement < 2s, Core Web Vitals excellents
- **Propriété complète** : hébergement et données sous contrôle direct
- **Expérience immersive** : design contemplatif favorisant la lecture/écoute prolongée

### 1.4 Utilisateurs cibles

**Utilisateur principal : L'auteur/créateur (admin)**

- Besoin de publier rapidement et facilement
- Contrôle total sur la présentation
- Interface admin intuitive
- Preview avant publication

**Utilisateurs secondaires : Lecteurs et auditeurs (public)**

_Persona 1 : Le lecteur occasionnel_

- Découvre le site par curiosité ou recommandation
- Apprécie les designs soignés et immersifs
- Lit 1-2 chapitres par visite
- Sensible à l'esthétique et la fluidité

_Persona 2 : Le lecteur régulier_

- Suit l'évolution des fictions
- Revient régulièrement pour nouveaux chapitres
- Lit plusieurs chapitres d'affilée
- Souhaite retrouver sa progression

_Persona 3 : L'auditeur musical_

- Découvre les compositions
- Écoute en arrière-plan pendant navigation
- Apprécie l'ambiance nocturne cohérente
- Peut écouter plusieurs morceaux en playlist

---

## 2. OBJECTIFS DU PRODUIT

### 2.1 Objectifs primaires

1. **Publier des fictions structurées par chapitres**
   - Interface admin permettant création rapide (< 10min par chapitre)
   - Organisation claire par fiction → chapitres numérotés
   - Navigation intuitive entre chapitres (précédent/suivant)
   - Indicateur de progression pour les lecteurs

2. **Diffuser des compositions musicales avec lecteur intégré**
   - Lecteur audio sticky restant accessible pendant navigation
   - Design Noctalys cohérent (contrôles lumineux)
   - Lecture séquentielle automatique (playlist)
   - Compatibilité tous navigateurs modernes

3. **Incarner l'identité Noctalys**
   - Thème sombre élégant (pas de noir pur brutal)
   - Effets halo lumineux sur éléments interactifs
   - Esthétique lunaire et contemplative
   - Animations subtiles et poétiques
   - Logo Noctalys omniprésent mais discret

4. **Garantir des performances optimales**
   - Temps de chargement initial < 2s
   - Core Web Vitals : LCP < 2.5s, FID < 100ms, CLS < 0.1
   - Images optimisées (WebP/AVIF)
   - Audio streaming sans lag

5. **Créer une expérience immersive**
   - Typographie optimisée pour lecture longue (interlignage 1.8, max 70ch)
   - Absence de distractions (UI minimaliste sur pages lecture)
   - Cohérence esthétique sur toutes les pages
   - Responsive impeccable (mobile/tablette/desktop)

### 2.2 Objectifs secondaires

1. **Permettre le suivi des lectures**
   - Bookmarks automatiques (localStorage ou cookies)
   - Indication "Continuer la lecture" sur homepage
   - Chapitres marqués comme lus

2. **Intégrer des commentaires modérés**
   - Système de commentaires sur chapitres et morceaux
   - Modération pré-publication (interface admin)
   - Notifications nouveaux commentaires

3. **Proposer un flux RSS**
   - RSS feed auto-généré (/feed.xml)
   - Notifications automatiques nouvelles publications
   - Compatible tous lecteurs RSS

4. **Optimiser le SEO**
   - Meta tags complets (title, description, OG, Twitter)
   - Sitemap.xml automatique
   - Structured data (JSON-LD)
   - URLs propres et lisibles

5. **Renforcer le branding Noctalys**
   - Logo dans tous les contextes (partage social, favicon, etc.)
   - Message d'attente poétique si aucun contenu
   - Easter eggs subtils (phase lunaire du jour, citations)

### 2.3 KPI / Métriques mesurables

| Métrique                          | Cible          | Méthode de mesure                         | Fréquence       |
| --------------------------------- | -------------- | ----------------------------------------- | --------------- |
| **Performance**                   |
| Temps de chargement initial       | < 2s           | Lighthouse, Vercel Analytics              | Hebdomadaire    |
| Core Web Vitals (LCP)             | < 2.5s         | Vercel Analytics, PageSpeed Insights      | Quotidienne     |
| Core Web Vitals (FID)             | < 100ms        | Vercel Analytics                          | Quotidienne     |
| Core Web Vitals (CLS)             | < 0.1          | Vercel Analytics                          | Quotidienne     |
| Score Lighthouse Performance      | > 90           | Lighthouse CI (GitHub Actions)            | À chaque commit |
| Score Lighthouse Accessibility    | > 95           | Lighthouse CI                             | À chaque commit |
| Score Lighthouse SEO              | > 90           | Lighthouse CI                             | Hebdomadaire    |
| **Engagement**                    |
| Taux de lecture complète chapitre | > 60%          | Analytics custom events (scroll depth)    | Hebdomadaire    |
| Taux d'écoute > 30s (musique)     | > 70%          | Analytics custom events (audio play time) | Hebdomadaire    |
| Temps passé sur site              | > 5min/session | Vercel Analytics                          | Hebdomadaire    |
| Pages par session                 | > 3            | Vercel Analytics                          | Hebdomadaire    |
| Taux de rebond                    | < 40%          | Vercel Analytics                          | Hebdomadaire    |
| **Technique**                     |
| Uptime                            | > 99.9%        | Vercel monitoring                         | Temps réel      |
| Erreurs 5xx                       | < 0.1%         | Vercel logs                               | Quotidienne     |
| Taille bundle JS                  | < 200KB        | Lighthouse, Bundle analyzer               | À chaque build  |

### 2.4 Métriques de succès à 3 mois

- **Contenu publié** : 5+ fictions (30+ chapitres), 10+ morceaux
- **Trafic** : 500+ visiteurs uniques/mois
- **Engagement** : 60%+ lecteurs lisent > 1 chapitre
- **Performance** : 100% des pages avec Lighthouse > 90
- **Retour utilisateurs** : 80%+ feedbacks positifs (si commentaires activés)

---

## 3. CONTEXTE & HYPOTHÈSES

### 3.1 Hypothèses fonctionnelles

**Création de contenu :**

- L'auteur publiera du contenu **manuellement** via interface admin (pas d'import automatique)
- Les fictions comportent entre **5 et 50 chapitres** en moyenne
- Les chapitres contiennent entre **1000 et 5000 mots** (temps de lecture : 5-20min)
- Fréquence de publication : **1-2 chapitres par semaine** (à confirmer)
- Les fichiers audio sont au format **MP3**, taille **< 10MB** par fichier
- Durée moyenne des morceaux : **3-5 minutes**

**Trafic et usage :**

- Le trafic initial sera **faible** (< 1000 visiteurs/mois)
- Croissance organique via SEO et bouche-à-oreille
- Pas de pic de trafic soudain attendu
- Sessions majoritairement en soirée/nuit (aligné avec le thème nocturne)

**Contenu initial :**

- ✅ **Contenu initial disponible** au lancement
- Minimum requis pour MVP : 3 fictions (5-10 chapitres chacune), 5 morceaux
- Contenu déjà rédigé, nécessite formatage Markdown

### 3.2 Hypothèses techniques

**Infrastructure :**

- Hébergement sur **Vercel** (Next.js optimisé)
- Base de données **Prisma Postgres** (décision validée)
- Stockage des assets audio/images sur **Vercel Blob** (CDN intégré)
- **Domaine configuré** : noctalys.lyksia.com (DNS à configurer)
- Pas de besoin de scalabilité massive au lancement (tier gratuit/hobby suffisant)

**Compatibilité :**

- Navigateurs modernes uniquement (**2 dernières versions**)
  - Chrome/Edge 120+
  - Firefox 120+
  - Safari 17+
  - Mobile : iOS Safari 17+, Chrome Android
- Pas de support IE11 ou navigateurs obsolètes
- Progressive Enhancement : fonctionnel sans JS pour contenu statique

**Performance :**

- Trafic initial < 10 000 pages vues/mois
- Bande passante : < 50GB/mois (estimé)
- Pas de problème de scalabilité attendu Phase 1

### 3.3 Contraintes connues

**Budget :**

- Optimisation pour **tier gratuit/low-cost**
  - Vercel Hobby : $0/mois (ou Pro $20/mois si nécessaire)
  - Prisma Postgres Free : 10GB storage, 100GB data transfer
  - Vercel Blob : inclus dans plan Hobby
- Budget total cible : **< 50€/mois** incluant domaine

**Temps de développement :**

- MVP : **6-8 semaines** (estimation réaliste)
- Disponibilité : développement solo ou petit équipe
- Pas de deadline stricte, priorité à la qualité

**Compétences :**

- Stack **Next.js/React/TypeScript** (maîtrisée)
- Stack technique alignée avec STACK.md (expertise confirmée)
- Design : création design system Noctalys en interne

**Branding :**

- Respect **strict** de l'identité visuelle Noctalys
- Logo finalisé et disponible
- Palette de couleurs définie (moon + accent)
- Pas de compromis sur l'esthétique

### 3.4 Dépendances

**Design :**

- ✅ Logo Noctalys finalisé (croissant de lune avec halo)
- [ ] Finalisation design system complet (palette, composants, animations)
- [ ] Images de couverture pour contenu initial (3-5 images)
- [ ] Pochettes pour morceaux musicaux (5 images)

**Contenu :**

- ✅ Contenu littéraire disponible (fictions + chapitres)
- [ ] Formatage en Markdown (migration depuis format actuel)
- ✅ Fichiers audio disponibles (morceaux musicaux)
- [ ] Métadonnées à définir (titres, résumés, genres)

**Infrastructure :**

- [ ] Compte Vercel créé et projet initialisé
- [ ] Base de données Prisma Postgres provisionnée
- [ ] Configuration DNS noctalys.lyksia.com → Vercel
- [ ] Variables d'environnement configurées (AUTH_SECRET, etc.)
- [ ] Repository GitHub créé

**Validation :**

- [ ] Validation design system par stakeholder (vous)
- [ ] Validation UX lecture/audio par tests utilisateurs (optionnel Phase 1)
- [ ] Validation performance (Lighthouse >90)

### 3.5 Risques identifiés

| Risque                               | Impact | Probabilité | Mitigation                                                            |
| ------------------------------------ | ------ | ----------- | --------------------------------------------------------------------- |
| **Design system trop complexe**      | Moyen  | Faible      | Utiliser Shadcn UI comme base, itérer progressivement                 |
| **Performance lecteur audio custom** | Moyen  | Moyen       | Commencer avec `<audio>` natif + contrôles simples, améliorer Phase 2 |
| **Compatibilité Safari (audio/CSS)** | Moyen  | Moyen       | Tests cross-browser dès le début, fallbacks CSS                       |
| **Budget Vercel dépassé**            | Faible | Faible      | Monitoring usage, tier gratuit normalement suffisant                  |
| **Contenu pas prêt au lancement**    | Moyen  | Faible      | ✅ Confirmé disponible, utiliser seed DB si besoin                    |
| **Complexité migrations Prisma**     | Faible | Faible      | Documentation Prisma excellente, migrations testées en local d'abord  |
| **SEO initial faible**               | Moyen  | Élevé       | Normal pour nouveau site, stratégie long-terme via contenu de qualité |
| **Temps développement sous-estimé**  | Moyen  | Moyen       | Roadmap flexible, MVP peut être allégé si nécessaire                  |

---

## 4. STACK TECHNIQUE

Basée sur le document **STACK.md** fourni, optimisée pour le projet Noctalys.

### 4.1 Frontend

**Framework & Langage :**

- **Next.js 15** (App Router)
  - _Justification :_ SSR/ISR pour SEO, performance optimale, architecture moderne
  - Turbopack pour builds rapides
  - Image optimization native
  - Route handlers pour API
- **TypeScript** (strict mode)
  - _Justification :_ Type safety, meilleure DX, moins d'erreurs runtime
  - Configuration stricte (`strict: true`, `noImplicitAny: true`)
- **React 19**
  - Server Components par défaut
  - Hooks modernes (useState, useContext, useMemo)

**Styling :**

- **Tailwind CSS V4** + PostCSS
  - _Justification :_ Productivité élevée, design system facile, bundle optimisé
  - Configuration custom (palette moon, effets glow)
- **Shadcn UI**
  - _Justification :_ Composants accessibles, customisables, pas de dépendance runtime lourde
  - Composants utilisés : Button, Card, Input, Modal, Toast, etc.
  - Thème Noctalys appliqué via Tailwind

**State Management :**

- **React Context** pour lecteur audio (state global)
  - AudioPlayerContext : état play/pause, track actuel, volume, etc.
- **SWR** pour data fetching
  - _Justification :_ Cache intelligent, revalidation automatique, optimistic UI
  - Alternative : React Query (plus lourd mais plus features)

**Validation :**

- **Zod** (côté client ET serveur)
  - Schemas réutilisables
  - Type inference automatique TypeScript
  - Messages d'erreur personnalisés

### 4.2 Backend

**API & Server :**

- **Next.js Server Actions** (mutations)
  - _Justification :_ Type-safe, pas de route API nécessaire, optimisé
- **Next.js API Routes** (queries complexes, webhooks)
  - `/api/fictions`, `/api/chapters`, `/api/music`, `/api/admin/*`

**Authentification :**

- **Better Auth** (email/password strategy)
  - _Justification :_ Moderne, type-safe, plugins optionnels (admin, org, stripe)
  - Session management avec cookies HTTP-only
  - CSRF protection intégrée

**Validation serveur :**

- **Zod** sur tous les endpoints
  - Double validation client + serveur (sécurité)

### 4.3 Base de données

**ORM :**

- **Prisma**
  - _Justification :_ Type-safe queries, migrations gérées, excellent DX
  - Prisma Studio pour visualisation DB
  - Introspection et génération de types automatique

**Database :**

- **Prisma Postgres** (✅ décision validée)
  - Hébergé par Prisma (Vercel partnership)
  - **Tier Free** : 10GB storage, 100GB data transfer/mois
  - Connection pooling intégré
  - Backups automatiques
  - _Alternative considérée :_ Supabase (plus features mais complexité)

**Migrations :**

- Prisma Migrate (dev + production)
- Seed script pour données initiales
- Rollback possible si nécessaire

### 4.4 Storage & CDN

**Assets (images + audio) :**

- **Vercel Blob**
  - _Justification :_ Intégration native Vercel, simple, CDN automatique
  - Upload direct depuis admin
  - Compression automatique images (WebP/AVIF)
  - Streaming audio optimisé
  - Inclus dans plan Vercel Hobby

**CDN :**

- **Vercel Edge Network** (automatique)
  - Distribution globale
  - Cache intelligent
  - Headers optimisés

### 4.5 Déploiement & Infrastructure

**Hébergement :**

- **Vercel** (tier Hobby ou Pro selon besoins)
  - _Justification :_ Optimisé Next.js, déploiement zero-config, preview automatiques
  - **Hobby** : $0/mois, suffisant pour MVP
  - **Pro** : $20/mois si besoin (+ analytics avancés, + bande passante)

**Domaine :**

- **noctalys.lyksia.com** (✅ décision validée)
  - Configuration DNS requise (A/CNAME records)
  - SSL automatique (Let's Encrypt via Vercel)

**CI/CD :**

- **GitHub Actions**
  - Lint (ESLint)
  - Type-check (TypeScript)
  - Tests unitaires (Vitest)
  - Tests E2E (Playwright)
  - Build
  - Déploiement automatique sur push `main`

**Environnements :**

- **Production** : noctalys.lyksia.com (branche `main`)
- **Staging** : preview Vercel automatique (toutes branches)
- **Local** : localhost:3000 (développement)

### 4.6 Tests

**Unitaires :**

- **Vitest**
  - _Justification :_ Rapide (Vite-powered), compatible Jest, native ESM
  - React Testing Library pour composants

**E2E :**

- **Playwright**
  - _Justification :_ Multi-navigateurs (Chrome, Firefox, Safari), stable, rapide
  - Tests sur 3 navigateurs en CI

**Coverage :**

- Vitest coverage (c8)
- Cible : >70% statements

### 4.7 Monitoring & Analytics

**Performance :**

- **Vercel Analytics**
  - _Justification :_ GDPR-compliant (pas de cookies), gratuit tier Hobby
  - Core Web Vitals en temps réel
  - Page views, sessions
  - Custom events possibles

**Errors (Phase 2) :**

- **Sentry** (optionnel)
  - Monitoring erreurs runtime
  - Source maps pour debug
  - Alerts par email

**Logs :**

- Vercel logs (automatique)
- Prisma logs (requêtes DB en dev)

### 4.8 Outils de développement

**IDE :**

- **Zed** (selon STACK.md)
- Alternatives : VSCode, Cursor

**Package Manager :**

- **npm** (ou pnpm pour performance)
- Volta pour gestion versions Node.js

**Linting & Formatting :**

- **ESLint** (Next.js config + custom rules)
- **Prettier** (formatage automatique)
- Husky (git hooks, optionnel)

**Build System :**

- **Turbopack** (Next.js 15, plus rapide que Webpack)

### 4.9 Dépendances principales

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@prisma/client": "^6.0.0",
    "better-auth": "^1.0.0",
    "zod": "^3.23.0",
    "swr": "^2.2.0",
    "tailwindcss": "^4.0.0",
    "@vercel/blob": "^0.23.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-sanitize": "^6.0.0",
    "rehype-highlight": "^7.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "prisma": "^6.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "playwright": "^1.47.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0"
  }
}
```

---

## 5. SCOPE FONCTIONNEL

---

## 4. MODÈLES DE DONNÉES (Prisma)

```prisma
model Fiction {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  summary     String
  coverImage  String?
  genre       Genre?
  status      Status    @default(DRAFT)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  chapters    Chapter[]
  @@index([publishedAt])
}

model Chapter {
  id            String    @id @default(cuid())
  fictionId     String
  fiction       Fiction   @relation(fields: [fictionId], references: [id], onDelete: Cascade)
  chapterNumber Int
  title         String
  content       String    @db.Text // Markdown
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  @@unique([fictionId, chapterNumber])
}

model Track {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  audioUrl    String
  coverArt    String?
  duration    Int       // secondes
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model User {
  id       String    @id @default(cuid())
  email    String    @unique
  sessions Session[]
  accounts Account[]
}

enum Genre { FANTASY SCIFI ROMANCE THRILLER HORROR LITERARY OTHER }
enum Status { DRAFT ONGOING COMPLETED HIATUS }
```

---

## 5. API ENDPOINTS

### Public (GET)

- `/api/fictions` → Liste fictions publiées
- `/api/fictions/[slug]` → Détail fiction + chapitres
- `/api/chapters/[id]` → Contenu chapitre
- `/api/music` → Liste morceaux

### Admin (Auth required)

- `POST /api/admin/fictions` → Créer fiction
- `PATCH /api/admin/fictions/[id]` → Modifier
- `DELETE /api/admin/fictions/[id]` → Supprimer
- `POST /api/admin/chapters` → Créer chapitre
- `POST /api/admin/music` → Upload morceau
- `POST /api/admin/upload/image` → Upload image
- `POST /api/admin/upload/audio` → Upload audio

## 5. SCOPE FONCTIONNEL

### 5.1 Fonctionnalités MUST HAVE (MVP - Phase 1)

#### 5.1.1 Page d'accueil

**Éléments requis :**

- **Header** :
  - Logo Noctalys (cliquable → home)
  - Navigation principale : Accueil | Fictions | Musiques | À propos
  - Design sticky (reste visible au scroll)
- **Hero section** :
  - Titre/tagline (ex: "Noctalys - Histoires et Mélodies Nocturnes")
  - Animation subtile (parallax léger, fade-in)
  - Illustration lunaire (croissant de lune avec glow)
- **Dernières publications** :
  - Grid responsive (1 col mobile, 2 cols tablet, 3 cols desktop)
  - Mix fictions + musiques (3-6 éléments total)
  - Cards avec :
    - Image (couverture fiction ou pochette morceau)
    - Titre + résumé court (2 lignes max)
    - Type de contenu (badge "Fiction" ou "Musique")
    - Date de publication
    - Effet halo au hover
- **Footer** :
  - Liens : À propos | Contact | Mentions légales (Phase 2)
  - Copyright © 2025 Noctalys
  - Icônes réseaux sociaux (Phase 2)

**Comportements :**

- Chargement : skeleton screens → fade-in contenu
- Responsive : adaptation fluide mobile/tablet/desktop
- Accessibilité : landmarks ARIA, skip link

#### 5.1.2 Section Fictions

**Page liste fictions (`/fictions`) :**

- Titre : "Fictions"
- Liste toutes les fictions publiées (triées par date desc)
- Card par fiction :
  - Couverture (image optimisée, lazy loading)
  - Titre + résumé (150 caractères max)
  - Métadonnées : Genre | Statut (En cours / Terminée) | X chapitres
  - Badge statut (couleur selon ongoing/completed/hiatus)
  - Bouton "Lire" avec effet halo
- Filtres (Phase 2) : par genre, statut
- Recherche (Phase 3)

**Page détail fiction (`/fictions/[slug]`) :**

- **Header fiction** :
  - Couverture en grand format (effet parallax subtil au scroll)
  - Titre + auteur
  - Résumé complet
  - Métadonnées : Genre | Statut | Date publication | Durée lecture totale estimée
- **Liste des chapitres** :
  - Table élégante : Numéro | Titre | Date
  - Indicateur lecture (si bookmarks Phase 2)
  - Clic sur ligne → ouvre chapitre
  - Bouton "Commencer la lecture" (va au chapitre 1 ou dernier lu)
- **Actions** :
  - Partager (Phase 2)
  - Ajouter aux favoris (Phase 2)

**Page chapitre (`/fictions/[slug]/[chapterNumber]`) :**

- **UI minimaliste** (focus sur le texte) :
  - Header discret : Logo + titre fiction (sticky)
  - Titre du chapitre (H1, police serif)
  - Contenu :
    - Markdown → HTML (sanitisé)
    - Typographie optimisée :
      - Police serif (Lora)
      - Line-height 1.8
      - Font-size 18px (1.125rem)
      - Max-width 70ch (centré)
    - Code syntax highlighting (si code dans contenu)
    - Images responsive
- **Navigation** :
  - Footer sticky :
    - Bouton "< Chapitre précédent" (disabled si chapitre 1)
    - Indicateur : "Chapitre 3/12"
    - Bouton "Chapitre suivant >" (disabled si dernier)
  - Transitions douces entre chapitres (fade)
- **Expérience lecture** :
  - Scroll fluide
  - Pas de sidebar ou distraction
  - Background nocturne subtil (gradient doux)
  - Animations d'apparition du texte (fade-in paragraphes, optionnel)

#### 5.1.3 Section Musiques

**Page liste musiques (`/music`) :**

- Titre : "Musiques"
- Grid responsive (2-3 colonnes)
- Card par morceau :
  - Pochette (ou image Noctalys par défaut)
  - Titre
  - Durée (MM:SS)
  - Date publication
  - Bouton Play avec icône (lance lecteur)
  - Effet glow au hover

**Lecteur audio intégré (sticky bottom) :**

- **Apparence** :
  - Barre sticky en bas de page (z-index élevé)
  - Design Noctalys :
    - Background moon-800 avec subtle blur
    - Contrôles avec effet glow
    - Pochette actuelle (petit format, animation pulse pendant lecture)
- **Contrôles** :
  - **Play/Pause** : bouton principal (icône change)
  - **Seek bar** : barre de progression cliquable
    - Barre remplie : gradient accent-primary → accent-glow
    - Glow sur curseur
    - Tooltip temps au hover
  - **Volume** : slider (0-100%)
    - Icône mute/unmute
    - Mémorisé en localStorage
  - **Next/Previous** : navigation playlist
  - **Métadonnées** : Titre morceau | Temps actuel / Total
- **Comportements** :
  - Reste visible pendant navigation (state global via Context)
  - Lecture séquentielle : fin morceau → suivant automatiquement
  - Pause si utilisateur quitte site (beforeunload)
  - Préchargement metadata du prochain morceau
- **États** :
  - Idle : lecteur masqué
  - Loading : spinner + "Chargement..."
  - Playing : animation pochette (rotation ou pulse)
  - Paused : animation pause
  - Error : message + suggestion

#### 5.1.4 Interface Admin

**Login (`/admin/login`) :**

- Formulaire centré, design Noctalys adapté (contraste amélioré)
- Champs : Email, Password
- Bouton "Se connecter"
- Messages d'erreur clairs
- Rate limiting : 5 tentatives / 15min

**Dashboard (`/admin`) :**

- **Sidebar** :
  - Logo Noctalys
  - Menu : Dashboard | Fictions | Musiques | Paramètres | Déconnexion
- **Vue d'ensemble** :
  - Stats (cards) :
    - Total fictions publiées
    - Total chapitres
    - Total morceaux
    - Vues dernière semaine (Vercel Analytics)
  - Dernières publications (liste)
  - Actions rapides : "Nouvelle fiction" | "Upload musique"

**Gestion fictions (`/admin/fictions`) :**

- **Liste** :
  - Table : Titre | Genre | Statut | Chapitres | Actions
  - Actions par ligne : Éditer | Supprimer | Voir sur site
  - Bouton "+ Nouvelle fiction"
  - Filtres : Statut (tous, draft, published)
  - Recherche par titre

- **Création/édition (`/admin/fictions/new` ou `/admin/fictions/[id]/edit`) :**
  - Formulaire :
    - Titre\* (input text)
    - Slug (généré auto, éditable)
    - Résumé\* (textarea, 50-500 char)
    - Genre (select)
    - Statut (select: draft, ongoing, completed, hiatus)
    - Couverture (upload image, max 2MB)
    - Preview image (si uploadée)
  - Validation temps réel (Zod)
  - Boutons : Sauvegarder draft | Publier | Annuler
  - Si édition : bouton "Supprimer" (modal confirmation)

**Gestion chapitres (`/admin/fictions/[id]`) :**

- **Vue fiction** :
  - Infos fiction (titre, statut, etc.)
  - Bouton "Éditer fiction"
  - Liste chapitres :
    - Numéro | Titre | Statut | Actions
    - Drag & drop pour réordonner (Phase 2)
  - Bouton "+ Nouveau chapitre"

- **Éditeur chapitre (`/admin/fictions/[id]/chapters/new` ou `/edit`) :**
  - **Split screen** (desktop) ou stack (mobile) :
    - **Gauche : Éditeur Markdown**
      - Toolbar : Gras, Italique, Titre, Liste, Lien, Image, Code
      - Textarea avec highlighting Markdown
      - Raccourcis clavier (Ctrl+B, Ctrl+I, etc.)
      - Auto-save draft toutes les 30s
      - Indicateur "Sauvegardé il y a X min"
    - **Droite : Preview**
      - Rendu HTML en temps réel
      - Applique thème Noctalys (prose-noctalys)
      - Scroll synchronisé (optionnel)

  - **Champs** :
    - Numéro chapitre (auto-incrémenté, éditable)
    - Titre chapitre\* (input)
    - Contenu\* (Markdown editor)
  - **Boutons** :
    - Sauvegarder draft (toujours dispo)
    - Publier (rend visible sur site)
    - Annuler
    - Supprimer (si édition)

**Gestion musiques (`/admin/music`) :**

- **Liste** :
  - Table : Titre | Durée | Date | Actions
  - Actions : Éditer | Supprimer | Écouter
  - Bouton "+ Upload musique"

- **Upload (`/admin/music/new`) :**
  - Upload fichier MP3 (drag & drop ou clic)
  - Progress bar pendant upload
  - Extraction automatique durée
  - Champs :
    - Titre\* (input, pré-rempli depuis nom fichier)
    - Slug (généré auto)
    - Pochette (upload optionnel, sinon image par défaut)
  - Preview lecteur (teste le morceau)
  - Boutons : Publier | Sauvegarder draft | Annuler

#### 5.1.5 Design System Noctalys

**Palette de couleurs :**

- Moon (gris) : 50 → 950 (voir section 9 pour détails)
- Accent : primary (argenté), secondary, glow, muted
- Status : success, warning, error, info

**Typographie :**

- Sans : Inter (UI, navigation)
- Serif : Lora (chapitres, titres élégants)
- Mono : JetBrains Mono (code)

**Composants UI :**

- **Button** : variants (primary, secondary, ghost), sizes (sm, md, lg)
- **Card** : effet halo au hover, border subtle
- **Input/Textarea** : thème sombre, focus glow
- **Modal** : backdrop blur, animations fade
- **Toast** : notifications top-right, auto-dismiss
- **Badge** : pour statuts (ongoing, completed, etc.)

**Effets :**

- **Halo/Glow** : box-shadow avec rgba accent-glow
- **Transitions** : duration-300 (rapide), ease-in-out
- **Animations** :
  - fade-in : apparition éléments
  - glow-pulse : pulsation subtile
  - slide-up : éléments entrants

**Responsive :**

- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile-first approach
- Touch-friendly (boutons min 44x44px)

### 5.2 Fonctionnalités SHOULD HAVE (Phase 2)

**Bookmarks / Progression lecture :**

- Sauvegarde position (chapitre actuel) en localStorage
- Indicateur "Continuer la lecture" sur homepage
- Badge "Lu" sur chapitres terminés

**Commentaires modérés :**

- Formulaire sous chapitres/morceaux (nom, email, message)
- Modération pré-publication (admin valide)
- Interface modération dans admin
- Notifications nouveaux commentaires

**Flux RSS :**

- `/feed.xml` généré automatiquement
- Contient dernières publications
- Compatible lecteurs RSS standards

**Mode lecture ajustable :**

- Toggle panel (settings icon)
- Options : Taille police (S/M/L), Espacement, Luminosité
- Sauvegarde préférences localStorage

**Partage social :**

- Boutons Twitter/X, Mastodon
- Open Graph optimisé (image, titre, description)
- Copy link to clipboard

**Dashboard analytics admin :**

- Graphiques vues par fiction/morceau
- Temps de lecture moyen
- Taux de complétion chapitres
- Données depuis Vercel Analytics API

### 5.3 Fonctionnalités COULD HAVE (Phase 3+)

**Recherche full-text :**

- Barre recherche globale
- Résultats : fictions (titres, résumés), chapitres (contenu)
- PostgreSQL full-text search OU Algolia

**Tags et filtres avancés :**

- Tags sur fictions et morceaux
- Filtres multi-critères
- Pages `/tags/[tag]`

**Mode clair (optionnel) :**

- Toggle "Mode jour/nuit"
- Palette inversée (backgrounds clairs)
- Sauvegarde préférence

**Export EPUB/PDF :**

- Bouton "Télécharger" sur page fiction
- Génération EPUB (epub-gen)
- PDF avec branding Noctalys

**Newsletter :**

- Formulaire abonnement (email)
- Intégration Resend ou Mailchimp
- Envoi auto nouvelles publications

**Système de notes/évaluations :**

- Étoiles ou likes sur fictions/morceaux
- Stockage DB, affichage public
- Pas de compte requis (cookie-based)

### 5.4 Fonctionnalités OUT OF SCOPE

**Définitivement exclus :**

- Système d'abonnement payant / monétisation
- Marketplace / vente directe
- Comptes utilisateurs multiples avec profils
- Forum ou espace communautaire
- Application mobile native (iOS/Android)
- Collaboration multi-auteurs
- Traductions multilingues automatiques
- Jeux ou éléments gamifiés
- Live streaming audio/video
- Chatbot ou IA conversationnelle

**Rationale :**

- Focus sur plateforme personnelle simple
- Éviter complexité inutile MVP
- Pas de besoin communauté Phase 1
- PWA suffit pour mobile

---

## 6. USER STORIES IA-FRIENDLY

### US-001 : Découvrir l'univers Noctalys (Visiteur)

**En tant que** visiteur occasionnel  
**Je veux** être immédiatement immergé dans l'esthétique Noctalys dès l'arrivée sur le site  
**Afin de** ressentir l'identité unique de la plateforme et avoir envie d'explorer le contenu

**Critères d'acceptation :**

- [ ] La page d'accueil affiche le logo Noctalys avec animation subtile au chargement (fade-in, durée 500ms)
- [ ] Le thème sombre avec halo lumineux est appliqué dès le premier rendu (pas de flash blanc)
- [ ] Les 3-6 dernières publications (mix fictions + musiques) sont visibles dans un grid responsive
- [ ] Chaque card a un effet halo au hover (transition smooth 300ms)
- [ ] La navigation principale est visible et intuitive (max 4 liens)
- [ ] Le temps de chargement total incluant les assets visuels est < 2s (Lighthouse)
- [ ] Les images sont lazy-loaded (sauf above-the-fold)
- [ ] Le site est navigable au clavier (Tab, Enter)

**Edge cases :**

- Aucun contenu publié → Afficher message poétique : "La lune se prépare à révéler ses secrets..."
- Images manquantes → Placeholder élégant avec croissant de lune SVG
- Connexion lente → Skeleton screens avec thème Noctalys pendant chargement
- Mobile : Navigation burger menu, hero section adapté (texte plus court)
- JavaScript désactivé → Contenu statique accessible, navigation fonctionnelle

**Priorité :** MUST HAVE  
**Estimation :** 3 jours  
**Dépendances :** Design system finalisé, logo intégré

---

### US-002 : Lire une fiction (Lecteur)

**En tant que** lecteur  
**Je veux** lire une fiction chapitre par chapitre dans une ambiance nocturne immersive  
**Afin de** profiter pleinement de l'histoire sans distraction et dans un confort optimal

**Critères d'acceptation :**

- [ ] La page chapitre affiche uniquement le texte et la navigation (UI minimaliste, pas de sidebar)
- [ ] Typographie optimisée pour lecture longue :
  - Police serif (Lora ou similaire)
  - Line-height 1.8
  - Font-size 18px (1.125rem) desktop, 16px mobile
  - Max-width 70ch (centré)
  - Color moon-200 (contraste suffisant sur moon-900)
- [ ] Background nocturne subtil (gradient doux, pas de motifs distrayants)
- [ ] Boutons navigation "< Précédent" et "Suivant >" clairs avec effet halo au hover
- [ ] Indicateur de progression visible et élégant (ex: "Chapitre 3 sur 12" avec icône lunaire)
- [ ] Temps de chargement chapitre < 1s (SSR optimisé)
- [ ] Scroll fluide sans lag
- [ ] Markdown correctement rendu (titres, listes, liens, gras, italique, code)
- [ ] Liens externes s'ouvrent dans nouvel onglet (rel="noopener")
- [ ] Transitions douces entre chapitres (fade 300ms)

**Edge cases :**

- Premier chapitre → Pas de bouton "Précédent", message discret "Début de l'histoire"
- Dernier chapitre → Pas de bouton "Suivant", message poétique "Fin de [Titre]" + bouton "Découvrir d'autres fictions"
- Chapitre très long (>5000 mots) → Scroll position indicator, bouton "Remonter" appear après scroll
- Images dans Markdown → Responsive, lazy-loaded, alt text obligatoire
- Mobile : Typographie adaptée (16px), navigation sticky bottom
- Connexion interrompue → Message "Erreur de chargement, réessayer"

**Priorité :** MUST HAVE  
**Estimation :** 5 jours  
**Dépendances :** Markdown renderer configuré, design prose-noctalys

---

### US-003 : Écouter de la musique (Auditeur)

**En tant qu'** auditeur  
**Je veux** écouter les morceaux avec un lecteur au design Noctalys  
**Afin de** découvrir les compositions dans une atmosphère cohérente avec le site

**Critères d'acceptation :**

- [ ] Lecteur audio intégré avec design personnalisé (pas de controls natifs browser)
- [ ] Contrôles avec effet glow :
  - Play/Pause (bouton central, icône change avec transition)
  - Barre de progression cliquable (seek) avec glow sur curseur
  - Volume (slider + bouton mute/unmute)
  - Next/Previous (si plusieurs morceaux)
- [ ] Affichage métadonnées : Titre, durée actuelle / totale, pochette
- [ ] Pochette s'anime subtilement pendant lecture (pulse ou rotation lente)
- [ ] Barre de progression update en temps réel (requestAnimationFrame)
- [ ] Audio démarre en < 2s après clic Play (buffering si nécessaire avec indicateur)
- [ ] Lecteur reste visible (sticky bottom) pendant navigation sur le site
- [ ] Lecture séquentielle : fin d'un morceau → suivant démarre automatiquement
- [ ] Volume mémorisé en localStorage
- [ ] Compatible tous navigateurs modernes (Chrome, Firefox, Safari mobile)

**Edge cases :**

- Fichier audio corrompu → Message erreur élégant "Impossible de lire ce morceau" + bouton "Suivant"
- Connexion lente → Indicateur buffering (spinner avec animation lunaire), afficher % chargé
- Dernier morceau de la liste → Lecture s'arrête, message "Playlist terminée" + bouton "Réécouter"
- Mobile : Contrôles tactiles optimisés (touch-friendly, min 44px)
- Background : audio continue si utilisateur change de page
- Utilisateur ferme site → Audio pause automatiquement
- Multiples instances (plusieurs onglets) → Seule la dernière contrôle l'audio

**Priorité :** MUST HAVE  
**Estimation :** 4 jours  
**Dépendances :** React Context audio configuré, design lecteur finalisé

---

### US-004 : Publier du contenu (Admin)

**En tant qu'** auteur/admin  
**Je veux** publier facilement fictions et musiques avec preview en temps réel  
**Afin de** partager mon travail rapidement tout en contrôlant le rendu final

**Critères d'acceptation :**

- [ ] Interface admin accessible via `/admin` (authentifié uniquement)
- [ ] Dashboard avec thème Noctalys adapté (contraste amélioré pour lisibilité)
- [ ] Formulaire création fiction avec validation temps réel :
  - Titre\* (3-200 char)
  - Résumé\* (50-500 char)
  - Couverture (upload max 2MB, formats jpg/png/webp)
  - Genre (select)
  - Statut (draft/ongoing/completed/hiatus)
- [ ] Upload image avec preview immédiat
- [ ] Slug généré automatiquement, éditable, validation unicité
- [ ] Éditeur chapitre split-screen :
  - Gauche : Markdown avec toolbar (bold, italic, headings, etc.)
  - Droite : Preview HTML avec thème Noctalys appliqué
- [ ] Preview update en temps réel (<500ms délai)
- [ ] Auto-save draft toutes les 30s avec indicateur "Sauvegardé il y a X min"
- [ ] Possibilité de tester le rendu final avant publication (bouton "Aperçu")
- [ ] Upload fichier audio (MP3, max 10MB) avec :
  - Progress bar
  - Extraction automatique durée
  - Preview lecteur fonctionnel
- [ ] Boutons clairs : "Sauvegarder draft" | "Publier" | "Annuler"
- [ ] Confirmation avant actions destructives (supprimer)

**Edge cases :**

- Upload > 10MB → Erreur "Fichier trop volumineux (max 10MB)" avant upload
- Format invalide → Erreur "Format non supporté" avec liste formats acceptés
- Session expirée pendant édition → Draft sauvegardé en localStorage, message "Session expirée, reconnectez-vous pour publier"
- Slug en doublon → Erreur "Ce slug existe déjà" + suggestion alternative
- Connexion perdue pendant upload → Retry automatique 1x, puis erreur utilisateur
- Preview ne charge pas → Message "Erreur de preview" + fallback texte brut
- Markdown invalide → Pas d'erreur bloquante, rendu best-effort

**Priorité :** MUST HAVE  
**Estimation :** 8 jours  
**Dépendances :** Better Auth configuré, Vercel Blob setup, Markdown editor choisi

---

### US-005 : Gérer le contenu (Admin)

**En tant qu'** auteur/admin  
**Je veux** modifier ou supprimer facilement du contenu publié  
**Afin de** corriger des erreurs, améliorer le texte ou retirer du contenu obsolète

**Critères d'acceptation :**

- [ ] Liste de tout le contenu dans l'admin :
  - Table avec colonnes : Titre | Type | Statut | Date | Actions
  - Tri par colonne (clic sur header)
  - Recherche par titre (input avec debounce)
  - Filtres : Type (fiction/musique), Statut (draft/published)
- [ ] Actions par ligne :
  - "Éditer" (icône crayon) → Ouvre formulaire édition
  - "Supprimer" (icône poubelle) → Ouvre modal confirmation
  - "Voir sur site" (icône œil) → Ouvre page publique (nouvel onglet)
- [ ] Modal confirmation suppression :
  - Titre : "Supprimer [Nom contenu] ?"
  - Message explicite selon type :
    - Fiction : "Cette fiction et tous ses chapitres (X) seront définitivement supprimés."
    - Chapitre : "Ce chapitre sera définitivement supprimé."
    - Musique : "Ce morceau sera définitivement supprimé."
  - Boutons : "Annuler" (primaire) | "Supprimer" (destructif, rouge)
  - Checkbox "Je confirme" (obligatoire pour valider)
- [ ] Édition sauvegarde automatiquement en draft (aucune perte de données)
- [ ] Toast notification après action : "Fiction supprimée avec succès" (avec undo Phase 2)
- [ ] Invalidation cache après modification (ISR revalidate)
- [ ] Historique modifications visible (qui, quand, Phase 2)

**Edge cases :**

- Suppression fiction avec chapitres → Cascade delete explicite dans modal
- Modification pendant que quelqu'un lit → Cache invalidé, lecteur voit nouveau contenu au prochain chargement (pas de refresh forcé)
- Erreur serveur pendant suppression → Message "Erreur lors de la suppression, réessayez" + log serveur
- Perte connexion pendant édition → Draft local persiste, sync au retour connexion
- Tentative suppression contenu inexistant (bug/race condition) → Erreur 404 gracieuse
- Plusieurs admins (futur) → Optimistic locking pour éviter conflits

**Priorité :** MUST HAVE  
**Estimation :** 3 jours  
**Dépendances :** CRUD API endpoints complets

---

## 8. DESIGN TOKENS NOCTALYS

```typescript
// Palette de couleurs
moon: {
  50: '#fafbfc',   // Reflets
  100: '#f0f2f5',  // Texte clair
  200: '#d8dde3',  // Texte secondaire
  300: '#b8c1cc',  // Borders
  400: '#8f9baa',  // Placeholders
  500: '#667085',  // Icons
  600: '#4a5568',  // Texte inversé
  700: '#2d3748',  // BG secondaire
  800: '#1a202c',  // Cards/Modals
  900: '#0f1419',  // BG primary
  950: '#070a0f',  // Noir profond
}

accent: {
  primary: '#a0aec0',    // Liens, CTA
  secondary: '#cbd5e0',  // Hover
  glow: '#e2e8f0',       // Halo focus
  muted: '#718096',      // Disabled
}

// Box shadows (effets halo)
'glow-sm': '0 0 10px rgba(226, 232, 240, 0.3)',
'glow': '0 0 20px rgba(226, 232, 240, 0.4)',
'glow-lg': '0 0 30px rgba(226, 232, 240, 0.5)',
'moonlight': '0 4px 24px rgba(160, 174, 192, 0.3)',

// Fonts
sans: ['Inter', 'system-ui', 'sans-serif'],
serif: ['Lora', 'Georgia', 'serif'], // Chapitres
mono: ['JetBrains Mono', 'monospace'],

// Typography chapitres
prose-noctalys: {
  maxWidth: '70ch',
  lineHeight: '1.8',
  fontSize: '1.125rem', // 18px
}
```

---

## 9. ROADMAP (6 semaines)

### Semaine 1-2: Setup + Design System

- Init Next.js + Prisma + Better Auth
- Config Tailwind + design tokens Noctalys
- Composants UI de base (Button, Card, Input, Modal)
- Logo intégré (favicon, header, OG image)
- Vercel + Prisma Postgres configurés
- DNS noctalys.lyksia.com

**Milestone:** Design system validé

### Semaine 3-4: Backend + Admin

- Modèles Prisma + migrations
- API endpoints (CRUD)
- Upload Vercel Blob
- Interface admin (login, dashboard, forms)
- Éditeur Markdown + preview
- Tests unitaires >50%

**Milestone:** Admin fonctionnel, 1ère fiction publiée

### Semaine 5-6: Frontend Public + Tests

- Pages publiques (home, fictions, chapitres, musiques)
- Lecteur audio (design Noctalys, sticky)
- Responsive design
- SEO (meta tags, sitemap, robots.txt)
- Tests E2E (5 parcours critiques)
- Lighthouse >90 performance
- Documentation complète

**Milestone:** MVP prêt production

---

## 10. LIVRABLES

**Code:**

- Site production: noctalys.lyksia.com
- Repository GitHub
- CI/CD GitHub Actions

**Documentation:**

- README.md (setup, commandes)
- ARCHITECTURE.md (diagrammes, patterns)
- API.md (endpoints docs)
- ADMIN_GUIDE.md (guide utilisateur)
- DEPLOYMENT.md (procédures)
- DESIGN_SYSTEM.md (styleguide)

**Tests:**

- Tests unitaires >70% coverage
- Tests E2E (5 scénarios)
- Rapports CI automatisés

**Scripts:**

- `npm run dev` → local
- `npm run build` → production build
- `npm run test:unit` → tests unitaires
- `npm run test:e2e` → tests E2E
- `npm run db:migrate` → migrations
- `npm run db:seed` → seed initial

---

## 11. CRITÈRES DE SUCCÈS

**Technique:**

- Uptime >99.9%
- Lighthouse >90 toutes pages
- CI/CD <5min
- Aucun bug bloquant

**Fonctionnel:**

- Publication <10min
- Lecture fluide
- Audio tous navigateurs
- Responsive impeccable

**Esthétique:**

- Identité Noctalys cohérente
- Effet halo élégant
- Thème nocturne respecté
- Animations subtiles

**Utilisateur:**

- Temps passé >5min/session
- Taux lecture chapitre >60%
- Taux écoute >70%

---

## 12. PROCHAINES ÉTAPES

### Jour 1-2: Infrastructure

- [x] Décisions validées (DB, domaine, logo, contenu)
- [ ] Créer repo GitHub
- [ ] Init Next.js 15
- [ ] Créer projet Vercel
- [ ] Provisionner Prisma Postgres
- [ ] Configurer DNS

### Jour 3-5: Design System

- [ ] Intégrer Tailwind V4
- [ ] Installer Shadcn UI
- [ ] Créer design tokens
- [ ] Intégrer logo Noctalys
- [ ] Développer composants UI

**Checkpoint Semaine 1:**

- Projet local fonctionnel
- Design tokens appliqués
- Logo visible
- Composants UI dans styleguide
- Vercel + DB connectés

---

## VARIABLES D'ENVIRONNEMENT

```bash
# Database
DATABASE_URL="postgresql://..." # Auto Prisma Postgres

# Auth
AUTH_SECRET="..." # openssl rand -base64 32
AUTH_URL="https://noctalys.lyksia.com"

# Storage
BLOB_READ_WRITE_TOKEN="..." # Auto Vercel

# Admin
ADMIN_EMAIL="admin@lyksia.com"
ADMIN_PASSWORD_HASH="..." # bcrypt hash

# Analytics (auto en prod)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="..."
```

---

## ANNEXES

### Glossaire

- **Noctalys:** Nom plateforme (nocturne + analyse)
- **Halo lumineux:** Effet CSS glow (box-shadow)
- **ISR:** Incremental Static Regeneration
- **Slug:** URL-friendly identifier
- **Draft:** Contenu non publié

### Architecture

```
VERCEL EDGE (CDN)
    ↓
NEXT.JS APP (App Router)
    ├─ Pages (SSR/ISR)
    ├─ Server Actions
    ├─ API Routes
    └─ Better Auth Middleware
    ↓
PRISMA POSTGRES + VERCEL BLOB
    ↓
VERCEL ANALYTICS
```

### Exemples JSON

**GET /api/fictions:**

```json
{
  "fictions": [
    {
      "id": "cm1...",
      "slug": "les-chroniques-de-lumina",
      "title": "Les Chroniques de Lumina",
      "summary": "Dans un monde où la lune...",
      "coverImage": "https://blob.vercel-storage.com/...",
      "genre": "FANTASY",
      "status": "ONGOING",
      "publishedAt": "2025-01-15T10:00:00.000Z",
      "chaptersCount": 12
    }
  ]
}
```

**POST /api/admin/fictions:**

```json
{
  "title": "Nouvelle Fiction",
  "summary": "Une description captivante...",
  "coverImage": "https://blob.../cover.jpg",
  "genre": "FANTASY",
  "status": "DRAFT"
}
```

---

## CHANGELOG

| Version | Date       | Changements                               |
| ------- | ---------- | ----------------------------------------- |
| 1.0     | 2025-11-19 | Création initiale avec décisions validées |

---

**Document validé et prêt pour l'exécution.**  
**Prochaine étape: Initialisation projet (Semaine 1, Jour 1)**

_Fin du PRD Noctalys v1.0_
