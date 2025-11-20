import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Publish a chapter
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id },
      data: {
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("Error publishing chapter:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Unpublish a chapter
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id },
      data: {
        publishedAt: null,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error("Error unpublishing chapter:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
