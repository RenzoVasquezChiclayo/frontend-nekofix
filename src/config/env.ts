/**
 * Variables de entorno públicas (NEXT_PUBLIC_*).
 * El backend NestJS vive en otro origen; la URL base se configura aquí.
 */
function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === "") {
    if (process.env.NODE_ENV === "development") {
      return fallback ?? "";
    }
    console.warn(`[env] Falta ${name}`);
  }
  return v ?? "";
}

/**
 * Origen de archivos estáticos (p. ej. `/uploads/...`), distinto del prefijo `/api` del REST.
 * Preferir `NEXT_PUBLIC_MEDIA_URL`. Si falta, se deduce quitando `/api` al final de la URL del API (compat).
 */
function resolveMediaBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_MEDIA_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const api = required("NEXT_PUBLIC_API_URL", "http://localhost:3005/api");
  const trimmed = api.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) return trimmed.slice(0, -4);
  return trimmed;
}

export const env = {
  apiBaseUrl: required("NEXT_PUBLIC_API_URL", "http://localhost:3005/api"),
  /** Base para rutas relativas de medios (`/uploads/...`). No incluye `/api`. */
  mediaBaseUrl: resolveMediaBaseUrl(),
  siteUrl: required("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  whatsappNumber: required("NEXT_PUBLIC_WHATSAPP", "51917688459"),
  whatsappDefaultMessage: required(
    "NEXT_PUBLIC_WHATSAPP_MESSAGE",
    "Hola, quiero información sobre NekoFix."
  ),
  /** Opcional: URL de embed de mapa (Google Maps iframe src) */
  mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL ?? "",
} as const;
