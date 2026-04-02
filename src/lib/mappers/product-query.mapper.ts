import { toQueryParams } from "@/lib/mappers/base-query.mapper";
import type {
  ProductCondition,
  ProductListQuery,
  ProductSortKey,
  ProductSortUI,
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
  type?: ProductType;
  condition?: ProductCondition;
  storage?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  isPublished?: boolean;
  lowStock?: boolean;
};

/**
 * Filtros de UI + campos admin opcionales.
 * Extiende el patrón base (page, limit, search) con ordenación y filtros de producto.
 */
export type ProductFiltersInput = ProductListQuery & {
  brandId?: string;
  categoryId?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  lowStock?: boolean;
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

function normalizeFeatured(
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

  return toQueryParams({
    page: rest.page,
    limit: rest.limit,
    search: rest.search,
    sortBy,
    sortOrder,
    brand: rest.brand,
    category: rest.category,
    brandId: rest.brandId,
    categoryId: rest.categoryId,
    model: rest.model,
    type: rest.type,
    condition: rest.condition,
    storage: rest.storage,
    color: rest.color,
    minPrice: rest.minPrice,
    maxPrice: rest.maxPrice,
    featured: normalizeFeatured(featured, isFeatured),
    isPublished: rest.isPublished,
    lowStock: rest.lowStock,
  });
}
