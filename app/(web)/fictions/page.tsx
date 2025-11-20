import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription, CardFiction, Badge } from "@/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Fictions",
  description:
    "Récits nocturnes à découvrir chapitre par chapitre. Explorez des univers fantastiques, de science-fiction, de mystère et bien plus encore.",
  openGraph: {
    title: "Fictions - Noctalys",
    description:
      "Récits nocturnes tissés avec soin, découpés en chapitres qui s'offrent à vous comme les phases d'une lune croissante.",
  },
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function FictionsPage() {
  // Récupérer toutes les fictions publiées
  const fictions = await prisma.fiction.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      _count: {
        select: { chapters: true },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
  return (
    <div className="flex flex-col">
      {/* Orbe décoratif */}
      <div className="pointer-events-none fixed top-[10vh] right-[15vw] z-[-1] h-[400px] w-[400px] bg-[radial-gradient(circle,_rgba(226,232,240,0.08)_0%,_rgba(226,232,240,0.04)_40%,_transparent_70%)] blur-[70px]" />

      {/* Hero Section */}
      <section className="section pt-20 pb-12">
        <div className="container">
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            {/* En-tête avec icône */}
            <div className="flex items-center gap-4">
              <div className="bg-moon-800 border-moon-700/50 shadow-glow-sm flex h-16 w-16 items-center justify-center rounded-2xl border">
                <span className="text-4xl">📖</span>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-heading-1 font-serif font-semibold">Fictions</h1>
                <p className="text-moon-400 text-sm">
                  Récits nocturnes à découvrir chapitre par chapitre
                </p>
              </div>
            </div>

            {/* Description narrative */}
            <div className="text-moon-300 flex max-w-3xl flex-col gap-4 leading-relaxed">
              <p>
                Chaque fiction est une porte ouverte vers un ailleurs. Des récits tissés avec soin,
                découpés en chapitres qui s'offrent à vous comme les phases d'une lune croissante.
              </p>
              <p className="text-moon-400">
                Installez-vous confortablement. Le temps s'étire, les mots résonnent. Vous avancez à
                votre rythme, guidé par la lueur argentée de votre curiosité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contenu */}
      <section className="section pt-0">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            {/* Séparateur décoratif */}
            <div className="mb-12 flex items-center gap-4">
              <div className="via-moon-700 to-moon-700 h-px flex-1 bg-gradient-to-r from-transparent" />
              <div className="flex gap-1">
                <div className="bg-moon-600 h-1 w-1 rounded-full" />
                <div className="bg-moon-500 h-1 w-1 rounded-full" />
                <div className="bg-moon-600 h-1 w-1 rounded-full" />
              </div>
              <div className="via-moon-700 to-moon-700 h-px flex-1 bg-gradient-to-l from-transparent" />
            </div>

            {/* Grille de fictions */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {fictions.length === 0 ? (
                // État vide élégant
                <div className="col-span-full">
                  <Card className="bg-moon-800/50 border-moon-700/30 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex flex-col items-center gap-6 py-12 text-center">
                        <div className="bg-moon-900/50 border-moon-700/30 flex h-20 w-20 items-center justify-center rounded-full border">
                          <svg
                            className="text-moon-500 h-10 w-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-3">
                          <CardTitle className="font-serif text-2xl">
                            Les histoires arrivent bientôt
                          </CardTitle>
                          <CardDescription className="mx-auto max-w-md text-base">
                            Les premières fictions sont en cours de création. Elles apparaîtront ici
                            comme des lucioles dans la nuit, une à une, avec patience et soin.
                          </CardDescription>
                        </div>
                        <p className="text-moon-500 mt-4 text-sm italic">
                          "Toute grande histoire commence par un silence."
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              ) : (
                // Liste des fictions
                fictions.map((fiction) => (
                  <CardFiction
                    key={fiction.id}
                    fiction={{
                      id: fiction.id,
                      slug: fiction.slug,
                      title: fiction.title,
                      summary: fiction.summary,
                      coverImage: fiction.coverImage || undefined,
                      genre: fiction.genre || undefined,
                      status: fiction.status,
                      publishedAt: fiction.publishedAt || undefined,
                      _count: fiction._count,
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
