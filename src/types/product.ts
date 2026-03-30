/** Tipo de producto en catálogo */
export type ProductKind = "nuevo" | "seminuevo" | "accesorio";

/** Grado de desgaste para equipos móviles (alineado con filtros del backend) */
export type DeviceWearGrade = "excelente" | "muy_bueno" | "bueno" | "aceptable";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description?: string;
  brand: string;
  series?: string;
  model?: string;
  kind: ProductKind;
  /** Seminuevos: grado de desgaste */
  wearGrade?: DeviceWearGrade;
  colors: string[];
  storageOptionsGb: number[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  stock: number;
  sku?: string;
  /** SEO */
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  series?: string;
  model?: string;
  kind?: ProductKind | ProductKind[];
  wearGrade?: DeviceWearGrade;
  color?: string;
  storageGb?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest";
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
