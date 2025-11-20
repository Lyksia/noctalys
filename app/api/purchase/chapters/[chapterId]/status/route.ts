import { auth } from "@/lib/auth";
import { canAccessChapter } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  try {
    const { chapterId } = await params;

    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id || null;

    // Récupérer le chapitre
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        isFree: true,
        price: true,
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: "Chapitre introuvable" },
        { status: 404 },
      );
    }

    // Vérifier si l'utilisateur peut accéder au chapitre
    const canAccess = await canAccessChapter(userId, chapterId);

    return NextResponse.json({
      isFree: chapter.isFree,
      isPurchased: canAccess && !chapter.isFree,
      canAccess,
      price: chapter.price,
    });
  } catch (error) {
    console.error("Error checking chapter status:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification du statut" },
      { status: 500 },
    );
  }
}
