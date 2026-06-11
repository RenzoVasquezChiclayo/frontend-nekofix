import type { Product, ProductStatus } from "@/types/product";

export const PRODUCT_STATUSES: ProductStatus[] = ["ACTIVE", "OUT_OF_STOCK", "HIDDEN"];

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "Disponible",
  OUT_OF_STOCK: "Agotado",
  HIDDEN: "Oculto",
};

export function isProductStatus(value: string | null | undefined): value is ProductStatus {
  return PRODUCT_STATUSES.includes(value as ProductStatus);
}

/** Legacy sin campo → ACTIVE. */
export function resolveProductStatus(
  product: Pick<Product, "status">
): ProductStatus {
  if (product.status && isProductStatus(product.status)) return product.status;
  return "ACTIVE";
}

export function isProductHidden(product: Pick<Product, "status">): boolean {
  return resolveProductStatus(product) === "HIDDEN";
}

export function isProductOutOfStock(product: Pick<Product, "status">): boolean {
  return resolveProductStatus(product) === "OUT_OF_STOCK";
}

/** Compra permitida: disponible y con stock. */
export function isProductPurchasable(product: Pick<Product, "status" | "stock">): boolean {
  return resolveProductStatus(product) === "ACTIVE" && product.stock > 0;
}

/** Excluye productos ocultos del catálogo público. */
export function filterPublicCatalogProducts<T extends Pick<Product, "status">>(
  products: T[]
): T[] {
  return products.filter((p) => !isProductHidden(p));
}
