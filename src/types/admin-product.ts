import type { ProductCatalogType, ProductCondition, ProductType, ProductStatus } from "@/types/product";

/** Payload de imágenes al crear/actualizar producto (`images` en el cuerpo). */
export type ProductImagePayload = {
  url: string;
  alt?: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

/** Crear producto — cuerpo POST /products */
export interface ProductCreateInput {
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  type: ProductType;
  catalogType: ProductCatalogType;
  /** Legacy; el backend puede seguir requiriendo el enum durante la migración. */
  condition: ProductCondition;
  conditionId?: string | null;
  seriesId?: string | null;
  stock: number;
  minStock: number;
  brandId: string;
  categoryId: string;
  modelId?: string | null;
  storage?: string | null;
  color?: string | null;
  colorHex?: string | null;
  batteryHealth?: number | null;
  /** Legacy string durante migración. */
  grade?: string | null;
  gradeId?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  status?: ProductStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  images?: ProductImagePayload[];
}

/** Actualizar producto — PATCH /products/:id */
export type ProductUpdateInput = Partial<ProductCreateInput>;
