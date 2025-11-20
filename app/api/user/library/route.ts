import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 },
      );
    }

    // Récupérer tous les chapitres achetés par l'utilisateur
    const purchases = await prisma.chapterPurchase.findMany({
      where: {
        userId: session.user.id,
        status: "succeeded",
      },
      include: {
        chapter: {
          include: {
            fiction: {
              select: {
                id: true,
                slug: true,
                title: true,
                coverImage: true,
                genre: true,
              },
            },
          },
        },
      },
      orderBy: {
        purchasedAt: "desc",
      },
    });

    // Formater les données pour le frontend
    const library = purchases.map((purchase) => ({
      purchaseId: purchase.id,
      purchasedAt: purchase.purchasedAt,
      amount: purchase.amount,
      chapter: {
        id: purchase.chapter.id,
        chapterNumber: purchase.chapter.chapterNumber,
        title: purchase.chapter.title,
        publishedAt: purchase.chapter.publishedAt,
      },
      fiction: {
        id: purchase.chapter.fiction.id,
        slug: purchase.chapter.fiction.slug,
        title: purchase.chapter.fiction.title,
        coverImage: purchase.chapter.fiction.coverImage,
        genre: purchase.chapter.fiction.genre,
      },
    }));

    return NextResponse.json({ library });
  } catch (error) {
    console.error("Erreur lors de la récupération de la bibliothèque:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la bibliothèque" },
      { status: 500 },
    );
  }
}
