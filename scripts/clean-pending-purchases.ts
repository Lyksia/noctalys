/**
 * Script pour nettoyer les achats en pending
 * Utile pour forcer la création de nouveaux Payment Intents après une modification
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Nettoyage des achats en pending...\n");

  // Supprimer tous les achats en pending
  const result = await prisma.chapterPurchase.deleteMany({
    where: {
      status: "pending",
    },
  });

  console.log(`✅ ${result.count} achat(s) en pending supprimé(s)`);
  console.log(
    "\n💡 Les utilisateurs devront créer un nouveau Payment Intent lors du prochain achat.",
  );
}

main()
  .catch((error) => {
    console.error("❌ Erreur lors du nettoyage:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
