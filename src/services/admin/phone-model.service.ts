import {
  mapAdminPhoneModelFiltersToQuery,
  type AdminPhoneModelListFiltersInput,
} from "@/lib/mappers/admin-phone-model-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import type { ApiListResponse } from "@/types/api";
import type { PhoneModel } from "@/types/product";
import { adminApiFetch } from "@/services/admin/client";

export type AdminPhoneModel = PhoneModel & {
  brandId: string;
  brand?: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt?: string;
};

export type PhoneModelInput = {
  name: string;
  slug: string;
  brandId: string;
};

export async function adminListPhoneModels(
  token: string,
  filters: AdminPhoneModelListFiltersInput = {}
): Promise<ApiListResponse<AdminPhoneModel>> {
  const raw = await adminApiFetch<unknown>("/phone-models", token, {
    method: "GET",
    searchParams: mapAdminPhoneModelFiltersToQuery(filters),
  });
  return normalizeApiListResponse<AdminPhoneModel>(raw);
}

export async function adminCreatePhoneModel(
  token: string,
  body: PhoneModelInput
): Promise<AdminPhoneModel> {
  return adminApiFetch<AdminPhoneModel>("/phone-models", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdatePhoneModel(
  token: string,
  id: string,
  body: Partial<PhoneModelInput>
): Promise<AdminPhoneModel> {
  return adminApiFetch<AdminPhoneModel>(`/phone-models/${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function adminDeletePhoneModel(token: string, id: string): Promise<void> {
  await adminApiFetch<void>(`/phone-models/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
}

export type { AdminPhoneModelListFiltersInput } from "@/lib/mappers/admin-phone-model-query.mapper";
