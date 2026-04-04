import { adminApiFetch } from "@/services/admin/client";
import type { DashboardStats } from "@/types/dashboard";

function unwrapStatsPayload(raw: unknown): DashboardStats {
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data;
    if (inner && typeof inner === "object") {
      return inner as DashboardStats;
    }
  }
  return raw as DashboardStats;
}

/**
 * Métricas agregadas del panel (sin listar productos).
 * `GET /admin/dashboard/stats`
 */
export async function getDashboardStats(accessToken: string): Promise<DashboardStats> {
  const raw = await adminApiFetch<unknown>("/admin/dashboard/stats", accessToken, {
    method: "GET",
  });
  return unwrapStatsPayload(raw);
}
