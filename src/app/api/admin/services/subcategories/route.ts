import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get("categoryName") || undefined;

    const subcategories = await prisma.serviceSubcategory.findMany({
      where: categoryName ? { categoryName } : undefined,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: subcategories });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, message: "Failed to fetch subcategories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body?.name || "").trim();
    const categoryName = (body?.categoryName || "").trim();

    if (!name || !categoryName) {
      return NextResponse.json({ success: false, message: "name and categoryName are required" }, { status: 400 });
    }

    const toSlug = (value: string): string =>
      value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    const slug = toSlug(name);

    const created = await prisma.serviceSubcategory.create({
      data: { name, slug, categoryName },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (e: any) {
    const message = e?.code === "P2002" ? "Subcategory with same name/slug exists in category" : "Failed to create subcategory";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}


