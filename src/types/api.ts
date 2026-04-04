/**
 * Contratos comunes de respuesta para listados y recursos únicos (NestJS / API).
 * Los servicios deben devolver siempre estas formas; la normalización convierte respuestas legacy.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiSingleResponse<T> {
  data: T;
}

/** Envelope típico con interceptor global (`success` / `message` + `data`). */
export interface ApiEnvelopeResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

/** Alias útil para documentar listados futuros (pedidos, ventas, etc.). */
export type ApiListOf<T> = ApiListResponse<T>;

/** Futuro: `ApiListResponse<Order>` cuando exista el modelo en el front. */
export type OrderListPlaceholder<T = unknown> = ApiListResponse<T>;
