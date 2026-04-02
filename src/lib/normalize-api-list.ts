import type { ApiListResponse, PaginationMeta } from "@/types/api";

function emptyMeta(): PaginationMeta {
  return { page: 1, limit: 0, total: 0, totalPages: 0 };
}

export function emptyListResponse<T>(): ApiListResponse<T> {
  return { data: [], meta: emptyMeta() };
}

function coerceNumber(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Interceptor global NestJS (u otro) que envuelve el payload paginado:
 * `{ success, message, data: { data: T[], meta } }`.
 * Se desenrolla hasta obtener `{ data: T[], meta }` para el resto del normalizador.
 */
function unwrapInterceptorListEnvelope(raw: unknown): unknown {
  let current = raw;
  while (current != null && typeof current === "object" && !Array.isArray(current)) {
    const r = current as Record<string, unknown>;
    const inner = r.data;
    if (inner != null && typeof inner === "object" && !Array.isArray(inner)) {
      const innerObj = inner as Record<string, unknown>;
      if (
        Array.isArray(innerObj.data) &&
        innerObj.meta != null &&
        typeof innerObj.meta === "object"
      ) {
        current = inner;
        continue;
      }
    }
    break;
  }
  return current;
}

/**
 * Unifica respuestas del backend al contrato `ApiListResponse<T>`:
 * - Con interceptor: `{ success?, message?, data: { data, meta } }` → se usa el nivel interno
 * - Sin interceptor: `{ data, meta: { page, limit, total, totalPages } }` (Nest estándar)
 * - Legacy `{ data, total, page, pageSize, hasMore }`
 * - Solo `{ data: [] }` sin meta
 * - Array plano `T[]`
 */
export function normalizeApiListResponse<T>(raw: unknown): ApiListResponse<T> {
  const payload = unwrapInterceptorListEnvelope(raw);

  if (payload == null) {
    return emptyListResponse<T>();
  }

  if (Array.isArray(payload)) {
    const data = payload as T[];
    const n = data.length;
    return {
      data,
      meta: { page: 1, limit: n, total: n, totalPages: n > 0 ? 1 : 0 },
    };
  }

  if (typeof payload !== "object") {
    return emptyListResponse<T>();
  }

  const r = payload as Record<string, unknown>;

  if (Array.isArray(r.data) && r.meta && typeof r.meta === "object") {
    const m = r.meta as Record<string, unknown>;
    const data = r.data as T[];
    const page = Math.max(1, coerceNumber(m.page, 1));
    const limit = Math.max(
      0,
      coerceNumber(m.limit, coerceNumber(m.pageSize, data.length))
    );
    const total = Math.max(0, coerceNumber(m.total, data.length));
    const totalPages = Math.max(
      1,
      coerceNumber(
        m.totalPages,
        limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1
      )
    );
    return { data, meta: { page, limit, total, totalPages } };
  }

  if (Array.isArray(r.data)) {
    const data = r.data as T[];
    const total = typeof r.total === "number" ? r.total : data.length;
    const page = typeof r.page === "number" ? r.page : 1;
    const limit =
      typeof r.pageSize === "number"
        ? r.pageSize
        : typeof r.limit === "number"
          ? r.limit
          : data.length;
    const totalPages =
      limit > 0 ? Math.max(1, Math.ceil(total / limit)) : data.length > 0 ? 1 : 0;
    return {
      data,
      meta: { page, limit, total, totalPages },
    };
  }

  return emptyListResponse<T>();
}
