"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import {
  adminCancelLead,
  adminConfirmLead,
  adminContactLead,
  adminListLeads,
} from "@/services/admin/lead.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { AdminHeader } from "@/components/admin/Header";
import { Pagination } from "@/components/admin/Pagination";
import type { PaginationMeta } from "@/types/api";
import type { LeadListItem, LeadStatus } from "@/types/lead";

const PAGE_SIZE = 15;
type LeadSortValue = "createdAt_desc" | "createdAt_asc" | "total_desc" | "total_asc";
type PendingAction = { type: "confirm" | "cancel"; lead: LeadListItem } | null;

const STATUS_FILTERS: Array<{ value: "ALL" | LeadStatus; label: string }> = [
  { value: "ALL", label: "Todos" },
  { value: "PENDING", label: "Pendientes" },
  { value: "CONTACTED", label: "Contactados" },
  { value: "SOLD", label: "Vendidos" },
  { value: "CANCELLED", label: "Cancelados" },
];

const STATUS_BADGES: Record<LeadStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  SOLD: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  PENDING: "Pendiente",
  CONTACTED: "Contactado",
  SOLD: "Vendido",
  CANCELLED: "Cancelado",
};

function formatCurrency(value?: number): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function buildLeadSearchParams(params: {
  page: number;
  search: string;
  status: "ALL" | LeadStatus;
  sort: LeadSortValue;
}): URLSearchParams {
  const next = new URLSearchParams();
  if (params.page > 1) next.set("page", String(params.page));
  if (params.search.trim()) next.set("search", params.search.trim());
  if (params.status !== "ALL") next.set("status", params.status);
  if (params.sort !== "createdAt_desc") next.set("sort", params.sort);
  return next;
}

