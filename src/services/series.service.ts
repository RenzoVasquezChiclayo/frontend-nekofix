import {
  mapCatalogAdminListQuery,
  type CatalogAdminListFilters,
} from "@/lib/mappers/catalog-admin-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { apiFetch } from "@/services/api";
import type { ApiListResponse } from "@/types/api";
import type { PhoneSeries } from "@/types/catalog-admin";

const CATALOG_REVALIDATE = 300;

/** GET /phone-series — catálogo público (series activas). */
export async function getPhoneSeries(
  filters: CatalogAdminListFilters = {}
): Promise<ApiListResponse<PhoneSeries>> {
  const raw = await apiFetch<unknown>("/phone-series", {
    searchParams: mapCatalogAdminListQuery({
      ...filters,
      isActive: filters.isActive ?? true,
    }),
    next: { revalidate: CATALOG_REVALIDATE },
  });
  return normalizeApiListResponse<PhoneSeries>(raw);
}
