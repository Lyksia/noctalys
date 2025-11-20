import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { trackCreateSchema, trackUpdateSchema } from "@/lib/validations/track";
import { z } from "zod";

/**
 * GET /api/admin/music
 * Liste tous les tracks
 */
export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer tous les tracks triés par date de création (les plus récents en premier)
    const tracks = await prisma.track.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        audioUrl: true,
        coverImage: true,
        duration: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des musiques" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/music
 * Créer un nouveau track
 */
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Parser et valider le body
    const body = await request.json();
    const validatedData = trackCreateSchema.parse(body);

    // Vérifier que le slug est unique
    const existingTrack = await prisma.track.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingTrack) {
      return NextResponse.json({ error: "Un morceau avec ce slug existe déjà" }, { status: 400 });
    }

    // Créer le track
    const track = await prisma.track.create({
      data: validatedData,
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error("Error creating track:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erreur lors de la création du morceau" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/music
 * Mettre à jour un track
 */
export async function PATCH(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Parser et valider le body
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "L'ID du morceau est requis" }, { status: 400 });
    }

    const validatedData = trackUpdateSchema.parse(data);

    // Si le slug est modifié, vérifier qu'il est unique
    if (validatedData.slug) {
      const existingTrack = await prisma.track.findFirst({
        where: {
          slug: validatedData.slug,
          NOT: { id },
        },
      });

      if (existingTrack) {
        return NextResponse.json({ error: "Un morceau avec ce slug existe déjà" }, { status: 400 });
      }
    }

    // Mettre à jour le track
    const track = await prisma.track.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error("Error updating track:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du morceau" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/music
 * Supprimer un track
 */
export async function DELETE(request: Request) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Parser le body pour récupérer l'ID
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "L'ID du morceau est requis" }, { status: 400 });
    }

    // Vérifier que le track existe
    const track = await prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      return NextResponse.json({ error: "Morceau non trouvé" }, { status: 404 });
    }

    // TODO: Supprimer le fichier audio de Vercel Blob si nécessaire
    // await del(track.audioUrl);
    // if (track.coverImage) await del(track.coverImage);

    // Supprimer le track
    await prisma.track.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Morceau supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting track:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du morceau" },
      { status: 500 }
    );
  }
}
