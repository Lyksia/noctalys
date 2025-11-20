"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/ui";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface StripeCheckoutModalProps {
  chapterId: string;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function StripeCheckoutModal({
  chapterId,
  amount,
  onClose,
  onSuccess,
}: StripeCheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Créer le Payment Intent
    const createPaymentIntent = async () => {
      try {
        const res = await fetch(`/api/purchase/chapters/${chapterId}`, {
          method: "POST",
        });

        if (!res.ok) {
          const error = await res.json();
          toast.error(error.error || "Erreur lors de la création du paiement");
          onClose();
          return;
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast.error("Erreur lors de la création du paiement");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [chapterId, onClose]);

  if (isLoading || !clientSecret) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Préparation du paiement</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="border-electric-blue h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            <p className="text-moon-400">Préparation du paiement...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paiement sécurisé</DialogTitle>
        </DialogHeader>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#00D5FF",
                colorBackground: "#0F1420",
                colorText: "#E2E8F0",
                colorDanger: "#ef4444",
                borderRadius: "8px",
              },
            },
          }}
        >
          <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onClose} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Erreur lors du paiement");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast.success("Paiement réussi ! Vous pouvez maintenant lire ce chapitre.");
        onSuccess();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erreur lors du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  const formattedAmount = (amount / 100).toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Amount - Compact */}
      <div className="border-moon-800 bg-moon-900/50 flex items-center justify-between rounded-lg border px-4 py-3">
        <span className="text-moon-400 text-sm">Montant</span>
        <span className="text-electric-blue text-xl font-bold">{formattedAmount} €</span>
      </div>

      {/* Payment Element */}
      <PaymentElement />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing} className="flex-1">
          {isProcessing ? "Traitement..." : "Payer"}
        </Button>
      </div>

      {/* Security Info */}
      <p className="text-moon-500 -mt-2 text-center text-xs">
        <svg className="mr-1 inline h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Paiement sécurisé par Stripe
      </p>
    </form>
  );
}
