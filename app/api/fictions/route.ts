import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    const fictions = await prisma.fiction.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        _count: {
          select: {
            chapters: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    return NextResponse.json(fictions);
  } catch (error) {
    console.error("Error fetching fictions:", error);
    return NextResponse.json({ error: "Failed to fetch fictions" }, { status: 500 });
  }
}
