"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CatalogSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "newest";

  return (
    <label className="flex shrink-0 items-center gap-2 text-sm text-zinc-600">
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Ordenar</span>
      <select
        value={sort}
        onChange={(e) => {
          const next = new URLSearchParams(searchParams.toString());
          next.set("sort", e.target.value);
          next.set("page", "1");
          router.push(`/catalogo?${next.toString()}`);
        }}
        className="rounded-full border border-primary-200 bg-white px-4 py-2.5 text-sm font-medium text-primary-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
      >
        <option value="newest">Más recientes</option>
        <option value="price_asc">Precio menor</option>
        <option value="price_desc">Precio mayor</option>
        <option value="relevance">Relevancia</option>
      </select>
    </label>
  );
}
