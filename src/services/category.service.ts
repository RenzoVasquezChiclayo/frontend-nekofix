import {
  mapCategoryFiltersToQuery,
  type CategoryListFiltersInput,
} from "@/lib/mappers/category-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { apiFetch } from "@/services/api";
import type { ApiListResponse } from "@/types/api";
import type { Category } from "@/types/product";

/** GET /categories — `data` + `meta`. */
export async function getCategories(
  filters: CategoryListFiltersInput = {}
): Promise<ApiListResponse<Category>> {
  const raw = await apiFetch<unknown>("/categories", {
    searchParams: mapCategoryFiltersToQuery(filters),
    next: { revalidate: 300 },
  });
  return normalizeApiListResponse<Category>(raw);
}
