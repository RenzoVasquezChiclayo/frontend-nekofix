/**
 * Query string para `GET /products` desde el panel admin.
 * Solo envía `brandId`, `categoryId`, `modelId` (UUID); nunca slugs `brand` / `category` / `model`.
 *
 * El catálogo público sigue usando `mapProductFiltersToQuery` con slugs en URL cuando aplica.
 */

import { toQueryParams } from "@/lib/mappers/base-query.mapper";
import {
  mapSortUiToBackend,
  normalizeFeatured,
  type ProductFiltersInput,
} from "@/lib/mappers/product-query.mapper";

/** Filtros de listado admin: sin campos slug legacy hacia el API. */
export type AdminProductFiltersInput = Omit<
  ProductFiltersInput,
  "brand" | "category" | "model"
>;

export function mapAdminProductFiltersToQuery(
  filters: AdminProductFiltersInput
): Record<string, string | number | boolean | undefined> {
  const { sort: sortKey, featured, isFeatured, ...rest } = filters;
  const { sortBy, sortOrder } = mapSortUiToBackend(sortKey);

  return toQueryParams({
    page: rest.page,
    limit: rest.limit,
    search: rest.search,
    sortBy,
    sortOrder,
    brandId:
      rest.brandId != null && rest.brandId !== "" ? rest.brandId : undefined,
    categoryId:
      rest.categoryId != null && rest.categoryId !== ""
        ? rest.categoryId
        : undefined,
    modelId:
      rest.modelId != null && rest.modelId !== "" ? rest.modelId : undefined,
    type: rest.type,
    condition: rest.condition,
    storage: rest.storage,
    color: rest.color,
    minPrice: rest.minPrice,
    maxPrice: rest.maxPrice,
    featured: normalizeFeatured(featured, isFeatured),
    isPublished: rest.isPublished,
    lowStock: rest.lowStock,
  });
}
