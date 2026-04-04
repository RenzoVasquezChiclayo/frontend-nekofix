/**
 * Unifica respuestas de recurso único al contrato `T`:
 * - Con interceptor: `{ success?, message?, data: T }`
 * - Estándar: `{ data: T }`
 * - Legacy: cuerpo plano `T`
 */
export function normalizeApiSingleResponse<T>(raw: unknown): T {
  if (raw == null) {
    throw new Error("Respuesta vacía");
  }
  if (typeof raw !== "object") {
    return raw as T;
  }
  const r = raw as Record<string, unknown>;
  if ("data" in r && r.data !== undefined && r.data !== null) {
    return r.data as T;
  }
  return raw as T;
}
