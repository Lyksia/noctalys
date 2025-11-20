# CI/CD - Intégration et Déploiement Continus

## Vue d'ensemble

Le projet Noctalys utilise **GitHub Actions** pour l'intégration continue (CI) et le déploiement continu (CD). Le déploiement est géré par **Vercel** via l'intégration GitHub native.

## Workflows GitHub Actions

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Déclencheurs:**
- Push sur `main` ou `develop`
- Pull Requests vers `main` ou `develop`

**Jobs:**

#### Lint
- Exécute ESLint pour vérifier la qualité du code
- Détecte les problèmes de style et les erreurs potentielles
- Commande: `pnpm run lint`

#### Type Check
- Vérifie la cohérence des types TypeScript
- Génère le Prisma Client
- Build complet pour détecter les erreurs de typage
- Commande: `pnpm run build`

#### Build
- S'exécute après lint et typecheck (needs: [lint, typecheck])
- Construit l'application Next.js en mode production
- Valide que le build passe sans erreurs
- Utilise `SKIP_ENV_VALIDATION=true` pour éviter les erreurs de variables d'environnement en CI

**Durée estimée:** 3-5 minutes

---

### 2. PR Check Workflow (`.github/workflows/pr-check.yml`)

**Déclencheurs:**
- Ouverture d'une Pull Request
- Push sur une branche avec PR ouverte

**Actions:**
- Exécute les mêmes vérifications que CI
- Ajoute un commentaire sur la PR avec le statut
- Bloque le merge si les checks échouent

**Statut requis:** Tous les checks doivent passer (✅) pour merger

---

### 3. Deploy Workflow (`.github/workflows/deploy.yml`)

**Déclencheurs:**
- Push sur `main` uniquement

**Actions:**
- Valide le build avant déploiement
- Le déploiement réel est géré par Vercel (via GitHub integration)

**Environnement:** Production (`https://noctalys.vercel.app`)

---

### 4. Preview Workflow (`.github/workflows/preview.yml`)

**Déclencheurs:**
- Pull Requests vers `main`

**Actions:**
- Valide que le build passe pour la preview
- Ajoute un commentaire avec le statut
- Vercel déploie automatiquement une preview URL

---

## Dependabot

Configuration dans `.github/dependabot.yml` pour maintenir les dépendances à jour.

**Stratégie:**
- Vérification hebdomadaire des mises à jour
- Maximum 10 PRs ouvertes simultanément pour npm
- Maximum 5 PRs pour les GitHub Actions

