import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/fictions/[id]
 * Récupérer une fiction par son ID avec tous ses chapitres
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const fiction = await prisma.fiction.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { chapterNumber: "asc" },
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!fiction) {
      return NextResponse.json({ error: "Fiction introuvable" }, { status: 404 });
    }

    return NextResponse.json(fiction);
  } catch (error) {
    console.error("Error fetching fiction:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la fiction" },
      { status: 500 }
    );
  }
}
