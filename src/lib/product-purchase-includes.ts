import { isDeviceCatalogType } from "@/lib/product-catalog-type";
import type { Product } from "@/types/product";

/**
 * Muestra “¿Qué incluye tu compra?” solo en equipos (smartphones),
 * no en repuestos ni accesorios de catálogo.
 */
export function shouldShowProductPurchaseIncludes(
  product: Pick<Product, "catalogType" | "category">
): boolean {
  return isDeviceCatalogType(product);
}
