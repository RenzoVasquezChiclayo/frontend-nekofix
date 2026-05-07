import type { ProductCondition } from "@/types/product";

/** Lead / cotización / contacto web → NestJS */
export type LeadSource = "web" | "whatsapp" | "catalogo" | "landing";
export type LeadStatus =
  | "PENDING"
  | "CONTACTED"
  | "SOLD"
  | "CANCELLED";

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

export interface LeadProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
  slug?: string;
  storage?: string | null;
  color?: string | null;
  condition?: ProductCondition | string;
}

export interface Lead {
  id: string;
  products: LeadProduct[];
  total: number;
  phone?: string | null;
  customerName?: string | null;
  notes?: string | null;
  status: LeadStatus;
  confirmedById?: string | null;
  soldAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeadListItem = Lead;

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

export interface LeadConfirmPurchasePayload {
  notes?: string;
}

export interface LeadConfirmPurchaseResponse {
  id: string;
  status: LeadStatus;
  soldAt?: string | null;
  cancelledAt?: string | null;
  message?: string;
}
