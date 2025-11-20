import { z } from "zod";

export const chapterCreateSchema = z.object({
  fictionId: z.string().cuid("ID de fiction invalide"),
  chapterNumber: z
    .number()
    .int("Le numéro de chapitre doit être un entier")
    .positive("Le numéro de chapitre doit être positif"),
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères"),
  content: z.string().min(100, "Le contenu doit contenir au moins 100 caractères"),
});

export const chapterUpdateSchema = chapterCreateSchema.partial();

export type ChapterCreateInput = z.infer<typeof chapterCreateSchema>;
export type ChapterUpdateInput = z.infer<typeof chapterUpdateSchema>;
