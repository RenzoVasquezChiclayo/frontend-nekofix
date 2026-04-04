import { toQueryParams } from "@/lib/mappers/base-query.mapper";

export type PhoneModelSortKey = "newest" | "oldest" | "name_asc" | "name_desc";

export type PhoneModelQueryBackend = {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  sortBy: "createdAt" | "name";
  sortOrder: "asc" | "desc";
};

export type PhoneModelListFiltersInput = {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  sort?: PhoneModelSortKey;
};

export type PhoneModelSortBackend = Pick<PhoneModelQueryBackend, "sortBy" | "sortOrder">;

/** Exportado para `mapAdminPhoneModelFiltersToQuery`. */
export function mapPhoneModelSortUiToBackend(sort?: PhoneModelSortKey): PhoneModelSortBackend {
  switch (sort) {
    case "oldest":
      return { sortBy: "createdAt", sortOrder: "asc" };
    case "name_asc":
      return { sortBy: "name", sortOrder: "asc" };
    case "name_desc":
      return { sortBy: "name", sortOrder: "desc" };
    case "newest":
    default:
      return { sortBy: "createdAt", sortOrder: "desc" };
  }
}

export function mapPhoneModelFiltersToQuery(
  filters: PhoneModelListFiltersInput
): Record<string, string | number | boolean | undefined> {
  const { sort: sortKey, page, limit, search, brand } = filters;
  const { sortBy, sortOrder } = mapPhoneModelSortUiToBackend(sortKey);
  return toQueryParams({
    page,
    limit,
    search,
    brand,
    sortBy,
    sortOrder,
  });
}
