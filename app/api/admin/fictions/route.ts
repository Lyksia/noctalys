import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { fictionCreateSchema, fictionUpdateSchema } from "@/lib/validations/fiction";

// GET - List all fictions (including drafts)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status"); // Filter by status

    const where =
      statusParam &&
      (statusParam === "DRAFT" || statusParam === "PUBLISHED" || statusParam === "ARCHIVED")
        ? { status: statusParam as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
        : {};

    const fictions = await prisma.fiction.findMany({
      where,
      include: {
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(fictions);
  } catch (error) {
    console.error("Error fetching fictions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new fiction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = fictionCreateSchema.parse(body);

    // Check if slug already exists
    const existingFiction = await prisma.fiction.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingFiction) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
    }

    const fiction = await prisma.fiction.create({
      data: {
        ...validatedData,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json(fiction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating fiction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update a fiction
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = fictionUpdateSchema.parse(body);

    // Check if fiction exists
    const existingFiction = await prisma.fiction.findUnique({
      where: { id },
    });

    if (!existingFiction) {
      return NextResponse.json({ error: "Fiction not found" }, { status: 404 });
    }

    // Check slug uniqueness if updating slug
    if (validatedData.slug && validatedData.slug !== existingFiction.slug) {
      const conflictingFiction = await prisma.fiction.findUnique({
        where: { slug: validatedData.slug },
      });

      if (conflictingFiction) {
        return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 400 });
      }
    }

    // Update publishedAt if status changes to PUBLISHED
    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.status === "PUBLISHED" && !existingFiction.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (validatedData.status === "DRAFT") {
      updateData.publishedAt = null;
    }

    const fiction = await prisma.fiction.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(fiction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error updating fiction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a fiction
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const fiction = await prisma.fiction.findUnique({
      where: { id },
    });

    if (!fiction) {
      return NextResponse.json({ error: "Fiction not found" }, { status: 404 });
    }

    // Delete fiction (chapters will be cascade deleted)
    await prisma.fiction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting fiction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
