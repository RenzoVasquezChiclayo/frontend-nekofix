import { resolveMediaUrl } from "@/lib/media-url";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import type { Product, ProductImage } from "@/types/product";

/**
 * URL absoluta para `next/image` o `<img>` (productos).
 * Rutas relativas usan `NEXT_PUBLIC_MEDIA_URL`, no la API REST.
 */
export function resolveProductMediaUrl(url: string | null | undefined): string {
  return resolveMediaUrl(url, { placeholder: PRODUCT_PLACEHOLDER_IMAGE });
}

/** Orden estable para UI y payloads. */
export function sortProductImages(images: ProductImage[] | undefined | null): ProductImage[] {
  if (!images?.length) return [];
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Imagen principal o primera de la galería (regla ecommerce).
 */
export function getPrimaryProductImage(
  product: Pick<Product, "productImages" | "name">
): ProductImage | null {
  const sorted = sortProductImages(product.productImages);
  if (sorted.length === 0) return null;
  return sorted.find((img) => img.isPrimary) ?? sorted[0] ?? null;
}

export function getProductCoverImage(product: Pick<Product, "productImages" | "name">): {
  src: string;
  alt: string;
} {
  const img = getPrimaryProductImage(product);
  if (!img) {
    return { src: PRODUCT_PLACEHOLDER_IMAGE, alt: product.name };
  }
  return {
    src: resolveProductMediaUrl(img.url),
    alt: img.alt?.trim() || product.name,
  };
}
