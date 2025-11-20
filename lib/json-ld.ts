/**
 * Génération de données structurées JSON-LD pour le SEO
 * https://schema.org/
 */

interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

interface WebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": "Organization";
    name: string;
  };
}

interface CreativeWork {
  "@context": "https://schema.org";
  "@type": "Book" | "CreativeWork";
  name: string;
  description: string;
  url: string;
  author: {
    "@type": "Organization";
    name: string;
  };
  datePublished?: string;
  dateModified?: string;
  image?: string;
  genre?: string;
}

interface MusicRecording {
  "@context": "https://schema.org";
  "@type": "MusicRecording";
  name: string;
  description?: string;
  url: string;
  duration?: string;
  datePublished?: string;
  image?: string;
  byArtist: {
    "@type": "Organization";
    name: string;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://noctalys.vercel.app";

/**
 * Organisation principale (Noctalys)
 */
export function generateOrganizationSchema(): Organization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Noctalys",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Plateforme de création et partage de fictions et musiques nocturnes. Plongez dans des récits captivants et des ambiances sonores envoûtantes.",
    sameAs: [
      // Ajouter les réseaux sociaux quand disponibles
      // "https://twitter.com/noctalys",
      // "https://instagram.com/noctalys",
    ],
  };
}

/**
 * WebSite (pour la page d'accueil)
 */
export function generateWebSiteSchema(): WebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Noctalys",
    url: baseUrl,
    description: "Quand la nuit tombe, les histoires s'éveillent...",
    publisher: {
      "@type": "Organization",
      name: "Noctalys",
    },
  };
}

/**
 * Fiction (CreativeWork / Book)
 */
export function generateFictionSchema(fiction: {
  title: string;
  slug: string;
  summary: string;
  genre: string;
  coverImage?: string | null;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
}): CreativeWork {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: fiction.title,
    description: fiction.summary,
    url: `${baseUrl}/fictions/${fiction.slug}`,
    author: {
      "@type": "Organization",
      name: "Noctalys",
    },
    datePublished: fiction.publishedAt?.toISOString(),
    dateModified: fiction.updatedAt?.toISOString(),
    image: fiction.coverImage || undefined,
    genre: fiction.genre,
  };
}

/**
 * Musique (MusicRecording)
 */
export function generateMusicSchema(track: {
  title: string;
  slug: string;
  duration: number;
  coverImage?: string | null;
  publishedAt?: Date | null;
}): MusicRecording {
  // Convertir durée en format ISO 8601 (PT1M30S pour 1min30s)
  const minutes = Math.floor(track.duration / 60);
  const seconds = track.duration % 60;
  const isoDuration = `PT${minutes}M${seconds}S`;

  return {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: track.title,
    url: `${baseUrl}/musiques#${track.slug}`,
    duration: isoDuration,
    datePublished: track.publishedAt?.toISOString(),
    image: track.coverImage || undefined,
    byArtist: {
      "@type": "Organization",
      name: "Noctalys",
    },
  };
}

/**
 * Breadcrumb (fil d'Ariane)
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}
