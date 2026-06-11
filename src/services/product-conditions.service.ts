import {
  mapCatalogAdminListQuery,
  type CatalogAdminListFilters,
} from "@/lib/mappers/catalog-admin-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { apiFetch } from "@/services/api";
import type { ApiListResponse } from "@/types/api";
import type { ProductConditionCatalog } from "@/types/catalog-admin";

const CATALOG_REVALIDATE = 300;

/** GET /product-conditions — catálogo público. */
export async function getProductConditions(
  filters: CatalogAdminListFilters = {}
): Promise<ApiListResponse<ProductConditionCatalog>> {
  const raw = await apiFetch<unknown>("/product-conditions", {
    searchParams: mapCatalogAdminListQuery({
      ...filters,
      isActive: filters.isActive ?? true,
    }),
    next: { revalidate: CATALOG_REVALIDATE },
  });
  return normalizeApiListResponse<ProductConditionCatalog>(raw);
}
