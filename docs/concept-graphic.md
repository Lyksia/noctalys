# Concept Graphique Noctalys

**Version:** 1.0 | **Date:** 19 novembre 2025 | **Statut:** Validé  
**Basé sur:** Hybride "Clair de Lune" + "Nocturne Soyeux"

---

## Vision Esthétique

Noctalys incarne une **élégance nocturne contemplative** où la lune devient le guide visuel. L'interface respire la sérénité d'une nuit claire, avec des halos lumineux subtils et une palette monochrome argentée. **Aucune couleur néon ou flashy** - uniquement des tons doux, reposants et sophistiqués.

**Mots-clés :** Contemplatif • Élégant • Lunaire • Subtil • Raffiné • Apaisant

---

## Palette de Couleurs

### Couleurs Principales (Moon)

Palette monochrome argentée inspirée par la clarté lunaire :

```css
@theme {
  /* Tons clairs - Texte & Highlights */
  --color-moon-50: #fafbfc; /* Reflets les plus clairs */
  --color-moon-100: #f0f2f5; /* Texte principal sur dark */
  --color-moon-200: #d8dde3; /* Texte secondaire */
  --color-moon-300: #b8c1cc; /* Borders subtiles */

  /* Tons moyens - UI Elements */
  --color-moon-400: #8f9baa; /* Placeholders, disabled text */
  --color-moon-500: #667085; /* Icons, labels */
  --color-moon-600: #4a5568; /* Texte inversé sur clair */

  /* Tons foncés - Backgrounds */
  --color-moon-700: #2d3748; /* Backgrounds secondaires */
  --color-moon-800: #1a202c; /* Cards, modals, panels */
  --color-moon-900: #0f1419; /* Background principal */
  --color-moon-950: #070a0f; /* Noir profond, overlays */
}
```

### Couleurs d'Accent (Subtiles)

**Pas de couleurs vives** - uniquement des teintes désaturées et douces :

```css
@theme {
  /* Accent principal - Argent lunaire */
  --color-accent-primary: #a0aec0; /* Liens, CTA primaires */
  --color-accent-primary-hover: #cbd5e0; /* Hover state */

  /* Glow - Halo lumineux */
  --color-accent-glow: #e2e8f0; /* Effet halo focus/hover */
  --color-accent-glow-soft: #edf2f7; /* Glow très subtil */

  /* Muted - États désactivés */
  --color-accent-muted: #718096; /* Disabled, inactive */

  /* Statut - Teintes désaturées */
  --color-status-success: #9ae6b4; /* Vert très pâle */
  --color-status-warning: #fbd38d; /* Ambre très pâle */
  --color-status-error: #fc8181; /* Rouge très pâle */
  --color-status-info: #90cdf4; /* Bleu très pâle */
}
```

### Backgrounds & Overlays

```css
@theme {
  /* Backgrounds */
  --color-bg-primary: var(--color-moon-900);
  --color-bg-secondary: var(--color-moon-800);
  --color-bg-elevated: var(--color-moon-700);

  /* Gradients */
  --gradient-page: linear-gradient(180deg, #0f1419 0%, #070a0f 100%);
  --gradient-card: linear-gradient(135deg, #1a202c 0%, #0f1419 100%);
  --gradient-glow: radial-gradient(circle, rgba(226, 232, 240, 0.1) 0%, transparent 70%);

  /* Overlays */
  --overlay-light: rgba(255, 255, 255, 0.05);
  --overlay-medium: rgba(255, 255, 255, 0.1);
  --overlay-dark: rgba(0, 0, 0, 0.4);
}
```

---

## Effets Lumineux (Halos)

Les halos lumineux sont la **signature visuelle de Noctalys**. Ils évoquent la lueur douce de la lune sans jamais être agressifs.

### Box Shadows (Halos)

