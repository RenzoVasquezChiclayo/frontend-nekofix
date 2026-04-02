import {
  mapInventoryHistoryQueryToParams,
  type InventoryHistoryListFilters,
} from "@/lib/mappers/inventory-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import type { ApiListResponse } from "@/types/api";
import type {
  InventoryHistoryEntry,
  InventoryMovePayload,
  InventoryMoveResult,
} from "@/types/inventory";
import { adminApiFetch } from "@/services/admin/client";

export type { InventoryHistoryListFilters } from "@/lib/mappers/inventory-query.mapper";

export async function adminMoveInventory(
  token: string,
  payload: InventoryMovePayload
): Promise<InventoryMoveResult> {
  return adminApiFetch<InventoryMoveResult>("/inventory/move", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Historial por producto (`GET /inventory/history/:productId` + query opcional).
 */
export async function adminGetInventoryHistory(
  token: string,
  productId: string,
  listFilters?: Omit<InventoryHistoryListFilters, "productId">
): Promise<ApiListResponse<InventoryHistoryEntry>> {
  const searchParams = listFilters
    ? mapInventoryHistoryQueryToParams(listFilters)
    : undefined;
  const raw = await adminApiFetch<unknown>(
    `/inventory/history/${encodeURIComponent(productId)}`,
    token,
    { method: "GET", searchParams }
  );
  return normalizeApiListResponse<InventoryHistoryEntry>(raw);
}
