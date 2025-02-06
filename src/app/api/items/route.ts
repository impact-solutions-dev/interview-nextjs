import { type NextRequest, NextResponse } from "next/server";
import { generateDummyData } from "@/utils/generateDummyData";

const ITEMS_PER_PAGE = 10;
const TOTAL_ITEMS = 1000;

const dummyData = generateDummyData(TOTAL_ITEMS);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get("page") || "1", 10);

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = dummyData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

  return NextResponse.json({
    items: paginatedItems,
    page,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems: TOTAL_ITEMS,
  });
}
