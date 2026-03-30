import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { apiFetch, ApiError } from "@/services/api";
import type { Paginated, Product, ProductListQuery } from "@/types/product";

/** Lista productos con filtros (GET /products o equivalente en Nest) */
export async function getProducts(
  query: ProductListQuery = {}
): Promise<Paginated<Product>> {
  return apiFetch<Paginated<Product>>("/products", {
    searchParams: {
      page: query.page,
      limit: query.limit,
      search: query.search,
      brand: query.brand,
      series: query.series,
      model: query.model,
      kind: Array.isArray(query.kind) ? query.kind.join(",") : query.kind,
      wearGrade: query.wearGrade,
      color: query.color,
      storageGb: query.storageGb,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort: query.sort,
    },
  });
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return apiFetch<Product>(`/products/slug/${encodeURIComponent(slug)}`);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const res = await getProducts({ limit, page: 1, sort: "newest" });
  return res.data;
}

/** Si el backend no responde, usa datos mock para desarrollo / demo */
export async function getProductsWithFallback(
  query: ProductListQuery = {}
): Promise<Paginated<Product>> {
  try {
    return await getProducts(query);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[products] API no disponible, usando mock:", e);
    }
    let data = [...MOCK_PRODUCTS];
    if (query.search) {
      const q = query.search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (query.kind) {
      const kinds = Array.isArray(query.kind) ? query.kind : [query.kind];
      data = data.filter((p) => kinds.includes(p.kind));
    }
    if (query.brand) {
      data = data.filter((p) =>
        p.brand.toLowerCase().includes(query.brand!.toLowerCase())
      );
    }
    return {
      data,
      total: data.length,
      page: query.page ?? 1,
      pageSize: data.length,
      hasMore: false,
    };
  }
}

export async function getProductBySlugWithFallback(
  slug: string
): Promise<Product | null> {
  try {
    return await getProductBySlug(slug);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    if (process.env.NODE_ENV === "development") {
      console.warn("[product] API no disponible, usando mock:", e);
    }
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}
