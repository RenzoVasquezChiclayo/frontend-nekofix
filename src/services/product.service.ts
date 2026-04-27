import { mapProductFiltersToQuery } from "@/lib/mappers/product-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import { sortProductsByGrade } from "@/lib/used-grade";
import { apiFetch } from "@/services/api";
import type { ApiListResponse } from "@/types/api";
import type { Product, ProductListQuery } from "@/types/product";

function unwrapFeatured(raw: Product[] | { data: Product[] }): Product[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && "data" in raw && Array.isArray(raw.data)) {
    return raw.data;
  }
  return [];
}

/** GET /products/featured */
export async function getFeaturedProducts(): Promise<Product[]> {
  const raw = await apiFetch<Product[] | { data: Product[] }>("/products/featured", {
    next: { revalidate: 60 },
  });
  return unwrapFeatured(raw);
}

/** GET /products — respuesta estándar `data` + `meta`. */
export async function getProducts(
  query: ProductListQuery = {}
): Promise<ApiListResponse<Product>> {
  const raw = await apiFetch<unknown>("/products", {
    searchParams: mapProductFiltersToQuery(query),
    next: { revalidate: 60 },
  });
  return normalizeApiListResponse<Product>(raw);
}

/** GET /products/:slug */
export async function getProductBySlug(slug: string): Promise<Product> {
  const raw = await apiFetch<unknown>(`/products/${encodeURIComponent(slug)}`, {
    next: { revalidate: 120 },
  });
  return normalizeApiSingleResponse<Product>(raw);
}

/** Productos relacionados (misma marca o categoría). */
export async function getRelatedProducts(
  product: Product,
  limit = 6
): Promise<Product[]> {
  try {
    const byBrand = await getProducts({
      brandId: product.brandId,
      limit: limit + 1,
      page: 1,
      sort: "newest",
    });
    const merged = byBrand.data.filter((p) => p.id !== product.id);
    if (merged.length >= limit) return merged.slice(0, limit);
    const byCat = await getProducts({
      categoryId: product.categoryId,
      limit: limit + 1,
      page: 1,
      sort: "newest",
    });
    const ids = new Set(merged.map((p) => p.id));
    for (const p of byCat.data) {
      if (p.id === product.id || ids.has(p.id)) continue;
      merged.push(p);
      ids.add(p.id);
      if (merged.length >= limit) break;
    }
    return merged.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Variantes del mismo equipo (modelo + almacenamiento + color) en `USED`, distinto `grade`.
 * Solo incluye filas con stock &gt; 0 para el selector; el producto actual se añade si falta (p. ej. sin stock).
 */
export async function getUsedGradeVariants(product: Product): Promise<Product[]> {
  if (product.type !== "USED" || !product.modelId) {
    return [product];
  }
  const storage = (product.storage ?? "").trim();
  const color = (product.color ?? "").trim();

  try {
    const res = await getProducts({
      modelId: product.modelId,
      type: "USED",
      limit: 48,
      page: 1,
      sort: "newest",
    });

    const sameSkuFamily = res.data.filter((p) => {
      const ps = (p.storage ?? "").trim();
      const pc = (p.color ?? "").trim();
      return ps === storage && pc === color && p.type === "USED";
    });

    const inStock = sameSkuFamily.filter((p) => p.stock > 0);
    const merged = inStock.some((p) => p.id === product.id)
      ? inStock
      : [...inStock, product];

    const byId = new Map<string, Product>();
    for (const p of merged) {
      if (!byId.has(p.id)) byId.set(p.id, p);
    }
    return sortProductsByGrade([...byId.values()]);
  } catch {
    return [product];
  }
}