**Groupes:**
- `nextjs`: Next.js et packages @next/*
- `react`: React et React DOM
- `prisma`: Prisma et @prisma/*
- `development`: Toutes les devDependencies (mises à jour mineures/patches groupées)

**Avantages:**
- Sécurité: patches de sécurité appliqués rapidement
- Stabilité: mises à jour testées via CI avant merge
- Maintenance: moins de PRs à gérer grâce aux groupes

---

## Configuration Vercel

### Intégration GitHub

1. **Connexion:** Le repository GitHub est connecté à Vercel
2. **Déploiement automatique:**
   - **Production:** Chaque push sur `main` → `noctalys.vercel.app`
   - **Preview:** Chaque PR → URL unique de preview

### Variables d'environnement

Les variables suivantes doivent être configurées dans Vercel Dashboard:

**Production & Preview:**
- `DATABASE_URL`: URL PostgreSQL (Prisma Postgres recommandé)
- `DIRECT_URL`: URL directe pour les migrations Prisma
- `BETTER_AUTH_SECRET`: Clé secrète pour Better Auth (générer avec `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: URL de l'app (ex: `https://noctalys.vercel.app`)
- `NEXT_PUBLIC_APP_URL`: URL publique de l'app

**Optionnel (si utilisé):**
- `UPSTASH_REDIS_REST_URL`: Redis pour rate limiting
- `UPSTASH_REDIS_REST_TOKEN`: Token Redis
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob pour uploads

### Build Settings

```json
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Post-install commands:**
```bash
pnpm prisma generate
```

---

## Workflow de développement

### 1. Feature Branch

```bash
# Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/nom-feature

# Développer et commit
git add .
git commit -m "feat: description"
git push origin feature/nom-feature
```

### 2. Pull Request

1. Ouvrir une PR depuis `feature/nom-feature` → `develop`
2. Les workflows CI et Preview s'exécutent automatiquement
3. Vérifier les checks GitHub Actions (doivent être verts ✅)
4. Reviewer le code
5. Tester sur l'URL de preview Vercel
6. Merger la PR si tous les checks passent

### 3. Release vers Production

```bash
# Merger develop dans main
git checkout main
git pull origin main
git merge develop
git push origin main
```

Le workflow Deploy se déclenche et Vercel déploie automatiquement en production.

---

## Statuts des Checks

### ✅ Tous les checks passent
- La PR peut être mergée
- Le code respecte les standards
- Le build fonctionne

### ❌ Un check échoue

**Lint failed:**
```bash
# Localement, fixer les erreurs
pnpm run lint
pnpm run lint --fix  # Auto-fix si possible
```

**Type check failed:**
```bash
# Vérifier les erreurs TypeScript
pnpm run build
# Corriger les erreurs de typage
```

**Build failed:**
```bash
# Reproduire localement
pnpm run build

# Vérifier les logs GitHub Actions pour plus de détails
```

---

## Optimisations

### Cache
- Les workflows utilisent le cache pnpm de GitHub Actions
- Accélère l'installation des dépendances (gain ~1-2 min)

### Parallélisation
- Les jobs `lint` et `typecheck` s'exécutent en parallèle
- Le job `build` attend que les deux soient terminés

### Skip Env Validation
- `SKIP_ENV_VALIDATION=true` en CI
- Évite les erreurs pour les variables d'environnement absentes en CI
- Les vraies validations se font sur Vercel avec les vraies variables

---

## Monitoring

### GitHub Actions
- **Onglet Actions:** Voir l'historique des workflows
- **Badge CI:** Statut visible dans README.md
- **Notifications:** Configurer les notifications d'échec

### Vercel
- **Dashboard Deployments:** Statut de tous les déploiements
- **Logs:** Logs de build et runtime
- **Analytics:** Performance et usage (si activé)
- **Monitoring:** Erreurs en production

---

## Rollback

### En cas de déploiement défectueux

**Option 1: Rollback via Vercel**
1. Aller sur Vercel Dashboard → Deployments
2. Trouver le dernier déploiement stable
3. Cliquer "Promote to Production"

**Option 2: Revert Git**
```bash
git revert HEAD
git push origin main
# Nouveau déploiement automatique avec la version précédente
```

**Option 3: Hotfix**
```bash
git checkout main
git checkout -b hotfix/fix-critique
# Corriger le bug
git commit -m "fix: correction critique"
git push origin hotfix/fix-critique
# Merger directement dans main après validation rapide
```

---

## Sécurité

### Secrets GitHub
- Ne jamais commit de secrets dans le code
- Utiliser GitHub Secrets pour les tokens sensibles
- Les secrets Vercel sont stockés dans Vercel Dashboard

### Permissions
- Les workflows ont un accès `read` par défaut
- `write` uniquement pour commenter les PRs (github-script)

### Dependabot
- Les PRs Dependabot passent par la CI
- Reviewer les changelogs avant merge
- Tester les breaking changes en preview

---

## Troubleshooting

### "Prisma Client not generated"
```yaml
# Ajouter dans le workflow:
- name: Generate Prisma Client
  run: pnpm prisma generate
```

### "Build failed: env variable missing"
```yaml
# Ajouter SKIP_ENV_VALIDATION:
env:
  SKIP_ENV_VALIDATION: true
```

### "pnpm not found"
```yaml
# Vérifier la version de pnpm:
- uses: pnpm/action-setup@v2
  with:
    version: 8  # Doit correspondre à packageManager dans package.json
```

### "Cache not working"
```yaml
# Vérifier que cache: 'pnpm' est présent:
- uses: actions/setup-node@v4
  with:
    cache: 'pnpm'
```

---

## Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Documentation](https://vercel.com/docs)
- [pnpm CI Documentation](https://pnpm.io/continuous-integration)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
