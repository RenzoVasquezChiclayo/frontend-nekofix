import type { Product } from "@/types/product";

/**
 * Normaliza la respuesta del API para el formulario admin: IDs planos, flags e imágenes.
 * Algunos backends envían solo relaciones anidadas (`brand`, `category`) sin repetir `brandId`.
 */
export function coerceAdminProductForForm(raw: Product): Product {
  const brandId = raw.brandId?.trim() || raw.brand?.id?.trim() || "";
  const categoryId = raw.categoryId?.trim() || raw.category?.id?.trim() || "";
  const modelId =
    raw.modelId != null && String(raw.modelId).trim() !== ""
      ? String(raw.modelId).trim()
      : raw.model?.id?.trim() ?? null;

  return {
    ...raw,
    brandId,
    categoryId,
    modelId,
    productImages: Array.isArray(raw.productImages) ? raw.productImages : [],
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
  };
}
