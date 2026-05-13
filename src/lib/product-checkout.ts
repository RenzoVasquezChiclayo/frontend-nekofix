import type { CartCheckoutPayload } from "@/types/lead";
import type { CartLine } from "@/types/order";
import type { Product } from "@/types/product";

/** Texto del mensaje de respaldo al consultar desde catálogo / ficha. */
export const WHATSAPP_CATALOG_CONSULT_INTRO = "Hola, quiero consultar por este pedido:";

export function productToCartLine(product: Product, quantity: number): CartLine {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    unitPrice: product.price,
    quantity,
    color: product.color,
    storage: product.storage,
    condition: product.condition,
    grade: product.type === "USED" ? product.grade : undefined,
    productType: product.type,
  };
}

export function productToCartCheckoutPayload(
  product: Product,
  quantity: number,
  phone?: string
): CartCheckoutPayload {
  const line = productToCartLine(product, quantity);
  const total = line.unitPrice * line.quantity;
  return {
    items: [
      {
        productId: line.productId,
        name: line.name,
        slug: line.slug,
        price: line.unitPrice,
        quantity: line.quantity,
        storage: line.storage,
        color: line.color,
        condition: line.condition,
      },
    ],
    total,
    phone,
  };
}
