"use server";

import { createLead } from "@/services/lead.service";
import type { LeadPayload } from "@/types/lead";

export type ContactState = { ok: boolean; error?: string };

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const payload: LeadPayload = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || undefined,
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    message: String(formData.get("message") ?? "").trim(),
    source: "web",
  };

  if (!payload.name || !payload.message) {
    return { ok: false, error: "Nombre y mensaje son obligatorios." };
  }

  try {
    await createLead(payload);
    return { ok: true };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "No se pudo enviar. Intenta por WhatsApp.";
    return { ok: false, error: message };
  }
}
