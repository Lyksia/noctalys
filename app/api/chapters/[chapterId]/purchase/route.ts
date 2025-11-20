import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;

    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer le chapitre
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        fiction: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapitre introuvable" }, { status: 404 });
    }

    // Vérifier que le chapitre n'est pas gratuit
    if (chapter.isFree) {
      return NextResponse.json({ error: "Ce chapitre est gratuit" }, { status: 400 });
    }

    // Vérifier que le chapitre a un prix
    if (!chapter.price) {
      return NextResponse.json({ error: "Ce chapitre n'a pas de prix défini" }, { status: 400 });
    }

    // Vérifier si l'utilisateur a déjà acheté ce chapitre
    const existingPurchase = await prisma.chapterPurchase.findUnique({
      where: {
        userId_chapterId: {
          userId: session.user.id,
          chapterId: chapterId,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: "Vous possédez déjà ce chapitre" }, { status: 400 });
    }

    // Créer un Payment Intent Stripe
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: chapter.price,
      currency: "eur",
      metadata: {
        userId: session.user.id,
        chapterId: chapterId,
        chapterTitle: chapter.title,
        fictionTitle: chapter.fiction.title,
      },
      description: `Achat: ${chapter.fiction.title} - ${chapter.title}`,
    });

    // Créer l'entrée de purchase en pending
    await prisma.chapterPurchase.create({
      data: {
        userId: session.user.id,
        chapterId: chapterId,
        stripePaymentIntentId: paymentIntent.id,
        amount: chapter.price,
        currency: "eur",
        status: "pending",
      },
    });

    // Retourner le client secret au frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: chapter.price,
    });
  } catch (error) {
    console.error("Erreur lors de la création du Payment Intent:", error);
    return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 });
  }
}
