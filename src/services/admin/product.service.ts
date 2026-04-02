import type { ProductCreateInput, ProductUpdateInput } from "@/types/admin-product";
import {
  mapProductFiltersToQuery,
  type ProductFiltersInput,
} from "@/lib/mappers/product-query.mapper";
import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { normalizeApiSingleResponse } from "@/lib/normalize-api-single";
import type { ApiListResponse } from "@/types/api";
import type { Product, ProductCondition, ProductType } from "@/types/product";
import { adminApiFetch } from "@/services/admin/client";

/** Query del panel (alias de `ProductFiltersInput`). */
export type AdminProductListQuery = ProductFiltersInput;

export async function adminListProducts(
  token: string,
  query: AdminProductListQuery = {}
): Promise<ApiListResponse<Product>> {
  const raw = await adminApiFetch<unknown>("/products", token, {
    method: "GET",
    searchParams: mapProductFiltersToQuery(query),
  });
  return normalizeApiListResponse<Product>(raw);
}

/** GET /products/:slug — en muchos backends el parámetro acepta slug o id. */
export async function adminGetProduct(token: string, slugOrId: string): Promise<Product> {
  const raw = await adminApiFetch<unknown>(`/products/${encodeURIComponent(slugOrId)}`, token, {
    method: "GET",
  });
  return normalizeApiSingleResponse<Product>(raw);
}

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
