"use client";

import { useCallback, useEffect, useState } from "react";
import { getDashboardStats } from "@/services/admin/dashboard.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { AdminHeader } from "@/components/admin/Header";
import { StatsCards, type StatItem } from "@/components/admin/StatsCards";
import { Loader } from "@/components/shared/Loader";
import { getApiErrorMessage } from "@/lib/api-errors";

export function DashboardHome() {
  const { accessToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatItem[]>([]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const d = await getDashboardStats(accessToken);
      setStats([
        { label: "Total productos", value: d.totalProducts },
        {
          label: "Publicados",
          value: d.publishedProducts,
          tone: "success",
        },
        {
          label: "Stock bajo",
          value: d.lowStockProducts,
          tone: d.lowStockProducts > 0 ? "warning" : "default",
          hint: "stock ≤ mínimo",
        },
        { label: "Destacados", value: d.featuredProducts },
      ]);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Resumen de inventario y publicación del catálogo."
      />
      <div className="p-6">
        {error ? (
          <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader label="Cargando métricas…" />
          </div>
        ) : (
          <>
            <StatsCards items={stats} />
          </>
        )}
      </div>
    </>
  );
}
