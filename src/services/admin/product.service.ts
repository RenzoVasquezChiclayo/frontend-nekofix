import { ADMIN_PRODUCT_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import type { ProductCreateInput, ProductUpdateInput } from "@/types/admin-product";
import {
  mapAdminProductFiltersToQuery,
  type AdminProductFiltersInput,
} from "@/lib/mappers/admin-product-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { Product, ProductCondition, ProductType } from "@/types/product";
import { ApiError } from "@/services/api";
import { adminApiFetch } from "@/services/admin/client";

/** Query del panel admin: solo IDs para marca/categoría/modelo (ver `mapAdminProductFiltersToQuery`). */
export type AdminProductListQuery = AdminProductFiltersInput;

export async function adminListProducts(
  token: string,
  query: AdminProductListQuery = {}
): Promise<ApiListResponse<Product>> {
  const raw = await adminApiFetch<unknown>("/products", token, {
    method: "GET",
    searchParams: mapAdminProductFiltersToQuery(query),
  });
  return normalizeApiListResponse<Product>(raw);
}

const LIST_SCAN_PAGE_LIMIT = 50;
/** Último recurso acotado: evita muchas idas al API si el listado es grande. */
const LIST_SCAN_MAX_PAGES = 5;

async function findProductByPaginatedList(
  token: string,
  productId: string
): Promise<Product | null> {
  for (let page = 1; page <= LIST_SCAN_MAX_PAGES; page++) {
    const list = await adminListProducts(token, {
      page,
      limit: LIST_SCAN_PAGE_LIMIT,
    });
    const hit = list.data.find((p) => p.id === productId);
    if (hit) return hit;
    const totalPages =
      typeof list.meta.totalPages === "number" && list.meta.totalPages > 0
        ? list.meta.totalPages
        : null;
    if (totalPages != null && page >= totalPages) break;
    if (list.data.length < LIST_SCAN_PAGE_LIMIT) break;
  }
  return null;
}

/**
 * Carga un producto para el panel admin por **UUID** de ruta (no slug).
 * Orden: `GET /products/:id` → `GET /products?search=…` + match por `id` → barrido paginado acotado.
 * No se envía `id` en query del listado: muchos backends Nest rechazan parámetros no declarados (400).
 */
export async function adminGetProduct(token: string, productId: string): Promise<Product> {
  const encoded = encodeURIComponent(productId);
  let notFound: ApiError | undefined;
  try {
    const raw = await adminApiFetch<unknown>(`/products/${encoded}`, token, {
      method: "GET",
    });
    return normalizeApiSingleResponse<Product>(raw);
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 404) throw e;
    notFound = e;
  }

  const bySearch = await adminListProducts(token, {
    search: productId,
    page: 1,
    limit: 50,
  });
  const fromSearch = bySearch.data.find((p) => p.id === productId);
  if (fromSearch) return fromSearch;

  const fromScan = await findProductByPaginatedList(token, productId);
  if (fromScan) return fromScan;

  throw new ApiError(ADMIN_PRODUCT_NOT_FOUND_MESSAGE, 404, notFound?.body);
}

/** Alias: rutas admin usan siempre UUID, no slug. */
export const adminGetProductById = adminGetProduct;

export async function adminCreateProduct(token: string, body: ProductCreateInput): Promise<Product> {
  const raw = await adminApiFetch<unknown>("/products", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<Product>(raw);
}

export async function adminUpdateProduct(
  token: string,
  id: string,
  body: ProductUpdateInput
): Promise<Product> {
  const raw = await adminApiFetch<unknown>(`/products/${encodeURIComponent(id)}`, token, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return normalizeApiSingleResponse<Product>(raw);
}

/** POST /products/upload-image — multipart `file` (jpg/png/webp). */
export async function adminUploadProductImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const raw = await adminApiFetch<unknown>("/products/upload-image", token, {
    method: "POST",
    body: formData,
  });
  const data = normalizeApiSingleResponse<{ url?: string }>(raw);
  const url =
    data && typeof data === "object" && "url" in data && typeof (data as { url: unknown }).url === "string"
      ? (data as { url: string }).url
      : null;
  if (!url?.trim()) {
    throw new Error("El servidor no devolvió una URL de imagen válida.");
  }
  return url.trim();
}

export async function adminDeleteProduct(token: string, id: string): Promise<void> {
  await adminApiFetch<void>(`/products/${encodeURIComponent(id)}`, token, {
    method: "DELETE",
  });
}

/** Atajos para toggles desde la tabla */
export async function adminSetProductPublished(
  token: string,
  id: string,
  isPublished: boolean
): Promise<Product> {
  return adminUpdateProduct(token, id, { isPublished });
}

export async function adminSetProductFeatured(
  token: string,
  id: string,
  isFeatured: boolean
): Promise<Product> {
  return adminUpdateProduct(token, id, { isFeatured });
}

/** Filtrado en cliente si el API no soporta `lowStock` / `isPublished` en query */
export function filterProductsClient(
  products: Product[],
  filters: {
    lowStock?: boolean;
    isPublished?: boolean;
    isFeatured?: boolean;
    type?: ProductType;
    condition?: ProductCondition;
  }
): Product[] {
  return products.filter((p) => {
    if (filters.lowStock === true && !(p.stock <= p.minStock)) return false;
    if (filters.isPublished === true && !p.isPublished) return false;
    if (filters.isPublished === false && p.isPublished) return false;
    if (filters.isFeatured === true && !p.isFeatured) return false;
    if (filters.isFeatured === false && p.isFeatured) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.condition && p.condition !== filters.condition) return false;
    return true;
  });
}
