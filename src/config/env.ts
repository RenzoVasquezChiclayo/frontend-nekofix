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

export const env = {
  apiBaseUrl: required("NEXT_PUBLIC_API_URL", "http://localhost:3005/api"),
  siteUrl: required("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  whatsappNumber: required("NEXT_PUBLIC_WHATSAPP", "51917688459"),
  whatsappDefaultMessage: required(
    "NEXT_PUBLIC_WHATSAPP_MESSAGE",
    "Hola, quiero información sobre NekoFix."
  ),
  /** Opcional: URL de embed de mapa (Google Maps iframe src) */
  mapEmbedUrl: process.env.NEXT_PUBLIC_MAP_EMBED_URL ?? "",
} as const;
