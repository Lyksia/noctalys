import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET n'est pas défini");
    return NextResponse.json({ error: "Configuration incorrecte" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    // Vérifier la signature du webhook
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Erreur de vérification de signature webhook:", errorMessage);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Gérer les événements Stripe
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent);
        break;
      }

      default:
        console.log(`Event non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return NextResponse.json({ error: "Erreur lors du traitement du webhook" }, { status: 500 });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log("✅ Payment Intent succeeded:", paymentIntent.id);

  try {
    // Vérifier si l'entrée existe déjà
    const existingPurchase = await prisma.chapterPurchase.findUnique({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    if (!existingPurchase) {
      // Si l'entrée n'existe pas, la créer à partir des métadonnées
      const { userId, chapterId } = paymentIntent.metadata;

      if (!userId || !chapterId) {
        console.error("❌ Métadonnées manquantes dans Payment Intent:", paymentIntent.id);
        return;
      }

      await prisma.chapterPurchase.create({
        data: {
          userId,
          chapterId,
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: "succeeded",
          purchasedAt: new Date(),
        },
      });

      console.log(`✅ Achat créé et confirmé pour userId: ${userId}, chapterId: ${chapterId}`);
    } else {
      // Mettre à jour l'entrée existante
      await prisma.chapterPurchase.update({
        where: {
          stripePaymentIntentId: paymentIntent.id,
        },
        data: {
          status: "succeeded",
          purchasedAt: new Date(),
        },
      });

      console.log(`✅ Achat mis à jour pour Payment Intent: ${paymentIntent.id}`);
    }

    // TODO: Envoyer un email de confirmation (optionnel)
    // TODO: Invalider les caches React Query si nécessaire
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'achat:", error);
    throw error;
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log("❌ Payment Intent failed:", paymentIntent.id);

  try {
    // Mettre à jour le ChapterPurchase avec le statut failed
    await prisma.chapterPurchase.update({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      data: {
        status: "failed",
      },
    });

    console.log(`❌ Paiement échoué pour Payment Intent: ${paymentIntent.id}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'échec:", error);
    // Ne pas throw ici, on veut quand même retourner 200 à Stripe
  }
}