export function LeadsAdminView() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAdminAuth();

  const initialPage = Number(searchParams.get("page") ?? "1");
  const initialSearch = searchParams.get("search") ?? "";
  const initialStatus = (searchParams.get("status") as LeadStatus | null) ?? "ALL";
  const initialSort =
    (searchParams.get("sort") as LeadSortValue | null) ?? "createdAt_desc";

  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [busyLeadId, setBusyLeadId] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<"contact" | "confirm" | "cancel" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<LeadListItem[]>([]);
  const [page, setPage] = useState(Number.isFinite(initialPage) ? Math.max(1, initialPage) : 1);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<"ALL" | LeadStatus>(initialStatus);
  const [sort, setSort] = useState<LeadSortValue>(initialSort);
  const [productsLead, setProductsLead] = useState<LeadListItem | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const next = buildLeadSearchParams({ page, search, status, sort }).toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  }, [page, pathname, router, search, sort, status]);

  const sortQuery = useMemo(() => {
    const [sortBy, sortOrder] = sort.split("_") as ["createdAt" | "total", "asc" | "desc"];
    return { sortBy, sortOrder };
  }, [sort]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminListLeads(accessToken, {
        page,
        limit: PAGE_SIZE,
        search,
        status: status === "ALL" ? undefined : status,
        sortBy: sortQuery.sortBy,
        sortOrder: sortQuery.sortOrder,
      });
      setRows(res.data);
      setMeta(res.meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e, "No se pudo cargar el listado de leads.");
      setRows([]);
      setMeta({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, search, sortQuery.sortBy, sortQuery.sortOrder, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function markAsContacted(lead: LeadListItem) {
    if (!accessToken || busyLeadId) return;
    setBusyLeadId(lead.id);
    setBusyAction("contact");
    try {
      await adminContactLead(accessToken, lead.id);
      notifySuccess("Lead marcado como contactado");
      await load();
    } catch (e) {
      notifyApiError(e);
    } finally {
      setBusyLeadId(null);
      setBusyAction(null);
    }
  }

  async function executePendingAction() {
    if (!pendingAction || !accessToken || busyLeadId) return;
    setBusyLeadId(pendingAction.lead.id);
    setBusyAction(pendingAction.type);
    try {
      if (pendingAction.type === "confirm") {
        await adminConfirmLead(accessToken, pendingAction.lead.id);
        notifySuccess("Venta confirmada correctamente");
      } else {
        await adminCancelLead(accessToken, pendingAction.lead.id);
        notifySuccess("Lead cancelado correctamente");
      }
      setPendingAction(null);
      await load();
    } catch (e) {
      const message = getApiErrorMessage(e);
      if (/stock/i.test(message)) {
        notifyApiError(e, "No hay stock suficiente");
      } else {
        notifyApiError(e);
      }
    } finally {
      setBusyLeadId(null);
      setBusyAction(null);
    }
  }

  function renderStatusBadge(leadStatus: LeadStatus) {
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGES[leadStatus]}`}
      >
        {STATUS_LABELS[leadStatus]}
      </span>
    );
  }

  function renderActions(lead: LeadListItem) {
    const isBusy = busyLeadId === lead.id;
    if (lead.status === "SOLD") {
      return <span className="text-xs font-semibold text-emerald-700">✅ Venta confirmada</span>;
    }
    if (lead.status === "CANCELLED") {
      return <span className="text-xs font-semibold text-red-700">❌ Cancelado</span>;
    }
    return (
      <div className="flex flex-wrap justify-end gap-2">
        {lead.status === "PENDING" ? (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void markAsContacted(lead)}
            className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
          >
            {isBusy && busyAction === "contact" ? "Guardando…" : "Contactado"}
          </button>
        ) : null}
        <button
          type="button"
          disabled={isBusy}
          onClick={() => setPendingAction({ type: "confirm", lead })}
          className="rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          Confirmar venta
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={() => setPendingAction({ type: "cancel", lead })}
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Leads WhatsApp"
        description="Gestión de ventas de WhatsApp con seguimiento comercial."
      />
      <div className="space-y-6 p-4 sm:p-6">
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end">
          <label className="min-w-[220px] flex-1">
            <span className="text-xs font-medium text-zinc-500">Buscar</span>
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Cliente, teléfono o producto"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </label>
          <label className="min-w-[180px]">
            <span className="text-xs font-medium text-zinc-500">Estado</span>
            <select
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value as "ALL" | LeadStatus);
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              {STATUS_FILTERS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[180px]">
            <span className="text-xs font-medium text-zinc-500">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value as LeadSortValue);
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="createdAt_desc">Más recientes</option>
              <option value="createdAt_asc">Más antiguos</option>
              <option value="total_desc">Mayor total</option>
              <option value="total_asc">Menor total</option>
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <span className="animate-pulse text-sm text-zinc-500">Cargando leads…</span>
            </div>
          ) : rows.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500">
              No hay leads para mostrar con los filtros actuales.
            </p>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="border-b border-zinc-100 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="py-3 pr-4">Estado</th>
                      <th className="py-3 pr-4">Cliente</th>
                      <th className="py-3 pr-4">Teléfono</th>
                      <th className="py-3 pr-4">Productos</th>
                      <th className="py-3 pr-4">Total</th>
                      <th className="py-3 pr-4">Fecha</th>
                      <th className="py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {rows.map((lead) => (
                      <tr key={lead.id} className="hover:bg-zinc-50/50">
                        <td className="py-3 pr-4">{renderStatusBadge(lead.status)}</td>
                        <td className="py-3 pr-4">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="font-medium text-zinc-900 hover:text-primary-700 hover:underline"
                          >
                            {lead.customerName || "Cliente WhatsApp"}
                          </Link>
                        </td>
                        <td className="py-3 pr-4 text-zinc-700">{lead.phone || "—"}</td>
                        <td className="py-3 pr-4">
                          <button
                            type="button"
                            onClick={() => setProductsLead(lead)}
                            className="text-xs font-semibold text-primary-700 hover:underline"
                          >
                            Ver ({lead.products.length})
                          </button>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-primary-900">
                          {formatCurrency(lead.total)}
                        </td>
                        <td className="py-3 pr-4 text-xs text-zinc-500">
                          {new Date(lead.createdAt).toLocaleString("es-PE")}
                        </td>
                        <td className="py-3 text-right">{renderActions(lead)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="space-y-3 lg:hidden">
                {rows.map((lead) => (
                  <li key={lead.id} className="rounded-2xl border border-zinc-200 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-medium text-zinc-900 hover:text-primary-700 hover:underline"
                        >
                          {lead.customerName || "Cliente WhatsApp"}
                        </Link>
                        <p className="mt-1 text-xs text-zinc-500">
                          {new Date(lead.createdAt).toLocaleString("es-PE")}
                        </p>
                      </div>
                      {renderStatusBadge(lead.status)}
                    </div>
                    <p className="mt-3 text-sm text-zinc-700">Teléfono: {lead.phone || "—"}</p>
                    <p className="mt-1 text-sm font-semibold text-primary-900">
                      Total: {formatCurrency(lead.total)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setProductsLead(lead)}
                      className="mt-2 text-xs font-semibold text-primary-700 hover:underline"
                    >
                      Ver productos ({lead.products.length})
                    </button>
                    <div className="mt-3">{renderActions(lead)}</div>
                  </li>
                ))}
              </ul>
            </>
          )}

          <Pagination className="mt-4" meta={meta} onPageChange={(next) => setPage(next)} />
        </div>
      </div>

      {productsLead ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">Productos del lead</h3>
                <p className="text-xs text-zinc-500">
                  {productsLead.customerName || productsLead.phone || "Cliente WhatsApp"} ·{" "}
                  {new Date(productsLead.createdAt).toLocaleString("es-PE")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductsLead(null)}
                className="rounded-lg px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 max-h-[360px] overflow-auto rounded-xl border border-zinc-200">
              {productsLead.products.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">Producto</th>
                      <th className="px-3 py-2">Cantidad</th>
                      <th className="px-3 py-2">Precio</th>
                      <th className="px-3 py-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {productsLead.products.map((item, idx) => (
                      <tr key={`${item.productId}-${idx}`}>
                        <td className="px-3 py-2">
                          <p className="font-medium text-zinc-900">{item.name}</p>
                        </td>
                        <td className="px-3 py-2 tabular-nums text-zinc-700">{item.quantity}</td>
                        <td className="px-3 py-2 tabular-nums text-zinc-700">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-3 py-2 font-medium tabular-nums text-primary-900">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-6 text-sm text-zinc-500">Este lead no tiene productos registrados.</p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="text-sm text-zinc-600">Total del lead</span>
              <strong className="text-base text-primary-900">
                {formatCurrency(productsLead.total)}
              </strong>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        open={pendingAction?.type === "confirm"}
        title="¿Deseas confirmar esta venta?"
        description="Esta acción descontará stock automáticamente."
        confirmLabel="Confirmar venta"
        loading={Boolean(
          pendingAction &&
            busyLeadId === pendingAction.lead.id &&
            busyAction === pendingAction.type
        )}
        onClose={() => setPendingAction(null)}
        onConfirm={() => void executePendingAction()}
      />
      <ConfirmModal
        open={pendingAction?.type === "cancel"}
        title="¿Deseas cancelar este lead?"
        description="El lead quedará marcado como cancelado y no podrá confirmarse luego."
        confirmLabel="Cancelar lead"
        variant="danger"
        loading={Boolean(
          pendingAction &&
            busyLeadId === pendingAction.lead.id &&
            busyAction === pendingAction.type
        )}
        onClose={() => setPendingAction(null)}
        onConfirm={() => void executePendingAction()}
      />
    </>
  );
}