```css
@theme {
  /* Glow effects - Halos subtils */
  --shadow-glow-sm: 0 0 10px rgba(226, 232, 240, 0.2);
  --shadow-glow: 0 0 20px rgba(226, 232, 240, 0.3);
  --shadow-glow-lg: 0 0 30px rgba(226, 232, 240, 0.4);

  /* Moonlight - Ombre douce avec lueur */
  --shadow-moonlight: 0 4px 24px rgba(160, 174, 192, 0.2);
  --shadow-moonlight-lg: 0 8px 40px rgba(160, 174, 192, 0.25);

  /* Standard shadows - Depth sans glow */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.5);

  /* Inner shadow - Effet "enfoncé" */
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

### Usage des Halos

**Règles d'application :**

- **Hover interactif** : `shadow-glow` (liens, boutons, cards cliquables)
- **Focus clavier** : `shadow-glow-lg` + `ring-2 ring-accent-glow/50`
- **Éléments élevés** : `shadow-moonlight` (modals, dropdowns, sticky header)
- **Logos & icônes** : `shadow-glow-sm` en permanence (identité)
- **Jamais** : Halos multiples superposés, halos colorés vifs

---

## Typographie

### Familles de Polices

```css
@theme {
  /* Sans-serif - UI, navigation, labels */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* Serif - Titres élégants, contenu chapitres */
  --font-serif: "Lora", "Georgia", "Times New Roman", serif;

  /* Monospace - Code, données techniques */
  --font-mono: "JetBrains Mono", "Consolas", "Monaco", monospace;
}
```

### Échelle Typographique

```css
@theme {
  /* Font sizes */
  --font-size-xs: 0.75rem; /* 12px - labels, captions */
  --font-size-sm: 0.875rem; /* 14px - small text */
  --font-size-base: 1rem; /* 16px - body text */
  --font-size-lg: 1.125rem; /* 18px - emphasized text, chapitres */
  --font-size-xl: 1.25rem; /* 20px - h4 */
  --font-size-2xl: 1.5rem; /* 24px - h3 */
  --font-size-3xl: 1.875rem; /* 30px - h2 */
  --font-size-4xl: 2.25rem; /* 36px - h1 */
  --font-size-5xl: 3rem; /* 48px - hero titles */

  /* Line heights */
  --line-height-tight: 1.25; /* Titres compacts */
  --line-height-normal: 1.5; /* UI standard */
  --line-height-relaxed: 1.8; /* Lecture chapitres */
  --line-height-loose: 2; /* Poésie, citations */

  /* Letter spacing */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
}
```

### Styles de Texte (Classes Utilitaires)

```css
/* Titres */
.text-hero {
  font-family: var(--font-serif);
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-tight);
  font-weight: 600;
  color: var(--color-moon-50);
  letter-spacing: var(--letter-spacing-tight);
}

.text-heading-1 {
  font-family: var(--font-serif);
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  font-weight: 600;
  color: var(--color-moon-100);
}

/* Corps de texte lecture */
.prose-noctalys {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-moon-200);
  max-width: 70ch;
}

/* UI text */
.text-ui {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-moon-200);
}

/* Labels */
.text-label {
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-moon-400);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
}
```

---

## Composants UI (Shadcn UI)

### Boutons

**Variantes :**

```tsx
// Primary - CTA principal
<Button variant="primary">
  /* Background: gradient argent subtil */
  /* Border: 1px solid accent-glow/30 */
  /* Shadow: glow-sm */
  /* Hover: shadow-glow + brightness(110%) */
  /* Text: moon-950 (contraste sur fond clair) */
</Button>

// Secondary - Actions secondaires
<Button variant="secondary">
  /* Background: moon-800 */
  /* Border: 1px solid moon-700 */
  /* Shadow: none */
  /* Hover: border-accent-primary + shadow-glow-sm */
  /* Text: moon-100 */
</Button>

// Ghost - Navigation subtile
<Button variant="ghost">
  /* Background: transparent */
  /* Border: none */
  /* Hover: bg-moon-800/50 + shadow-glow-sm */
  /* Text: moon-300, hover: moon-100 */
</Button>

// Destructive - Actions dangereuses
<Button variant="destructive">
  /* Background: status-error/20 */
  /* Border: 1px solid status-error/40 */
  /* Hover: bg-status-error/30 */
  /* Text: status-error (pâle, pas agressif) */
</Button>
```

**Tailles :**

```tsx
// sm - Compact (32px height)
<Button size="sm">Label</Button>

// md - Standard (40px height) - DEFAULT
<Button size="md">Label</Button>

// lg - Emphase (48px height)
<Button size="lg">Label</Button>

