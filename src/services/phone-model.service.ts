import { mapBaseListQuery, type BaseListQueryInput } from "@/lib/mappers/base-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { apiFetch } from "@/services/api";
import type { ApiListResponse } from "@/types/api";
import type { PhoneModel } from "@/types/product";

/** GET /phone-models — `data` + `meta`. */
export async function getPhoneModels(
  filters: BaseListQueryInput = {}
): Promise<ApiListResponse<PhoneModel>> {
  const raw = await apiFetch<unknown>("/phone-models", {
    searchParams: mapBaseListQuery(filters),
    next: { revalidate: 300 },
  });
  return normalizeApiListResponse<PhoneModel>(raw);
}
