import { sql } from "kysely";
import { db } from "@/db";
import type { ItemsApiResponse } from "@/types/api";
import type { Category } from "@/types/DummyItem";

const ITEMS_PER_PAGE = 10;

export async function getCategories(): Promise<Category[]> {
  const rows = await db
    .selectFrom("categories")
    .select(["id", "name"])
    .orderBy("id")
    .execute();
  return rows.map((r) => ({ id: Number(r.id), name: String(r.name) }));
}

export async function getItemsPage(
  page: number,
  options?: { search?: string; categoryId?: number }
): Promise<ItemsApiResponse> {
  const validPage = Math.max(1, page);
  const searchTerm = options?.search?.trim() || undefined;
  const categoryId = options?.categoryId;

  let baseQuery = db
    .selectFrom("items")
    .innerJoin("categories", "items.categoryId", "categories.id");

  if (searchTerm) {
    baseQuery = baseQuery.where(
      sql<boolean>`LOWER(items.title) LIKE LOWER(${"%" + searchTerm + "%"})`
    );
  }
  if (categoryId != null && categoryId > 0) {
    baseQuery = baseQuery.where("items.categoryId", "=", categoryId);
  }

  const countResult = await baseQuery
    .select((eb) => eb.fn.countAll().as("count"))
    .executeTakeFirst();
  const totalItems = Number(countResult?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const clampedPage = Math.min(validPage, totalPages);
  const offset = (clampedPage - 1) * ITEMS_PER_PAGE;

  const items = await baseQuery
    .select(["items.id", "items.title", "categories.id as categoryId", "categories.name as categoryName"])
    .orderBy("items.id")
    .limit(ITEMS_PER_PAGE)
    .offset(offset)
    .execute();

  return {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      category: {
        id: item.categoryId,
        name: item.categoryName,
      },
    })),
    page: clampedPage,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    totalItems,
  };
}

export async function deleteItem(id: number): Promise<boolean> {
  const result = await db
    .deleteFrom("items")
    .where("id", "=", id)
    .executeTakeFirst();

  return Number(result.numDeletedRows) > 0;
}
