import { z } from "zod";

// Helper function to generate slug from title
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export const fictionCreateSchema = z.object({
  title: z
    .string({ message: "Le titre est requis" })
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  slug: z
    .string({ message: "Le slug est requis" })
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(200, "Le slug ne peut pas dépasser 200 caractères")
    .regex(
      /^[a-z0-9-]+$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"
    ),
  summary: z
    .string({ message: "Le résumé est requis" })
    .min(50, "Le résumé doit contenir au moins 50 caractères")
    .max(500, "Le résumé ne peut pas dépasser 500 caractères"),
  coverImage: z.string().url("L'URL de la couverture doit être valide").optional().nullable(),
  genre: z
    .enum(["FANTASY", "SCI_FI", "HORROR", "ROMANCE", "MYSTERY", "THRILLER", "POETRY", "OTHER"], {
      message: "Le genre est requis",
    })
    .optional()
    .nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"], {
    message: "Le statut est requis",
  }),
});

export const fictionUpdateSchema = fictionCreateSchema.partial();

export type FictionCreateInput = z.infer<typeof fictionCreateSchema>;
export type FictionUpdateInput = z.infer<typeof fictionUpdateSchema>;
