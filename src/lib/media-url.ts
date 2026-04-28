import { env } from "@/config/env";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";

/**
 * Resuelve URLs de archivos estáticos (productos, futuras marcas/categorías, CDN).
 * - Absoluta `http(s)://` → se usa tal cual (compat con datos legacy o CDN).
 * - `//host/...` (protocol-relative) → se normaliza a `https://...`.
 * - `data:image/...` → se usa tal cual.
 * - Relativa (`/uploads/...` u otra) → se antepone `NEXT_PUBLIC_MEDIA_URL`.
 */
export function resolveMediaUrl(
  url: string | null | undefined,
  options?: { placeholder?: string }
): string {
  const placeholder = options?.placeholder ?? PRODUCT_PLACEHOLDER_IMAGE;
  if (!url || typeof url !== "string") return placeholder;
  const t = url.trim();
  if (t === "") return placeholder;
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.startsWith("//")) return `https:${t}`;
  if (t.startsWith("data:image/")) return t;
  const base = env.mediaBaseUrl.replace(/\/$/, "");
  const path = t.startsWith("/") ? t : `/${t}`;
  return `${base}${path}`;
}
