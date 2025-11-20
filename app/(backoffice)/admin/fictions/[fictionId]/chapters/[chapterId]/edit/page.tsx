"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  TipTapEditor,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui";
import { useAutoSave } from "@/lib/use-auto-save";
import { chapterUpdateSchema } from "@/lib/validations/chapter";
import { toast } from "sonner";

interface EditChapterPageProps {
  params: Promise<{
    fictionId: string;
    chapterId: string;
  }>;
}

export default function EditChapterPage({ params }: EditChapterPageProps) {
  const router = useRouter();
  const { fictionId, chapterId } = use(params);
  const [fiction, setFiction] = useState<{ id: string; title: string } | null>(null);
  const [chapter, setChapter] = useState<{
    id: string;
    title: string;
    content: string;
    chapterNumber: number;
    publishedAt: Date | null;
    isFree: boolean;
    price: number | null;
  } | null>(null);
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState<number>(2.99); // Prix en euros
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch chapter and fiction data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fiction
        const fictionRes = await fetch(`/api/admin/fictions/${fictionId}`);
        if (!fictionRes.ok) {
          toast.error("Fiction introuvable");
          router.push("/admin/fictions");
          return;
        }
        const fictionData = await fictionRes.json();
        setFiction(fictionData);

        // Fetch chapter
        const chapterRes = await fetch(`/api/admin/chapters?fictionId=${fictionId}`);
        if (!chapterRes.ok) {
          toast.error("Erreur lors du chargement du chapitre");
          router.push(`/admin/fictions/${fictionId}`);
          return;
        }
        const chapters = await chapterRes.json();
        const currentChapter = chapters.find((ch: { id: string }) => ch.id === chapterId);

        if (!currentChapter) {
          toast.error("Chapitre introuvable");
          router.push(`/admin/fictions/${fictionId}`);
          return;
        }

        // Get full chapter content
        const fullChapterRes = await fetch(
          `/api/chapters/${fictionData.slug}/${currentChapter.chapterNumber}`
        );
        if (fullChapterRes.ok) {
          const { chapter: fullChapter } = await fullChapterRes.json();
          setChapter(fullChapter);
          setChapterNumber(fullChapter.chapterNumber);
          setTitle(fullChapter.title);
          setContent(fullChapter.content);
          // Convertir le prix de centimes en euros
          setPrice(fullChapter.price ? fullChapter.price / 100 : 2.99);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [fictionId, chapterId, router]);

  // Auto-save
  const { isSaving, lastSaved, timeSinceLastSave } = useAutoSave({
    onSave: async () => {
      if (!chapter) return;

      try {
        const isFree = chapterNumber === 1;
        const priceInCents = isFree ? null : Math.round(price * 100);

        const validatedData = chapterUpdateSchema.parse({
          chapterNumber,
          title,
          content,
        });

        const res = await fetch(`/api/admin/chapters?id=${chapterId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...validatedData,
            isFree,
            price: priceInCents,
          }),
        });

        if (!res.ok) {
          throw new Error("Auto-save failed");
        }
      } catch (error) {
        console.error("Auto-save error:", error);
      }
    },
    delay: 10000, // 10 seconds
    enabled: !!(chapter && (title !== chapter.title || content !== chapter.content)),
  });

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const isFree = chapterNumber === 1;
      const priceInCents = isFree ? null : Math.round(price * 100);

      const validatedData = chapterUpdateSchema.parse({
        chapterNumber,
        title,
        content,
      });

      const res = await fetch(`/api/admin/chapters?id=${chapterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validatedData,
          isFree,
          price: priceInCents,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erreur lors de la mise à jour");
        return;
      }

      toast.success("Chapitre mis à jour");
      router.push(`/admin/fictions/${fictionId}`);
    } catch (error) {
      console.error("Error updating:", error);
      if (error instanceof Error && "errors" in error) {
        const zodError = error as { errors: Array<{ message: string }> };
        zodError.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Erreur lors de la mise à jour");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);

      const isFree = chapterNumber === 1;
      const priceInCents = isFree ? null : Math.round(price * 100);

      // First update the chapter
      const validatedData = chapterUpdateSchema.parse({
        chapterNumber,
        title,
        content,
      });

      const updateRes = await fetch(`/api/admin/chapters?id=${chapterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validatedData,
          isFree,
          price: priceInCents,
        }),
      });

      if (!updateRes.ok) {
        toast.error("Erreur lors de la mise à jour");
        return;
      }

      // Then publish
      const publishRes = await fetch(`/api/admin/chapters/${chapterId}/publish`, {
        method: "POST",
      });

      if (!publishRes.ok) {
        toast.error("Erreur lors de la publication");
        return;
      }

      toast.success("Chapitre publié");
      router.push(`/admin/fictions/${fictionId}`);
    } catch (error) {
      console.error("Error publishing:", error);
      if (error instanceof Error && "errors" in error) {
        const zodError = error as { errors: Array<{ message: string }> };
        zodError.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Erreur lors de la publication");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/admin/chapters/${chapterId}/publish`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Erreur lors de la dépublication");
        return;
      }

      toast.success("Chapitre dépublié");
      if (chapter) {
        setChapter({ ...chapter, publishedAt: null });
      }
    } catch (error) {
      console.error("Error unpublishing:", error);
      toast.error("Erreur lors de la dépublication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const res = await fetch(`/api/admin/chapters?id=${chapterId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Erreur lors de la suppression");
        return;
      }

      toast.success("Chapitre supprimé");
      router.push(`/admin/fictions/${fictionId}`);
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isFetching || !fiction || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-moon-400">Chargement...</p>
      </div>
    );
  }

  const isPublished = !!chapter.publishedAt;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-1 font-serif font-semibold">Éditer le chapitre</h1>
        <p className="text-moon-400">Fiction : {fiction.title}</p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-6">
            {/* Chapter Number, Title and Price */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="chapterNumber">Numéro</Label>
                <Input
                  id="chapterNumber"
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(parseInt(e.target.value, 10))}
                  min={1}
                  className="bg-moon-900 border-moon-700"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-4">
                <Label htmlFor="title">Titre du chapitre</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-moon-900 border-moon-700"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="price">
                  Prix (€)
                  {chapterNumber === 1 && (
                    <span className="ml-2 text-xs text-green-500">Gratuit</span>
                  )}
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={chapterNumber === 1 ? 0 : price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  min={0}
                  step={0.01}
                  disabled={chapterNumber === 1}
                  className="bg-moon-900 border-moon-700 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Contenu</Label>
                {lastSaved && (
                  <span className="text-moon-500 text-xs">
                    {isSaving ? "Sauvegarde automatique..." : `Sauvegardé ${timeSinceLastSave}`}
                  </span>
                )}
              </div>

              <TipTapEditor content={content} onChange={setContent} />
            </div>

            {/* Actions */}
            <div className="border-moon-700 flex items-center justify-between border-t pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
              >
                Supprimer
              </Button>

              <div className="flex gap-3">
                {isPublished && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleUnpublish}
                    disabled={isLoading}
                  >
                    Dépublier
                  </Button>
                )}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleUpdate}
                  disabled={isLoading || !title || !content}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>

                {!isPublished && (
                  <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={isLoading || !title || !content}
                  >
                    {isLoading ? "Publication..." : "Publier"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce chapitre ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
