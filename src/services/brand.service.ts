import {
  mapBrandFiltersToQuery,
  type BrandListFiltersInput,
} from "@/lib/mappers/brand-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { apiFetch } from "@/services/api";
import type { ApiListResponse } from "@/types/api";
import type { Brand } from "@/types/product";

/** GET /brands — `data` + `meta`. */
export async function getBrands(
  filters: BrandListFiltersInput = {}
): Promise<ApiListResponse<Brand>> {
  const raw = await apiFetch<unknown>("/brands", {
    searchParams: mapBrandFiltersToQuery(filters),
    next: { revalidate: 300 },
  });
  return normalizeApiListResponse<Brand>(raw);
}
