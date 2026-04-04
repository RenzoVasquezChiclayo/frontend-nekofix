import {
  mapBaseListQuery,
  toQueryParams,
  type BaseListQueryInput,
} from "@/lib/mappers/base-query.mapper";
import type { InventoryMoveType } from "@/types/inventory";

/**
 * Filtros para historial de inventario (listado).
 * `productId` suele ir en path: `GET /inventory/history/:productId`; el resto como query.
 */
export type InventoryHistoryListFilters = {
  productId: string;
  movementType?: InventoryMoveType;
  dateFrom?: string;
  dateTo?: string;
} & BaseListQueryInput;

/** Params de query excluyendo `productId` (útil con path param). */
export function mapInventoryHistoryQueryToParams(
  filters: Omit<InventoryHistoryListFilters, "productId">
): Record<string, string | number | boolean | undefined> {
  const { movementType, dateFrom, dateTo, page, limit, search, sort } = filters;
  const base = mapBaseListQuery({ page, limit, search, sort });
  return toQueryParams({
    ...base,
    movementType,
    dateFrom,
    dateTo,
  });
}

/** Params completos (incluye `productId`) por si el backend expone un solo GET con query. */
export function mapInventoryHistoryListQuery(
  filters: InventoryHistoryListFilters
): Record<string, string | number | boolean | undefined> {
  const { productId, ...rest } = filters;
  return toQueryParams({
    productId,
    ...mapInventoryHistoryQueryToParams(rest),
  });
}
