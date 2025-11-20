"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  FileUpload,
} from "@/ui";
import { fictionUpdateSchema } from "@/lib/validations/fiction";
import { toast } from "sonner";

const GENRES = [
  { value: "FANTASTIQUE", label: "Fantastique" },
  { value: "SCIENCE_FICTION", label: "Science-Fiction" },
  { value: "HORREUR", label: "Horreur" },
  { value: "THRILLER", label: "Thriller" },
  { value: "MYSTERE", label: "Mystère" },
  { value: "ROMANCE", label: "Romance" },
  { value: "AVENTURE", label: "Aventure" },
  { value: "DYSTOPIE", label: "Dystopie" },
  { value: "AUTRE", label: "Autre" },
];

interface EditFictionPageProps {
  params: Promise<{
    fictionId: string;
  }>;
}

interface Fiction {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string | null;
  genre: string;
  status: "DRAFT" | "PUBLISHED";
}

export default function EditFictionPage({ params }: EditFictionPageProps) {
  const router = useRouter();
  const { fictionId } = use(params);
  const [fiction, setFiction] = useState<Fiction | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [genre, setGenre] = useState("FANTASTIQUE");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFiction = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/fictions/${fictionId}`);
      if (!res.ok) {
        toast.error("Fiction introuvable");
        router.push("/admin/fictions");
        return;
      }
      const data = await res.json();
      setFiction(data);
      setTitle(data.title);
      setSlug(data.slug);
      setSummary(data.summary);
      setCoverImage(data.coverImage || "");
      setGenre(data.genre);
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching fiction:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setIsFetching(false);
    }
  }, [fictionId, router]);

  useEffect(() => {
    fetchFiction();
  }, [fetchFiction]);

  const handleUpdate = async (publish?: boolean) => {
    try {
      setIsLoading(true);

      const validatedData = fictionUpdateSchema.parse({
        title,
        slug,
        summary,
        coverImage: coverImage || null,
        genre,
        status: publish !== undefined ? (publish ? "PUBLISHED" : "DRAFT") : status,
      });

      const res = await fetch(`/api/admin/fictions?id=${fictionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) {
        const error = await res.json();
        if (typeof error.error === "string") {
          toast.error(error.error);
        } else {
          toast.error("Erreur lors de la mise à jour");
        }
        return;
      }

      toast.success("Fiction mise à jour");
      router.push(`/admin/fictions/${fictionId}`);
    } catch (error) {
      console.error("Error updating fiction:", error);
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const res = await fetch(`/api/admin/fictions?id=${fictionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Erreur lors de la suppression");
        return;
      }

      toast.success("Fiction supprimée");
      router.push("/admin/fictions");
    } catch (error) {
      console.error("Error deleting fiction:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isFetching || !fiction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-moon-400">Chargement...</p>
      </div>
    );
  }

  const isPublished = status === "PUBLISHED";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-1 font-serif font-semibold">Éditer la fiction</h1>
        <p className="text-moon-400">{fiction.title}</p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-moon-900 border-moon-700"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">
                Slug *
                <span className="text-moon-500 ml-2 text-xs">
                  (URL : /fictions/{slug || "mon-slug"})
                </span>
              </Label>
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-moon-900 border-moon-700"
              />
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="summary">
                Résumé *
                <span className="text-moon-500 ml-2 text-xs">
                  ({summary.length}/500 caractères)
                </span>
              </Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={5}
                maxLength={500}
                className="bg-moon-900 border-moon-700"
              />
            </div>

            {/* Genre */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="genre">Genre *</Label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="border-moon-700 bg-moon-900 text-moon-100 focus:ring-accent-glow/20 flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              >
                {GENRES.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div className="flex flex-col gap-2">
              <Label>Couverture (optionnel)</Label>
              <FileUpload
                type="image"
                onUploadComplete={(url) => setCoverImage(url)}
                buttonText="Uploader une couverture"
                currentUrl={coverImage}
              />
              <div className="text-moon-500 text-xs">Ou saisir une URL directement :</div>
              <Input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://exemple.com/image.jpg"
                className="bg-moon-900 border-moon-700"
              />
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
                    onClick={() => handleUpdate(false)}
                    disabled={isLoading}
                  >
                    Dépublier
                  </Button>
                )}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleUpdate()}
                  disabled={isLoading || !title || !slug || !summary}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>

                {!isPublished && (
                  <Button
                    type="button"
                    onClick={() => handleUpdate(true)}
                    disabled={isLoading || !title || !slug || !summary}
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
              Êtes-vous sûr de vouloir supprimer cette fiction et tous ses chapitres ? Cette action
              est irréversible.
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
