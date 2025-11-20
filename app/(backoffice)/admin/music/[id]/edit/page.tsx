"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Label,
  FileUpload,
} from "@/ui";
import { toast } from "sonner";
import { slugify } from "@/lib/validations/track";

interface Track {
  id: string;
  slug: string;
  title: string;
  audioUrl: string;
  coverImage: string | null;
  duration: number;
  publishedAt: string | null;
}

interface EditMusicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditMusicPage({ params }: EditMusicPageProps) {
  const router = useRouter();
  const { id: trackId } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    audioUrl: "",
    coverImage: "",
    duration: "",
    isPublished: false,
  });

  useEffect(() => {
    fetchTrack();
  }, [trackId]);

  const fetchTrack = async () => {
    try {
      const res = await fetch("/api/admin/music");
      if (!res.ok) {
        toast.error("Erreur lors du chargement");
        router.push("/admin/music");
        return;
      }
      const tracks: Track[] = await res.json();
      const track = tracks.find((t) => t.id === trackId);

      if (!track) {
        toast.error("Morceau non trouvé");
        router.push("/admin/music");
        return;
      }

      setFormData({
        title: track.title,
        slug: track.slug,
        audioUrl: track.audioUrl,
        coverImage: track.coverImage || "",
        duration: track.duration.toString(),
        isPublished: track.publishedAt !== null,
      });
    } catch (error) {
      console.error("Error fetching track:", error);
      toast.error("Erreur lors du chargement");
      router.push("/admin/music");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation basique côté client
      if (!formData.title.trim()) {
        toast.error("Le titre est requis");
        setIsSubmitting(false);
        return;
      }

      if (!formData.audioUrl.trim()) {
        toast.error("L'URL audio est requise");
        setIsSubmitting(false);
        return;
      }

      if (!formData.duration || parseFloat(formData.duration) <= 0) {
        toast.error("La durée doit être supérieure à 0");
        setIsSubmitting(false);
        return;
      }

      // Préparer les données
      const data = {
        id: trackId,
        title: formData.title.trim(),
        slug: formData.slug || slugify(formData.title),
        audioUrl: formData.audioUrl.trim(),
        coverImage: formData.coverImage.trim() || null,
        duration: Math.floor(parseFloat(formData.duration)),
        publishedAt: formData.isPublished ? new Date().toISOString() : null,
      };

      const res = await fetch("/api/admin/music", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erreur lors de la mise à jour");
        setIsSubmitting(false);
        return;
      }

      toast.success("Morceau mis à jour avec succès");
      router.push("/admin/music");
    } catch (error) {
      console.error("Error updating track:", error);
      toast.error("Erreur lors de la mise à jour");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer "${formData.title}" ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch("/api/admin/music", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trackId }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erreur lors de la suppression");
        setIsDeleting(false);
        return;
      }

      toast.success("Morceau supprimé avec succès");
      router.push("/admin/music");
    } catch (error) {
      console.error("Error deleting track:", error);
      toast.error("Erreur lors de la suppression");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-moon-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-1 font-serif font-semibold">Éditer la musique</h1>
        <p className="text-moon-400">Modifier les informations du morceau</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations du morceau</CardTitle>
                <CardDescription>Modifiez les détails de votre musique</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Titre */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">
                    Titre <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ex: Contemplation Nocturne"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>

                {/* Slug */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="slug"
                    type="text"
                    placeholder="contemplation-nocturne"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                  <p className="text-moon-500 text-xs">
                    URL du morceau : /musiques/{formData.slug || "slug"}
                  </p>
                </div>

                {/* URL Audio */}
                <div className="flex flex-col gap-2">
                  <Label>
                    Fichier Audio <span className="text-red-400">*</span>
                  </Label>
                  <FileUpload
                    type="audio"
                    onUploadComplete={(url) => setFormData((prev) => ({ ...prev, audioUrl: url }))}
                    buttonText="Uploader un fichier audio"
                    currentUrl={formData.audioUrl}
                  />
                  <div className="text-moon-500 text-xs">Ou saisir une URL directement :</div>
                  <Input
                    id="audioUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.audioUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, audioUrl: e.target.value }))}
                  />
                </div>

                {/* Durée */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="duration">
                    Durée (en secondes) <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ex: 180"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                  <p className="text-moon-500 text-xs">
                    {formData.duration &&
                      parseFloat(formData.duration) > 0 &&
                      `= ${Math.floor(parseFloat(formData.duration) / 60)}:${(Math.floor(parseFloat(formData.duration)) % 60).toString().padStart(2, "0")}`}
                  </p>
                </div>

                {/* URL Pochette */}
                <div className="flex flex-col gap-2">
                  <Label>Pochette (optionnel)</Label>
                  <FileUpload
                    type="image"
                    onUploadComplete={(url) =>
                      setFormData((prev) => ({ ...prev, coverImage: url }))
                    }
                    buttonText="Uploader une pochette"
                    currentUrl={formData.coverImage}
                  />
                  <div className="text-moon-500 text-xs">Ou saisir une URL directement :</div>
                  <Input
                    id="coverImage"
                    type="url"
                    placeholder="https://... (optionnel)"
                    value={formData.coverImage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
                    }
                  />
                </div>

                {/* Publier */}
                <div className="flex items-center gap-3">
                  <input
                    id="isPublished"
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                    }
                    className="border-input bg-moon-900 ring-offset-background focus-visible:ring-ring h-4 w-4 rounded border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Label htmlFor="isPublished" className="cursor-pointer text-sm font-normal">
                    Publier immédiatement
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
                <CardDescription>Prévisualisation du morceau</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {/* Pochette */}
                {formData.coverImage ? (
                  <div className="border-moon-700 relative aspect-square w-full overflow-hidden rounded-lg border">
                    <Image
                      src={formData.coverImage}
                      alt="Pochette"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                ) : (
                  <div className="bg-moon-900 border-moon-700 flex aspect-square w-full items-center justify-center rounded-lg border">
                    <span className="text-moon-500 text-4xl">🎵</span>
                  </div>
                )}

                {/* Infos */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-moon-100 truncate font-medium">
                    {formData.title || "Titre du morceau"}
                  </h3>
                  {formData.duration && parseFloat(formData.duration) > 0 && (
                    <p className="text-moon-400 text-sm">
                      Durée : {Math.floor(parseFloat(formData.duration) / 60)}:
                      {(Math.floor(parseFloat(formData.duration)) % 60).toString().padStart(2, "0")}
                    </p>
                  )}
                </div>

                {/* Player preview */}
                {formData.audioUrl && (
                  <audio controls className="w-full">
                    <source src={formData.audioUrl} type="audio/mpeg" />
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/music">
              <Button type="button" variant="outline" disabled={isSubmitting || isDeleting}>
                Annuler
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="border-red-900/50 text-red-400 hover:border-red-800 hover:bg-red-950/20"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </div>

          <Button type="submit" variant="default" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
