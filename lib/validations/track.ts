import { z } from "zod";

/**
 * Helper function pour générer un slug à partir du titre
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, "") // Garder uniquement lettres, chiffres, espaces, tirets
    .trim()
    .replace(/\s+/g, "-") // Remplacer espaces par tirets
    .replace(/-+/g, "-"); // Supprimer tirets multiples
}

/**
 * Schéma pour la création d'un track
 */
export const trackCreateSchema = z.object({
  title: z
    .string({ message: "Le titre doit être une chaîne de caractères" })
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),

  slug: z
    .string({ message: "Le slug doit être une chaîne de caractères" })
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(200, "Le slug ne peut pas dépasser 200 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"
    ),

  audioUrl: z
    .string({ message: "L'URL audio doit être une chaîne de caractères" })
    .url("L'URL audio doit être une URL valide"),

  coverImage: z.string().url("L'URL de la pochette doit être une URL valide").optional().nullable(),

  duration: z
    .number({ message: "La durée doit être un nombre" })
    .int("La durée doit être un nombre entier")
    .positive("La durée doit être supérieure à 0"),

  publishedAt: z.string().datetime().optional().nullable(),
});

/**
 * Schéma pour la mise à jour d'un track (tous les champs optionnels)
 */
export const trackUpdateSchema = trackCreateSchema.partial();

/**
 * Type TypeScript inféré du schéma de création
 */
export type TrackCreateInput = z.infer<typeof trackCreateSchema>;

/**
 * Type TypeScript inféré du schéma de mise à jour
 */
export type TrackUpdateInput = z.infer<typeof trackUpdateSchema>;
