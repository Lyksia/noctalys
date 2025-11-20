import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "./card";
import { Badge } from "./badge";
import { cn } from "@/utils";

interface FictionCardProps {
  fiction: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    coverImage?: string;
    genre?: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishedAt?: Date | string;
    _count?: {
      chapters: number;
    };
  };
  className?: string;
}

const statusVariant = {
  DRAFT: "warning" as const,
  PUBLISHED: "success" as const,
  ARCHIVED: "destructive" as const,
};

const statusLabel = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publié",
  ARCHIVED: "Archivé",
};

export function CardFiction({ fiction, className }: FictionCardProps) {
  const chaptersCount = fiction._count?.chapters ?? 0;
  const publishedDate = fiction.publishedAt
    ? new Date(fiction.publishedAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link href={`/fictions/${fiction.slug}`} className="group">
      <Card className={cn("h-full transition-all duration-400", className)}>
        {/* Image de couverture */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
          {fiction.coverImage ? (
            <Image
              src={fiction.coverImage}
              alt={`Couverture de ${fiction.title}`}
              fill
              className="object-cover transition-transform duration-400 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="from-moon-700 to-moon-900 absolute inset-0 flex items-center justify-center bg-gradient-to-br">
              <span className="text-6xl opacity-30">📖</span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <CardHeader>
          <div className="flex flex-col gap-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{fiction.genre}</Badge>
              <Badge variant={statusVariant[fiction.status]}>{statusLabel[fiction.status]}</Badge>
            </div>

            {/* Titre */}
            <h3 className="text-moon-100 group-hover:text-accent-primary line-clamp-2 font-serif text-xl font-semibold transition-colors">
              {fiction.title}
            </h3>

            {/* Résumé */}
            <p className="text-moon-300 line-clamp-3 text-sm leading-relaxed">{fiction.summary}</p>
          </div>
        </CardHeader>

        {/* Footer avec métadonnées */}
        <CardContent>
          <div className="text-moon-400 flex items-center justify-between font-mono text-xs">
            <span>
              {chaptersCount} {chaptersCount > 1 ? "chapitres" : "chapitre"}
            </span>
            {publishedDate && <span>{publishedDate}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
