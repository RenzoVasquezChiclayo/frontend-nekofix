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
