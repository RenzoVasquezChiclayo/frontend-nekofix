"use client";

import { useState } from "react";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductFilters } from "@/components/catalog/ProductFilters";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import type { PaginationMeta } from "@/types/api";
import type { Brand, Category, PhoneModel, Product } from "@/types/product";

type Props = {
  products: Product[];
  meta: PaginationMeta;
  brands: Brand[];
  categories: Category[];
  models: PhoneModel[];
};

export function CatalogLayout({ products, meta, brands, categories, models }: Props) {
  const total = meta.total;
  const { page, limit } = meta;
  const pageSize = limit > 0 ? limit : 12;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(page * pageSize, total);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <ProductFilters brands={brands} categories={categories} models={models} />
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <ProductSearch />
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="touch-manipulation rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 lg:hidden"
            >
              Filtros
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm font-medium text-zinc-600">
            {total === 0 ? (
              "Sin resultados"
            ) : (
              <>
                Mostrando{" "}
                <span className="tabular-nums text-zinc-900">
                  {start}–{end}
                </span>{" "}
                de <span className="tabular-nums text-zinc-900">{total}</span> productos
              </>
            )}
          </p>
          <CatalogSort />
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-primary-200/70 bg-primary-50/40 py-20 text-center text-sm text-zinc-600">
            No hay productos con estos filtros.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}

        <CatalogPagination meta={meta} />
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[1px]"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Cerrar filtros"
          />
          <div className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col overflow-hidden bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-4 py-4">
              <h2 className="text-base font-semibold text-zinc-900">Filtros</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="touch-manipulation rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700"
              >
                Cerrar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-8">
              <ProductFilters
                brands={brands}
                categories={categories}
                models={models}
                onNavigate={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
