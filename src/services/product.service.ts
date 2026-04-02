import { mapProductFiltersToQuery } from "@/lib/mappers/product-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
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
      brand: product.brand.slug,
      limit: limit + 1,
      page: 1,
      sort: "newest",
    });
    const merged = byBrand.data.filter((p) => p.id !== product.id);
    if (merged.length >= limit) return merged.slice(0, limit);
    const byCat = await getProducts({
      category: product.category.slug,
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
