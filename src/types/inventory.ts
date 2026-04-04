/**
 * Inventario — alineado a movimientos típicos NestJS + Prisma.
 * Ajusta nombres si tu DTO difiere (p. ej. snake_case en JSON).
 */

export type InventoryMoveType = "IN" | "OUT" | "ADJUSTMENT" | "SALE" | "RETURN";

export const INVENTORY_MOVE_LABELS: Record<InventoryMoveType, string> = {
  IN: "Entrada",
  OUT: "Salida",
  ADJUSTMENT: "Ajuste",
  SALE: "Venta",
  RETURN: "Devolución",
};

/** Payload POST /inventory/move */
export interface InventoryMovePayload {
  productId: string;
  type: InventoryMoveType;
  quantity: number;
  notes?: string;
}

/** Respuesta esperada tras mover stock (campos opcionales por variaciones de API). */
export interface InventoryMoveResult {
  productId?: string;
  previousStock?: number;
  newStock?: number;
  stock?: number;
  message?: string;
}

/** Ítem de GET /inventory/history/:productId */
export interface InventoryHistoryEntry {
  id: string;
  productId: string;
  type: InventoryMoveType;
  quantity: number;
  previousStock: number;
  newStock: number;
  notes?: string | null;
  createdAt: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
}
