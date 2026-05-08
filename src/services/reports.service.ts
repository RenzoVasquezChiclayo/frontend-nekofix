import { adminApiFetch } from "@/services/admin/client";
import type {
  DashboardMetrics,
  InventorySummary,
  LeadStatusReport,
  LowStockProduct,
  MonthlySales,
  ReportDateRange,
  TopSellingProduct,
} from "@/types/report";

function unwrapObject<T>(raw: unknown, fallback: T): T {
  if (!raw || typeof raw !== "object") return fallback;
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data;
    if (inner && typeof inner === "object" && !Array.isArray(inner)) return inner as T;
  }
  if (!Array.isArray(raw)) return raw as T;
  return fallback;
}

function normalizeArrayResponse<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj.data)) return obj.data as T[];

  if (obj.data && typeof obj.data === "object") {
    const inner = obj.data as Record<string, unknown>;
    if (Array.isArray(inner.items)) return inner.items as T[];
    if (Array.isArray(inner.data)) return inner.data as T[];
  }

  if (Array.isArray(obj.items)) return obj.items as T[];
  return [];
}

function reportParams(range: ReportDateRange): Record<string, string | undefined> {
  const base: Record<string, string | undefined> = { preset: range.preset };
  if (range.startDate) base.startDate = range.startDate;
  if (range.endDate) base.endDate = range.endDate;
  return base;
}

export async function getReportsDashboard(
  token: string,
  range: ReportDateRange
): Promise<DashboardMetrics> {
  const raw = await adminApiFetch<unknown>("/reports/dashboard", token, {
    method: "GET",
    searchParams: reportParams(range),
  });
  return unwrapObject<DashboardMetrics>(raw, {
    totalSales: 0,
    pendingLeads: 0,
    soldLeads: 0,
    conversionRate: 0,
    publishedProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalRevenue: 0,
  });
}

export async function getReportsMonthlySales(
  token: string,
  range: ReportDateRange
): Promise<MonthlySales[]> {
  const raw = await adminApiFetch<unknown>("/reports/sales/monthly", token, {
    method: "GET",
    searchParams: reportParams(range),
  });
  return normalizeArrayResponse<MonthlySales>(raw);
}

export async function getReportsLeadsByStatus(
  token: string,
  range: ReportDateRange
): Promise<LeadStatusReport[]> {
  const raw = await adminApiFetch<unknown>("/reports/leads/status", token, {
    method: "GET",
    searchParams: reportParams(range),
  });
  return normalizeArrayResponse<LeadStatusReport>(raw);
}

export async function getReportsTopSellingProducts(
  token: string,
  range: ReportDateRange
): Promise<TopSellingProduct[]> {
  const raw = await adminApiFetch<unknown>("/reports/products/top-selling", token, {
    method: "GET",
    searchParams: reportParams(range),
  });
  return normalizeArrayResponse<TopSellingProduct>(raw);
}

export async function getReportsInventorySummary(
  token: string,
  range: ReportDateRange
): Promise<InventorySummary> {
  const raw = await adminApiFetch<unknown>("/reports/inventory/summary", token, {
    method: "GET",
    searchParams: reportParams(range),
  });
  return unwrapObject<InventorySummary>(raw, {
    publishedProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
}

export async function getReportsLowStock(
  token: string,
  range: ReportDateRange
): Promise<LowStockProduct[]> {
  const raw = await adminApiFetch<unknown>("/reports/inventory/low-stock", token, {
    method: "GET",
    searchParams: reportParams(range),
  });
  if (process.env.NODE_ENV === "development") {
    console.log("[reports][low-stock]", raw);
  }
  return normalizeArrayResponse<LowStockProduct>(raw);
}
