import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/ui";

interface LibraryItem {
  purchaseId: string;
  purchasedAt: Date;
  amount: number;
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
    publishedAt: Date | null;
  };
  fiction: {
    id: string;
    slug: string;
    title: string;
    coverImage: string | null;
    genre: string | null;
  };
}

async function getLibrary(): Promise<LibraryItem[]> {
  const res = await fetch(
    `${process.env.BETTER_AUTH_URL || "http://localhost:3003"}/api/user/library`,
    {
      headers: await headers(),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.library;
}

export default async function LibraryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login?redirect=/library");
  }

  const library = await getLibrary();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-heading-1 font-semibold">
          Ma Bibliothèque
        </h1>
        <p className="text-moon-400">
          Tous vos chapitres achetés sont disponibles ici
        </p>
      </div>

      {/* Library Content */}
      {library.length === 0 ? (
        <Card className="border-moon-800 bg-moon-900">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="text-moon-400 text-4xl">📚</div>
            <h2 className="text-heading-3 font-semibold">
              Votre bibliothèque est vide
            </h2>
            <p className="text-moon-400 max-w-md">
              Vous n&apos;avez pas encore acheté de chapitres. Explorez nos
              fictions et commencez votre lecture !
            </p>
            <Link
              href="/fictions"
              className="mt-4 rounded-lg bg-electric-blue px-6 py-3 text-sm font-medium text-dark-navy transition-colors hover:bg-electric-blue/90"
            >
              Découvrir les fictions
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {library.map((item) => (
            <LibraryChapterCard key={item.purchaseId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryChapterCard({ item }: { item: LibraryItem }) {
  const chapterSlug = `chapitre-${item.chapter.chapterNumber}`;
  const chapterUrl = `/fictions/${item.fiction.slug}/${chapterSlug}`;

  const formattedDate = new Date(item.purchasedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedPrice = (item.amount / 100).toFixed(2);

  return (
    <Card className="border-moon-800 bg-moon-900 transition-all hover:border-moon-700">
      <CardContent className="p-0">
        <Link href={chapterUrl} className="flex flex-col">
          {/* Cover Image */}
          {item.fiction.coverImage && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
              <img
                src={item.fiction.coverImage}
                alt={item.fiction.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col gap-3 p-4">
            {/* Fiction Title */}
            <p className="text-moon-400 text-sm">{item.fiction.title}</p>

            {/* Chapter Title */}
            <h3 className="font-semibold leading-tight">
              Chapitre {item.chapter.chapterNumber} : {item.chapter.title}
            </h3>

            {/* Metadata */}
            <div className="flex flex-col gap-1 text-xs text-moon-500">
              <div className="flex items-center justify-between">
                <span>Acheté le {formattedDate}</span>
                <span className="font-medium text-electric-blue">
                  {formattedPrice} €
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-2 flex items-center justify-between border-t border-moon-800 pt-3">
              <span className="text-sm text-electric-blue">Lire →</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
