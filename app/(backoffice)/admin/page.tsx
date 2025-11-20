import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/ui";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // Récupérer les statistiques
  const [fictionsCount, chaptersCount, tracksCount] = await Promise.all([
    prisma.fiction.count(),
    prisma.chapter.count(),
    prisma.track.count(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-1 font-serif font-semibold">Tableau de bord</h1>
        <p className="text-moon-400">Vue d'ensemble de votre plateforme Noctalys</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Fictions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-moon-900 border-moon-700 flex h-12 w-12 items-center justify-center rounded-lg border">
                <span className="text-2xl">📖</span>
              </div>
              <div className="flex flex-col gap-1">
                <CardDescription>Total Fictions</CardDescription>
                <CardTitle className="text-3xl">{fictionsCount}</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chapitres */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-moon-900 border-moon-700 flex h-12 w-12 items-center justify-center rounded-lg border">
                <span className="text-2xl">📝</span>
              </div>
              <div className="flex flex-col gap-1">
                <CardDescription>Total Chapitres</CardDescription>
                <CardTitle className="text-3xl">{chaptersCount}</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Musiques */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-moon-900 border-moon-700 flex h-12 w-12 items-center justify-center rounded-lg border">
                <span className="text-2xl">🎵</span>
              </div>
              <div className="flex flex-col gap-1">
                <CardDescription>Total Musiques</CardDescription>
                <CardTitle className="text-3xl">{tracksCount}</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="flex flex-col gap-4">
        <h2 className="text-moon-100 font-serif text-xl font-semibold">Actions rapides</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/fictions/new">
            <Card className="hover:border-electric-blue/50 hover:shadow-glow-sm h-full cursor-pointer transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-moon-900 border-moon-700 flex h-10 w-10 items-center justify-center rounded-lg border">
                    <span className="text-xl">📖</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg">Créer une fiction</CardTitle>
                    <CardDescription>Commencer une nouvelle histoire</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/fictions">
            <Card className="hover:border-electric-blue/50 hover:shadow-glow-sm h-full cursor-pointer transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-moon-900 border-moon-700 flex h-10 w-10 items-center justify-center rounded-lg border">
                    <span className="text-xl">📚</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg">Gérer les fictions</CardTitle>
                    <CardDescription>Éditer et publier vos histoires</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/music">
            <Card className="hover:border-electric-blue/50 hover:shadow-glow-sm h-full cursor-pointer transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-moon-900 border-moon-700 flex h-10 w-10 items-center justify-center rounded-lg border">
                    <span className="text-xl">🎵</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg">Gérer les musiques</CardTitle>
                    <CardDescription>Uploader et éditer vos morceaux</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Activité récente */}
      <div className="flex flex-col gap-4">
        <h2 className="text-moon-100 font-serif text-xl font-semibold">Activité récente</h2>
        <Card>
          <CardContent className="py-6">
            <p className="text-moon-400 text-center">Aucune activité récente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
