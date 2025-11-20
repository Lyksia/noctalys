import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validation
const chapterCreateSchema = z.object({
  fictionId: z.string().cuid(),
  chapterNumber: z.number().int().positive(),
  title: z.string().min(3).max(200),
  content: z.string().min(100),
});

const chapterUpdateSchema = chapterCreateSchema.partial();

// GET - List all chapters for a fiction
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fictionId = searchParams.get("fictionId");

  if (!fictionId) {
    return NextResponse.json({ error: "fictionId is required" }, { status: 400 });
  }

  try {
    const chapters = await prisma.chapter.findMany({
      where: { fictionId },
      orderBy: { chapterNumber: "asc" },
      select: {
        id: true,
        chapterNumber: true,
        title: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new chapter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = chapterCreateSchema.parse(body);

    // Check if chapter number already exists for this fiction
    const existingChapter = await prisma.chapter.findFirst({
      where: {
        fictionId: validatedData.fictionId,
        chapterNumber: validatedData.chapterNumber,
      },
    });

    if (existingChapter) {
      return NextResponse.json(
        { error: "Chapter number already exists for this fiction" },
        { status: 400 }
      );
    }

    const chapter = await prisma.chapter.create({
      data: {
        ...validatedData,
        publishedAt: null, // Draft by default
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating chapter:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update a chapter
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = chapterUpdateSchema.parse(body);

    // Check if chapter exists
    const existingChapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!existingChapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // If updating chapter number, check for conflicts
    if (
      validatedData.chapterNumber &&
      validatedData.chapterNumber !== existingChapter.chapterNumber
    ) {
      const conflictingChapter = await prisma.chapter.findFirst({
        where: {
          fictionId: existingChapter.fictionId,
          chapterNumber: validatedData.chapterNumber,
          id: { not: id },
        },
      });

      if (conflictingChapter) {
        return NextResponse.json(
          { error: "Chapter number already exists for this fiction" },
          { status: 400 }
        );
      }
    }

    const chapter = await prisma.chapter.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(chapter);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating chapter:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a chapter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    await prisma.chapter.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
