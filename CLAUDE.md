# CLAUDE.md

## Objectif

Ce fichier définit les **directives à suivre par toute IA** pour respecter la structure, les conventions et la stack du projet.

---

## Directives par catégorie

### Structure

- Organiser le projet selon une logique "feature-first" où chaque feature est autonome et regroupe tout ce qui lui appartient.
- Centraliser uniquement les éléments transversaux dans les dossiers globaux (`ui/`, `lib/`, `utils/`, `config/`, etc.).
- Placer les données spécifiques à une feature dans `features/[name]/data/`.
- Placer les types spécifiques à une feature dans `features/[name]/types.ts`.
- Centraliser les configurations globales dans `config/`.
- Centraliser les types globaux TypeScript dans `types/`.
- Centraliser les données statiques et fichiers JSON dans `data/`.
- Centraliser les fonctions dépendantes de librairies externes dans `lib/`.
- Centraliser les fonctions pures et génériques dans `utils/`.
- Organiser le design system (Shadcn UI + composants custom) dans `ui/`.
- Respecter strictement les conventions de nommage des fichiers et dossiers.

### Stack

- Utiliser Next.js avec App Router (pas Pages Router).
- Utiliser Server Components par défaut et marquer `"use client"` uniquement quand nécessaire.
- Placer toute la logique de routing dans `app/`.
- Utiliser Route Handlers (`route.ts`) dans `app/api/` pour les API Routes.
- Centraliser les layouts partagés dans `app/layout.tsx`.
- Définir les métadonnées SEO via `metadata` ou `generateMetadata`.
- Utiliser `loading.tsx` et `error.tsx` pour gérer les états.
- Utiliser React Query pour gérer l'état serveur (fetching, caching, synchronisation, mutations).
- Utiliser `useQuery` pour le fetching.
- Utiliser `useMutation` pour les opérations create/update/delete.
- Toujours utiliser des clés de query cohérentes et descriptives.
- Invalider les queries après une mutation pour refetch automatique.
- Définir le `QueryClient` dans `lib/react-query.ts`.
- Utiliser Axios pour les appels HTTP.
- Utiliser Zod pour la validation et le typage des schémas.
- Valider systématiquement les données externes (formulaires, API).
- Définir les schémas Zod avant les types TypeScript.
- Utiliser `z.infer<>` pour générer les types TypeScript.
- Centraliser les schémas partagés dans `lib/zod.ts`.
- Personnaliser les messages d'erreur pour l'UX.
- Activer le mode strict (`strict: true`) dans `tsconfig.json`.
- Ne jamais utiliser `any`, utiliser `unknown` si le type est inconnu.
- Typer explicitement les paramètres et valeurs de retour des fonctions.
- Utiliser `interface` pour les objets extensibles, `type` pour les unions.
- Utiliser les composants fonctionnels uniquement (pas de classes).
- Utiliser les hooks React (`useState`, `useEffect`, etc.) et créer des hooks personnalisés.
- Composer les composants plutôt que d'utiliser l'héritage.
- Toujours typer les props avec TypeScript.
- Éviter les effets de bord dans le rendu.
- Utiliser PascalCase pour les composants, préfixe `use` pour les hooks.
- Utiliser Tailwind CSS V4 pour le styling.
- Prioriser les classes utilitaires et éviter le CSS inline ou les fichiers CSS custom sauf pour les tokens globaux.
- Ne pas créer et utiliser les fichiers de config `tailwind.config.js` qui n'est plus utile dans la v4 de tailwind.
- **Ne jamais utiliser de classes arbitraires Tailwind** (ex: `bg-[#00d5ff]`, `text-[18px]`, `h-[60px]`).
- Toujours définir les valeurs de design (couleurs, tailles, espacements) comme tokens CSS dans `@theme` ou variables CSS.
- Utiliser uniquement les classes utilitaires Tailwind basées sur ces tokens (ex: `bg-electric-blue`, `text-lg`, `h-14`).
- **Toujours utiliser Flexbox avec `gap`** au lieu des classes `space-*`.
  - ✅ Correct: `flex flex-col gap-4` ou `flex gap-6`
  - ❌ Incorrect: `space-y-4` ou `space-x-6`
  - Raison: Flexbox avec `gap` est plus moderne, prévisible et évite les problèmes de marges négatives.
- Utiliser PostgreSQL comme système de gestion de base de données.
- Utiliser Prisma comme ORM.
- Utiliser Vitest comme framework de test.
- Utiliser Vercel comme plateforme de déploiement pour les projets Next.js.

### Conventions

