import Stripe from "stripe";

// Initialisation de Stripe uniquement si la clé est présente
// Cela permet le build même sans les variables d'environnement
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-11-17.clover",
      typescript: true,
    })
  : null;

export const STRIPE_CONFIG = {
  currency: "eur",
  defaultChapterPrice: 299, // 2.99€ en centimes
} as const;

export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not initialized. Make sure STRIPE_SECRET_KEY is set in environment variables."
    );
  }
  return stripe;
}
