import { FileManagerClient } from "@lyksia/file-manager";

/**
 * Client de gestion de fichiers
 * Utilise la clé API définie dans les variables d'environnement
 */
export const fileClient = new FileManagerClient({
  apiKey: process.env.FILE_MANAGER_API_KEY!,
  devMode: process.env.NODE_ENV === "development",
});

/**
 * Types de fichiers autorisés pour les images
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * Types de fichiers autorisés pour l'audio
 */
export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
];

/**
 * Taille maximale pour les images (5MB)
 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Taille maximale pour l'audio (50MB)
 */
export const MAX_AUDIO_SIZE = 50 * 1024 * 1024;

/**
 * Valide un fichier image
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Fichier trop volumineux. Taille maximale : 5MB.";
  }

  return null;
}

/**
 * Valide un fichier audio
 */
export function validateAudioFile(file: File): string | null {
  if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
    return "Type de fichier non autorisé. Utilisez MP3, WAV, OGG ou WebM.";
  }

  if (file.size > MAX_AUDIO_SIZE) {
    return "Fichier trop volumineux. Taille maximale : 50MB.";
  }

  return null;
}
