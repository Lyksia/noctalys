/**
 * Script de migration des données pour les chapitres
 * - Chapitre 1 : isFree = true, price = null
 * - Chapitres 2+ : isFree = false, price = 299 (2.99€)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_PRICE = 299; // 2.99€ en centimes

async function main() {
  console.log("🚀 Démarrage de la migration des prix des chapitres...\n");

  // Récupérer tous les chapitres
  const chapters = await prisma.chapter.findMany({
    include: {
      fiction: {
        select: {
          title: true,
        },
      },
    },
    orderBy: [{ fictionId: "asc" }, { chapterNumber: "asc" }],
  });

  console.log(`📚 ${chapters.length} chapitres trouvés\n`);

  let updatedCount = 0;
  let chapter1Count = 0;
  let otherChaptersCount = 0;

  for (const chapter of chapters) {
    const isFirstChapter = chapter.chapterNumber === 1;

    await prisma.chapter.update({
      where: { id: chapter.id },
      data: {
        isFree: isFirstChapter,
        price: isFirstChapter ? null : DEFAULT_PRICE,
      },
    });

    updatedCount++;

    if (isFirstChapter) {
      chapter1Count++;
      console.log(
        `✅ ${chapter.fiction.title} - Chapitre ${chapter.chapterNumber}: GRATUIT`,
      );
    } else {
      otherChaptersCount++;
      console.log(
        `💰 ${chapter.fiction.title} - Chapitre ${chapter.chapterNumber}: ${DEFAULT_PRICE / 100}€`,
      );
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Résumé de la migration:");
  console.log("=".repeat(60));
  console.log(`Total chapitres mis à jour: ${updatedCount}`);
  console.log(`Chapitres gratuits (chapitre 1): ${chapter1Count}`);
  console.log(
    `Chapitres payants (2+): ${otherChaptersCount} (${DEFAULT_PRICE / 100}€ chacun)`,
  );
  console.log("=".repeat(60));
  console.log("\n✨ Migration terminée avec succès !");
}

main()
  .catch((error) => {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
