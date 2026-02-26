import { type NextRequest, NextResponse } from "next/server";
import { getItemsPage } from "@/lib/items";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  const data = await getItemsPage(page);
  return NextResponse.json(data);
}
