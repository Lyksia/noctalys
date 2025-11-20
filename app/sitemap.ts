import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://noctalys.vercel.app";

  // Récupérer toutes les fictions et chapitres publiés
  const [fictions, tracks] = await Promise.all([
    prisma.fiction.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        chapters: {
          where: { publishedAt: { not: null } },
          select: {
            chapterNumber: true,
            updatedAt: true,
          },
        },
      },
    }),
    prisma.track.findMany({
      where: { publishedAt: { not: null } },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ]);

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/fictions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/musiques`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Pages de fictions
  const fictionPages: MetadataRoute.Sitemap = fictions.map((fiction) => ({
    url: `${baseUrl}/fictions/${fiction.slug}`,
    lastModified: fiction.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Pages de chapitres
  const chapterPages: MetadataRoute.Sitemap = fictions.flatMap((fiction) =>
    fiction.chapters.map((chapter) => ({
      url: `${baseUrl}/fictions/${fiction.slug}/${chapter.chapterNumber}`,
      lastModified: chapter.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...fictionPages, ...chapterPages];
}
