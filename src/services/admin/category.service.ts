import {
  mapCategoryFiltersToQuery,
  type CategoryListFiltersInput,
} from "@/lib/mappers/category-query.mapper";
import { ADMIN_CATEGORY_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { Category } from "@/types/product";
import { ApiError } from "@/services/api";
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

/** `GET /categories/:id` — panel admin por UUID. */
export async function adminGetCategory(token: string, categoryId: string): Promise<Category> {
  let notFound: ApiError | undefined;
  try {
    const raw = await adminApiFetch<unknown>(`/categories/${encodeURIComponent(categoryId)}`, token, {
      method: "GET",
    });
    return normalizeApiSingleResponse<Category>(raw);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 404) throw e;
    notFound = e;
  }
  const list = await adminListCategories(token, { search: categoryId, limit: 50, page: 1 });
  const hit = list.data.find((c) => c.id === categoryId);
  if (hit) return hit;
  throw new ApiError(ADMIN_CATEGORY_NOT_FOUND_MESSAGE, 404, notFound?.body);
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
