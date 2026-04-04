import {
  mapBrandFiltersToQuery,
  type BrandListFiltersInput,
} from "@/lib/mappers/brand-query.mapper";
import { ADMIN_BRAND_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { Brand } from "@/types/product";
import { ApiError } from "@/services/api";
import { adminApiFetch } from "@/services/admin/client";

export type BrandInput = {
  name: string;
  slug: string;
  logo?: string | null;
};

export async function adminListBrands(
  token: string,
  filters: BrandListFiltersInput = {}
): Promise<ApiListResponse<Brand>> {
  const raw = await adminApiFetch<unknown>("/brands", token, {
    method: "GET",
    searchParams: mapBrandFiltersToQuery(filters),
  });
  return normalizeApiListResponse<Brand>(raw);
}

/** `GET /brands/:id` — panel admin por UUID (no slug en rutas de edición). */
export async function adminGetBrand(token: string, brandId: string): Promise<Brand> {
  let notFound: ApiError | undefined;
  try {
    const raw = await adminApiFetch<unknown>(`/brands/${encodeURIComponent(brandId)}`, token, {
      method: "GET",
    });
    return normalizeApiSingleResponse<Brand>(raw);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 404) throw e;
    notFound = e;
  }
  const list = await adminListBrands(token, { search: brandId, limit: 50, page: 1 });
  const hit = list.data.find((b) => b.id === brandId);
  if (hit) return hit;
  throw new ApiError(ADMIN_BRAND_NOT_FOUND_MESSAGE, 404, notFound?.body);
}

export async function adminCreateBrand(token: string, body: BrandInput): Promise<Brand> {
  return adminApiFetch<Brand>("/brands", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdateBrand(token: string, id: string, body: Partial<BrandInput>): Promise<Brand> {
  return adminApiFetch<Brand>(`/brands/${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function adminDeleteBrand(token: string, id: string): Promise<void> {
  await adminApiFetch<void>(`/brands/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
}
