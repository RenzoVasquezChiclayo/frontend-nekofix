"use client";

import Image from "next/image";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { resolveProductMediaUrl } from "@/lib/product-images";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import { StatsCards, type StatItem } from "@/components/admin/StatsCards";
import type {
  DashboardMetrics,
  LeadStatusReport,
  LowStockProduct,
  MonthlySales,
  TopSellingProduct,
} from "@/types/report";

type Props = {
  dashboard: DashboardMetrics | null;
  monthlySales: MonthlySales[];
  leadStatuses: LeadStatusReport[];
  topProducts: TopSellingProduct[];
  lowStock: LowStockProduct[];
};

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

function formatCurrency(value?: number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function ReportsPanels({
  dashboard,
  monthlySales,
  leadStatuses,
  topProducts,
  lowStock,
}: Props) {
  const safeMonthlySales = Array.isArray(monthlySales) ? monthlySales : [];
  const safeLeadStatuses = Array.isArray(leadStatuses) ? leadStatuses : [];
  const safeTopProducts = Array.isArray(topProducts) ? topProducts : [];
  const safeLowStock = Array.isArray(lowStock) ? lowStock : [];

  const kpis: StatItem[] = [
    { label: "Ventas totales", value: dashboard?.totalSales ?? "—" },
    { label: "Leads pendientes", value: dashboard?.pendingLeads ?? "—", tone: "warning" },
    { label: "Leads vendidos", value: dashboard?.soldLeads ?? "—", tone: "success" },
    {
      label: "Conversion",
      value:
        typeof dashboard?.conversionRate === "number"
          ? `${dashboard.conversionRate.toFixed(1)}%`
          : "—",
    },
    { label: "Productos publicados", value: dashboard?.publishedProducts ?? "—" },
    { label: "Stock bajo", value: dashboard?.lowStockProducts ?? "—", tone: "warning" },
    { label: "Productos agotados", value: dashboard?.outOfStockProducts ?? "—", tone: "warning" },
    { label: "Ingresos totales", value: formatCurrency(dashboard?.totalRevenue) },
  ];

  return (
    <div className="space-y-6">
      <StatsCards items={kpis} className="lg:grid-cols-4" />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary-950">Ventas mensuales</h3>
          <div className="mt-4 h-[280px]">
            {safeMonthlySales.length === 0 ? (
              <p className="text-sm text-zinc-500">Sin datos para el rango seleccionado.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safeMonthlySales}>
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" name="Ventas" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="revenue" name="Ingresos" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary-950">Leads por estado</h3>
          <div className="mt-4 h-[280px]">
            {safeLeadStatuses.length === 0 ? (
              <p className="text-sm text-zinc-500">Sin datos para el rango seleccionado.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeLeadStatuses}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={64}
                    outerRadius={96}
                    paddingAngle={3}
                  >
                    {safeLeadStatuses.map((entry, index) => (
                      <Cell key={`${entry.status}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary-950">Productos mas vendidos</h3>
          <div className="mt-4 space-y-3">
            {safeTopProducts.length === 0 ? (
              <p className="text-sm text-zinc-500">No hay productos vendidos para este rango.</p>
            ) : (
              safeTopProducts.map((item) => (
                <article
                  key={item.productId}
                  className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-zinc-50">
                    <Image
                      src={resolveProductMediaUrl(item.imageUrl) || PRODUCT_PLACEHOLDER_IMAGE}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
                    <p className="text-xs text-zinc-500">Vendidos: {item.quantitySold}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary-900">{formatCurrency(item.revenue)}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-primary-950">Productos con stock bajo</h3>
          <div className="mt-4 space-y-3">
            {safeLowStock.length === 0 ? (
              <p className="text-sm text-zinc-500">Sin productos con stock bajo.</p>
            ) : (
              safeLowStock.map((item) => (
                <article
                  key={item.productId}
                  className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-zinc-50">
                    <Image
                      src={resolveProductMediaUrl(item.imageUrl) || PRODUCT_PLACEHOLDER_IMAGE}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
                    <p className="text-xs text-zinc-500">
                      Stock: {item.stock} · Minimo: {item.minStock}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.stock === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.stock === 0 ? "Agotado" : "Stock bajo"}
                  </span>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
