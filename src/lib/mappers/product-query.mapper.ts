import { toQueryParams } from "@/lib/mappers/base-query.mapper";
import type {
  ProductCatalogType,
  ProductCondition,
  ProductListQuery,
  ProductSortKey,
  ProductSortUI,
  ProductStatus,
  ProductType,
} from "@/types/product";

/** Re-export para consumo desde UI / tests. */
export type { ProductSortKey, ProductSortUI } from "@/types/product";

/** DTO de query que espera NestJS (`sortBy` / `sortOrder`, sin `sort` legacy). */
export type ProductQueryBackend = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy: "price" | "createdAt";
  sortOrder: "asc" | "desc";
  brand?: string;
  category?: string;
  brandId?: string;
  categoryId?: string;
  model?: string;
  modelId?: string;
  type?: ProductType;
  catalogType?: ProductCatalogType;
  excludeCatalogType?: ProductCatalogType;
  condition?: ProductCondition;
  storage?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  isPublished?: boolean;
  status?: ProductStatus;
  lowStock?: boolean;
};

/**
 * Filtros de UI + campos admin opcionales.
 * Extiende el patrón base (page, limit, search) con ordenación y filtros de producto.
 */
export type ProductFiltersInput = ProductListQuery & {
  isPublished?: boolean;
  isFeatured?: boolean;
  lowStock?: boolean;
  status?: ProductStatus;
};

export type ProductSortBackend = Pick<ProductQueryBackend, "sortBy" | "sortOrder">;

/**
 * Traduce la clave de orden UI al par `sortBy` / `sortOrder` del backend.
 * Incluye aliases legacy del catálogo (`price_asc`, `price_desc`, `relevance`).
 */
export function mapSortUiToBackend(sort?: ProductSortKey): ProductSortBackend {
  switch (sort) {
    case "oldest":
      return { sortBy: "createdAt", sortOrder: "asc" };
    case "price_low":
    case "price_asc":
      return { sortBy: "price", sortOrder: "asc" };
    case "price_high":
    case "price_desc":
      return { sortBy: "price", sortOrder: "desc" };
    case "stock_low":
      return { sortBy: "createdAt", sortOrder: "desc" };
    case "stock_high":
      return { sortBy: "createdAt", sortOrder: "asc" };
    case "newest":
    case "relevance":
    default:
      return { sortBy: "createdAt", sortOrder: "desc" };
  }
}

/** Usado también por `mapAdminProductFiltersToQuery`. */
export function normalizeFeatured(
  featured: ProductFiltersInput["featured"],
  isFeatured: ProductFiltersInput["isFeatured"]
): boolean | undefined {
  if (featured === true || featured === false) return featured;
  if (isFeatured === true) return true;
  if (isFeatured === false) return false;
  return undefined;
}

/**
 * `GET /products`: paginación + búsqueda + `sortBy`/`sortOrder` + filtros de producto.
 * Usa `toQueryParams` del mapper base para consistencia global.
 */
export function mapProductFiltersToQuery(
  filters: ProductFiltersInput
): Record<string, string | number | boolean | undefined> {
  const { sort: sortKey, featured, isFeatured, ...rest } = filters;
  const { sortBy, sortOrder } = mapSortUiToBackend(sortKey);

  const categoryForApi =
    rest.categoryId != null && rest.categoryId !== ""
      ? undefined
      : rest.category;

  const brandForApi =
    rest.brandId != null && rest.brandId !== "" ? undefined : rest.brand;

  const modelForApi =
    rest.modelId != null && rest.modelId !== "" ? undefined : rest.model;

  return toQueryParams({
    page: rest.page,
    limit: rest.limit,
    search: rest.search,
    sortBy,
    sortOrder,
    brand: brandForApi,
    category: categoryForApi,
    brandId:
      rest.brandId != null && rest.brandId !== "" ? rest.brandId : undefined,
    categoryId:
      rest.categoryId != null && rest.categoryId !== "" ? rest.categoryId : undefined,
    model: modelForApi,
    modelId:
      rest.modelId != null && rest.modelId !== "" ? rest.modelId : undefined,
    type: rest.type,
    catalogType: rest.catalogType,
    excludeCatalogType: rest.excludeCatalogType,
    condition: rest.condition,
    conditionId:
      rest.conditionId != null && rest.conditionId !== "" ? rest.conditionId : undefined,
    gradeId: rest.gradeId != null && rest.gradeId !== "" ? rest.gradeId : undefined,
    seriesId: rest.seriesId != null && rest.seriesId !== "" ? rest.seriesId : undefined,
    storage: rest.storage,
    color: rest.color,
    minPrice: rest.minPrice,
    maxPrice: rest.maxPrice,
    featured: normalizeFeatured(featured, isFeatured),
    isPublished: rest.isPublished,
    status: rest.status,
    lowStock: rest.lowStock,
  });
}
