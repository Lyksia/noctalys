import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les statistiques
    const [
      fictionsCount,
      chaptersCount,
      tracksCount,
      publishedFictionsCount,
      publishedChaptersCount,
    ] = await Promise.all([
      prisma.fiction.count(),
      prisma.chapter.count(),
      prisma.track.count(),
      prisma.fiction.count({ where: { status: "PUBLISHED" } }),
      prisma.chapter.count({ where: { publishedAt: { not: null } } }),
    ]);

    const stats = {
      fictionsCount,
      chaptersCount,
      tracksCount,
      publishedFictionsCount,
      publishedChaptersCount,
      draftsCount: fictionsCount - publishedFictionsCount,
    };

    return NextResponse.json(stats, {
      headers: {
        // Cache pendant 5 minutes
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
