export const SITE_NAME = "NekoFix";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/catalogo", label: "Tienda" },
  { href: "/categorias", label: "Categorías" },
  { href: "/contacto", label: "Contacto" },
] as const;

/** Marcas mostradas en landing (estático hasta conectar con API). */
export const FEATURED_BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "Xiaomi",
  "Motorola",
  "OnePlus",
] as const;
