import {
  mapCatalogAdminListQuery,
  type CatalogAdminListFilters,
} from "@/lib/mappers/catalog-admin-query.mapper";
import { ADMIN_PHONE_SERIES_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { PhoneSeries } from "@/types/catalog-admin";
import { ApiError } from "@/services/api";
import { adminApiFetch } from "@/services/admin/client";

export type SeriesInput = {
  name: string;
  slug: string;
  brandId: string;
  description?: string | null;
  isActive: boolean;
};

export async function adminListSeries(
  token: string,
  filters: CatalogAdminListFilters = {}
): Promise<ApiListResponse<PhoneSeries>> {
  const raw = await adminApiFetch<unknown>("/phone-series", token, {
    method: "GET",
    searchParams: mapCatalogAdminListQuery(filters),
  });
  return normalizeApiListResponse<PhoneSeries>(raw);
}

export async function adminGetSeries(token: string, id: string): Promise<PhoneSeries> {
  let notFound: ApiError | undefined;
  try {
    const raw = await adminApiFetch<unknown>(`/phone-series/${encodeURIComponent(id)}`, token, {
      method: "GET",
    });
    return normalizeApiSingleResponse<PhoneSeries>(raw);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 404) throw e;
    notFound = e;
  }
  const list = await adminListSeries(token, { search: id, limit: 50, page: 1 });
  const hit = list.data.find((s) => s.id === id);
  if (hit) return hit;
  throw new ApiError(ADMIN_PHONE_SERIES_NOT_FOUND_MESSAGE, 404, notFound?.body);
}

export async function adminCreateSeries(token: string, body: SeriesInput): Promise<PhoneSeries> {
  const raw = await adminApiFetch<unknown>("/phone-series", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<PhoneSeries>(raw);
}

export async function adminUpdateSeries(
  token: string,
  id: string,
  body: Partial<SeriesInput>
): Promise<PhoneSeries> {
  const raw = await adminApiFetch<unknown>(`/phone-series/${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<PhoneSeries>(raw);
}

export async function adminDeleteSeries(token: string, id: string): Promise<void> {
  await adminApiFetch<void>(`/phone-series/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
}

/** Alias legible para vistas admin. */
export const adminListPhoneSeries = adminListSeries;
export const adminGetPhoneSeries = adminGetSeries;
export const adminCreatePhoneSeries = adminCreateSeries;
export const adminUpdatePhoneSeries = adminUpdateSeries;
export const adminDeletePhoneSeries = adminDeleteSeries;
