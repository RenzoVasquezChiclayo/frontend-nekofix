"use client";

import { useEffect, useMemo, useState } from "react";
import { useReports } from "@/hooks/useReports";
import { useAdminAuth } from "@/store/admin-auth-context";
import { AdminHeader } from "@/components/admin/Header";
import { ReportsDateFilter } from "@/components/admin/reports/ReportsDateFilter";
import { ReportsPanels } from "@/components/admin/reports/ReportsPanels";
import { notifyApiError } from "@/lib/toast";
import type { ReportDatePreset } from "@/types/report";

export function DashboardHome() {
  const { accessToken } = useAdminAuth();
  const [preset, setPreset] = useState<ReportDatePreset>("30d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const range = useMemo(
    () => ({
      preset,
      startDate: preset === "custom" ? startDate || undefined : undefined,
      endDate: preset === "custom" ? endDate || undefined : undefined,
    }),
    [endDate, preset, startDate]
  );

  const {
    dashboard,
    monthlySales,
    leadStatuses,
    topProducts,
    lowStock,
    loading,
    error,
  } = useReports(accessToken, range);

  useEffect(() => {
    if (error) notifyApiError(new Error(error), "No se pudieron cargar los reportes.");
  }, [error]);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Métricas comerciales y operativas en tiempo real."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <ReportsDateFilter
          preset={preset}
          startDate={startDate}
          endDate={endDate}
          onPresetChange={setPreset}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {error ? (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <ReportsPanels
          dashboard={dashboard}
          monthlySales={monthlySales}
          leadStatuses={leadStatuses}
          topProducts={topProducts}
          lowStock={lowStock}
        />

        {loading ? <p className="text-sm text-zinc-500">Actualizando métricas…</p> : null}
      </div>
    </>
  );
}
