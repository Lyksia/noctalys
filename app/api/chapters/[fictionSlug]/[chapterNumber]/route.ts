import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fictionSlug: string; chapterNumber: string }> }
) {
  try {
    const { fictionSlug, chapterNumber } = await params;
    const chapterNum = parseInt(chapterNumber, 10);

    if (isNaN(chapterNum)) {
      return NextResponse.json({ error: "Invalid chapter number" }, { status: 400 });
    }

    // Find the fiction first
    const fiction = await prisma.fiction.findUnique({
      where: {
        slug: fictionSlug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (!fiction) {
      return NextResponse.json({ error: "Fiction not found" }, { status: 404 });
    }

    // Find the chapter
    const chapter = await prisma.chapter.findFirst({
      where: {
        fictionId: fiction.id,
        chapterNumber: chapterNum,
        publishedAt: {
          not: null,
        },
      },
      select: {
        id: true,
        chapterNumber: true,
        title: true,
        content: true,
        publishedAt: true,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // Get total chapters count
    const totalChapters = await prisma.chapter.count({
      where: {
        fictionId: fiction.id,
        publishedAt: {
          not: null,
        },
      },
    });

    // Get previous and next chapters
    const previousChapter = await prisma.chapter.findFirst({
      where: {
        fictionId: fiction.id,
        chapterNumber: chapterNum - 1,
        publishedAt: {
          not: null,
        },
      },
      select: {
        chapterNumber: true,
      },
    });

    const nextChapter = await prisma.chapter.findFirst({
      where: {
        fictionId: fiction.id,
        chapterNumber: chapterNum + 1,
        publishedAt: {
          not: null,
        },
      },
      select: {
        chapterNumber: true,
      },
    });

    return NextResponse.json({
      chapter,
      fiction,
      navigation: {
        previous: previousChapter?.chapterNumber || null,
        next: nextChapter?.chapterNumber || null,
        total: totalChapters,
      },
    });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
