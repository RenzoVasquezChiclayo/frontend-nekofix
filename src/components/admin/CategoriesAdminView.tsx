"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { adminDeleteCategory, adminListCategories } from "@/services/admin/category.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { AdminHeader } from "@/components/admin/Header";
import { CategoryModal } from "@/components/admin/CategoryModal";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Pagination } from "@/components/admin/Pagination";
import { Loader } from "@/components/shared/Loader";
import type { PaginationMeta } from "@/types/api";
import type { Category } from "@/types/product";

const PAGE_SIZE = 15;

export function CategoriesAdminView() {
  const { accessToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [listMeta, setListMeta] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminListCategories(accessToken, {
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        sort: "newest",
      });
      setCategories(res.data);
      setListMeta(res.meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setCategories([]);
      setListMeta({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setDeleting(true);
    try {
      await adminDeleteCategory(accessToken, deleteId);
      setDeleteId(null);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <AdminHeader
        title="Categorías"
        description="Organiza el catálogo por categorías."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Nueva categoría
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
          <label className="min-w-[200px] flex-1">
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
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-zinc-100 bg-white">
            <Loader label="Cargando categorías…" />
          </div>
        ) : categories.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 py-14 text-center text-sm text-zinc-500">
            No hay categorías que coincidan con la búsqueda.
          </p>
        ) : (
          <>
            <ul className="space-y-3 lg:hidden">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-50 text-xl">
                      {c.icon?.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.icon} alt="" className="h-9 w-9 object-contain" />
                      ) : (
                        <span>{c.icon || "—"}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-zinc-900">{c.name}</p>
                      <p className="font-mono text-xs text-zinc-600">{c.slug}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-zinc-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(c);
                        setModalOpen(true);
                      }}
                      className="touch-manipulation rounded-lg bg-primary-50 px-4 py-2 text-xs font-semibold text-primary-800"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(c.id)}
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
                    <th className="px-4 py-3">Icono</th>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-50/50">
                      <td className="px-4 py-3">
                        {c.icon?.startsWith("http") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.icon}
                            alt=""
                            className="h-9 w-9 object-contain"
                          />
                        ) : (
                          <span className="text-xl">{c.icon || "—"}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-900">{c.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-600">{c.slug}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(c);
                            setModalOpen(true);
                          }}
                          className="text-xs font-semibold text-primary-700 hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(c.id)}
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
        <CategoryModal
          open={modalOpen}
          accessToken={accessToken}
          category={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => void load()}
        />
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Eliminar categoría"
        description="¿Eliminar esta categoría?"
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
