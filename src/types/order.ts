/** Checkout — alineable con DTOs del backend NestJS */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  /** Variantes seleccionadas */
  color?: string;
  storageGb?: number;
}

export interface CheckoutPayload {
  lines: CartLine[];
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  couponCode?: string;
}
