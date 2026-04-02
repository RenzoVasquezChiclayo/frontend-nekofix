import type { ProductCondition, ProductType } from "@/types/product";

/** Crear producto — cuerpo POST /products */
export interface ProductCreateInput {
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  price: number;
  comparePrice?: number | null;
  type: ProductType;
  condition: ProductCondition;
  stock: number;
  minStock: number;
  brandId: string;
  categoryId: string;
  modelId?: string | null;
  storage?: string | null;
  color?: string | null;
  batteryHealth?: number | null;
  grade?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

/** Actualizar producto — PATCH /products/:id */
export type ProductUpdateInput = Partial<ProductCreateInput>;
