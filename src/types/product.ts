/**
 * Tipos alineados al modelo Prisma `Product` y relaciones `Brand`, `Category`, `PhoneModel`.
 */

export type ProductType = "NEW" | "USED" | "ACCESSORY";

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
  /** Si el API lo expone (conteo de publicados) */
  _count?: { products?: number };
}

export interface PhoneModel {
  id: string;
  name: string;
  slug: string;
  brandId?: string;
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
  condition: ProductCondition;
  stock: number;
  minStock: number;
  brandId: string;
  categoryId: string;
  modelId: string | null;
  storage: string | null;
  color: string | null;
  batteryHealth: number | null;
  grade: string | null;
  isFeatured: boolean;
  isPublished: boolean;
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
 * El panel admin usa `AdminProductFiltersInput` y `mapAdminProductFiltersToQuery` (solo `brandId` / `categoryId` / `modelId`).
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
  condition?: ProductCondition;
  storage?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  /** true | false como string en query */
  featured?: boolean;
  /**
   * Orden en UI (query string). Se mapea a `sortBy` + `sortOrder` del backend
   * mediante `mapProductFiltersToQuery` (no enviar `sort` al API).
   */
  sort?: ProductSortKey;
}

