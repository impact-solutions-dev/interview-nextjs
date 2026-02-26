import { type NextRequest, NextResponse } from "next/server";
import { deleteItem } from "@/lib/items";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itemId = Number.parseInt(id, 10);

  if (isNaN(itemId) || itemId < 1) {
    return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
  }

  const deleted = await deleteItem(itemId);

  if (!deleted) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
