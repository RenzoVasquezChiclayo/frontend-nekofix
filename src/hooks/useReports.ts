"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import {
  getReportsDashboard,
  getReportsInventorySummary,
  getReportsLeadsByStatus,
  getReportsLowStock,
  getReportsMonthlySales,
  getReportsTopSellingProducts,
} from "@/services/reports.service";
import type {
  DashboardMetrics,
  InventorySummary,
  LeadStatusReport,
  LowStockProduct,
  MonthlySales,
  ReportDateRange,
  TopSellingProduct,
} from "@/types/report";

type ReportsState = {
  dashboard: DashboardMetrics | null;
  monthlySales: MonthlySales[];
  leadStatuses: LeadStatusReport[];
  topProducts: TopSellingProduct[];
  inventorySummary: InventorySummary | null;
  lowStock: LowStockProduct[];
};

const EMPTY: ReportsState = {
  dashboard: null,
  monthlySales: [],
  leadStatuses: [],
  topProducts: [],
  inventorySummary: null,
  lowStock: [],
};

export function useReports(token: string | null | undefined, range: ReportDateRange) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReportsState>(EMPTY);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [dashboard, monthlySales, leadStatuses, topProducts, inventorySummary, lowStock] =
        await Promise.all([
          getReportsDashboard(token, range),
          getReportsMonthlySales(token, range),
          getReportsLeadsByStatus(token, range),
          getReportsTopSellingProducts(token, range),
          getReportsInventorySummary(token, range),
          getReportsLowStock(token, range),
        ]);
      setData({
        dashboard,
        monthlySales,
        leadStatuses,
        topProducts,
        inventorySummary,
        lowStock,
      });
    } catch (e) {
      setError(getApiErrorMessage(e));
      setData(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [range, token]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...data, loading, error, reload: load };
}
