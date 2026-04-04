import type { ApiListResponse } from "@/types/api";

/** Tamaño de página al cargar listas completas para selects (evita `limit` altos y `sortBy=name` si el API no lo acepta). */
export const ADMIN_SELECT_PAGE_SIZE = 100;

/**
 * Recorre todas las páginas de un listado admin hasta vaciar `totalPages`.
 * Usar con `sort: "newest"` en el fetcher para máxima compatibilidad con el backend.
 */
export async function fetchAllAdminPages<T>(
  fetchPage: (page: number) => Promise<ApiListResponse<T>>
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  for (;;) {
    const res = await fetchPage(page);
    all.push(...res.data);
    if (page >= res.meta.totalPages || res.data.length === 0) break;
    page += 1;
  }
  return all;
}
