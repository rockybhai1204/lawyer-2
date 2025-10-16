import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category id is required" },
        { status: 400 }
      );
    }

    const category = await prisma.serviceCategory.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const serviceCount = await prisma.service.count({
      where: { categoryName: category.name },
    });

    if (serviceCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete category with existing services. Move or delete services first.",
        },
        { status: 409 }
      );
    }

    await prisma.serviceCategory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const newNameRaw: string | undefined = body?.name;

    if (!newNameRaw || newNameRaw.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    const newName = newNameRaw.trim();
    const newSlug = generateSlug(newName);

    const existing = await prisma.serviceCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // If nothing changes, return current
    if (existing.name === newName && existing.slug === newSlug) {
      return NextResponse.json({
        success: true,
        data: {
          id: existing.id,
          name: existing.name,
          slug: existing.slug,
          createdAt: existing.createdAt.toISOString(),
          updatedAt: existing.updatedAt.toISOString(),
        },
      });
    }

    // Ensure uniqueness
    const conflict = await prisma.serviceCategory.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { OR: [{ name: newName }, { slug: newSlug }] },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        {
          success: false,
          message: "Another category with this name or slug already exists",
        },
        { status: 409 }
      );
    }

    // Avoid FK violation: create new category (newName), re-point services, then delete old category
    const updated = await prisma.$transaction(async (tx) => {
      // Create the new category first so services can point to it
      const created = await tx.serviceCategory.create({
        data: { name: newName, slug: newSlug },
      });

      // Migrate services from old name to new name
      if (existing.name !== newName) {
        await tx.service.updateMany({
          where: { categoryName: existing.name },
          data: { categoryName: newName },
        });
      }

      // Remove the old category record
      await tx.serviceCategory.delete({ where: { id: existing.id } });

      return created;
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}


