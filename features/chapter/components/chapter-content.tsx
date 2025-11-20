"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Markdown } from "@/lib/markdown";
import { PaywallCard } from "./paywall-card";

interface ChapterContentProps {
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
    content: string;
    isFree: boolean;
    price: number | null;
  };
  fiction: {
    title: string;
    slug: string;
  };
  canAccess: boolean;
  isAuthenticated: boolean;
}

export function ChapterContent({
  chapter,
  fiction,
  canAccess,
  isAuthenticated,
}: ChapterContentProps) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(canAccess);

  // Si le chapitre est gratuit ou si l'utilisateur y a accès, afficher le contenu complet
  if (chapter.isFree || hasAccess) {
    return (
      <div className="prose-reading">
        <Markdown>{chapter.content}</Markdown>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher un aperçu et un CTA de connexion
  if (!isAuthenticated) {
    const preview = chapter.content.substring(0, 500) + "...";

    return (
      <div className="flex flex-col gap-8">
        {/* Preview */}
        <div className="prose-reading relative">
          <Markdown>{preview}</Markdown>
          <div className="from-moon-950 pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t" />
        </div>

        {/* Login CTA */}
        <div className="border-electric-blue/30 bg-moon-900/50 rounded-lg border p-8 text-center backdrop-blur-sm">
          <h3 className="mb-4 font-serif text-heading-3 font-semibold">
            Connectez-vous pour continuer
          </h3>
          <p className="text-moon-400 mb-6">
            Créez un compte gratuit pour acheter ce chapitre et accéder à votre
            bibliothèque
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() =>
                router.push(
                  `/auth/login?redirect=/fictions/${fiction.slug}/${chapter.chapterNumber}`,
                )
              }
              className="rounded-lg bg-moon-800 px-6 py-3 font-medium transition-colors hover:bg-moon-700"
            >
              Se connecter
            </button>
            <button
              onClick={() =>
                router.push(
                  `/auth/signup?redirect=/fictions/${fiction.slug}/${chapter.chapterNumber}`,
                )
              }
              className="rounded-lg bg-electric-blue px-6 py-3 font-medium text-dark-navy transition-colors hover:bg-electric-blue/90"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est connecté mais n'a pas acheté le chapitre, afficher le paywall
  if (!chapter.isFree && chapter.price) {
    const preview = chapter.content.substring(0, 500) + "...";

    return (
      <div className="flex flex-col gap-8">
        {/* Preview */}
        <div className="prose-reading relative">
          <Markdown>{preview}</Markdown>
          <div className="from-moon-950 pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t" />
        </div>

        {/* Paywall */}
        <PaywallCard
          chapter={{
            id: chapter.id,
            title: chapter.title,
            chapterNumber: chapter.chapterNumber,
            price: chapter.price,
          }}
          fiction={{ title: fiction.title }}
          onPurchaseSuccess={() => {
            setHasAccess(true);
            router.refresh();
          }}
        />
      </div>
    );
  }

  // Fallback: chapitre non accessible
  return (
    <div className="border-moon-800 rounded-lg border bg-moon-900/50 p-8 text-center">
      <p className="text-moon-400">
        Ce chapitre n&apos;est pas accessible.
      </p>
    </div>
  );
}
