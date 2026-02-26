"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DummyItem } from "@/types/DummyItem";
import type { ItemsApiResponse } from "@/types/api";

type InfiniteListProps = {
  initialData?: ItemsApiResponse;
};

type FetchItemsOptions = {
  page: number;
  search?: string;
  append?: boolean;
};

export function InfiniteList({ initialData }: InfiniteListProps) {
  const [items, setItems] = useState<DummyItem[]>(initialData?.items ?? []);
  const [page, setPage] = useState(initialData?.page ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);
  const prevItemsLengthRef = useRef(initialData?.items?.length ?? 0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRequestRef = useRef<AbortController | null>(null);

  const fetchItems = useCallback(async ({ page, search, append = false }: FetchItemsOptions) => {
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: String(page) });
      const normalizedSearch = search?.trim();
      if (normalizedSearch) {
        params.set("search", normalizedSearch);
      }
      const res = await fetch(`/api/items?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst položky");
      }
      const data: ItemsApiResponse = await res.json();

      if (append) {
        setItems((prev) => [...prev, ...data.items]);
      } else {
        setItems(data.items);
      }
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "Došlo k chybě");
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      debounceRef.current = null;
    }, 300);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchInput]);

  const skipInitialSearchFetchRef = useRef(!!initialData);
  useEffect(() => {
    if (skipInitialSearchFetchRef.current && search === "") {
      skipInitialSearchFetchRef.current = false;
      return;
    }
    void fetchItems({ page: 1, search });
  }, [search, fetchItems]);

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort();
    };
  }, []);

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
      void fetchItems({ page: page + 1, search, append: true });
    }
  };

  const handleDelete = async (item: DummyItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setError(null);

    try {
      const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Nepodařilo se smazat položku");
      }
    } catch (err) {
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.id > item.id);
        const insertAt = idx === -1 ? prev.length : idx;
        return [...prev.slice(0, insertAt), item, ...prev.slice(insertAt)];
      });
      setError(err instanceof Error ? err.message : "Došlo k chybě");
    }
  };

  const isLastPage = page >= totalPages;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <label htmlFor="search" className="sr-only">
          Vyhledat položky
        </label>
        <input
          id="search"
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Vyhledat položky…"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Vyhledat položky"
        />
      </div>
      {error && (
        <div className="mb-4 p-4 text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg">
          {error}
        </div>
      )}
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <li
            key={item.id}
            className="py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between gap-3"
          >
            <span className="text-gray-900 dark:text-gray-100 flex-1 min-w-0">
              {item.title}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(item)}
              className="shrink-0 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50 rounded transition-colors"
              aria-label={`Smazat ${item.title}`}
            >
              Smazat
            </button>
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
