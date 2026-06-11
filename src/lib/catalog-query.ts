import { isProductCatalogType } from "@/lib/product-catalog-type";
import type {
  ProductCatalogType,
  ProductCondition,
  ProductListQuery,
  ProductType,
} from "@/types/product";

function pick(
  sp: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const v = sp[key];
  return typeof v === "string" ? v : undefined;
}

const TYPES: ProductType[] = ["NEW", "USED", "ACCESSORY"];
const CONDITIONS: ProductCondition[] = [
  "NEW",
  "SEMINUEVO",
  "REFURBISHED",
  "REPAIRED",
  "FOR_PARTS",
];

export type ParseProductListQueryOptions = {
  /** Valores por defecto (p. ej. `catalogType` o `excludeCatalogType` por ruta). */
  defaults?: Partial<ProductListQuery>;
};

export function parseProductListQuery(
  sp: Record<string, string | string[] | undefined>,
  options?: ParseProductListQueryOptions
): ProductListQuery {
  const search = pick(sp, "search");
  const brandId = pick(sp, "brandId");
  const brand = pick(sp, "brand");
  const categoryId = pick(sp, "categoryId");
  const category = pick(sp, "category");
  const modelId = pick(sp, "modelId");
  const model = pick(sp, "model");
  const seriesId = pick(sp, "seriesId");
  const conditionId = pick(sp, "conditionId");
  const gradeId = pick(sp, "gradeId");
  const typeRaw = pick(sp, "type");
  const catalogTypeRaw = pick(sp, "catalogType");
  const excludeCatalogTypeRaw = pick(sp, "excludeCatalogType");
  const conditionRaw = pick(sp, "condition");
  const storage = pick(sp, "storage");
  const color = pick(sp, "color");
  const minPriceRaw = pick(sp, "minPrice");
  const maxPriceRaw = pick(sp, "maxPrice");
  const featuredRaw = pick(sp, "featured");
  const sortRaw = pick(sp, "sort");
  const pageRaw = pick(sp, "page");
  const limitRaw = pick(sp, "limit");

  const type = TYPES.includes(typeRaw as ProductType)
    ? (typeRaw as ProductType)
    : undefined;
  const catalogType = isProductCatalogType(catalogTypeRaw) ? catalogTypeRaw : undefined;
  const excludeCatalogType = isProductCatalogType(excludeCatalogTypeRaw)
    ? excludeCatalogTypeRaw
    : undefined;
  const condition = CONDITIONS.includes(conditionRaw as ProductCondition)
    ? (conditionRaw as ProductCondition)
    : undefined;

  const minPrice = minPriceRaw ? Number(minPriceRaw) : undefined;
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined;
  const page = pageRaw ? Number(pageRaw) : undefined;
  const limit = limitRaw ? Number(limitRaw) : undefined;

  const sortKeys = [
    "newest",
    "oldest",
    "price_low",
    "price_high",
    "stock_low",
    "stock_high",
    "relevance",
    "price_asc",
    "price_desc",
  ] as const;
  const sort = sortKeys.includes(sortRaw as (typeof sortKeys)[number])
    ? (sortRaw as (typeof sortKeys)[number])
    : undefined;

  let featured: boolean | undefined;
  if (featuredRaw === "true") featured = true;
  else if (featuredRaw === "false") featured = false;

  const parsed: ProductListQuery = {
    search,
    brandId: brandId || undefined,
    brand: brandId ? undefined : brand || undefined,
    categoryId: categoryId || undefined,
    category: categoryId ? undefined : category || undefined,
    modelId: modelId || undefined,
    model: modelId ? undefined : model || undefined,
    seriesId: seriesId || undefined,
    type,
    catalogType,
    excludeCatalogType,
    condition,
    conditionId: conditionId || undefined,
    gradeId: gradeId || undefined,
    storage,
    color,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    featured,
    sort,
    page: Number.isFinite(page) && page! > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit! > 0 ? limit : 12,
  };

  const defaults = options?.defaults;
  if (defaults) {
    if (parsed.catalogType == null && defaults.catalogType != null) {
      parsed.catalogType = defaults.catalogType;
    }
    if (parsed.excludeCatalogType == null && defaults.excludeCatalogType != null) {
      parsed.excludeCatalogType = defaults.excludeCatalogType;
    }
  }

  return parsed;
}

export type CatalogQueryMode = "store" | "spare_parts";

/** Elimina filtros incompatibles según la ruta de catálogo. */
export function sanitizeQueryForCatalogMode(
  query: ProductListQuery,
  mode: CatalogQueryMode
): ProductListQuery {
  if (mode === "spare_parts") {
    return {
      ...query,
      seriesId: undefined,
      gradeId: undefined,
      color: undefined,
      storage: undefined,
      type: undefined,
    };
  }
  return query;
}
