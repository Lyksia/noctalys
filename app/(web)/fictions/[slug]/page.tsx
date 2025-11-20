import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge, Button, Card, CardHeader, CardContent } from "@/ui";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { generateFictionSchema, generateBreadcrumbSchema } from "@/lib/json-ld";

interface FictionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: FictionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fiction = await prisma.fiction.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!fiction) {
    return {
      title: "Fiction non trouvée",
    };
  }

  return {
    title: `${fiction.title} - Noctalys`,
    description: fiction.summary,
    openGraph: {
      title: fiction.title,
      description: fiction.summary,
      images: fiction.coverImage ? [fiction.coverImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const fictions = await prisma.fiction.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
    take: 10, // Generate static pages for top 10 fictions
  });

  return fictions.map((fiction) => ({
    slug: fiction.slug,
  }));
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function FictionPage({ params }: FictionPageProps) {
  const { slug } = await params;
  const fiction = await prisma.fiction.findUnique({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      chapters: {
        where: {
          publishedAt: {
            not: null,
          },
        },
        orderBy: {
          chapterNumber: "asc",
        },
        select: {
          id: true,
          chapterNumber: true,
          title: true,
          publishedAt: true,
        },
      },
    },
  });

  if (!fiction) {
    notFound();
  }

  const firstChapter = fiction.chapters[0];

  // Générer les données structurées JSON-LD
  const fictionSchema = generateFictionSchema({
    title: fiction.title,
    slug: fiction.slug,
    summary: fiction.summary,
    genre: fiction.genre || "OTHER",
    coverImage: fiction.coverImage,
    publishedAt: fiction.publishedAt,
    updatedAt: fiction.updatedAt,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "Fictions", url: "/fictions" },
    { name: fiction.title, url: `/fictions/${fiction.slug}` },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fictionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Orbe lunaire décoratif */}
      <div className="pointer-events-none fixed top-[10vh] right-[10vw] z-[-1] h-[400px] w-[400px] bg-[radial-gradient(circle,_rgba(226,232,240,0.08)_0%,_rgba(226,232,240,0.04)_40%,_transparent_70%)] blur-[70px]" />

      {/* Hero Section - Fiction Header */}
      <section className="section bg-moon-950/50 relative overflow-hidden">
        <div className="container">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Couverture */}
            <div className="flex-shrink-0">
              <div className="border-moon-700 shadow-moonlight relative aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-2xl border">
                {fiction.coverImage ? (
                  <Image
                    src={fiction.coverImage}
                    alt={`Couverture de ${fiction.title}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="bg-moon-800 text-moon-400 flex h-full w-full items-center justify-center">
                    <span className="text-6xl">📖</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations */}
            <div className="flex flex-1 flex-col gap-6">
              {/* Titre et Badges */}
              <div className="flex flex-col gap-4">
                <h1 className="text-heading-1 text-moon-50 font-serif font-semibold">
                  {fiction.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">{fiction.genre}</Badge>
                  <Badge variant={fiction.status === "PUBLISHED" ? "success" : "default"}>
                    {fiction.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </Badge>
                  <span className="text-moon-400 text-sm">
                    {fiction.chapters.length} chapitre{fiction.chapters.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Résumé */}
              <p className="text-moon-300 text-lg leading-relaxed">{fiction.summary}</p>

              {/* Métadonnées */}
              <div className="text-moon-400 flex flex-col gap-2 text-sm">
                {fiction.publishedAt && (
                  <p>
                    Publié le{" "}
                    {new Date(fiction.publishedAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {fiction.updatedAt && (
                  <p>
                    Dernière mise à jour:{" "}
                    {new Date(fiction.updatedAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* CTA */}
              {firstChapter && (
                <div className="flex gap-4">
                  <Link href={`/fictions/${fiction.slug}/${firstChapter.chapterNumber}`}>
                    <Button size="lg" className="group">
                      Commencer la lecture
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Liste des Chapitres */}
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-moon-100 mb-8 font-serif text-2xl font-semibold">Chapitres</h2>

            {fiction.chapters.length === 0 ? (
              <Card>
                <CardContent className="text-moon-400 py-12 text-center">
                  Aucun chapitre publié pour le moment.
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                {fiction.chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/fictions/${fiction.slug}/${chapter.chapterNumber}`}
                  >
                    <Card className="group hover:shadow-moonlight cursor-pointer transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <Badge variant="default" className="text-xs">
                                Chapitre {chapter.chapterNumber}
                              </Badge>
                              <h3 className="text-moon-100 group-hover:text-accent-primary text-lg font-medium transition-colors">
                                {chapter.title}
                              </h3>
                            </div>
                            {chapter.publishedAt && (
                              <p className="text-moon-500 text-sm">
                                {new Date(chapter.publishedAt).toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                          </div>

                          <svg
                            className="text-moon-400 group-hover:text-accent-primary h-6 w-6 transition-all group-hover:translate-x-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
