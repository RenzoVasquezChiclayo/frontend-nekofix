import {
  mapCatalogAdminListQuery,
  type CatalogAdminListFilters,
} from "@/lib/mappers/catalog-admin-query.mapper";
import { ADMIN_PRODUCT_GRADE_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { ProductGradeCatalog } from "@/types/catalog-admin";
import { ApiError } from "@/services/api";
import { adminApiFetch } from "@/services/admin/client";
import type { ProductCatalogType } from "@/types/product";

export type ProductGradeInput = {
  name: string;
  description?: string | null;
  catalogType: ProductCatalogType;
  sortOrder?: number;
  isActive: boolean;
};

export async function adminListProductGrades(
  token: string,
  filters: CatalogAdminListFilters = {}
): Promise<ApiListResponse<ProductGradeCatalog>> {
  const raw = await adminApiFetch<unknown>("/product-grades", token, {
    method: "GET",
    searchParams: mapCatalogAdminListQuery(filters),
  });
  return normalizeApiListResponse<ProductGradeCatalog>(raw);
}

export async function adminGetProductGrade(
  token: string,
  id: string
): Promise<ProductGradeCatalog> {
  let notFound: ApiError | undefined;
  try {
    const raw = await adminApiFetch<unknown>(`/product-grades/${encodeURIComponent(id)}`, token, {
      method: "GET",
    });
    return normalizeApiSingleResponse<ProductGradeCatalog>(raw);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 404) throw e;
    notFound = e;
  }
  const list = await adminListProductGrades(token, { search: id, limit: 50, page: 1 });
  const hit = list.data.find((g) => g.id === id);
  if (hit) return hit;
  throw new ApiError(ADMIN_PRODUCT_GRADE_NOT_FOUND_MESSAGE, 404, notFound?.body);
}

export async function adminCreateProductGrade(
  token: string,
  body: ProductGradeInput
): Promise<ProductGradeCatalog> {
  const raw = await adminApiFetch<unknown>("/product-grades", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<ProductGradeCatalog>(raw);
}

export async function adminUpdateProductGrade(
  token: string,
  id: string,
  body: Partial<ProductGradeInput>
): Promise<ProductGradeCatalog> {
  const raw = await adminApiFetch<unknown>(`/product-grades/${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<ProductGradeCatalog>(raw);
}

export async function adminDeleteProductGrade(token: string, id: string): Promise<void> {
  await adminApiFetch<void>(`/product-grades/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
}
