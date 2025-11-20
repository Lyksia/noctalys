"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "./button";
import { toast } from "sonner";

interface FileUploadProps {
  /**
   * Type de fichier à uploader
   */
  type: "image" | "audio";
  /**
   * Callback appelé après un upload réussi
   */
  onUploadComplete: (url: string) => void;
  /**
   * Texte du bouton (optionnel)
   */
  buttonText?: string;
  /**
   * Classe CSS personnalisée (optionnel)
   */
  className?: string;
  /**
   * URL actuelle du fichier (pour affichage preview)
   */
  currentUrl?: string;
}

export function FileUpload({
  type,
  onUploadComplete,
  buttonText,
  className = "",
  currentUrl,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview local pour les images
    if (type === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/upload/${type}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Upload response:", { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      toast.success(
        type === "image" ? "Image uploadée avec succès" : "Fichier audio uploadé avec succès"
      );

      if (data.url) {
        onUploadComplete(data.url);
        setPreviewUrl(data.url);
      } else {
        console.error("Pas d'URL dans la réponse:", data);
        toast.error("Erreur: URL manquante dans la réponse");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload");
      setPreviewUrl(currentUrl || null);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const accept = type === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "audio/*";

  const defaultButtonText = type === "image" ? "Choisir une image" : "Choisir un fichier audio";

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      <Button type="button" variant="outline" onClick={handleButtonClick} disabled={isUploading}>
        {isUploading ? "Upload en cours..." : buttonText || defaultButtonText}
      </Button>

      {/* Preview pour images */}
      {type === "image" && previewUrl && (
        <div className="border-moon-700 relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 384px"
          />
        </div>
      )}

      {/* Indication pour audio */}
      {type === "audio" && previewUrl && (
        <div className="text-moon-400 text-sm">
          <p>✓ Fichier audio uploadé</p>
          <p className="text-moon-600 truncate text-xs">{previewUrl}</p>
        </div>
      )}
    </div>
  );
}
