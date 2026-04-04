"use server";

import { postCartCheckout } from "@/services/lead.service";
import type { CartCheckoutPayload } from "@/types/lead";

export type WhatsAppCheckoutState = {
  ok: boolean;
  error?: string;
  whatsappUrl?: string;
};

export async function submitWhatsAppCheckout(
  payload: CartCheckoutPayload
): Promise<WhatsAppCheckoutState> {
  try {
    const res = await postCartCheckout(payload);
    return { ok: true, whatsappUrl: res.whatsappUrl };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "No se pudo enviar el pedido.";
    return { ok: false, error: message };
  }
}
