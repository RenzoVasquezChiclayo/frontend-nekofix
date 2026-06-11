import type { Brand, ProductCatalogType } from "@/types/product";

/** Serie de teléfono administrable (`PhoneSeries` en backend). */
export interface PhoneSeries {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  brandId: string;
  brand?: Brand;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

/** Condición administrable (`ProductConditionCatalog` en backend). */
export interface ProductConditionCatalog {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  catalogType: ProductCatalogType;
  sortOrder?: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Grado administrable (`ProductGrade` en backend). */
export interface ProductGradeCatalog {
  id: string;
  name: string;
  description?: string | null;
  catalogType: ProductCatalogType;
  sortOrder?: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
