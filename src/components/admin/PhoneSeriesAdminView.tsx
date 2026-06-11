"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import { ADMIN_SELECT_PAGE_SIZE, fetchAllAdminPages } from "@/lib/admin-paginate-list";
import { adminDeleteSeries, adminListSeries } from "@/services/admin/series.service";
import { adminListBrands } from "@/services/admin/brand.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { AdminHeader } from "@/components/admin/Header";
import { SeriesModal } from "@/components/admin/SeriesModal";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Pagination } from "@/components/admin/Pagination";
import { Loader } from "@/components/shared/Loader";
import type { PaginationMeta } from "@/types/api";
import type { PhoneSeries } from "@/types/catalog-admin";
import type { Brand } from "@/types/product";

const PAGE_SIZE = 15;

export function PhoneSeriesAdminView() {
  const { accessToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PhoneSeries[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [listMeta, setListMeta] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PhoneSeries | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBrands = useCallback(async () => {
    if (!accessToken) return;
    try {
      const list = await fetchAllAdminPages((p) =>
        adminListBrands(accessToken, { page: p, limit: ADMIN_SELECT_PAGE_SIZE, sort: "newest" })
      );
      setBrands([...list].sort((a, b) => a.name.localeCompare(b.name, "es")));
    } catch {
      /* opcional */
    }
  }, [accessToken]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminListSeries(accessToken, {
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        sort: "newest",
      });
      setRows(res.data);
      setListMeta(res.meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e);
      setRows([]);
      setListMeta({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, search]);

  useEffect(() => {
    void loadBrands();
  }, [loadBrands]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setDeleting(true);
    try {
      await adminDeleteSeries(accessToken, deleteId);
      setDeleteId(null);
      notifySuccess("Serie eliminada correctamente");
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e);
    } finally {
      setDeleting(false);
    }
  }

  function brandName(row: PhoneSeries) {
    return row.brand?.name ?? brands.find((b) => b.id === row.brandId)?.name ?? "—";
  }

  return (
    <>
      <AdminHeader
        title="Series"
        description="Series de teléfono por marca."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Nueva serie
          </button>
        }
      />
      <div className="space-y-6 p-4 sm:p-6">
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="block max-w-md">
            <span className="text-xs font-medium text-zinc-500">Buscar por nombre</span>
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Nombre de serie"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-zinc-100 bg-white">
            <Loader label="Cargando series…" />
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 py-14 text-center text-sm text-zinc-500">
            No hay series que coincidan con la búsqueda.
          </p>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/90 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Marca</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/50">
                      <td className="px-4 py-3 font-medium text-zinc-900">{row.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{row.slug}</td>
                      <td className="px-4 py-3 text-zinc-700">{brandName(row)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            row.isActive
                              ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800"
                              : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600"
                          }
                        >
                          {row.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(row);
                            setModalOpen(true);
                          }}
                          className="text-xs font-semibold text-primary-700 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(row.id)}
                          className="ml-3 text-xs font-semibold text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination meta={listMeta} onPageChange={(p) => setPage(p)} />
          </>
        )}
      </div>

      {accessToken ? (
        <SeriesModal
          open={modalOpen}
          accessToken={accessToken}
          series={editing}
          brands={brands}
          onClose={() => setModalOpen(false)}
          onSaved={() => void load()}
        />
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Eliminar serie"
        description="¿Eliminar esta serie? Los productos asociados pueden quedar inconsistentes."
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
