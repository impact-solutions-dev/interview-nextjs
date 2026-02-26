import { type NextRequest, NextResponse } from "next/server";
import { getItemsPage } from "@/lib/items";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const rawSearch = searchParams.get("search");
  const search = rawSearch?.trim().slice(0, 100) || undefined;

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  const data = await getItemsPage(page, search);
  return NextResponse.json(data);
}
