/**
 * Script pour créer un compte administrateur
 *
 * Usage:
 *   pnpm tsx scripts/create-admin.ts
 *
 * Le script demande interactivement:
 * - Email
 * - Nom
 * - Mot de passe (avec confirmation)
 *
 * Compatible avec Better Auth + Prisma
 */

import { PrismaClient } from "@prisma/client";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { auth } from "../lib/auth";

const prisma = new PrismaClient();

/**
 * Demande une entrée utilisateur sans afficher le texte (pour mot de passe)
 */
async function askPassword(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const originalMuted = (stdin as { _writeToOutput?: () => void })._writeToOutput;

    // Mute l'output pour ne pas afficher le mot de passe
    (stdin as { _writeToOutput?: () => void })._writeToOutput = function () {};

    rl.question(prompt).then((answer: string) => {
      // Restore l'output
      (stdin as { _writeToOutput?: () => void })._writeToOutput = originalMuted;
      console.log(""); // Nouvelle ligne après le mot de passe
      resolve(answer);
    });
  });
}

/**
 * Valide un email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un mot de passe (minimum 8 caractères)
 */
function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Script principal
 */
async function main() {
  console.log("╔════════════════════════════════════════════╗");
  console.log("║   Création d'un compte administrateur      ║");
  console.log("╚════════════════════════════════════════════╝\n");

  const rl = readline.createInterface({ input, output });

  try {
    // 1. Demander l'email
    let email = "";
    while (!email || !isValidEmail(email)) {
      email = await rl.question("Email de l'admin: ");
      if (!isValidEmail(email)) {
        console.log("❌ Email invalide. Veuillez réessayer.\n");
      }
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`\n❌ Un utilisateur avec l'email "${email}" existe déjà.`);
      console.log(`   ID: ${existingUser.id}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Nom: ${existingUser.name}`);
      console.log("\n⚠️  Note: Le système de rôles n'est pas encore implémenté dans le schéma.");
      console.log("   Tous les utilisateurs ont les mêmes permissions pour le moment.");

      rl.close();
      await prisma.$disconnect();
      return;
    }

    // 2. Demander le nom
    let name = "";
    while (!name || name.trim().length < 2) {
      name = await rl.question("Nom complet: ");
      if (!name || name.trim().length < 2) {
        console.log("❌ Le nom doit contenir au moins 2 caractères.\n");
      }
    }

    // 3. Demander le mot de passe
    let password = "";
    let passwordConfirm = "";

    while (true) {
      password = await askPassword(rl, "Mot de passe (min. 8 caractères): ");

      if (!isValidPassword(password)) {
        console.log("❌ Le mot de passe doit contenir au moins 8 caractères.\n");
        continue;
      }

      passwordConfirm = await askPassword(rl, "Confirmez le mot de passe: ");

      if (password !== passwordConfirm) {
        console.log("❌ Les mots de passe ne correspondent pas. Veuillez réessayer.\n");
        continue;
      }

      break;
    }

    // 4. Créer l'utilisateur avec Better Auth signUp
    console.log("\n⏳ Création du compte...");

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result?.user) {
      throw new Error("Erreur lors de la création du compte");
    }

    // 5. Marquer l'email comme vérifié
    const updatedUser = await prisma.user.update({
      where: { id: result.user.id },
      data: {
        emailVerified: true, // Marquer l'email comme vérifié
      },
    });

    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║        ✅ Compte admin créé avec succès!   ║");
    console.log("╚════════════════════════════════════════════╝");
    console.log(`\nID:    ${updatedUser.id}`);
    console.log(`Email: ${updatedUser.email}`);
    console.log(`Nom:   ${updatedUser.name}`);
    console.log("\n⚠️  Note: Le système de rôles n'est pas encore implémenté dans le schéma.");
    console.log("   Tous les utilisateurs ont les mêmes permissions pour le moment.");
    console.log("\nVous pouvez maintenant vous connecter avec ces identifiants.");
  } catch (error) {
    console.error("\n❌ Erreur lors de la création du compte:", error);
    throw error;
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Exécuter le script
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
