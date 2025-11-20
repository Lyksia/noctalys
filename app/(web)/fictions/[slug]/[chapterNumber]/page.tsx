import { notFound } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/ui";
import { Markdown } from "@/lib/markdown";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface ChapterPageProps {
  params: Promise<{
    slug: string;
    chapterNumber: string;
  }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug, chapterNumber } = await params;
  const chapterNum = parseInt(chapterNumber, 10);

  if (isNaN(chapterNum)) {
    return { title: "Chapitre introuvable" };
  }

  const fiction = await prisma.fiction.findUnique({
    where: { slug, status: "PUBLISHED" },
  });

  if (!fiction) {
    return { title: "Fiction introuvable" };
  }

  const chapter = await prisma.chapter.findFirst({
    where: {
      fictionId: fiction.id,
      chapterNumber: chapterNum,
      publishedAt: { not: null },
    },
  });

  if (!chapter) {
    return { title: "Chapitre introuvable" };
  }

  return {
    title: `${chapter.title} - ${fiction.title} - Noctalys`,
    description: `Chapitre ${chapter.chapterNumber} de ${fiction.title}`,
    openGraph: {
      title: `${chapter.title} - ${fiction.title}`,
      description: `Chapitre ${chapter.chapterNumber}`,
      images: fiction.coverImage ? [fiction.coverImage] : [],
    },
  };
}

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug, chapterNumber } = await params;
  const chapterNum = parseInt(chapterNumber, 10);

  if (isNaN(chapterNum)) {
    notFound();
  }

  // Find the fiction
  const fiction = await prisma.fiction.findUnique({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
  });

  if (!fiction) {
    notFound();
  }

  // Find the chapter
  const chapter = await prisma.chapter.findFirst({
    where: {
      fictionId: fiction.id,
      chapterNumber: chapterNum,
      publishedAt: {
        not: null,
      },
    },
    select: {
      id: true,
      chapterNumber: true,
      title: true,
      content: true,
      publishedAt: true,
    },
  });

  if (!chapter) {
    notFound();
  }

  // Get total chapters count
  const totalChapters = await prisma.chapter.count({
    where: {
      fictionId: fiction.id,
      publishedAt: {
        not: null,
      },
    },
  });

  // Get previous and next chapters
  const previousChapter = await prisma.chapter.findFirst({
    where: {
      fictionId: fiction.id,
      chapterNumber: chapterNum - 1,
      publishedAt: {
        not: null,
      },
    },
    select: {
      chapterNumber: true,
    },
  });

  const nextChapter = await prisma.chapter.findFirst({
    where: {
      fictionId: fiction.id,
      chapterNumber: chapterNum + 1,
      publishedAt: {
        not: null,
      },
    },
    select: {
      chapterNumber: true,
    },
  });

  return (
    <div className="bg-moon-950 flex min-h-screen flex-col">
      {/* Sticky Header - Discret */}
      <header className="border-moon-800 bg-moon-900/95 shadow-moonlight sticky top-0 z-50 w-full border-b backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Logo size="sm" animated={false} />
          </Link>

          <Link
            href={`/fictions/${fiction.slug}`}
            className="text-moon-300 hover:text-moon-100 text-sm transition-colors"
          >
            ← Retour à {fiction.title}
          </Link>
        </div>
      </header>

      {/* Main Reading Area */}
      <main className="flex-1 py-12">
        <article className="container mx-auto max-w-[70ch]">
          {/* Chapter Header */}
          <header className="mb-12 flex flex-col gap-4">
            <div className="text-moon-500 flex items-center gap-3 text-sm">
              <Link
                href={`/fictions/${fiction.slug}`}
                className="hover:text-moon-300 transition-colors"
              >
                {fiction.title}
              </Link>
              <span>•</span>
              <span>
                Chapitre {chapter.chapterNumber} / {totalChapters}
              </span>
            </div>

            <h1 className="text-heading-1 text-moon-50 font-serif font-semibold">
              {chapter.title}
            </h1>

            {chapter.publishedAt && (
              <p className="text-moon-500 text-sm">
                Publié le{" "}
                {new Date(chapter.publishedAt).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            <div className="via-moon-700 h-px bg-gradient-to-r from-transparent to-transparent" />
          </header>

          {/* Chapter Content */}
          <div className="prose-reading">
            <Markdown>{chapter.content}</Markdown>
          </div>

          {/* End Ornament */}
          <div className="my-12 flex items-center justify-center gap-4">
            <div className="via-moon-700 h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
            <svg className="text-moon-400 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <div className="via-moon-700 h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
          </div>
        </article>
      </main>

      {/* Sticky Bottom Navigation */}
      <nav className="border-moon-800 bg-moon-900/95 sticky bottom-0 z-40 w-full border-t shadow-[0_-4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between">
          {/* Previous Chapter */}
          {previousChapter ? (
            <Link
              href={`/fictions/${fiction.slug}/${previousChapter.chapterNumber}`}
              className="text-moon-300 hover:text-moon-100 group flex items-center gap-2 transition-colors"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:-translate-x-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">Chapitre précédent</span>
              <span className="sm:hidden">Précédent</span>
            </Link>
          ) : (
            <div className="text-moon-600">
              <span className="hidden sm:inline">Premier chapitre</span>
              <span className="sm:hidden">•</span>
            </div>
          )}

          {/* Current Position */}
          <div className="text-moon-400 flex items-center gap-2 text-sm">
            <span className="text-moon-200 font-medium">{chapter.chapterNumber}</span>
            <span>/</span>
            <span>{totalChapters}</span>
          </div>

          {/* Next Chapter */}
          {nextChapter ? (
            <Link
              href={`/fictions/${fiction.slug}/${nextChapter.chapterNumber}`}
              className="text-moon-300 hover:text-moon-100 group flex items-center gap-2 transition-colors"
            >
              <span className="hidden sm:inline">Chapitre suivant</span>
              <span className="sm:hidden">Suivant</span>
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
            </Link>
          ) : (
            <div className="text-moon-600">
              <span className="hidden sm:inline">Dernier chapitre</span>
              <span className="sm:hidden">•</span>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
