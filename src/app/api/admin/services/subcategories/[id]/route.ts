import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const name = (body?.name || "").trim();
    if (!name) return NextResponse.json({ success: false, message: "name is required" }, { status: 400 });

    const toSlug = (value: string): string =>
      value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    const updated = await prisma.serviceSubcategory.update({
      where: { id },
      data: { name, slug: toSlug(name) },
      select: { id: true, name: true, slug: true, categoryName: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    const message = e?.code === "P2002" ? "Duplicate subcategory in category" : "Failed to update subcategory";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await prisma.serviceSubcategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Failed to delete subcategory" }, { status: 400 });
  }
}


