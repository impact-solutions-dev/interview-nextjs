import { db } from "@/db";
import type { ItemsApiResponse } from "@/types/api";

const ITEMS_PER_PAGE = 10;

export async function getItemsPage(page: number): Promise<ItemsApiResponse> {
  const validPage = Math.max(1, page);
  const offset = (validPage - 1) * ITEMS_PER_PAGE;

  const [items, countResult] = await Promise.all([
    db
      .selectFrom("items")
      .select(["id", "title"])
      .orderBy("id")
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .execute(),
    db
      .selectFrom("items")
      .select((eb) => eb.fn.count<number>("id").as("count"))
      .executeTakeFirst(),
  ]);

  const totalItems = Number(countResult?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const clampedPage = Math.min(validPage, totalPages);

  return {
    items: items.map((item) => ({
      id: Number(item.id),
      title: String(item.title),
    })),
    page: clampedPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems,
  };
}
