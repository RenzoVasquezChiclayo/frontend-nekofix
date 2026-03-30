import { apiFetch } from "@/services/api";
import type { LeadPayload, LeadResponse } from "@/types/lead";

export async function createLead(payload: LeadPayload): Promise<LeadResponse> {
  return apiFetch<LeadResponse>("/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
