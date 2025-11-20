"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui";
import { toast } from "sonner";

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Fiction {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string | null;
  genre: string;
  status: string;
  publishedAt: string | null;
  chapters: Chapter[];
}

interface FictionDetailPageProps {
  params: Promise<{
    fictionId: string;
  }>;
}

export default function FictionDetailPage({ params }: FictionDetailPageProps) {
  const router = useRouter();
  const { fictionId } = use(params);
  const [fiction, setFiction] = useState<Fiction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingChapterId, setDeletingChapterId] = useState<string | null>(null);

  useEffect(() => {
    fetchFiction();
  }, [fictionId]);

  const fetchFiction = async () => {
    try {
      const res = await fetch(`/api/admin/fictions/${fictionId}`);
      if (!res.ok) {
        toast.error("Fiction introuvable");
        router.push("/admin/fictions");
        return;
      }
      const data = await res.json();
      setFiction(data);
    } catch (error) {
      console.error("Error fetching fiction:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    try {
      const res = await fetch(`/api/admin/chapters?id=${chapterId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Erreur lors de la suppression");
        return;
      }

      toast.success("Chapitre supprimé");
      setDeletingChapterId(null);
      fetchFiction(); // Refresh
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (isLoading || !fiction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-moon-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <Link href="/admin/fictions" className="text-moon-400 hover:text-moon-200">
          ← Retour aux fictions
        </Link>
      </div>

      {/* Fiction Info Card */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Cover Image */}
            {fiction.coverImage && (
              <div className="flex-shrink-0">
                <div className="border-moon-700 relative aspect-[3/4] w-40 overflow-hidden rounded-lg border">
                  <Image
                    src={fiction.coverImage}
                    alt={`Couverture de ${fiction.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-heading-1 font-serif font-semibold">{fiction.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">{fiction.genre}</Badge>
                  <Badge variant={fiction.status === "PUBLISHED" ? "success" : "default"}>
                    {fiction.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </Badge>
                  <span className="text-moon-500 text-sm">
                    {fiction.chapters.length} chapitre{fiction.chapters.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <p className="text-moon-300 leading-relaxed">{fiction.summary}</p>

              <div className="flex gap-3">
                <Link href={`/admin/fictions/${fiction.id}/edit`}>
                  <Button variant="secondary">Éditer la fiction</Button>
                </Link>
                {fiction.status === "PUBLISHED" && (
                  <Link
                    href={`/fictions/${fiction.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost">Voir sur le site</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapters Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-moon-100 font-serif text-2xl font-semibold">Chapitres</h2>
        <Link href={`/admin/fictions/${fiction.id}/chapters/new`}>
          <Button>+ Nouveau chapitre</Button>
        </Link>
      </div>

      {/* Chapters List */}
      {fiction.chapters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-moon-400 mb-4">Aucun chapitre pour le moment.</p>
            <Link href={`/admin/fictions/${fiction.id}/chapters/new`}>
              <Button>Créer le premier chapitre</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-moon-900 border-moon-700 border-b">
                  <tr>
                    <th className="text-moon-200 w-24 px-6 py-4 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="text-moon-200 px-6 py-4 text-left text-sm font-semibold">
                      Titre
                    </th>
                    <th className="text-moon-200 px-6 py-4 text-left text-sm font-semibold">
                      Statut
                    </th>
                    <th className="text-moon-200 px-6 py-4 text-left text-sm font-semibold">
                      Mis à jour
                    </th>
                    <th className="text-moon-200 px-6 py-4 text-right text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fiction.chapters.map((chapter) => (
                    <tr
                      key={chapter.id}
                      className="border-moon-800 hover:bg-moon-900/50 border-b transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Badge variant="default" className="text-xs">
                          {chapter.chapterNumber}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/fictions/${fiction.id}/chapters/${chapter.id}/edit`}
                          className="text-moon-100 hover:text-accent-primary font-medium transition-colors"
                        >
                          {chapter.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={chapter.publishedAt ? "success" : "default"}>
                          {chapter.publishedAt ? "Publié" : "Brouillon"}
                        </Badge>
                      </td>
                      <td className="text-moon-400 px-6 py-4 text-sm">
                        {new Date(chapter.updatedAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/fictions/${fiction.id}/chapters/${chapter.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </Button>
                          </Link>
                          {chapter.publishedAt && (
                            <Link
                              href={`/fictions/${fiction.slug}/${chapter.chapterNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="sm">
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingChapterId(chapter.id)}
                            className="text-status-error hover:text-status-error"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingChapterId} onOpenChange={() => setDeletingChapterId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce chapitre ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeletingChapterId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingChapterId && handleDeleteChapter(deletingChapterId)}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