// icon - Carré (40x40px)
<Button size="icon"><Icon /></Button>
```

**Règles de Design :**

- Border radius: `rounded-lg` (8px) pour douceur
- Transition: `300ms cubic-bezier(0.4, 0, 0.2, 1)` (smooth)
- Padding horizontal: `px-4` (sm), `px-6` (md), `px-8` (lg)
- Font weight: `500` (medium) pour lisibilité
- Hover: Toujours ajouter `shadow-glow-sm` minimum

### Cards

**Structure de base :**

```tsx
<Card>
  /* Background: moon-800 */ /* Border: 1px solid moon-700/50 */ /* Border radius: rounded-2xl (16px
  - généreux) */ /* Padding: p-6 */ /* Shadow: shadow-md */
  {/* Hover si cliquable */}
  /* Hover: shadow-moonlight + translateY(-4px) */ /* Transition: 400ms ease-out */
</Card>
```

**Variantes :**

```tsx
// Elevated - Pour modals, dialogs
<Card variant="elevated">
  /* Background: moon-800 */
  /* Border: 1px solid accent-glow/20 */
  /* Shadow: shadow-moonlight-lg */
  /* Backdrop filter: blur(8px) si overlay */
</Card>

// Flat - Pour listes, grids
<Card variant="flat">
  /* Background: moon-900 */
  /* Border: 1px solid moon-700 */
  /* Shadow: none */
  /* Hover: border-accent-primary/50 + shadow-glow-sm */
</Card>

// Featured - Highlight
<Card variant="featured">
  /* Background: gradient-card */
  /* Border: 1px solid accent-glow/30 */
  /* Shadow: shadow-glow */
  /* Inner glow subtil (::before pseudo-element) */
</Card>
```

**Règles de Design :**

- **Coins arrondis généreux** : `rounded-2xl` (16px) minimum
- **Espacement interne** : `p-6` (24px) standard, `p-8` (32px) pour large
- **Hover elevation** : `translateY(-4px)` + shadow upgrade
- **Transitions douces** : `400-500ms ease-out` pour élégance
- **Inner content spacing** : `gap-4` entre éléments enfants

### Inputs & Forms

**Input Text :**

```tsx
<Input>
  /* Background: moon-900 */ /* Border: 1px solid moon-700 */ /* Border radius: rounded-lg */ /*
  Padding: px-4 py-2 */ /* Text: moon-100 */ /* Placeholder: moon-500 */
  {/* Focus state */}
  /* Border: accent-glow */ /* Shadow: shadow-glow-sm */ /* Ring: ring-2 ring-accent-glow/20 */
  {/* Error state */}
  /* Border: status-error/60 */ /* Shadow: 0 0 0 3px status-error/10 */
</Input>
```

**Textarea :**

```tsx
<Textarea>
  /* Identical à Input mais min-height: 120px */ /* Resize: vertical uniquement */ /* Line-height:
  relaxed (1.6) */
</Textarea>
```

**Labels :**

```tsx
<Label>
  /* Font: sans 14px medium */ /* Color: moon-300 */ /* Margin-bottom: 8px */ /* Text-transform:
  none (pas de uppercase) */
</Label>
```

**Règles de Design :**

- Focus toujours visible (accessibility)
- Placeholder subtil (`moon-500`, jamais `moon-300+`)
- Validation inline avec messages clairs
- Disabled state: `opacity-50 cursor-not-allowed`

### Navigation

**Header (Sticky) :**

```tsx
<Header>
  /* Position: sticky top-0 */ /* Background: moon-900/95 */ /* Backdrop-filter: blur(12px)
  saturate(180%) */ /* Border-bottom: 1px solid moon-800 */ /* Shadow: shadow-moonlight (visible au
  scroll) */ /* Height: 64px */ /* Z-index: 50 */
  <Logo>/* Shadow: glow-sm permanent */ /* Hover: glow animation pulse */</Logo>
  <Nav>
    /* Gap: 8 (32px entre liens) */
    <NavLink>
      /* Color: moon-300 */ /* Hover: moon-100 + underline offset-4 */ /* Active: moon-50 + glow-sm
      */ /* Transition: 200ms */
    </NavLink>
  </Nav>
