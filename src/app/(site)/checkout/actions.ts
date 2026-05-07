"use server";

import { ApiError } from "@/services/api";
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
    const message = resolveCheckoutError(e);
    console.error("[checkout] submitWhatsAppCheckout error", {
      error: e,
      payload,
      message,
    });
    return { ok: false, error: message };
  }
}

function resolveCheckoutError(error: unknown): string {
  if (error instanceof ApiError) {
    const detail = readApiErrorDetail(error.body);
    return detail
      ? `No se pudo registrar el pedido: ${detail}`
      : `No se pudo registrar el pedido (${error.status}).`;
  }
  if (error instanceof Error) return error.message;
  return "No se pudo enviar el pedido.";
}

function readApiErrorDetail(body: unknown): string | null {
  if (!body) return null;
  if (typeof body === "string") return body;
  if (typeof body !== "object") return null;

  const candidate = body as { message?: unknown; error?: unknown };
  if (Array.isArray(candidate.message)) {
    return candidate.message.filter((v): v is string => typeof v === "string").join(", ");
  }
  if (typeof candidate.message === "string") return candidate.message;
  if (typeof candidate.error === "string") return candidate.error;
  return null;
}
