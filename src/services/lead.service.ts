import { apiFetch } from "@/services/api";
import type { ApiListResponse } from "@/types/api";
import type {
  CartCheckoutPayload,
  CartCheckoutResponse,
  LeadListItem,
  LeadPayload,
  LeadResponse,
} from "@/types/lead";

/** Listado de leads (misma forma que el resto de módulos). Implementar con `GET /leads` + `normalizeApiListResponse`. */
export type LeadsListResponse = ApiListResponse<LeadListItem>;

export async function createLead(payload: LeadPayload): Promise<LeadResponse> {
  return apiFetch<LeadResponse>("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function postCartCheckout(
  payload: CartCheckoutPayload
): Promise<CartCheckoutResponse> {
  return apiFetch<CartCheckoutResponse>("/leads/cart-checkout", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
}
