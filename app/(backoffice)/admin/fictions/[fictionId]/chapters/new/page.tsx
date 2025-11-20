"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Card, CardContent, TipTapEditor } from "@/ui";
import { useAutoSave } from "@/lib/use-auto-save";
import { chapterCreateSchema } from "@/lib/validations/chapter";
import { toast } from "sonner";

interface NewChapterPageProps {
  params: Promise<{
    fictionId: string;
  }>;
}

export default function NewChapterPage({ params }: NewChapterPageProps) {
  const router = useRouter();
  const { fictionId } = use(params);
  const [fiction, setFiction] = useState<{ id: string; title: string } | null>(null);
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextNumber, setIsFetchingNextNumber] = useState(true);

  // Fetch fiction details and next chapter number
  useEffect(() => {
    const fetchFictionAndNextNumber = async () => {
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

        // Fetch chapters to get next chapter number
        const chaptersRes = await fetch(`/api/admin/chapters?fictionId=${fictionId}`);
        if (chaptersRes.ok) {
          const chapters = await chaptersRes.json();
          const maxChapterNumber = chapters.reduce(
            (max: number, ch: { chapterNumber: number }) => Math.max(max, ch.chapterNumber),
            0
          );
          setChapterNumber(maxChapterNumber + 1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsFetchingNextNumber(false);
      }
    };

    fetchFictionAndNextNumber();
  }, [fictionId, router]);

  // Auto-save draft to localStorage
  const { isSaving, lastSaved, timeSinceLastSave } = useAutoSave({
    onSave: () => {
      localStorage.setItem(
        `chapter-draft-${fictionId}`,
        JSON.stringify({ chapterNumber, title, content })
      );
    },
    delay: 10000, // 10 seconds
    enabled: !!(title || content),
  });

  // Restore draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(`chapter-draft-${fictionId}`);
    if (draft) {
      try {
        const {
          chapterNumber: savedNumber,
          title: savedTitle,
          content: savedContent,
        } = JSON.parse(draft);
        if (savedTitle || savedContent) {
          const shouldRestore = window.confirm(
            "Un brouillon non publié a été trouvé. Voulez-vous le restaurer ?"
          );
          if (shouldRestore) {
            setChapterNumber(savedNumber || chapterNumber);
            setTitle(savedTitle || "");
            setContent(savedContent || "");
          }
        }
      } catch (error) {
        console.error("Error parsing draft:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fictionId]);

  const handleSaveDraft = async () => {
    try {
      setIsLoading(true);

      // Validate
      const validatedData = chapterCreateSchema.parse({
        fictionId: fictionId,
        chapterNumber,
        title,
        content,
      });

      // Create chapter
      const res = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erreur lors de la sauvegarde");
        return;
      }

      await res.json();

      // Clear draft
      localStorage.removeItem(`chapter-draft-${fictionId}`);

      toast.success("Brouillon sauvegardé");
      router.push(`/admin/fictions/${fictionId}`);
    } catch (error) {
      console.error("Error saving draft:", error);
      if (error instanceof Error && "errors" in error) {
        const zodError = error as { errors: Array<{ message: string }> };
        zodError.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Erreur lors de la sauvegarde");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);

      // Validate
      const validatedData = chapterCreateSchema.parse({
        fictionId: fictionId,
        chapterNumber,
        title,
        content,
      });

      // Create chapter
      const res = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erreur lors de la création");
        return;
      }

      const createdChapter = await res.json();

      // Publish chapter
      const publishRes = await fetch(`/api/admin/chapters/${createdChapter.id}/publish`, {
        method: "POST",
      });

      if (!publishRes.ok) {
        toast.error("Erreur lors de la publication");
        return;
      }

      // Clear draft
      localStorage.removeItem(`chapter-draft-${fictionId}`);

      toast.success("Chapitre publié avec succès");
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

  if (isFetchingNextNumber || !fiction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-moon-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-heading-1 font-serif font-semibold">Nouveau chapitre</h1>
        <p className="text-moon-400">Fiction : {fiction.title}</p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col gap-6">
            {/* Chapter Number and Title */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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

              <div className="flex flex-col gap-2 md:col-span-3">
                <Label htmlFor="title">Titre du chapitre</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre captivant..."
                  className="bg-moon-900 border-moon-700"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Contenu</Label>
                {lastSaved && (
                  <span className="text-moon-500 text-xs">
                    {isSaving ? "Sauvegarde..." : `Sauvegardé ${timeSinceLastSave}`}
                  </span>
                )}
              </div>

              <TipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Il était une fois, dans un monde lointain..."
              />
            </div>

            {/* Actions */}
            <div className="border-moon-700 flex items-center justify-between border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(`/admin/fictions/${fictionId}`)}
                disabled={isLoading}
              >
                Annuler
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  disabled={isLoading || !title || !content}
                >
                  Sauvegarder brouillon
                </Button>

                <Button
                  type="button"
                  onClick={handlePublish}
                  disabled={isLoading || !title || !content}
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
