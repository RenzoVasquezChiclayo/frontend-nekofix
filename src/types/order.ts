import type { ProductCondition, ProductType, ProductStatus } from "@/types/product";

/** Línea del carrito (persistencia local). Alineado a CartCheckoutItemPayload. */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  color?: string | null;
  /** Hex guardado al agregar al carrito (swatch en carrito/checkout). */
  colorHex?: string | null;
  storage?: string | null;
  condition: ProductCondition;
  /** Opcional: grado cosmético (USED) para badge en carrito. */
  grade?: string | null;
  /** Opcional: para badges tipo / usado. */
  productType?: ProductType;
  /** Estado al agregar; se revalida en carrito. */
  productStatus?: ProductStatus;
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
