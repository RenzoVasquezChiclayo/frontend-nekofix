import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogLayout } from "@/components/catalog/CatalogLayout";
import { parseProductListQuery, sanitizeQueryForCatalogMode } from "@/lib/catalog-query";
import { emptyListResponse } from "@/lib/normalize-api-list";
import { loadCatalogFilterOptions } from "@/lib/load-catalog-filters";
import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Catálogo · ${SITE_NAME}`,
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = sanitizeQueryForCatalogMode(
    parseProductListQuery(sp, {
      defaults: { excludeCatalogType: "SPARE_PART" },
    }),
    "store"
  );

  const [filterOptions, result] = await Promise.all([
    loadCatalogFilterOptions("store"),
    getProducts(query).catch(() => emptyListResponse<Product>()),
  ]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-6 sm:mb-10">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl md:text-4xl">
          Tienda
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Equipos y accesorios alineados a nuestro inventario. Filtra por marca,
          categoría, condición y más.
        </p>
      </header>
      <Suspense fallback={null}>
        <CatalogLayout
          basePath="/catalogo"
          filterMode="store"
          filterOptions={filterOptions}
          products={result.data}
          meta={result.meta}
        />
      </Suspense>
    </div>
  );
}
