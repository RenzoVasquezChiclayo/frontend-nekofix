import {
  mapBrandFiltersToQuery,
  type BrandListFiltersInput,
} from "@/lib/mappers/brand-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import type { ApiListResponse } from "@/types/api";
import type { Brand } from "@/types/product";
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
