import Link from "next/link";
import type { Metadata } from "next";
import { Button, Card, CardHeader, CardFiction, CardTrack } from "@/ui";
import { prisma } from "@/lib/prisma";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Quand la nuit tombe, les histoires s'éveillent. Découvrez des fictions captivantes et des compositions musicales originales sur Noctalys.",
  openGraph: {
    title: "Noctalys - Quand la nuit tombe, les histoires s'éveillent",
    description:
      "Découvrez des fictions captivantes et des compositions musicales originales dans un univers nocturne et contemplatif.",
  },
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  // Récupérer les 3 dernières fictions et 3 derniers morceaux publiés
  const [latestFictions, latestTracks] = await Promise.all([
    prisma.fiction.findMany({
      where: { status: "PUBLISHED" },
      include: {
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.track.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  // Générer les données structurées JSON-LD
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <div className="flex flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Orbes lunaires multiples pour créer de la profondeur */}
      <div className="pointer-events-none fixed top-[5vh] right-[10vw] z-[-1] h-[500px] w-[500px] bg-[radial-gradient(circle,_rgba(226,232,240,0.1)_0%,_rgba(226,232,240,0.05)_40%,_transparent_70%)] blur-[80px]" />
      <div className="pointer-events-none fixed bottom-[20vh] left-[5vw] z-[-1] h-[400px] w-[400px] bg-[radial-gradient(circle,_rgba(226,232,240,0.08)_0%,_rgba(226,232,240,0.04)_40%,_transparent_70%)] blur-[70px]" />

      {/* Acte I - L'Éveil Nocturne */}
      <section className="section flex min-h-[90vh] items-center">
        <div className="container">
          <div className="mx-auto flex max-w-4xl flex-col gap-12">
            {/* Ouverture poétique */}
            <div className="animate-fade-in flex flex-col gap-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="via-moon-700 h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
                <svg
                  className="text-moon-200 animate-float-subtle h-8 w-8 drop-shadow-[0_0_16px_rgba(226,232,240,0.3)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <div className="via-moon-700 h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
              </div>

              <h1 className="text-moon-50 text-center font-serif text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
                Quand la nuit tombe,
                <br />
                <span className="text-moon-200">les histoires s&apos;éveillent</span>
              </h1>

              <p className="text-moon-300 mx-auto max-w-2xl text-center text-lg leading-relaxed md:text-xl">
                Dans le silence de la nuit, loin du tumulte du jour, un espace se dessine où les
                mots prennent vie et les mélodies s&apos;élèvent. Bienvenue sur{" "}
                <span className="text-moon-100 font-serif font-semibold">Noctalys</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Acte II - Le Voyage Littéraire */}
      <section className="section bg-moon-950/50 relative overflow-hidden">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Texte narratif */}
            <div className="animate-slide-up flex flex-1 flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-moon-800/80 border-moon-700/50 shadow-glow-sm flex h-12 w-12 items-center justify-center rounded-xl border backdrop-blur-sm">
                  <span className="text-2xl">📖</span>
                </div>
                <h2 className="text-moon-100 font-serif text-3xl font-semibold md:text-4xl">
                  Les Fictions
                </h2>
              </div>

              <div className="text-moon-300 flex flex-col gap-4 leading-relaxed">
                <p>
                  Chaque fiction est une porte ouverte vers un ailleurs. Des récits tissés avec
                  soin, découpés en chapitres qui s&apos;offrent à vous comme les phases d&apos;une
                  lune croissante.
                </p>
                <p>
                  Ici, pas de précipitation. Le temps s&apos;étire, les mots résonnent. Vous avancez
                  à votre rythme, guidé par la lueur argentée de votre curiosité.
                </p>
                <p className="text-moon-400 text-sm italic">
                  &quot;Dans l&apos;obscurité, chaque mot devient une étoile.&quot;
                </p>
              </div>

              <div className="mt-4 flex gap-4">
                <Button asChild>
                  <Link href="/fictions">Commencer la lecture</Link>
                </Button>
              </div>
            </div>

            {/* Card exemple visuel */}
            <div className="w-full flex-1">
              <Card className="bg-moon-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="from-moon-700 to-moon-900 border-moon-600/30 flex aspect-[16/9] items-center justify-center rounded-lg border bg-gradient-to-br">
                      <span className="text-6xl opacity-30">📚</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-moon-100 font-serif text-xl font-semibold">
                        Histoires organisées
                      </h3>
                      <p className="text-moon-400 text-sm leading-relaxed">
                        Chapitres numérotés • Progression sauvegardée • Lecture confortable
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Acte III - L'Éveil Musical */}
      <section className="section relative overflow-hidden">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row-reverse lg:gap-16">
            {/* Texte narratif */}
            <div className="flex flex-1 flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-moon-800/80 border-moon-700/50 shadow-glow-sm flex h-12 w-12 items-center justify-center rounded-xl border backdrop-blur-sm">
                  <span className="text-2xl">🎵</span>
                </div>
                <h2 className="text-moon-100 font-serif text-3xl font-semibold md:text-4xl">
                  Les Musiques
                </h2>
              </div>

              <div className="text-moon-300 flex flex-col gap-4 leading-relaxed">
                <p>
                  Fermez les yeux. Laissez les notes vous envelopper comme un voile de brume
                  nocturne. Chaque composition est née dans l&apos;intimité de la nuit, pour
                  accompagner vos instants de contemplation.
                </p>
                <p>
                  Des mélodies douces qui ne cherchent pas à remplir le silence, mais à le sublimer.
                  Une bande sonore pour vos lectures, vos rêveries, vos errances nocturnes.
                </p>
                <p className="text-moon-400 text-sm italic">
                  &quot;La musique est le silence entre les notes.&quot;
                </p>
              </div>

              <div className="mt-4 flex gap-4">
                <Button asChild>
                  <Link href="/musiques">Découvrir les compositions</Link>
                </Button>
              </div>
            </div>

            {/* Card exemple visuel */}
            <div className="w-full flex-1">
              <Card className="bg-moon-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <div className="from-moon-700 to-moon-900 border-moon-600/30 flex aspect-[16/9] items-center justify-center rounded-lg border bg-gradient-to-br">
                      <span className="text-6xl opacity-30">🎹</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-moon-100 font-serif text-xl font-semibold">
                        Compositions originales
                      </h3>
                      <p className="text-moon-400 text-sm leading-relaxed">
                        Ambiances nocturnes • Écoute en streaming • Playlists thématiques
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Acte IV - Dernières Publications */}
      {(latestFictions.length > 0 || latestTracks.length > 0) && (
        <section className="section bg-moon-950/30">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              {/* Header */}
              <div className="mb-12 flex flex-col items-center gap-4 text-center">
                <h2 className="text-moon-100 font-serif text-3xl font-semibold md:text-4xl">
                  Dernières Publications
                </h2>
                <p className="text-moon-400 max-w-2xl">
                  Découvrez les dernières histoires et mélodies ajoutées à Noctalys
                </p>
              </div>

              {/* Fictions */}
              {latestFictions.length > 0 && (
                <div className="mb-16">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-moon-200 flex items-center gap-2 font-serif text-xl font-semibold">
                      <span>📖</span> Nouvelles Fictions
                    </h3>
                    <Link
                      href="/fictions"
                      className="text-moon-400 hover:text-electric-blue text-sm transition-colors"
                    >
                      Voir tout →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {latestFictions.map((fiction) => (
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
                    ))}
                  </div>
                </div>
              )}

              {/* Musiques */}
              {latestTracks.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-moon-200 flex items-center gap-2 font-serif text-xl font-semibold">
                      <span>🎵</span> Nouvelles Compositions
                    </h3>
                    <Link
                      href="/musiques"
                      className="text-moon-400 hover:text-electric-blue text-sm transition-colors"
                    >
                      Voir tout →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {latestTracks.map((track) => (
                      <CardTrack
                        key={track.id}
                        track={{
                          id: track.id,
                          slug: track.slug,
                          title: track.title,
                          audioUrl: track.audioUrl,
                          coverImage: track.coverImage,
                          duration: track.duration,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Acte V - L'Invitation */}
      <section className="section via-moon-950/50 to-moon-950 relative bg-gradient-to-b from-transparent">
        <div className="container">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
            {/* Séparateur décoratif */}
            <div className="flex w-full items-center gap-4">
              <div className="via-moon-700 to-moon-700 h-px flex-1 bg-gradient-to-r from-transparent" />
              <div className="flex gap-1">
                <div className="bg-moon-600 h-1 w-1 rounded-full" />
                <div className="bg-moon-500 h-1 w-1 rounded-full" />
                <div className="bg-moon-600 h-1 w-1 rounded-full" />
              </div>
              <div className="via-moon-700 to-moon-700 h-px flex-1 bg-gradient-to-l from-transparent" />
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="text-moon-100 font-serif text-3xl font-semibold md:text-4xl">
                L&apos;aventure commence maintenant
              </h2>
              <p className="text-moon-300 text-lg leading-relaxed">
                La nuit n&apos;attend que vous. Ouvrez la porte, franchissez le seuil. Les histoires
                murmurent déjà votre nom, et les mélodies préparent leur premier accord.
              </p>
            </div>

            {/* CTAs finaux */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="min-w-[200px]">
                <Link href="/fictions">Explorer les Fictions</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-w-[200px]">
                <Link href="/musiques">Écouter les Musiques</Link>
              </Button>
            </div>

            {/* Citation finale */}
            <p className="text-moon-500 mt-8 text-sm italic">
              &quot;Dans chaque nuit, une histoire attend d&apos;être découverte.&quot;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
