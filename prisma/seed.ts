import { PrismaClient, Genre, Status } from "@prisma/client";
import { auth } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌙 Début du seeding Noctalys...\n");

  // Nettoyage
  console.log("🧹 Nettoyage des données existantes...");
  await prisma.chapter.deleteMany();
  await prisma.fiction.deleteMany();
  await prisma.track.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ===================================
  // 1. CRÉER L'UTILISATEUR ADMIN
  // ===================================
  console.log("\n👤 Création de l'utilisateur admin avec Better Auth...");

  try {
    const adminUser = await auth.api.signUpEmail({
      body: {
        name: process.env.ADMIN_NAME || "Admin Noctalys",
        email: process.env.ADMIN_EMAIL || "admin@noctalys.com",
        password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
        rememberMe: true,
      },
    });

    console.log(`✅ Admin créé: ${adminUser.user.email}`);
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error);
    throw error;
  }

  // ===================================
  // 2. CRÉER LES FICTIONS
  // ===================================
  console.log("\n📖 Création des fictions...");

  const fiction1 = await prisma.fiction.create({
    data: {
      slug: "les-chroniques-de-lumeria",
      title: "Les Chroniques de Lumeria",
      summary:
        "Dans un monde où la lumière et l'obscurité se disputent le pouvoir, une jeune mage découvre qu'elle possède un don unique : contrôler les deux forces. Son voyage la mènera à travers des royaumes oubliés et des secrets millénaires.",
      genre: Genre.FANTASY,
      status: Status.PUBLISHED,
      publishedAt: new Date("2025-01-15"),
      coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=1200",
    },
  });

  const fiction2 = await prisma.fiction.create({
    data: {
      slug: "echos-du-futur",
      title: "Échos du Futur",
      summary:
        "En 2157, l'humanité a colonisé Mars. Mais lorsqu'un signal mystérieux provenant des confins de la galaxie est détecté, une expédition est lancée. Ce qu'ils découvriront changera à jamais notre compréhension de l'univers.",
      genre: Genre.SCI_FI,
      status: Status.PUBLISHED,
      publishedAt: new Date("2025-02-01"),
      coverImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=1200",
    },
  });

  const fiction3 = await prisma.fiction.create({
    data: {
      slug: "murmures-nocturnes",
      title: "Murmures Nocturnes",
      summary:
        "Une anthologie de nouvelles courtes explorant les mystères de la nuit. Chaque chapitre révèle une histoire différente, des rencontres étranges aux secrets enfouis dans l'ombre.",
      genre: Genre.MYSTERY,
      status: Status.PUBLISHED,
      publishedAt: new Date("2025-03-10"),
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200",
    },
  });

  console.log(`✅ 3 fictions créées`);

  // ===================================
  // 3. CRÉER LES CHAPITRES
  // ===================================
  console.log("\n📝 Création des chapitres...");

  // Chapitres pour Fiction 1 (Les Chroniques de Lumeria)
  await prisma.chapter.createMany({
    data: [
      {
        fictionId: fiction1.id,
        chapterNumber: 1,
        title: "L'Éveil",
        content: `# Chapitre 1 : L'Éveil

La lune brillait haut dans le ciel nocturne lorsque Aria sentit pour la première fois le pouvoir couler en elle. Ce n'était pas une sensation ordinaire - c'était comme si deux forces opposées dansaient dans ses veines, cherchant l'équilibre.

*"Impossible,"* murmura-t-elle en observant ses mains tremblantes. Des filaments de lumière et d'ombre s'entremêlaient autour de ses doigts, créant des motifs hypnotiques.

Le vieux sage lui avait dit que cela arriverait un jour. Mais elle n'était pas prête. Comment pourrait-elle l'être ?

---

Dans les profondeurs du royaume de Lumeria, une prophétie ancienne commençait à se réaliser. Une prophétie qui changerait le destin de tous les royaumes...`,
        publishedAt: new Date("2025-01-15"),
      },
      {
        fictionId: fiction1.id,
        chapterNumber: 2,
        title: "Le Mentor",
        content: `# Chapitre 2 : Le Mentor

Le lendemain, Aria se rendit à la tour du sage Eldrin. Le vieil homme l'attendait, comme s'il savait qu'elle viendrait.

"Tu as ressenti l'Éveil," dit-il sans préambule. Ce n'était pas une question.

Aria hocha la tête, incapable de trouver les mots. Eldrin sourit doucement.

"Viens, enfant. Il est temps que tu apprennes la vérité sur ton héritage."

Et ainsi commença sa formation...`,
        publishedAt: new Date("2025-01-22"),
      },
      {
        fictionId: fiction1.id,
        chapterNumber: 3,
        title: "Les Premiers Pas",
        content: `# Chapitre 3 : Les Premiers Pas

L'entraînement était épuisant. Chaque jour, Eldrin lui enseignait à contrôler les deux forces qui l'habitaient.

"La lumière sans l'ombre devient aveuglante," lui dit-il un jour. "L'ombre sans la lumière devient oppressante. Tu dois trouver l'équilibre, Aria."

Mais l'équilibre était plus difficile à atteindre qu'elle ne l'avait imaginé...`,
        publishedAt: new Date("2025-01-29"),
      },
    ],
  });

  // Chapitres pour Fiction 2 (Échos du Futur)
  await prisma.chapter.createMany({
    data: [
      {
        fictionId: fiction2.id,
        chapterNumber: 1,
        title: "Le Signal",
        content: `# Chapitre 1 : Le Signal

**Station Orbitale Mars - 15 Mars 2157**

Le Dr. Sarah Chen fixait l'écran avec incrédulité. Les données ne mentaient pas. Un signal, clair et distinct, provenait d'un point situé à 47 années-lumière de la Terre.

\`\`\`
SIGNAL DÉTECTÉ
Origine: Secteur Delta-7
Distance: 47 AL
Fréquence: 1420 MHz
Pattern: NON NATUREL
\`\`\`

"C'est impossible," murmura son collègue, le Dr. James Wu. "Rien ne devrait émettre à cette fréquence naturellement."

"Exactement," répondit Sarah, son cœur battant la chamade. "Ce n'est pas naturel."`,
        publishedAt: new Date("2025-02-01"),
      },
      {
        fictionId: fiction2.id,
        chapterNumber: 2,
        title: "L'Expédition",
        content: `# Chapitre 2 : L'Expédition

Trois mois plus tard, le vaisseau *Odyssée* quitta l'orbite de Mars. À bord, une équipe de douze scientifiques et explorateurs, Sarah et James inclus.

Leur mission : atteindre la source du signal.

Leur voyage : 47 ans en stase.

Leur destination : l'inconnu.`,
        publishedAt: new Date("2025-02-08"),
      },
    ],
  });

  // Chapitres pour Fiction 3 (Murmures Nocturnes)
  await prisma.chapter.createMany({
    data: [
      {
        fictionId: fiction3.id,
        chapterNumber: 1,
        title: "Le Voyageur de Minuit",
        content: `# Le Voyageur de Minuit

*Une nouvelle courte*

Chaque nuit, à minuit précis, un homme en long manteau noir traverse le parc. Personne ne sait d'où il vient ni où il va.

Mais ceux qui l'ont suivi racontent des histoires étranges...`,
        publishedAt: new Date("2025-03-10"),
      },
      {
        fictionId: fiction3.id,
        chapterNumber: 2,
        title: "La Bibliothèque Oubliée",
        content: `# La Bibliothèque Oubliée

*Une nouvelle courte*

Dans une ruelle sombre de la vieille ville se cache une bibliothèque que peu connaissent. On dit qu'elle contient tous les livres jamais écrits - et certains qui n'existent pas encore.

Mais pour y entrer, il faut connaître le mot de passe...`,
        publishedAt: new Date("2025-03-17"),
      },
    ],
  });

  console.log(`✅ 7 chapitres créés`);

  // ===================================
  // 4. CRÉER LES MORCEAUX MUSICAUX
  // ===================================
  console.log("\n🎵 Création des morceaux musicaux...");

  await prisma.track.createMany({
    data: [
      {
        slug: "clair-de-lune-electronique",
        title: "Clair de Lune Électronique",
        description:
          "Une réinterprétation électronique du classique de Debussy, mêlant piano acoustique et synthétiseurs ambiants.",
        audioUrl: "https://example.com/audio/clair-de-lune.mp3",
        duration: 245, // 4:05
        coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800",
        publishedAt: new Date("2025-01-20"),
      },
      {
        slug: "nocturne-stellaire",
        title: "Nocturne Stellaire",
        description:
          "Une composition originale inspirée par le cosmos et l'immensité de l'espace. Parfaite pour la contemplation nocturne.",
        audioUrl: "https://example.com/audio/nocturne-stellaire.mp3",
        duration: 312, // 5:12
        coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=800",
        publishedAt: new Date("2025-02-05"),
      },
      {
        slug: "murmures-du-vent",
        title: "Murmures du Vent",
        description:
          "Des sonorités douces et apaisantes qui évoquent le vent dans les arbres lors d'une nuit calme.",
        audioUrl: "https://example.com/audio/murmures-du-vent.mp3",
        duration: 198, // 3:18
        coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800",
        publishedAt: new Date("2025-02-15"),
      },
      {
        slug: "reflets-lunaires",
        title: "Reflets Lunaires",
        description:
          "Une pièce minimaliste au piano, capturant la beauté et la sérénité d'une nuit de pleine lune.",
        audioUrl: "https://example.com/audio/reflets-lunaires.mp3",
        duration: 267, // 4:27
        coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=800",
        publishedAt: new Date("2025-03-01"),
      },
      {
        slug: "reverie-nocturne",
        title: "Rêverie Nocturne",
        description: "Un voyage onirique à travers des paysages sonores éthérés et contemplatifs.",
        audioUrl: "https://example.com/audio/reverie-nocturne.mp3",
        duration: 334, // 5:34
        coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=800",
        publishedAt: new Date("2025-03-15"),
      },
    ],
  });

  console.log(`✅ 5 morceaux musicaux créés`);

  // ===================================
  // RÉSUMÉ
  // ===================================
  console.log("\n" + "=".repeat(50));
  console.log("🌙 Seeding terminé avec succès !");
  console.log("=".repeat(50));
  console.log(`
📊 Résumé:
- 1 utilisateur admin (admin@noctalys.com)
- 3 fictions publiées
- 7 chapitres au total
- 5 morceaux musicaux

🔑 Identifiants admin:
Email: ${process.env.ADMIN_EMAIL || "admin@noctalys.com"}
Password: ${process.env.ADMIN_PASSWORD || "ChangeMe123!"}

✨ La base de données est prête !
  `);
}

main()
  .catch((e) => {
    console.error("\n❌ Erreur lors du seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
