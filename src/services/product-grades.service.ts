import {
  mapCatalogAdminListQuery,
  type CatalogAdminListFilters,
} from "@/lib/mappers/catalog-admin-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { apiFetch } from "@/services/api";
import type { ApiListResponse } from "@/types/api";
import type { ProductGradeCatalog } from "@/types/catalog-admin";

const CATALOG_REVALIDATE = 300;

/** GET /product-grades — catálogo público. */
export async function getProductGrades(
  filters: CatalogAdminListFilters = {}
): Promise<ApiListResponse<ProductGradeCatalog>> {
  const raw = await apiFetch<unknown>("/product-grades", {
    searchParams: mapCatalogAdminListQuery({
      ...filters,
      isActive: filters.isActive ?? true,
    }),
    next: { revalidate: CATALOG_REVALIDATE },
  });
  return normalizeApiListResponse<ProductGradeCatalog>(raw);
}
