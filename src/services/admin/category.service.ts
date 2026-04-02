import {
  mapCategoryFiltersToQuery,
  type CategoryListFiltersInput,
} from "@/lib/mappers/category-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import type { ApiListResponse } from "@/types/api";
import type { Category } from "@/types/product";
import { adminApiFetch } from "@/services/admin/client";

export type CategoryInput = {
  name: string;
  slug: string;
  icon?: string | null;
};

export async function adminListCategories(
  token: string,
  filters: CategoryListFiltersInput = {}
): Promise<ApiListResponse<Category>> {
  const raw = await adminApiFetch<unknown>("/categories", token, {
    method: "GET",
    searchParams: mapCategoryFiltersToQuery(filters),
  });
  return normalizeApiListResponse<Category>(raw);
}

export async function adminCreateCategory(token: string, body: CategoryInput): Promise<Category> {
  return adminApiFetch<Category>("/categories", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdateCategory(
  token: string,
  id: string,
  body: Partial<CategoryInput>
): Promise<Category> {
  return adminApiFetch<Category>(`/categories/${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function adminDeleteCategory(token: string, id: string): Promise<void> {
  await adminApiFetch<void>(`/categories/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
}
