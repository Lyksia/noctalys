import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const fiction = await prisma.fiction.findUnique({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        chapters: {
          where: {
            publishedAt: {
              not: null,
            },
          },
          orderBy: {
            chapterNumber: "asc",
          },
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            publishedAt: true,
          },
        },
      },
    });

    if (!fiction) {
      return NextResponse.json({ error: "Fiction not found" }, { status: 404 });
    }

    return NextResponse.json(fiction);
  } catch (error) {
    console.error("Error fetching fiction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
