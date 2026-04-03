"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { ADMIN_SELECT_PAGE_SIZE, fetchAllAdminPages } from "@/lib/admin-paginate-list";
import { adminListBrands } from "@/services/admin/brand.service";
import {
  adminDeletePhoneModel,
  adminListPhoneModels,
  type AdminPhoneModel,
} from "@/services/admin/phone-model.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { AdminHeader } from "@/components/admin/Header";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Pagination } from "@/components/admin/Pagination";
import { PhoneModelModal } from "@/components/admin/PhoneModelModal";
import { Loader } from "@/components/shared/Loader";
import type { PaginationMeta } from "@/types/api";
import type { Brand } from "@/types/product";
import type { PhoneModelSortKey } from "@/lib/mappers/phone-model-query.mapper";

const PAGE_SIZE = 15;

export function PhoneModelsAdminView() {
  const { accessToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminPhoneModel[]>([]);
  const [listMeta, setListMeta] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("");
  const [sort, setSort] = useState<PhoneModelSortKey>("newest");
  const [brandOptions, setBrandOptions] = useState<Brand[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPhoneModel | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminListPhoneModels(accessToken, {
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        brandId: brandId || undefined,
        sort,
      });
      setRows(res.data);
      setListMeta(res.meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setRows([]);
      setListMeta({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, search, brandId, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const token = accessToken;
    if (!token) return;
    const authToken: string = token;
    let cancelled = false;
    async function loadBrands() {
      try {
        const rows = await fetchAllAdminPages((p) =>
          adminListBrands(authToken, {
            page: p,
            limit: ADMIN_SELECT_PAGE_SIZE,
            sort: "newest",
          })
        );
        if (!cancelled) {
          setBrandOptions(rows.sort((a, b) => a.name.localeCompare(b.name, "es")));
        }
      } catch {
        if (!cancelled) setBrandOptions([]);
      }
    }
    void loadBrands();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setDeleting(true);
    try {
      await adminDeletePhoneModel(accessToken, deleteId);
      setDeleteId(null);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  const sortLabel = useMemo(
    () => ({
      newest: "Mas nuevos",
      oldest: "Mas antiguos",
      name_asc: "Nombre A-Z",
      name_desc: "Nombre Z-A",
    }),
    []
  );

  return (
    <>
      <AdminHeader
        title="Modelos de telefono"
        description="Catalogo de modelos vinculados a marcas."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Nuevo modelo
          </button>
        }
      />
      <div className="space-y-6 p-4 sm:p-6">
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:flex-row lg:flex-wrap lg:items-end">
          <label className="min-w-[180px] flex-1">
            <span className="text-xs font-medium text-zinc-500">Buscar</span>
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Nombre o slug"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </label>
          <label className="min-w-[180px]">
            <span className="text-xs font-medium text-zinc-500">Marca</span>
            <select
              value={brandId}
              onChange={(e) => {
                setPage(1);
                setBrandId(e.target.value);
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="">Todas</option>
              {brandOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[180px]">
            <span className="text-xs font-medium text-zinc-500">Orden</span>
            <select
              value={sort}
              onChange={(e) => {
                setPage(1);
                setSort(e.target.value as PhoneModelSortKey);
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="newest">{sortLabel.newest}</option>
              <option value="oldest">{sortLabel.oldest}</option>
              <option value="name_asc">{sortLabel.name_asc}</option>
              <option value="name_desc">{sortLabel.name_desc}</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-zinc-100 bg-white">
            <Loader label="Cargando modelos..." />
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 py-14 text-center text-sm text-zinc-500">
            No hay modelos que coincidan con los filtros.
          </p>
        ) : (
          <>
            <ul className="space-y-3 lg:hidden">
              {rows.map((m) => (
                <li
                  key={m.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <p className="font-semibold text-zinc-900">{m.name}</p>
                  <p className="mt-1 font-mono text-xs text-zinc-600">{m.slug}</p>
                  <p className="mt-2 text-sm text-zinc-700">
                    {m.brand?.name ?? brandOptions.find((b) => b.id === m.brandId)?.name ?? "—"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString("es-PE") : "—"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(m);
                        setModalOpen(true);
                      }}
                      className="touch-manipulation rounded-lg bg-primary-50 px-4 py-2 text-xs font-semibold text-primary-800"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(m.id)}
                      className="touch-manipulation rounded-lg px-4 py-2 text-xs font-semibold text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white lg:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/90 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Marca</th>
                    <th className="px-4 py-3">Fecha creacion</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {rows.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50/50">
                      <td className="px-4 py-3 font-medium text-zinc-900">{m.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{m.slug}</td>
                      <td className="px-4 py-3 text-zinc-700">
                        {m.brand?.name ?? brandOptions.find((b) => b.id === m.brandId)?.name ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {m.createdAt ? new Date(m.createdAt).toLocaleString("es-PE") : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(m);
                            setModalOpen(true);
                          }}
                          className="text-xs font-semibold text-primary-700 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(m.id)}
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
        <PhoneModelModal
          open={modalOpen}
          accessToken={accessToken}
          phoneModel={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => void load()}
        />
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Eliminar modelo"
        description="Esta accion no se puede deshacer. Continuar?"
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
