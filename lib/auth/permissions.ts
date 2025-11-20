import { prisma } from "@/lib/prisma";

/**
 * Vérifie si un utilisateur peut accéder à un chapitre
 * @param userId - ID de l'utilisateur (null si non connecté)
 * @param chapterId - ID du chapitre
 * @returns true si l'utilisateur peut accéder au chapitre
 */
export async function canAccessChapter(userId: string | null, chapterId: string): Promise<boolean> {
  // Récupérer le chapitre
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: {
      isFree: true,
    },
  });

  if (!chapter) {
    return false;
  }

  // Si le chapitre est gratuit, tout le monde peut y accéder
  if (chapter.isFree) {
    return true;
  }

  // Si l'utilisateur n'est pas connecté et que le chapitre est payant
  if (!userId) {
    return false;
  }

  // Vérifier si l'utilisateur a acheté le chapitre
  const purchase = await prisma.chapterPurchase.findUnique({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
      status: "succeeded",
    },
  });

  return !!purchase;
}

/**
 * Vérifie si un utilisateur a acheté un chapitre spécifique
 * @param userId - ID de l'utilisateur
 * @param chapterId - ID du chapitre
 * @returns true si l'utilisateur a acheté le chapitre
 */
export async function hasUserPurchasedChapter(userId: string, chapterId: string): Promise<boolean> {
  const purchase = await prisma.chapterPurchase.findUnique({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
      status: "succeeded",
    },
  });

  return !!purchase;
}

/**
 * Vérifie si un chapitre est le premier d'une fiction (donc gratuit)
 * @param chapterNumber - Numéro du chapitre
 * @returns true si c'est le chapitre 1
 */
export function isChapterFree(chapterNumber: number): boolean {
  return chapterNumber === 1;
}