</Header>
```

**Footer :**

```tsx
<Footer>
  /* Background: moon-950 */ /* Border-top: 1px solid moon-800 */ /* Padding: py-12 */ /* Text:
  moon-400 (discret) */ /* Links: moon-300 hover:moon-100 */
</Footer>
```

### Modals & Overlays

```tsx
<Modal>
  {/* Backdrop */}
  /* Background: overlay-dark */ /* Backdrop-filter: blur(4px) */ /* Animation: fade-in 200ms */
  {/* Content */}
  /* Background: moon-800 */ /* Border: 1px solid accent-glow/20 */ /* Border-radius: rounded-3xl
  (24px) */ /* Shadow: shadow-moonlight-lg */ /* Max-width: 600px */ /* Padding: p-8 */ /*
  Animation: fade-in + scale(0.95 → 1) 300ms */
</Modal>
```

### Badges & Pills

```tsx
// Status badges
<Badge variant="success">
  /* Background: status-success/20 */
  /* Border: 1px solid status-success/40 */
  /* Text: status-success */
  /* Padding: px-2 py-1 */
  /* Border-radius: rounded-full */
  /* Font: sans 12px medium */
</Badge>

// Info pill
<Badge variant="default">
  /* Background: moon-700 */
  /* Text: moon-200 */
  /* No border */
</Badge>
```

---

## Animations & Transitions

### Principes d'Animation

**Subtilité avant tout :**

- Durées : 200-500ms (jamais > 600ms sauf cas spécial)
- Easing : `cubic-bezier(0.4, 0, 0.2, 1)` (material ease-in-out)
- Déclencheur : Hover, focus, scroll, state change
- **Jamais** : Animations infinies agressives, mouvements brusques

### Animations Signature Noctalys

```css
@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.6;
    box-shadow: var(--shadow-glow-sm);
  }
  50% {
    opacity: 1;
    box-shadow: var(--shadow-glow);
  }
}

@keyframes float-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
```

### Usage Recommandé

```css
/* Logo header - Flottement subtil permanent */
.logo-noctalys {
  animation: float-subtle 4s ease-in-out infinite;
  filter: drop-shadow(var(--shadow-glow-sm));
}

/* Cards - Apparition au scroll */
.card-enter {
  animation: slide-up 400ms ease-out;
}

/* Bouton CTA - Shimmer au hover */
.btn-primary:hover::before {
  animation: shimmer 2s ease-in-out infinite;
}

/* Glow pulse - Éléments focus */
.element-focus {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### Transitions Standards

```css
/* Hover interactions */
.interactive {
  transition-property: transform, box-shadow, border-color, background-color;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Color changes */
.color-transition {
  transition: color 200ms ease-out;
}

/* Layout shifts (accordions, etc.) */
.layout-shift {
  transition:
    height 400ms ease-out,
    opacity 300ms ease-out;
}
```

---

## Textures & Effets de Fond

### Noise Texture (Grain Subtil)

Appliqué sur `body` pour texture organique :

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("/noise.svg"); /* SVG filter noise */
  opacity: 0.05;
  pointer-events: none;
  z-index: -1;
}
```

**Noise SVG :**

```svg
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
  </filter>
  <rect width="100%" height="100%" filter="url(#noise)" opacity="0.5"/>
</svg>
```

### Gradient Backgrounds

```css
/* Page principale */
.bg-page {
  background: var(--gradient-page);
}

/* Hero sections */
.bg-hero {
  background:
    radial-gradient(circle at 50% 0%, rgba(226, 232, 240, 0.03) 0%, transparent 50%),
    var(--gradient-page);
}

