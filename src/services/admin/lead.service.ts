import { normalizeApiListResponse } from "@/lib/normalize-api-list";
import { adminApiFetch } from "@/services/admin/client";
import type { ApiListResponse } from "@/types/api";
import type {
  LeadConfirmPurchaseResponse,
  Lead,
  LeadListItem,
  LeadStatus,
} from "@/types/lead";

export type AdminLeadListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: LeadStatus;
  sortBy?: "createdAt" | "total";
  sortOrder?: "asc" | "desc";
};

function unwrapLead(raw: unknown): Lead {
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data;
    if (inner && typeof inner === "object") return inner as Lead;
  }
  return raw as Lead;
}

export async function adminListLeads(
  token: string,
  query: AdminLeadListQuery = {}
): Promise<ApiListResponse<LeadListItem>> {
  const searchParams = {
    page: query.page,
    limit: query.limit,
    search: query.search?.trim() || undefined,
    status: query.status,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  };
  const raw = await adminApiFetch<unknown>("/leads", token, {
    method: "GET",
    searchParams,
  });
  return normalizeApiListResponse<LeadListItem>(raw);
}

export async function adminGetLead(token: string, leadId: string): Promise<Lead> {
  const raw = await adminApiFetch<unknown>(`/leads/${encodeURIComponent(leadId)}`, token, {
    method: "GET",
  });
  return unwrapLead(raw);
}

export async function adminConfirmLead(
  token: string,
  leadId: string
): Promise<LeadConfirmPurchaseResponse> {
  return adminApiFetch<LeadConfirmPurchaseResponse>(
    `/leads/${encodeURIComponent(leadId)}/confirm`,
    token,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}

export async function adminCancelLead(
  token: string,
  leadId: string
): Promise<LeadConfirmPurchaseResponse> {
  return adminApiFetch<LeadConfirmPurchaseResponse>(
    `/leads/${encodeURIComponent(leadId)}/cancel`,
    token,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}

export async function adminContactLead(
  token: string,
  leadId: string
): Promise<LeadConfirmPurchaseResponse> {
  return adminApiFetch<LeadConfirmPurchaseResponse>(
    `/leads/${encodeURIComponent(leadId)}/contact`,
    token,
    {
      method: "POST",
      body: JSON.stringify({}),
    }
  );
}
