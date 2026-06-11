import { resolveProductStatus } from "@/lib/product-status";
import type { Product } from "@/types/product";

/**
 * Normaliza la respuesta del API para el formulario admin: IDs planos, flags e imágenes.
 */
export function coerceAdminProductForForm(raw: Product): Product {
  const brandId = raw.brandId?.trim() || raw.brand?.id?.trim() || "";
  const categoryId = raw.categoryId?.trim() || raw.category?.id?.trim() || "";
  const modelId =
    raw.modelId != null && String(raw.modelId).trim() !== ""
      ? String(raw.modelId).trim()
      : raw.model?.id?.trim() ?? null;
  const seriesId =
    raw.seriesId != null && String(raw.seriesId).trim() !== ""
      ? String(raw.seriesId).trim()
      : raw.series?.id?.trim() ?? null;
  const conditionId =
    raw.conditionId != null && String(raw.conditionId).trim() !== ""
      ? String(raw.conditionId).trim()
      : raw.conditionRef?.id?.trim() ?? null;
  const gradeId =
    raw.gradeId != null && String(raw.gradeId).trim() !== ""
      ? String(raw.gradeId).trim()
      : raw.gradeRef?.id?.trim() ?? null;

  return {
    ...raw,
    brandId,
    categoryId,
    modelId,
    seriesId,
    conditionId,
    gradeId,
    productImages: Array.isArray(raw.productImages) ? raw.productImages : [],
    isFeatured: Boolean(raw.isFeatured),
    isPublished: raw.isPublished !== false,
    status: resolveProductStatus(raw),
  };
}
