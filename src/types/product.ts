import type {
  PhoneSeries,
  ProductConditionCatalog,
  ProductGradeCatalog,
} from "@/types/catalog-admin";

/**
 * Tipos alineados al modelo Prisma `Product` y relaciones `Brand`, `Category`, `PhoneModel`.
 */

export type ProductType = "NEW" | "USED" | "ACCESSORY";

/** Clasificación de catálogo (independiente de `type`). */
export type ProductCatalogType = "DEVICE" | "SPARE_PART" | "ACCESSORY";

/** Estado comercial del producto. Legacy sin campo → ACTIVE. */
export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "HIDDEN";

export type ProductCondition =
  | "NEW"
  | "SEMINUEVO"
  | "REFURBISHED"
  | "REPAIRED"
  | "FOR_PARTS";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  /** Equipo, repuesto o accesorio. Legacy sin campo → DEVICE o inferido. */
  catalogType?: ProductCatalogType | null;
  /** Si el API lo expone (conteo de publicados) */
  _count?: { products?: number };
}

export interface PhoneModel {
  id: string;
  name: string;
  slug: string;
  brandId?: string;
  /** Serie asociada (filtro catálogo). */
  seriesId?: string | null;
  brand?: Brand;
  createdAt?: string;
  updatedAt?: string;
}

/** Imagen de galería de producto (relación `productImages` en backend). */
export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

/** Producto con relaciones (respuesta típica del API). */
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  type: ProductType;
  /** Equipo, repuesto o accesorio. Legacy sin campo → DEVICE. */
  catalogType?: ProductCatalogType | null;
  /** Legacy enum; preferir `conditionRef` / `conditionId`. */
  condition: ProductCondition;
  /** UUID de condición administrable. */
  conditionId?: string | null;
  /** Relación expuesta por el backend. */
  conditionRef?: ProductConditionCatalog | null;
  /** UUID de serie (solo equipos). */
  seriesId?: string | null;
  series?: PhoneSeries | null;
  stock: number;
  minStock: number;
  brandId: string;
  categoryId: string;
  modelId: string | null;
  storage: string | null;
  color: string | null;
  /** Hex del acabado (#RGB o #RRGGBB). Prioridad en UI sobre el mapa por nombre. */
  colorHex?: string | null;
  batteryHealth: number | null;
  /** Legacy string; preferir `gradeRef` / `gradeId`. */
  grade: string | null;
  gradeId?: string | null;
  gradeRef?: ProductGradeCatalog | null;
  isFeatured: boolean;
  isPublished: boolean;
  /** Disponibilidad comercial. Legacy sin campo → ACTIVE. */
  status?: ProductStatus | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
  model?: PhoneModel | null;
  /** Galería; puede faltar en respuestas antiguas del API. */
  productImages?: ProductImage[];
}

/** Orden amigable (admin / catálogo). */
export type ProductSortUI =
  | "newest"
  | "oldest"
  | "price_low"
  | "price_high"
  | "stock_low"
  | "stock_high";

/** Valores legacy en URLs del catálogo. */
export type ProductSortLegacy = "relevance" | "price_asc" | "price_desc";

export type ProductSortKey = ProductSortUI | ProductSortLegacy;

/**
 * Query params para GET /products (catálogo público).
 * URLs pueden usar slugs (`brand`, `category`, `model`) o UUIDs; `mapProductFiltersToQuery` serializa ambos.
 * El panel admin usa `AdminProductFiltersInput` y `mapAdminProductFiltersToQuery`
 * (`brandId` / `categoryId` / `modelId`; sin `id` en query: el API no lo soporta).
 */
export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  /** @deprecated Preferir `brandId`. Slug legacy en URLs antiguas. */
  brand?: string;
  /** UUID de marca (filtro hacia el API). */
  brandId?: string;
  /** @deprecated Preferir `categoryId`. Slug legacy en URLs antiguas. */
  category?: string;
  /** UUID de categoría (filtro real hacia el API). */
  categoryId?: string;
  /** @deprecated Preferir `modelId`. Slug legacy en URLs antiguas. */
  model?: string;
  /** UUID de modelo de teléfono (filtro hacia el API). */
  modelId?: string;
  type?: ProductType;
  catalogType?: ProductCatalogType;
  /** Excluye un `catalogType` del listado (tienda sin repuestos). */
  excludeCatalogType?: ProductCatalogType;
  condition?: ProductCondition;
  conditionId?: string;
  gradeId?: string;
  seriesId?: string;
  storage?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  /** true | false como string en query */
  featured?: boolean;
  status?: ProductStatus;
  /**
   * Orden en UI (query string). Se mapea a `sortBy` + `sortOrder` del backend
   * mediante `mapProductFiltersToQuery` (no enviar `sort` al API).
   */
  sort?: ProductSortKey;
}

