"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DummyItem } from "@/types/DummyItem";
import type { ItemsApiResponse } from "@/types/api";

type InfiniteListProps = {
  initialData?: ItemsApiResponse;
};

export function InfiniteList({ initialData }: InfiniteListProps) {
  const [items, setItems] = useState<DummyItem[]>(initialData?.items ?? []);
  const [page, setPage] = useState(initialData?.page ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);
  const prevItemsLengthRef = useRef(initialData?.items?.length ?? 0);

  const fetchItems = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/items?page=${pageNum}`);
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst položky");
      }
      const data: ItemsApiResponse = await res.json();

      if (pageNum === 1) {
        setItems(data.items);
      } else {
        setItems((prev) => [...prev, ...data.items]);
      }
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Došlo k chybě");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      fetchItems(1);
    }
  }, [fetchItems, initialData]);

  useEffect(() => {
    if (items.length > prevItemsLengthRef.current && prevItemsLengthRef.current > 0) {
      requestAnimationFrame(() => {
        listEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
    prevItemsLengthRef.current = items.length;
  }, [items.length]);

  const handleLoadMore = () => {
    if (page < totalPages && !isLoading) {
      fetchItems(page + 1);
    }
  };

  const isLastPage = page >= totalPages;

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <li
            key={item.id}
            className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-gray-900 dark:text-gray-100">{item.title}</span>
          </li>
        ))}
      </ul>

      <div ref={listEndRef} className="flex flex-col items-center gap-3 py-6">
        {isLoading && (
          <div
            className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
            aria-hidden
          />
        )}
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isLastPage || isLoading}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
        >
          {isLoading ? "Načítám…" : "Načíst další"}
        </button>
      </div>
    </div>
  );
}