- Employer camelCase pour les fonctions et variables.
- Utiliser PascalCase pour les composants React.
- Utiliser kebab-case pour les fichiers.
- Utiliser le singulier pour les dossiers de features.
- Préfixer les hooks avec `use`.
- Utiliser UPPER_SNAKE_CASE pour les constantes.
- Utiliser PascalCase pour les types et interfaces.
- Utiliser le suffixe `.test.tsx` pour les fichiers de test.
- Ne jamais utiliser `export default`, utiliser uniquement les exports nommés.
  - **Exception Next.js** : `export default` est OBLIGATOIRE pour les fichiers spéciaux Next.js App Router :
    - `app/**/page.tsx` (pages de route)
    - `app/**/layout.tsx` (layouts)
    - `app/**/error.tsx` (pages d'erreur)
    - `app/**/loading.tsx` (états de chargement)
    - `app/**/not-found.tsx` (pages 404)
  - Pour tous les autres fichiers, utiliser UNIQUEMENT les exports nommés.
- Utiliser les fichiers `index.ts` (barrels) pour regrouper les exports.
- Importer depuis la racine d'une feature via son barrel.
- Structurer les composants React dans l'ordre suivant : imports, types, constantes internes, déclaration du composant, hooks React, fonctions internes, effets de bord, early returns, return JSX.
- Documenter chaque feature dans un fichier README.md dédié.
- Utiliser les alias d'import pour simplifier les imports.
- Créer les hooks personnalisés avec le préfixe `use` et respecter les règles React.
- Placer chaque composant dans son propre fichier complet.
- Utiliser des constantes pour éviter les valeurs magiques.

### State / Data

- Utiliser React Query pour gérer toutes les données serveur.
- Ne jamais faire de fetch direct dans un composant.
- Utiliser les services API (`services/`) avec Axios pour les appels HTTP.
- Utiliser les hooks React Query (`hooks/`) qui utilisent les services.
- Faire utiliser les hooks (jamais les services directement) par les composants.
- Typer strictement les réponses API.
- Gérer les erreurs de manière cohérente.
- Gérer l'état local avec `useState` pour les cas simples.
- Gérer l'état local avec `useReducer` pour les cas complexes.
- Ne jamais stocker l'état dérivé, le calculer à la volée ou le mémoriser avec `useMemo`.
- Gérer les erreurs de manière uniforme (toutes les erreurs doivent être typées, loggées et affichées).
- Configurer les stratégies de cache selon les besoins avec React Query.
- Utiliser SWR pour les données volatiles et temps réel nécessitant un polling fréquent.
- Utiliser React Hook Form pour la gestion des formulaires.
- Utiliser Zod pour la validation des formulaires.
- Invalider les queries après une mutation.
- Utiliser les mises à jour optimistes pour améliorer l'UX.

### Testing / Quality

- Tester une unité à la fois (isolation complète).
- Rendre les tests rapides (exécution en millisecondes).
- Assurer le déterminisme (résultats identiques à chaque exécution).
- Rendre les tests lisibles (le test doit documenter le comportement attendu).
- Rendre les tests indépendants (pas d'ordre d'exécution requis).
- Tester les fonctions utilitaires (`utils/`, `lib/`).
- Tester les hooks personnalisés (`use*`).
- Tester la logique métier pure (calculs, transformations).
- Tester les composants simples sans dépendances externes.
- Tester la validation des schémas Zod.
- Tester le formatage et le parsing de données.
- Éviter de tester les composants avec beaucoup de dépendances dans les tests unitaires (→ tests d'intégration).
- Éviter les appels API réels dans les tests unitaires (→ mocks).
- Éviter de tester les interactions entre modules dans les tests unitaires (→ tests d'intégration).
- Structurer les tests selon le pattern Arrange-Act-Assert.
- Nommer les fichiers de test avec `.test.ts` ou `.test.tsx`.
- Utiliser ESLint pour le linting (détection d'erreurs et mauvaises pratiques).
- Utiliser Prettier pour le formatage automatique du code.

### Deployment

- Distinguer clairement trois environnements : development, preview, production.
- Gérer les variables d'environnement de manière sécurisée et cohérente.
- Ne jamais exposer publiquement les secrets (clés API privées, tokens d'authentification, secrets de signature JWT/webhooks, identifiants de base de données, mots de passe SMTP).
- Gérer les erreurs de build et de déploiement et définir les stratégies de rollback.

### UI / Utils

- Garantir l'accessibilité en respectant les normes ARIA, la navigation au clavier et les contrastes.
- Utiliser les éléments HTML sémantiques (`nav`, `main`, `article`, `footer`).
- Toujours fournir des alternatives textuelles pour les images.
- Rendre toutes les interactions accessibles au clavier.
- Rendre le focus toujours visible.
- Utiliser les attributs ARIA pour décrire les éléments.
- Respecter les ratios de contraste WCAG.
- Utiliser les rôles sémantiques appropriés.
- Rendre les formulaires accessibles avec des labels associés.
- Utiliser les animations de manière subtile, rapide et avec un objectif fonctionnel.
- Gérer les variantes de composants avec `cva`, `clsx` et la fonction utilitaire `cn`.
- Centraliser les valeurs de design globales (couleurs, espacements, typographie) dans les tokens Tailwind.
- Utiliser les tokens Tailwind de manière cohérente dans tous les composants.
- Standardiser les helpers de manipulation de chaînes de caractères.
- Standardiser les helpers de gestion des erreurs.
- Standardiser les helpers de formatage visuel.
- Standardiser les helpers de dates.
- Standardiser les helpers de manipulation de nombres et montants.
- Standardiser les helpers de manipulation d'objets.
- Standardiser les helpers de manipulation de tableaux.
- Suivre strictement les conventions pour faciliter la découverte, la compréhension et la réutilisabilité des fonctions utilitaires.

---

## Consignes générales pour l'IA

- Toujours appliquer les directives du présent fichier avant toute génération.
- Ne jamais ignorer ou réécrire les règles.
- Consulter `/.cursor/rules/` pour les explications détaillées.
