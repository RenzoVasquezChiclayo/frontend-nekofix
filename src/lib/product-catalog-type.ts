import type { Category, Product, ProductCatalogType } from "@/types/product";

const ACCESSORY_CATEGORY_NAMES = new Set(["accesorios", "accesorio"]);
const ACCESSORY_CATEGORY_SLUGS = new Set([
  "accesorios",
  "accesorio",
  "accessories",
  "accessory",
]);

function normalizeCategoryKey(value: string | null | undefined): string {
  if (value == null || !String(value).trim()) return "";
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Categoría legacy de accesorios (fallback si falta `catalogType`). */
export function isAccessoryCategory(category: Pick<Category, "name" | "slug"> | null | undefined): boolean {
  if (!category) return false;
  const name = normalizeCategoryKey(category.name);
  const slug = normalizeCategoryKey(category.slug);
  if (name && ACCESSORY_CATEGORY_NAMES.has(name)) return true;
  if (slug && ACCESSORY_CATEGORY_SLUGS.has(slug)) return true;
  if (name.includes("accesorio")) return true;
  if (slug.startsWith("accesor") || slug.startsWith("accessor")) return true;
  return false;
}

export const PRODUCT_CATALOG_TYPES: ProductCatalogType[] = [
  "DEVICE",
  "SPARE_PART",
  "ACCESSORY",
];

const CATALOG_TYPES = PRODUCT_CATALOG_TYPES;

export function isProductCatalogType(value: string | null | undefined): value is ProductCatalogType {
  return CATALOG_TYPES.includes(value as ProductCatalogType);
}

/**
 * Resuelve `catalogType` del API o infiere desde categoría legacy.
 * Productos sin campo → DEVICE (compatibilidad con datos existentes).
 */
export function resolveProductCatalogType(
  product: Pick<Product, "catalogType" | "category">
): ProductCatalogType {
  if (product.catalogType && isProductCatalogType(product.catalogType)) {
    return product.catalogType;
  }
  if (isAccessoryCategory(product.category)) return "ACCESSORY";
  return "DEVICE";
}

export function isDeviceCatalogType(
  product: Pick<Product, "catalogType" | "category">
): boolean {
  return resolveProductCatalogType(product) === "DEVICE";
}

export function isSparePartCatalogType(
  product: Pick<Product, "catalogType" | "category">
): boolean {
  return resolveProductCatalogType(product) === "SPARE_PART";
}

export function isAccessoryCatalogType(
  product: Pick<Product, "catalogType" | "category">
): boolean {
  return resolveProductCatalogType(product) === "ACCESSORY";
}

/** Ruta de listado según catálogo del producto. */
export function getCatalogBasePath(
  product: Pick<Product, "catalogType" | "category">
): "/catalogo" | "/repuestos" {
  return isSparePartCatalogType(product) ? "/repuestos" : "/catalogo";
}

/** Variantes por grado solo aplican a equipos usados. */
export function shouldUseUsedGradeDetail(
  product: Pick<Product, "type" | "catalogType" | "category">
): boolean {
  return product.type === "USED" && isDeviceCatalogType(product);
}

const SPARE_PART_CATEGORY_NAMES = new Set(["repuestos", "repuesto", "spare parts"]);
const SPARE_PART_CATEGORY_SLUGS = new Set([
  "repuestos",
  "repuesto",
  "spare-parts",
  "spare-part",
]);

function isSparePartCategory(category: Pick<Category, "name" | "slug"> | null | undefined): boolean {
  if (!category) return false;
  const name = normalizeCategoryKey(category.name);
  const slug = normalizeCategoryKey(category.slug);
  if (name && SPARE_PART_CATEGORY_NAMES.has(name)) return true;
  if (slug && SPARE_PART_CATEGORY_SLUGS.has(slug)) return true;
  if (name.includes("repuesto") || slug.includes("repuesto")) return true;
  return false;
}

/** `catalogType` de categoría; fallback por nombre/slug legacy. */
export function resolveCategoryCatalogType(
  category: Pick<Category, "catalogType" | "name" | "slug">
): ProductCatalogType {
  if (category.catalogType && isProductCatalogType(category.catalogType)) {
    return category.catalogType;
  }
  if (isSparePartCategory(category)) return "SPARE_PART";
  if (isAccessoryCategory(category)) return "ACCESSORY";
  return "DEVICE";
}

export function filterCategoriesByCatalogType(
  categories: Category[],
  catalogType: ProductCatalogType
): Category[] {
  return categories.filter((c) => resolveCategoryCatalogType(c) === catalogType);
}
