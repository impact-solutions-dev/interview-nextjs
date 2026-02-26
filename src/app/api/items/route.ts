import { type NextRequest, NextResponse } from "next/server";
import { getItemsPage } from "@/lib/items";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const rawSearch = searchParams.get("search");
  const search = rawSearch?.trim().slice(0, 100) || undefined;
  const rawCategoryId = searchParams.get("category");
  const parsedCategoryId = rawCategoryId
    ? Number.parseInt(rawCategoryId, 10)
    : undefined;
  const categoryId =
    parsedCategoryId != null && !isNaN(parsedCategoryId) && parsedCategoryId > 0
      ? parsedCategoryId
      : undefined;

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  const data = await getItemsPage(page, { search, categoryId });
  return NextResponse.json(data);
}
