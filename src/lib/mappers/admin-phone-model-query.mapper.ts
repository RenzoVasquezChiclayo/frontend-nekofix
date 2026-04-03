/**
 * `GET /phone-models` desde el panel admin.
 * Usa `brandId` (UUID); no envía el slug legacy `brand`.
 */

import { toQueryParams } from "@/lib/mappers/base-query.mapper";
import {
  mapPhoneModelSortUiToBackend,
  type PhoneModelListFiltersInput,
} from "@/lib/mappers/phone-model-query.mapper";

export type AdminPhoneModelListFiltersInput = Omit<
  PhoneModelListFiltersInput,
  "brand"
> & {
  brandId?: string;
};

export function mapAdminPhoneModelFiltersToQuery(
  filters: AdminPhoneModelListFiltersInput
): Record<string, string | number | boolean | undefined> {
  const { sort: sortKey, page, limit, search, brandId } = filters;
  const { sortBy, sortOrder } = mapPhoneModelSortUiToBackend(sortKey);

  return toQueryParams({
    page,
    limit,
    search,
    brandId: brandId != null && brandId !== "" ? brandId : undefined,
    sortBy,
    sortOrder,
  });
}