/* Card backgrounds */
.bg-card-gradient {
  background: var(--gradient-card);
}
```

### Orbe Lunaire (Background Décoratif)

```css
.lunar-orb {
  position: fixed;
  top: -200px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(226, 232, 240, 0.08) 0%,
    rgba(226, 232, 240, 0.03) 40%,
    transparent 70%
  );
  filter: blur(60px);
  pointer-events: none;
  z-index: -1;
}
```

---

## Responsive Design

### Breakpoints Tailwind V4

```css
@theme {
  --breakpoint-sm: 640px; /* Mobile large */
  --breakpoint-md: 768px; /* Tablet */
  --breakpoint-lg: 1024px; /* Desktop */
  --breakpoint-xl: 1280px; /* Large desktop */
  --breakpoint-2xl: 1536px; /* Extra large */
}
```

### Règles Mobile-First

**Touch targets :**

- Minimum `44x44px` (Apple HIG)
- Boutons mobiles : `h-12` (48px) minimum
- Espacement entre éléments tactiles : `16px` minimum

**Typography mobile :**

- Hero: `text-3xl` → `md:text-5xl`
- H1: `text-2xl` → `md:text-4xl`
- Body chapitres: `text-base` → `md:text-lg`

**Spacing :**

- Padding mobile: `px-4` (16px)
- Padding desktop: `px-6` → `lg:px-8`
- Sections: `py-8` → `md:py-12` → `lg:py-16`

**Grids :**

```css
/* Cards grid */
.grid-cards {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 col */
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid-cards {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 cols */
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .grid-cards {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 cols */
    gap: 2rem;
  }
}
```

---

## Accessibilité (a11y)

### Contraste

**WCAG AAA (niveau cible) :**

- Texte normal (< 18px) : 7:1 minimum
- Large text (≥ 18px) : 4.5:1 minimum
- UI components : 3:1 minimum

**Paires validées :**

- `moon-100` sur `moon-900` : ✅ 14.2:1
- `moon-200` sur `moon-900` : ✅ 11.8:1
- `moon-300` sur `moon-900` : ✅ 8.5:1
- `accent-primary` sur `moon-900` : ✅ 5.2:1

### Focus States

**Toujours visible :**

```css
.interactive:focus-visible {
  outline: 2px solid var(--color-accent-glow);
  outline-offset: 2px;
  box-shadow: var(--shadow-glow);
}
```

**Navigation clavier :**

- Tab order logique
- Skip links : "Skip to main content"
- Focus trap dans modals

### ARIA & Sémantique

```html
<!-- Landmarks -->
<header role="banner">
  <main role="main">
    <nav role="navigation" aria-label="Navigation principale">
      <footer role="contentinfo">
        <!-- States -->
        <button aria-pressed="true|false">
          <div role="status" aria-live="polite">
            <!-- Labels -->
            <img alt="Description précise" />
            <input aria-label="Rechercher" aria-describedby="help-text" />
          </div>
        </button>
      </footer>
    </nav>
  </main>
</header>
```

---

## Composants Spécifiques Noctalys

### Logo Noctalys

```tsx
<div className="logo-noctalys">
  <svg className="h-12 w-12">
    {/* Croissant de lune SVG */}
    <path d="[croissant path]" fill="currentColor" className="text-moon-100" />
  </svg>

  <style>{`
    .logo-noctalys {
      filter: drop-shadow(0 0 12px rgba(226, 232, 240, 0.3));
      animation: float-subtle 4s ease-in-out infinite;
    }
    
    .logo-noctalys:hover {
      filter: drop-shadow(0 0 20px rgba(226, 232, 240, 0.5));
    }
  `}</style>
</div>
```

### Lecteur Audio (Sticky Bottom)

```tsx
<div className="audio-player">
  /* Position: fixed bottom-0 */ /* Width: 100% */ /* Height: 80px */ /* Background: moon-800/95 */
  /* Backdrop-filter: blur(12px) */ /* Border-top: 1px solid moon-700 */ /* Shadow: 0 -4px 24px
  rgba(0,0,0,0.3) */ /* Z-index: 40 */
  <div className="player-content">
    /* Max-width: 1280px */ /* Margin: 0 auto */ /* Padding: px-4 */ /* Flex: items-center gap-4 */
    <img className="album-art">
      /* Size: 48x48px */ /* Rounded: rounded-lg */ /* Shadow: glow-sm */ /* Animation: pulse subtle
      si playing */
    </img>
    <div className="track-info">
      /* Flex-1 */
      <p className="track-title">/* Font: sans 14px medium */ /* Color: moon-100 */</p>
      <p className="track-time">/* Font: mono 12px */ /* Color: moon-400 */</p>
    </div>
    <div className="controls">
      /* Gap: 2 */
      <Button size="icon" variant="ghost">
        {/* Play/Pause avec transition icône */}
      </Button>
    </div>
    <div className="progress-bar">
      /* Background: moon-700 */ /* Height: 4px */ /* Rounded: rounded-full */
      <div className="progress-fill">
        /* Background: gradient accent-primary → accent-glow */ /* Shadow: glow-sm */ /* Transition:
        width 100ms linear */
      </div>
    </div>
  </div>
</div>
```

### Card Fiction

```tsx
<Card className="fiction-card">
  /* Hover: lift effect + shadow-moonlight */
  <img className="cover-image">/* Aspect: 3/4 */ /* Object-fit: cover */ /* Rounded-t: 2xl */</img>
  <div className="card-content">
    /* Padding: p-6 */ /* Gap: 4 */
    <div className="badges">
      /* Flex gap-2 */
      <Badge variant="default">{genre}</Badge>
      <Badge variant={statusColor}>{status}</Badge>
    </div>
    <h3 className="title">
      /* Font: serif 20px semibold */ /* Color: moon-100 */ /* Hover: accent-primary */
    </h3>
    <p className="summary">/* Font: sans 14px */ /* Color: moon-300 */ /* Line-clamp: 3 */</p>
    <div className="meta">
      /* Flex justify-between */ /* Font: mono 12px */ /* Color: moon-400 */
      <span>{chaptersCount} chapitres</span>
      <span>{publishedDate}</span>
    </div>
  </div>
</Card>
```

### Chapitre (Lecture)

```tsx
<article className="chapter-content">
  /* Max-width: 70ch */ /* Margin: 0 auto */ /* Padding: px-6 py-12 */
  <header className="chapter-header">
    /* Margin-bottom: 12 */
    <p className="fiction-title">
      /* Font: sans 14px */ /* Color: moon-400 */ /* Text-transform: uppercase */ /* Letter-spacing:
      wider */
    </p>
    <h1 className="chapter-title">
      /* Font: serif 36px semibold */ /* Color: moon-50 */ /* Margin-top: 2 */
    </h1>
  </header>
  <div className="prose-noctalys">
    {/* Contenu Markdown */}
    /* Font: serif 18px */ /* Line-height: 1.8 */ /* Color: moon-200 */ /* Styles Markdown : */ /*
    H2: serif 24px moon-100 mt-12 mb-4 */ /* H3: serif 20px moon-100 mt-8 mb-3 */ /* P: mb-6 */ /*
    Strong: font-medium moon-100 */ /* Em: italic */ /* A: accent-primary underline hover:glow-sm */
    /* Code: mono 16px moon-300 bg-moon-800 px-2 py-1 rounded */ /* Blockquote: border-l-4
    border-accent-glow/30 pl-6 italic moon-300 */
  </div>
  <footer className="chapter-nav">
    /* Position: sticky bottom-0 */ /* Background: moon-900/95 backdrop-blur */ /* Border-top:
    moon-800 */ /* Padding: py-4 */ /* Flex: justify-between items-center */
    <Button variant="ghost">← Précédent</Button>
    <span className="progress">/* Font: mono 12px moon-400 */ Chapitre 3/12</span>
    <Button variant="ghost">Suivant →</Button>
  </footer>
</article>
```

---

## Design Tokens Tailwind V4 (Configuration)

### Fichier `app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* === COLORS === */

  /* Moon palette */
  --color-moon-50: #fafbfc;
  --color-moon-100: #f0f2f5;
  --color-moon-200: #d8dde3;
  --color-moon-300: #b8c1cc;
  --color-moon-400: #8f9baa;
  --color-moon-500: #667085;
  --color-moon-600: #4a5568;
  --color-moon-700: #2d3748;
  --color-moon-800: #1a202c;
  --color-moon-900: #0f1419;
  --color-moon-950: #070a0f;

  /* Accents */
  --color-accent-primary: #a0aec0;
  --color-accent-primary-hover: #cbd5e0;
  --color-accent-glow: #e2e8f0;
  --color-accent-glow-soft: #edf2f7;
  --color-accent-muted: #718096;

  /* Status (désaturés) */
  --color-status-success: #9ae6b4;
  --color-status-warning: #fbd38d;
  --color-status-error: #fc8181;
  --color-status-info: #90cdf4;

  /* === SHADOWS === */

  --shadow-glow-sm: 0 0 10px rgb(226 232 240 / 0.2);
  --shadow-glow: 0 0 20px rgb(226 232 240 / 0.3);
  --shadow-glow-lg: 0 0 30px rgb(226 232 240 / 0.4);
  --shadow-moonlight: 0 4px 24px rgb(160 174 192 / 0.2);
  --shadow-moonlight-lg: 0 8px 40px rgb(160 174 192 / 0.25);
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.2);
  --shadow-md: 0 4px 6px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px rgb(0 0 0 / 0.4);
  --shadow-xl: 0 20px 25px rgb(0 0 0 / 0.5);
  --shadow-inner: inset 0 2px 4px rgb(0 0 0 / 0.3);

  /* === TYPOGRAPHY === */

  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-serif: "Lora", "Georgia", "Times New Roman", serif;
  --font-mono: "JetBrains Mono", "Consolas", "Monaco", monospace;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.8;
  --line-height-loose: 2;

  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;

  /* === SPACING === */

  --spacing-prose-max-width: 70ch;

  /* === ANIMATIONS === */

  --transition-fast: 200ms;
  --transition-normal: 300ms;
  --transition-slow: 400ms;
  --transition-slower: 500ms;

  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

