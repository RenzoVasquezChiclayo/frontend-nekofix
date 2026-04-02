import type {
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

export function parseProductListQuery(
  sp: Record<string, string | string[] | undefined>
): ProductListQuery {
  const search = pick(sp, "search");
  const brand = pick(sp, "brand");
  const category = pick(sp, "category");
  const model = pick(sp, "model");
  const typeRaw = pick(sp, "type");
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

  return {
    search,
    brand,
    category,
    model,
    type,
    condition,
    storage,
    color,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    featured,
    sort,
    page: Number.isFinite(page) && page! > 0 ? page : 1,
    limit: Number.isFinite(limit) && limit! > 0 ? limit : 48,
  };
}
