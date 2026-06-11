import {
  mapCatalogAdminListQuery,
  type CatalogAdminListFilters,
} from "@/lib/mappers/catalog-admin-query.mapper";
import { ADMIN_PRODUCT_CONDITION_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { ProductConditionCatalog } from "@/types/catalog-admin";
import { ApiError } from "@/services/api";
import { adminApiFetch } from "@/services/admin/client";
import type { ProductCatalogType } from "@/types/product";

export type ProductConditionInput = {
  name: string;
  slug: string;
  description?: string | null;
  catalogType: ProductCatalogType;
  sortOrder?: number;
  isActive: boolean;
};

export async function adminListProductConditions(
  token: string,
  filters: CatalogAdminListFilters = {}
): Promise<ApiListResponse<ProductConditionCatalog>> {
  const raw = await adminApiFetch<unknown>("/product-conditions", token, {
    method: "GET",
    searchParams: mapCatalogAdminListQuery(filters),
  });
  return normalizeApiListResponse<ProductConditionCatalog>(raw);
}

export async function adminGetProductCondition(
  token: string,
  id: string
): Promise<ProductConditionCatalog> {
  let notFound: ApiError | undefined;
  try {
    const raw = await adminApiFetch<unknown>(
      `/product-conditions/${encodeURIComponent(id)}`,
      token,
      { method: "GET" }
    );
    return normalizeApiSingleResponse<ProductConditionCatalog>(raw);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 404) throw e;
    notFound = e;
  }
  const list = await adminListProductConditions(token, { search: id, limit: 50, page: 1 });
  const hit = list.data.find((c) => c.id === id);
  if (hit) return hit;
  throw new ApiError(ADMIN_PRODUCT_CONDITION_NOT_FOUND_MESSAGE, 404, notFound?.body);
}

export async function adminCreateProductCondition(
  token: string,
  body: ProductConditionInput
): Promise<ProductConditionCatalog> {
  const raw = await adminApiFetch<unknown>("/product-conditions", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<ProductConditionCatalog>(raw);
}

export async function adminUpdateProductCondition(
  token: string,
  id: string,
  body: Partial<ProductConditionInput>
): Promise<ProductConditionCatalog> {
  const raw = await adminApiFetch<unknown>(
    `/product-conditions/${encodeURIComponent(id)}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
  return normalizeApiSingleResponse<ProductConditionCatalog>(raw);
}

export async function adminDeleteProductCondition(token: string, id: string): Promise<void> {
  await adminApiFetch<void>(`/product-conditions/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
}
