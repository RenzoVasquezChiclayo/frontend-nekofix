import { toQueryParams } from "@/lib/mappers/base-query.mapper";

/**
 * Ordenación en UI para listados de marcas (mismo patrón que `ProductSortKey` en productos).
 */
export type BrandSortKey = "newest" | "oldest" | "name_asc" | "name_desc";

/** DTO de query que espera NestJS (`sortBy` / `sortOrder`, sin `sort` legacy). */
export type BrandQueryBackend = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy: "createdAt" | "name";
  sortOrder: "asc" | "desc";
};

export type BrandListFiltersInput = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: BrandSortKey;
};

export type BrandSortBackend = Pick<BrandQueryBackend, "sortBy" | "sortOrder">;

/**
 * Traduce la clave de orden UI al par `sortBy` / `sortOrder` del backend.
 * Alineado con `mapSortUiToBackend` de productos.
 */
export function mapBrandSortUiToBackend(sort?: BrandSortKey): BrandSortBackend {
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

/**
 * `GET /brands`: paginación + búsqueda + `sortBy`/`sortOrder`.
 * Usa `toQueryParams` del mapper base para consistencia con productos.
 */
export function mapBrandFiltersToQuery(
  filters: BrandListFiltersInput
): Record<string, string | number | boolean | undefined> {
  const { sort: sortKey, page, limit, search } = filters;
  const { sortBy, sortOrder } = mapBrandSortUiToBackend(sortKey);

  return toQueryParams({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });
}
