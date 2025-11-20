import { NextRequest, NextResponse } from "next/server";
import { fileClient, validateImageFile } from "@/lib/file-manager";

/**
 * API Route pour uploader des images
 * POST /api/upload/image
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier que l'API key est configurée
    if (!process.env.FILE_MANAGER_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Le gestionnaire de fichiers n'est pas configuré. Ajoutez FILE_MANAGER_API_KEY dans les variables d'environnement.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Validation du fichier
    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Upload via le SDK (v1.2.0 avec URLs publiques permanentes)
    const uploadResult = await fileClient.files.upload({
      file,
      tags: ["image"],
      description: `Image: ${file.name}`,
      isPublic: true, // URLs publiques sans token JWT
    });

    // Gérer le cas où le résultat est un tableau ou un objet unique
    const uploadedFile = Array.isArray(uploadResult) ? uploadResult[0] : uploadResult;

    return NextResponse.json({
      url: uploadedFile.downloadUrl,
      id: uploadedFile.id,
      name: uploadedFile.name,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimeType,
      thumbnailUrl: uploadedFile.thumbnailUrl,
    });
  } catch (error) {
    console.error("Erreur upload image:", error);

    // Gestion des erreurs spécifiques du SDK
    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as { response?: { status?: number; data?: any } };
      const status = apiError.response?.status;
      const errorData = apiError.response?.data;

      console.error("Détails erreur API:", { status, errorData });

      if (status === 401) {
        return NextResponse.json({ error: "Clé API invalide" }, { status: 401 });
      } else if (status === 409) {
        return NextResponse.json(
          { error: errorData?.message || "Conflit lors de l'upload" },
          { status: 409 }
        );
      } else if (status === 413) {
        return NextResponse.json({ error: "Fichier trop volumineux" }, { status: 413 });
      } else if (status === 429) {
        return NextResponse.json(
          { error: "Trop de requêtes, réessayez plus tard" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json({ error: "Erreur lors de l'upload de l'image" }, { status: 500 });
  }
}
