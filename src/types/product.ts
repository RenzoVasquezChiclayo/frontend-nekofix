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

/** Query params para GET /products (snake_case opcional según backend; usamos camelCase en TS y mapeamos al enviar). */
export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  /** slug de marca */
  brand?: string;
  /** slug de categoría */
  category?: string;
  /** slug de modelo */
  model?: string;
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

