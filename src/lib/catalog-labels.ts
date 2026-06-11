import type { ProductCatalogType, ProductCondition, ProductType } from "@/types/product";

export const CATALOG_TYPE_LABELS: Record<ProductCatalogType, string> = {
  DEVICE: "Equipo",
  SPARE_PART: "Repuesto",
  ACCESSORY: "Accesorio",
};

/** Etiquetas plurales para listados admin de categorías. */
export const CATALOG_TYPE_PLURAL_LABELS: Record<ProductCatalogType, string> = {
  DEVICE: "Equipos",
  SPARE_PART: "Repuestos",
  ACCESSORY: "Accesorios",
};

export const CATALOG_TYPE_BADGE_CLASS: Record<ProductCatalogType, string> = {
  DEVICE: "bg-primary-100 text-primary-800",
  SPARE_PART: "bg-violet-100 text-violet-800",
  ACCESSORY: "bg-amber-100 text-amber-900",
};

/** Badges de catálogo en tabla de categorías (DEVICE azul, ACCESSORY verde, SPARE_PART naranja). */
export const CATEGORY_CATALOG_BADGE_CLASS: Record<ProductCatalogType, string> = {
  DEVICE: "bg-sky-100 text-sky-900",
  ACCESSORY: "bg-emerald-100 text-emerald-800",
  SPARE_PART: "bg-orange-100 text-orange-900",
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  NEW: "Nuevo",
  USED: "Usado",
  ACCESSORY: "Accesorio",
};

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  NEW: "Nuevo",
  SEMINUEVO: "Seminuevo",
  REFURBISHED: "Reacondicionado",
  REPAIRED: "Reparado",
  FOR_PARTS: "Para repuestos",
};
