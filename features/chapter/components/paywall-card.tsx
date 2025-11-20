"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@/ui";
import { StripeCheckoutModal } from "@/features/payment/components/stripe-checkout-modal";

interface PaywallCardProps {
  chapter: {
    id: string;
    title: string;
    chapterNumber: number;
    price: number; // Prix en centimes
  };
  fiction: {
    title: string;
  };
  onPurchaseSuccess?: () => void;
}

export function PaywallCard({
  chapter,
  fiction,
  onPurchaseSuccess,
}: PaywallCardProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  const formattedPrice = (chapter.price / 100).toFixed(2);

  return (
    <>
      <Card className="border-electric-blue/30 bg-moon-900/50 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-6 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-electric-blue/10">
            <svg
              className="h-8 w-8 text-electric-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-heading-3 font-semibold">
              Contenu Premium
            </h3>
            <p className="text-moon-400">
              Achetez ce chapitre pour continuer la lecture
            </p>
          </div>

          {/* Chapter Info */}
          <div className="border-moon-800 rounded-lg border bg-moon-900/50 p-4">
            <p className="text-moon-400 text-sm">{fiction.title}</p>
            <p className="mt-1 font-medium">
              Chapitre {chapter.chapterNumber} : {chapter.title}
            </p>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-heading-1 font-bold text-electric-blue">
                {formattedPrice}
              </span>
              <span className="text-moon-400 text-lg">€</span>
            </div>
            <p className="text-moon-500 text-xs">
              Accès permanent • Paiement unique
            </p>
          </div>

          {/* CTA */}
          <Button
            onClick={() => setShowCheckout(true)}
            size="lg"
            className="w-full"
          >
            Acheter ce chapitre
          </Button>

          {/* Info */}
          <p className="text-moon-500 text-xs">
            Le chapitre 1 de chaque fiction est toujours gratuit
          </p>
        </CardContent>
      </Card>

      {/* Stripe Checkout Modal */}
      {showCheckout && (
        <StripeCheckoutModal
          chapterId={chapter.id}
          amount={chapter.price}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            onPurchaseSuccess?.();
          }}
        />
      )}
    </>
  );
}
