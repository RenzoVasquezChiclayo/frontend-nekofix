"use client";

import { useState } from "react";
import { CatalogSort } from "@/components/catalog/CatalogSort";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductFilters } from "@/components/catalog/ProductFilters";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import type { Brand, Category, PhoneModel, Product } from "@/types/product";

type Props = {
  products: Product[];
  total: number;
  brands: Brand[];
  categories: Category[];
  models: PhoneModel[];
};

export function CatalogLayout({ products, total, brands, categories, models }: Props) {
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
              className="rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 lg:hidden"
            >
              Filtrar
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-sm font-medium text-zinc-600">Mostrando {total} productos</p>
          <CatalogSort />
        </div>

        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-primary-200/70 bg-primary-50/40 py-20 text-center text-sm text-zinc-600">
            No hay productos con estos filtros.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/45"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Cerrar filtros"
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900">Filtros</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700"
              >
                Cerrar
              </button>
            </div>
            <ProductFilters
              brands={brands}
              categories={categories}
              models={models}
              onNavigate={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
