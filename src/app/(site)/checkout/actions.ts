"use server";

import { createOrder } from "@/services/order.service";
import type { CheckoutPayload } from "@/types/order";

export type CheckoutState = { ok: boolean; error?: string; orderId?: string };

export async function submitCheckout(
  _prev: CheckoutState,
  payload: CheckoutPayload
): Promise<CheckoutState> {
  try {
    const order = await createOrder(payload);
    return { ok: true, orderId: order.id };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "No se pudo completar el pedido.";
    return { ok: false, error: message };
  }
}
