"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Textarea, Card, CardContent, FileUpload } from "@/ui";
import { fictionCreateSchema, slugify } from "@/lib/validations/fiction";
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

export default function NewFictionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [genre, setGenre] = useState("FANTASTIQUE");
  const [isLoading, setIsLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugManuallyEdited(true);
  };

  const handleSubmit = async (publish: boolean) => {
    try {
      setIsLoading(true);

      const validatedData = fictionCreateSchema.parse({
        title,
        slug,
        summary,
        coverImage: coverImage || null,
        genre,
        status: publish ? "PUBLISHED" : "DRAFT",
      });

      const res = await fetch("/api/admin/fictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) {
        const error = await res.json();
        if (typeof error.error === "string") {
          toast.error(error.error);
        } else {
          toast.error("Erreur lors de la création");
        }
        return;
      }

      const fiction = await res.json();
      toast.success(publish ? "Fiction publiée" : "Fiction créée");
      router.push(`/admin/fictions/${fiction.id}`);
    } catch (error) {
      console.error("Error creating fiction:", error);
      if (error instanceof Error && "errors" in error) {
        (error as { errors: { message: string }[] }).errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Erreur lors de la création");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-1 font-serif font-semibold">Nouvelle fiction</h1>
        <p className="text-moon-400">Créez une nouvelle fiction</p>
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
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Le titre captivant de votre histoire..."
                className="bg-moon-900 border-moon-700"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">
                Slug *
                <span className="text-moon-500 ml-2 text-xs">
                  (URL de la fiction : /fictions/{slug || "mon-slug"})
                </span>
              </Label>
              <Input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="mon-titre-de-fiction"
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
                placeholder="Un résumé captivant qui donnera envie de lire votre histoire..."
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
                variant="ghost"
                onClick={() => router.push("/admin/fictions")}
                disabled={isLoading}
              >
                Annuler
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSubmit(false)}
                  disabled={isLoading || !title || !slug || !summary}
                >
                  Sauvegarder brouillon
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={isLoading || !title || !slug || !summary}
                >
                  {isLoading ? "Publication..." : "Publier"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
