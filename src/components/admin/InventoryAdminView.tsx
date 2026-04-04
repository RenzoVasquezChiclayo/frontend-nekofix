"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError } from "@/lib/toast";
import { ADMIN_SELECT_PAGE_SIZE, fetchAllAdminPages } from "@/lib/admin-paginate-list";
import { adminListBrands } from "@/services/admin/brand.service";
import { adminListProducts } from "@/services/admin/product.service";
import { adminGetInventoryHistory } from "@/services/admin/inventory.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { AdminHeader } from "@/components/admin/Header";
import { InventoryModal } from "@/components/admin/InventoryModal";
import { Pagination } from "@/components/admin/Pagination";
import { Loader } from "@/components/shared/Loader";
import { INVENTORY_MOVE_LABELS } from "@/types/inventory";
import type { InventoryHistoryEntry } from "@/types/inventory";
import type { PaginationMeta } from "@/types/api";
import type { Brand, Product } from "@/types/product";

const PAGE_SIZE = 15;

export function InventoryAdminView() {
  const { accessToken } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [listMeta, setListMeta] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [history, setHistory] = useState<InventoryHistoryEntry[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingHist, setLoadingHist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moveProduct, setMoveProduct] = useState<Product | null>(null);

  const loadBrands = useCallback(async () => {
    if (!accessToken) return;
    try {
      const rows = await fetchAllAdminPages((p) =>
        adminListBrands(accessToken, {
          page: p,
          limit: ADMIN_SELECT_PAGE_SIZE,
          sort: "newest",
        })
      );
      setBrands(rows.sort((a, b) => a.name.localeCompare(b.name, "es")));
    } catch {
      setBrands([]);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadBrands();
  }, [loadBrands]);

  const loadProducts = useCallback(async () => {
    if (!accessToken) return;
    setLoadingList(true);
    setError(null);
    try {
      const res = await adminListProducts(accessToken, {
        page,
        limit: PAGE_SIZE,
        sort: "newest",
        search: search.trim() || undefined,
        brandId: brandId || undefined,
      });
      setProducts(res.data);
      setListMeta(res.meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e);
      setProducts([]);
      setListMeta({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    } finally {
      setLoadingList(false);
    }
  }, [accessToken, page, search, brandId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setSelectedProductId(null);
    setHistory([]);
  }, [page, search, brandId]);

  const loadHistory = useCallback(async () => {
    if (!accessToken || !selectedProductId) {
      setHistory([]);
      return;
    }
    setLoadingHist(true);
    setError(null);
    try {
      const res = await adminGetInventoryHistory(accessToken, selectedProductId);
      setHistory(res.data);
    } catch (e) {
      setError(getApiErrorMessage(e));
      notifyApiError(e, "No se pudo cargar el historial de inventario.");
      setHistory([]);
    } finally {
      setLoadingHist(false);
    }
  }, [accessToken, selectedProductId]);

  useEffect(() => {
    if (selectedProductId) void loadHistory();
  }, [loadHistory, selectedProductId]);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ?? null;

  return (
    <>
      <AdminHeader
        title="Inventario"
        description="Movimientos de stock e historial por producto."
        actions={
          selectedProduct ? (
            <button
              type="button"
              onClick={() => setMoveProduct(selectedProduct)}
              className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              Mover stock
            </button>
          ) : null
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
              placeholder="Nombre o SKU"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </label>
          <label className="min-w-[160px]">
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
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-primary-950">Productos</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Elige un producto para ver su historial de movimientos debajo.
          </p>

          {loadingList ? (
            <div className="mt-8 flex min-h-[200px] items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50/50">
              <Loader label="Cargando productos…" />
            </div>
          ) : products.length === 0 ? (
            <p className="mt-8 rounded-xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-500">
              No hay productos que coincidan. Crea productos o ajusta filtros.
            </p>
          ) : (
            <>
              <ul className="mt-6 space-y-3 lg:hidden">
                {products.map((p) => {
                  const active = selectedProductId === p.id;
                  return (
                    <li
                      key={p.id}
                      className={`rounded-2xl border p-4 shadow-sm ${
                        active
                          ? "border-primary-200 bg-primary-50/60"
                          : "border-zinc-200 bg-white"
                      }`}
                    >
                      <p className="font-medium text-zinc-900">{p.name}</p>
                      <p className="mt-1 font-mono text-xs text-zinc-600">{p.sku}</p>
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
                        <span className="text-sm tabular-nums text-zinc-800">
                          Stock: <strong>{p.stock}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedProductId(p.id)}
                          className="touch-manipulation rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-700"
                        >
                          Ver historial
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 hidden overflow-x-auto lg:block">
                <table className="w-full min-w-0 text-left text-sm">
                  <thead className="border-b border-zinc-100 bg-zinc-50/90 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-3 py-3">Producto</th>
                      <th className="px-3 py-3">SKU</th>
                      <th className="px-3 py-3 text-right">Stock</th>
                      <th className="px-3 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {products.map((p) => {
                      const active = selectedProductId === p.id;
                      return (
                        <tr
                          key={p.id}
                          className={
                            active ? "bg-primary-50/60 hover:bg-primary-50/80" : "hover:bg-zinc-50/50"
                          }
                        >
                          <td className="px-3 py-3 font-medium text-zinc-900">{p.name}</td>
                          <td className="px-3 py-3 font-mono text-xs text-zinc-600">{p.sku}</td>
                          <td className="px-3 py-3 text-right tabular-nums text-zinc-800">
                            {p.stock}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedProductId(p.id)}
                              className="text-xs font-semibold text-primary-700 hover:underline"
                            >
                              Ver historial
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination
                className="mt-4 border-t-0 pt-2"
                meta={listMeta}
                onPageChange={(next) => setPage(next)}
              />
            </>
          )}
        </section>

        {selectedProductId ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-primary-950">
              Historial
              {selectedProduct ? (
                <span className="ml-2 font-normal text-zinc-600">
                  — {selectedProduct.name}{" "}
                  <span className="font-mono text-xs text-zinc-500">({selectedProduct.sku})</span>
                </span>
              ) : null}
            </h2>

            {loadingHist ? (
              <div className="mt-8 flex justify-center py-12">
                <Loader label="Cargando historial…" />
              </div>
            ) : history.length === 0 ? (
              <p className="mt-8 rounded-xl border border-dashed border-zinc-200 py-10 text-center text-sm text-zinc-500">
                Sin movimientos para este producto.
              </p>
            ) : (
              <>
                <ul className="mt-6 space-y-3 lg:hidden">
                  {history.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50/40 p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-semibold text-zinc-900">
                          {INVENTORY_MOVE_LABELS[r.type] ?? r.type}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(r.createdAt).toLocaleString("es-PE")}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-zinc-500">Cant.</p>
                          <p className="tabular-nums">{r.quantity}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-zinc-500">Ant.</p>
                          <p className="tabular-nums text-zinc-600">{r.previousStock}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-zinc-500">Nuevo</p>
                          <p className="font-medium tabular-nums text-primary-800">{r.newStock}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-zinc-600">
                        {r.user?.email ?? r.user?.name ?? "—"}
                      </p>
                      {r.notes ? (
                        <p className="mt-2 border-t border-zinc-100 pt-2 text-xs text-zinc-500">
                          {r.notes}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-0 text-left text-sm">
                    <thead className="border-b border-zinc-100 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      <tr>
                        <th className="py-3 pr-4">Tipo</th>
                        <th className="py-3 pr-4">Cantidad</th>
                        <th className="py-3 pr-4">Ant.</th>
                        <th className="py-3 pr-4">Nuevo</th>
                        <th className="py-3 pr-4">Usuario</th>
                        <th className="py-3 pr-4">Fecha</th>
                        <th className="py-3">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {history.map((r) => (
                        <tr key={r.id} className="hover:bg-zinc-50/50">
                          <td className="py-3 pr-4 text-zinc-800">
                            {INVENTORY_MOVE_LABELS[r.type] ?? r.type}
                          </td>
                          <td className="py-3 pr-4 tabular-nums">{r.quantity}</td>
                          <td className="py-3 pr-4 tabular-nums text-zinc-600">{r.previousStock}</td>
                          <td className="py-3 pr-4 font-medium tabular-nums text-primary-800">
                            {r.newStock}
                          </td>
                          <td className="py-3 pr-4 text-xs text-zinc-600">
                            {r.user?.email ?? r.user?.name ?? "—"}
                          </td>
                          <td className="py-3 pr-4 text-xs text-zinc-500">
                            {new Date(r.createdAt).toLocaleString("es-PE")}
                          </td>
                          <td
                            className="max-w-[200px] truncate py-3 text-xs text-zinc-500"
                            title={r.notes ?? ""}
                          >
                            {r.notes ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        ) : null}
      </div>

      {accessToken && moveProduct ? (
        <InventoryModal
          accessToken={accessToken}
          product={moveProduct}
          onClose={() => setMoveProduct(null)}
          onSuccess={() => {
            void loadHistory();
            void loadProducts();
          }}
        />
      ) : null}
    </>
  );
}
