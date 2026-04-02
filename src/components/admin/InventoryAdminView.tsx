"use client";

import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
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
import type { Product } from "@/types/product";

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
  const [brand, setBrand] = useState("");

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [history, setHistory] = useState<InventoryHistoryEntry[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingHist, setLoadingHist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moveProduct, setMoveProduct] = useState<Product | null>(null);

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
        brand: brand.trim() || undefined,
      });
      setProducts(res.data);
      setListMeta(res.meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setProducts([]);
      setListMeta({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    } finally {
      setLoadingList(false);
    }
  }, [accessToken, page, search, brand]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setSelectedProductId(null);
    setHistory([]);
  }, [page, search, brand]);

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
      <div className="space-y-6 p-6">
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
          <label className="min-w-[120px]">
            <span className="text-xs font-medium text-zinc-500">Marca (slug)</span>
            <input
              value={brand}
              onChange={(e) => {
                setPage(1);
                setBrand(e.target.value);
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="apple"
            />
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
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
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
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
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
