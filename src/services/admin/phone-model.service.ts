import {
  mapAdminPhoneModelFiltersToQuery,
  type AdminPhoneModelListFiltersInput,
} from "@/lib/mappers/admin-phone-model-query.mapper";
import { ADMIN_PHONE_MODEL_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { PhoneModel } from "@/types/product";
import { ApiError } from "@/services/api";
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

/** `GET /phone-models/:id` — panel admin por UUID. */
export async function adminGetPhoneModel(
  token: string,
  phoneModelId: string
): Promise<AdminPhoneModel> {
  let notFound: ApiError | undefined;
  try {
    const raw = await adminApiFetch<unknown>(
      `/phone-models/${encodeURIComponent(phoneModelId)}`,
      token,
      { method: "GET" }
    );
    return normalizeApiSingleResponse<AdminPhoneModel>(raw);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 404) throw e;
    notFound = e;
  }
  const list = await adminListPhoneModels(token, { search: phoneModelId, limit: 50, page: 1 });
  const hit = list.data.find((m) => m.id === phoneModelId);
  if (hit) return hit;
  throw new ApiError(ADMIN_PHONE_MODEL_NOT_FOUND_MESSAGE, 404, notFound?.body);
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
