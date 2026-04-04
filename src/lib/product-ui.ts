/** Imagen principal: el modelo Prisma no incluye galería; usar placeholder hasta que el API adjunte URLs. */
export const PRODUCT_PLACEHOLDER_IMAGE = "/placeholder-phone.svg";

export function isLowStock(stock: number, minStock: number): boolean {
  return stock <= minStock;
}
