import type { ProductKind } from "@/types/product";

export const SITE_NAME = "NekoFix";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const PRODUCT_KIND_LABELS: Record<ProductKind, string> = {
  nuevo: "Nuevo",
  seminuevo: "Seminuevo",
  accesorio: "Accesorio",
};

export const WEAR_GRADE_LABELS = {
  excelente: "Excelente",
  muy_bueno: "Muy bueno",
  bueno: "Bueno",
  aceptable: "Aceptable",
} as const;

/** Marcas mostradas en landing (pueden venir del API después) */
export const FEATURED_BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "Xiaomi",
  "Motorola",
  "OnePlus",
] as const;
