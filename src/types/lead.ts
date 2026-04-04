import type { ProductCondition } from "@/types/product";

/** Lead / cotización / contacto web → NestJS */
export type LeadSource = "web" | "whatsapp" | "catalogo" | "landing";

export interface LeadPayload {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  source?: LeadSource;
  /** Referencia opcional a producto o SKU */
  productId?: string;
  productSlug?: string;
}

export interface LeadResponse {
  id: string;
  createdAt: string;
}

/** Fila de listado cuando exista `GET /leads` (usar con `ApiListResponse<LeadListItem>`). */
export interface LeadListItem {
  id: string;
  createdAt: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  source?: LeadSource;
}

/** POST /leads/cart-checkout */
export interface CartCheckoutItemPayload {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  storage?: string | null;
  color?: string | null;
  condition: ProductCondition;
}

export interface CartCheckoutPayload {
  items: CartCheckoutItemPayload[];
  total: number;
  phone?: string;
}

export interface CartCheckoutResponse {
  /** Si el backend devuelve URL lista para abrir */
  whatsappUrl?: string;
  leadId?: string;
}
