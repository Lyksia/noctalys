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
      // Si l'achat est déjà réussi
      if (existingPurchase.status === "succeeded") {
        return NextResponse.json({ error: "Vous possédez déjà ce chapitre" }, { status: 400 });
      }

      // Si un achat est en cours (pending), récupérer le Payment Intent existant
      if (existingPurchase.status === "pending") {
        const stripe = getStripe();
        try {
          const existingPaymentIntent = await stripe.paymentIntents.retrieve(
            existingPurchase.stripePaymentIntentId
          );

          // Si le Payment Intent est toujours valide, le retourner
          if (
            existingPaymentIntent.status === "requires_payment_method" ||
            existingPaymentIntent.status === "requires_confirmation"
          ) {
            return NextResponse.json({
              clientSecret: existingPaymentIntent.client_secret,
              amount: existingPurchase.amount,
            });
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du Payment Intent:", error);
        }

        // Si le Payment Intent n'est plus valide, supprimer l'ancien et créer un nouveau
        await prisma.chapterPurchase.delete({
          where: {
            userId_chapterId: {
              userId: session.user.id,
              chapterId: chapterId,
            },
          },
        });
      }

      // Si l'achat a échoué, supprimer l'ancien et créer un nouveau
      if (existingPurchase.status === "failed") {
        await prisma.chapterPurchase.delete({
          where: {
            userId_chapterId: {
              userId: session.user.id,
              chapterId: chapterId,
            },
          },
        });
      }
    }

    // Créer un nouveau Payment Intent Stripe
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

    // Créer ou mettre à jour l'entrée de purchase en pending
    // Utiliser upsert pour éviter les race conditions avec le webhook
    await prisma.chapterPurchase.upsert({
      where: {
        userId_chapterId: {
          userId: session.user.id,
          chapterId: chapterId,
        },
      },
      update: {
        stripePaymentIntentId: paymentIntent.id,
        amount: chapter.price,
        status: "pending",
      },
      create: {
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
