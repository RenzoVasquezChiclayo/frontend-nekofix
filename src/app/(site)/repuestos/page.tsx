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
  title: "Repuestos",
  description: `Repuestos y microelectrónica para smartphones · ${SITE_NAME}`,
};

export default async function RepuestosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = sanitizeQueryForCatalogMode(
    parseProductListQuery(sp, {
      defaults: { catalogType: "SPARE_PART" },
    }),
    "spare_parts"
  );
  query.catalogType = "SPARE_PART";
  query.excludeCatalogType = undefined;

  const [filterOptions, result] = await Promise.all([
    loadCatalogFilterOptions("spare_parts"),
    getProducts(query).catch(() => emptyListResponse<Product>()),
  ]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-6 sm:mb-10">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl md:text-4xl">
          Repuestos
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Pantallas, baterías, flex, sensores y microelectrónica para tu reparación.
          Filtra por marca, categoría y modelo compatible.
        </p>
      </header>
      <Suspense fallback={null}>
        <CatalogLayout
          basePath="/repuestos"
          filterMode="spare_parts"
          filterOptions={filterOptions}
          products={result.data}
          meta={result.meta}
        />
      </Suspense>
    </div>
  );
}
