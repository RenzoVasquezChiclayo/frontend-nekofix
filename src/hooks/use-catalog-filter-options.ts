"use client";

import { useMemo } from "react";
import { filterModelsForCatalog, filterSeriesForBrand } from "@/lib/catalog-models-filter";
import type { CatalogFilterOptions } from "@/lib/load-catalog-filters";

type Params = {
  options: CatalogFilterOptions;
  brandId: string;
  seriesId: string;
};

/**
 * Deriva listas de filtros dependientes (marca → serie → modelo) sin llamadas extra al API.
 */
export function useCatalogFilterOptions({ options, brandId, seriesId }: Params) {
  const seriesForBrand = useMemo(
    () => filterSeriesForBrand(options.series, brandId),
    [options.series, brandId]
  );

  const modelsForSelection = useMemo(
    () =>
      filterModelsForCatalog(options.models, {
        brandId: brandId || undefined,
        seriesId: seriesId || undefined,
      }),
    [options.models, brandId, seriesId]
  );

  return {
    seriesForBrand,
    modelsForSelection,
  };
}
