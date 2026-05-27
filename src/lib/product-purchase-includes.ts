import type { Category, Product } from "@/types/product";

/** Nombres de categoría considerados accesorios (normalizados). */
const ACCESSORY_CATEGORY_NAMES = new Set(["accesorios", "accesorio"]);

/** Slugs de categoría considerados accesorios (normalizados). */
const ACCESSORY_CATEGORY_SLUGS = new Set([
  "accesorios",
  "accesorio",
  "accessories",
  "accessory",
]);

/** Normaliza nombre/slug de categoría: trim, minúsculas, sin acentos. */
export function normalizeCategoryKey(value: string | null | undefined): string {
  if (value == null || !String(value).trim()) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

type CategoryRef = Pick<Category, "name" | "slug">;

/**
 * Categoría de accesorios (cables, cargadores, cases, etc.).
 * Tolerante a mayúsculas, acentos y slugs en inglés.
 */
export function isAccessoryCategory(category: CategoryRef | null | undefined): boolean {
  if (!category) return false;

  const name = normalizeCategoryKey(category.name);
  const slug = normalizeCategoryKey(category.slug);

  if (name && ACCESSORY_CATEGORY_NAMES.has(name)) return true;
  if (slug && ACCESSORY_CATEGORY_SLUGS.has(slug)) return true;

  if (name.includes("accesorio")) return true;
  if (slug.startsWith("accesor") || slug.startsWith("accessor")) return true;

  return false;
}

/**
 * Muestra “¿Qué incluye tu compra?” solo en equipos/smartphones,
 * no en la categoría Accesorios.
 */
export function shouldShowProductPurchaseIncludes(
  product: Pick<Product, "category">
): boolean {
  return !isAccessoryCategory(product.category);
}
