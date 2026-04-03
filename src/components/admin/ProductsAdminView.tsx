"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import { getApiErrorMessage } from "@/lib/api-errors";
import {
  adminDeleteProduct,
  adminListProducts,
  adminSetProductFeatured,
  adminSetProductPublished,
  filterProductsClient,
  type AdminProductListQuery,
} from "@/services/admin/product.service";
import { adminListBrands } from "@/services/admin/brand.service";
import { adminListCategories } from "@/services/admin/category.service";
import { adminListPhoneModels, type AdminPhoneModel } from "@/services/admin/phone-model.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { AdminHeader } from "@/components/admin/Header";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { InventoryModal } from "@/components/admin/InventoryModal";
import { ProductTable } from "@/components/admin/ProductTable";
import { Pagination } from "@/components/admin/Pagination";
import { Loader } from "@/components/shared/Loader";
import { ADMIN_SELECT_PAGE_SIZE, fetchAllAdminPages } from "@/lib/admin-paginate-list";
import type { PaginationMeta } from "@/types/api";
import type { Brand, Category, Product, ProductCondition, ProductType } from "@/types/product";

const PAGE_SIZE = 15;

export function ProductsAdminView() {
  const { accessToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [categoryId, setCategoryId] = useState("");
  const [modelId, setModelId] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [phoneModels, setPhoneModels] = useState<AdminPhoneModel[]>([]);
  const [type, setType] = useState<ProductType | "">("");
  const [condition, setCondition] = useState<ProductCondition | "">("");
  const [lowStock, setLowStock] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const modelsForSelect = useMemo(() => {
    if (!brandId) return phoneModels;
    return phoneModels.filter((m) => m.brandId === brandId);
  }, [phoneModels, brandId]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [inventoryProduct, setInventoryProduct] = useState<Product | null>(null);

  const loadRefs = useCallback(async () => {
    if (!accessToken) return;
    try {
      const [b, c, m] = await Promise.all([
        fetchAllAdminPages((p) =>
          adminListBrands(accessToken, {
            page: p,
            limit: ADMIN_SELECT_PAGE_SIZE,
            sort: "newest",
          })
        ),
        fetchAllAdminPages((p) =>
          adminListCategories(accessToken, {
            page: p,
            limit: ADMIN_SELECT_PAGE_SIZE,
            sort: "newest",
          })
        ),
        fetchAllAdminPages((p) =>
          adminListPhoneModels(accessToken, {
            page: p,
            limit: ADMIN_SELECT_PAGE_SIZE,
            sort: "newest",
          })
        ),
      ]);
      setBrands([...b].sort((a, z) => a.name.localeCompare(z.name, "es")));
      setCategories([...c].sort((a, z) => a.name.localeCompare(z.name, "es")));
      setPhoneModels([...m].sort((a, z) => a.name.localeCompare(z.name, "es")));
    } catch {
      /* refs opcionales */
    }
  }, [accessToken]);

  useEffect(() => {
    void loadRefs();
  }, [loadRefs]);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const q: AdminProductListQuery = {
        page,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        brandId: brandId || undefined,
        categoryId: categoryId || undefined,
        modelId: modelId || undefined,
        type: type || undefined,
        condition: condition || undefined,
        sort: "newest",
        isFeatured: featuredOnly || undefined,
        lowStock: lowStock || undefined,
      };
      const res = await adminListProducts(accessToken, q);
      let rows = res.data;
      if (lowStock || featuredOnly) {
        rows = filterProductsClient(rows, {
          lowStock: lowStock || undefined,
          isFeatured: featuredOnly ? true : undefined,
        });
      }
      setProducts(rows);
      setListMeta(res.meta);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setProducts([]);
      setListMeta({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    page,
    search,
    brandId,
    categoryId,
    modelId,
    type,
    condition,
    lowStock,
    featuredOnly,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete() {
    if (!accessToken || !deleteId) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(accessToken, deleteId);
      setDeleteId(null);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  async function togglePublished(p: Product) {
    if (!accessToken) return;
    try {
      await adminSetProductPublished(accessToken, p.id, !p.isPublished);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  async function toggleFeatured(p: Product) {
    if (!accessToken) return;
    try {
      await adminSetProductFeatured(accessToken, p.id, !p.isFeatured);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  }

  return (
    <>
      <AdminHeader
        title="Productos"
        description="Catálogo completo con filtros y acciones rápidas."
        actions={
          <Link
            href="/admin/products/new"
            className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Nuevo producto
          </Link>
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
                const next = e.target.value;
                setBrandId(next);
                setModelId((prev) => {
                  if (!next || !prev) return "";
                  const ok = phoneModels.some((mod) => mod.id === prev && mod.brandId === next);
                  return ok ? prev : "";
                });
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
          <label className="min-w-[160px]">
            <span className="text-xs font-medium text-zinc-500">Categoría</span>
            <select
              value={categoryId}
              onChange={(e) => {
                setPage(1);
                setCategoryId(e.target.value);
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[180px]">
            <span className="text-xs font-medium text-zinc-500">Modelo</span>
            <select
              value={modelId}
              onChange={(e) => {
                setPage(1);
                setModelId(e.target.value);
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {modelsForSelect.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[130px]">
            <span className="text-xs font-medium text-zinc-500">Tipo</span>
            <select
              value={type}
              onChange={(e) => {
                setPage(1);
                setType(e.target.value as ProductType | "");
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((t) => (
                <option key={t} value={t}>
                  {PRODUCT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-[140px]">
            <span className="text-xs font-medium text-zinc-500">Condición</span>
            <select
              value={condition}
              onChange={(e) => {
                setPage(1);
                setCondition(e.target.value as ProductCondition | "");
              }}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="">Todas</option>
              {(Object.keys(PRODUCT_CONDITION_LABELS) as ProductCondition[]).map((c) => (
                <option key={c} value={c}>
                  {PRODUCT_CONDITION_LABELS[c]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(e) => {
                setPage(1);
                setLowStock(e.target.checked);
              }}
              className="rounded border-zinc-300 accent-primary-600"
            />
            Stock bajo
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => {
                setPage(1);
                setFeaturedOnly(e.target.checked);
              }}
              className="rounded border-zinc-300 accent-primary-600"
            />
            Destacados
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-zinc-100 bg-white">
            <Loader label="Cargando productos…" />
          </div>
        ) : (
          <>
            <ProductTable
              products={products}
              onDelete={setDeleteId}
              onTogglePublished={togglePublished}
              onToggleFeatured={toggleFeatured}
              onOpenInventory={setInventoryProduct}
            />
            <Pagination
              meta={listMeta}
              onPageChange={(p) => setPage(p)}
            />
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Eliminar producto"
        description="Esta acción no se puede deshacer. ¿Continuar?"
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      {accessToken && inventoryProduct ? (
        <InventoryModal
          accessToken={accessToken}
          product={inventoryProduct}
          onClose={() => setInventoryProduct(null)}
          onSuccess={() => void load()}
        />
      ) : null}
    </>
  );
}
