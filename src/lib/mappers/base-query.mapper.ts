/**
 * Contrato común para listados paginados frente al backend NestJS:
 * `sort` (UI) → `sortBy` + `sortOrder` (nunca enviar `sort` en query).
 */

export type SortOrder = "asc" | "desc";

/** Orden simple por fecha de creación (marcas, categorías, historiales, etc.). */
export type BaseListSortKey = "newest" | "oldest";

export type BaseListQueryInput = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: BaseListSortKey;
};

export type BaseListQueryBackend = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy: "createdAt";
  sortOrder: SortOrder;
};

export function mapBaseListSortToBackend(
  sort?: BaseListSortKey
): Pick<BaseListQueryBackend, "sortBy" | "sortOrder"> {
  if (sort === "oldest") {
    return { sortBy: "createdAt", sortOrder: "asc" };
  }
  return { sortBy: "createdAt", sortOrder: "desc" };
}

/**
 * Listados genéricos: paginación, búsqueda y orden por `createdAt`.
 */
export function mapBaseListQuery(
  filters: BaseListQueryInput
): Record<string, string | number | boolean | undefined> {
  const { sort, page, limit, search } = filters;
  const { sortBy, sortOrder } = mapBaseListSortToBackend(sort);
  return toQueryParams({ page, limit, search, sortBy, sortOrder });
}

/**
 * Elimina `undefined` / `null` para serializar query string sin claves vacías.
 */
export function toQueryParams(
  record: Record<string, string | number | boolean | undefined | null>
): Record<string, string | number | boolean | undefined> {
  const out: Record<string, string | number | boolean | undefined> = {};
  for (const [k, v] of Object.entries(record)) {
    if (v === undefined || v === null) continue;
    out[k] = v;
  }
  return out;
}
