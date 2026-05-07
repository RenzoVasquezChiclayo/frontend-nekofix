"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { resolveProductMediaUrl } from "@/lib/product-images";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import { notifyApiError } from "@/lib/toast";
import { adminGetLead } from "@/services/admin/lead.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import type { Lead, LeadStatus } from "@/types/lead";

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

export function LeadDetailView({ leadId }: { leadId: string }) {
  const { accessToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);

  const loadLead = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const row = await adminGetLead(accessToken, leadId);
      setLead(row);
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e, "No se pudo cargar el detalle del lead.");
      setLead(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken, leadId]);

  useEffect(() => {
    void loadLead();
  }, [loadLead]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-500">Cargando detalle del lead…</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800 shadow-sm">
        {error || "No se encontró el lead."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-primary-950">Lead #{lead.id}</h1>
            <p className="mt-1 text-sm text-zinc-600">{lead.customerName || "Cliente WhatsApp"}</p>
            <p className="mt-1 text-sm text-zinc-600">Teléfono: {lead.phone || "—"}</p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGES[lead.status]}`}
          >
            {STATUS_LABELS[lead.status]}
          </span>
        </div>

        <div className="mt-5 grid gap-4 text-sm text-zinc-700 sm:grid-cols-2">
          <p>
            <span className="text-zinc-500">Creado:</span>{" "}
            {new Date(lead.createdAt).toLocaleString("es-PE")}
          </p>
          <p>
            <span className="text-zinc-500">Actualizado:</span>{" "}
            {new Date(lead.updatedAt).toLocaleString("es-PE")}
          </p>
          <p>
            <span className="text-zinc-500">Total:</span>{" "}
            <strong className="text-primary-900">{formatCurrency(lead.total)}</strong>
          </p>
          <p>
            <span className="text-zinc-500">Confirmado por:</span> {lead.confirmedById || "—"}
          </p>
        </div>

        {lead.notes ? (
          <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
            {lead.notes}
          </div>
        ) : null}
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-primary-950">Productos</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-100 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3 pr-4">Producto</th>
                <th className="py-3 pr-4">Cantidad</th>
                <th className="py-3 pr-4">Precio</th>
                <th className="py-3 pr-4">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {lead.products.map((item, idx) => (
                <tr key={`${item.productId}-${idx}`}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-50">
                        <Image
                          src={resolveProductMediaUrl(item.imageUrl) || PRODUCT_PLACEHOLDER_IMAGE}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.productId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{item.quantity}</td>
                  <td className="py-3 pr-4 tabular-nums">{formatCurrency(item.price)}</td>
                  <td className="py-3 pr-4 tabular-nums font-medium text-primary-900">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-700">
        {lead.status === "SOLD" ? (
          <>
            <p>
              <strong>Vendido el:</strong>{" "}
              {lead.soldAt ? new Date(lead.soldAt).toLocaleString("es-PE") : "—"}
            </p>
            <p className="mt-1">
              <strong>Confirmado por:</strong> {lead.confirmedById || "—"}
            </p>
          </>
        ) : null}
        {lead.status === "CANCELLED" ? (
          <p>
            <strong>Cancelado el:</strong>{" "}
            {lead.cancelledAt ? new Date(lead.cancelledAt).toLocaleString("es-PE") : "—"}
          </p>
        ) : null}
      </section>

      <Link
        href="/admin/leads"
        className="inline-flex rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
      >
        Volver a Leads
      </Link>
    </div>
  );
}