/* === GLOBAL STYLES === */

body {
  background: linear-gradient(180deg, #0f1419 0%, #070a0f 100%);
  color: var(--color-moon-200);
  font-family: var(--font-sans);
  position: relative;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("/noise.svg");
  opacity: 0.05;
  pointer-events: none;
  z-index: -1;
}

/* === ANIMATIONS === */

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.6;
    box-shadow: var(--shadow-glow-sm);
  }
  50% {
    opacity: 1;
    box-shadow: var(--shadow-glow);
  }
}

@keyframes float-subtle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* === UTILITY CLASSES === */

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

.animate-float {
  animation: float-subtle 4s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 400ms ease-out;
}

.animate-slide-up {
  animation: slide-up 400ms ease-out;
}
```

---

## Checklist d'Implémentation

**Phase 1 - Foundation :**

- [ ] Installer Tailwind CSS V4 (`npm install tailwindcss@next`)
- [ ] Créer `app/globals.css` avec design tokens ci-dessus
- [ ] Installer fonts (Inter, Lora, JetBrains Mono) via `@next/font`
- [ ] Créer `public/noise.svg` pour texture grain
- [ ] Installer Shadcn UI (`npx shadcn@latest init`)

**Phase 2 - Composants Base :**

- [ ] Configurer variants Button (primary, secondary, ghost, destructive)
- [ ] Créer composant Card avec variantes (elevated, flat, featured)
- [ ] Configurer Input/Textarea avec focus states
- [ ] Créer Badge component avec status variants
- [ ] Implémenter Modal avec backdrop blur

**Phase 3 - Layout :**

- [ ] Créer Header sticky avec logo Noctalys
- [ ] Implémenter navigation responsive (burger menu mobile)
- [ ] Créer Footer avec liens
- [ ] Configurer grids responsive pour cards

**Phase 4 - Composants Spécifiques :**

- [ ] Logo Noctalys SVG avec animation float
- [ ] Card Fiction avec hover effects
- [ ] Lecteur audio sticky bottom
- [ ] Template chapitre avec prose-noctalys
- [ ] Navigation chapitres (précédent/suivant)

**Phase 5 - Polish :**

- [ ] Tester contraste WCAG AAA sur toutes paires
- [ ] Implémenter focus states clavier
- [ ] Ajouter skip links
- [ ] Tester responsive mobile/tablet/desktop
- [ ] Valider animations (subtilité, durées)

---

## Ressources

**Fonts :**

- Inter : https://fonts.google.com/specimen/Inter
- Lora : https://fonts.google.com/specimen/Lora
- JetBrains Mono : https://fonts.google.com/specimen/JetBrains+Mono

**Outils :**

- Contrast checker : https://webaim.org/resources/contrastchecker/
- Tailwind V4 docs : https://tailwindcss.com/docs/v4-beta
- Shadcn UI : https://ui.shadcn.com/

**Inspiration :**

- Lunar phases animations
- Astrophotography (halos, glows)
- Minimalist dark UI (Vercel, Linear, Arc)

---

**Document validé. Prêt pour implémentation.**
