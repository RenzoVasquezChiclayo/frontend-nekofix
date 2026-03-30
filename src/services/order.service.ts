import { apiFetch } from "@/services/api";
import type { CheckoutPayload } from "@/types/order";

export interface OrderCreated {
  id: string;
  status: string;
  total: number;
}

/** Crear pedido en NestJS (ajusta la ruta al controlador real) */
export async function createOrder(
  payload: CheckoutPayload
): Promise<OrderCreated> {
  return apiFetch<OrderCreated>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });
}
