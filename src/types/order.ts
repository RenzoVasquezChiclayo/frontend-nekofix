import type { ProductCondition } from "@/types/product";

/** Línea del carrito (persistencia local). Alineado a CartCheckoutItemPayload. */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  color?: string | null;
  storage?: string | null;
  condition: ProductCondition;
}

/** Alias explícito para documentación / payloads. */
export type CartItem = CartLine;

export interface CheckoutPayload {
  lines: CartLine[];
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  couponCode?: string;
}
