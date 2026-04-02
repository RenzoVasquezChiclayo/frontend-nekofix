"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import { getApiErrorMessage } from "@/lib/api-errors";
import { emptyListResponse } from "@/lib/normalize-api-list";
import { adminCreateProduct, adminGetProduct, adminUpdateProduct } from "@/services/admin/product.service";
import { adminListBrands } from "@/services/admin/brand.service";
import { adminListCategories } from "@/services/admin/category.service";
import { getPhoneModels } from "@/services/phone-model.service";
import { useAdminAuth } from "@/store/admin-auth-context";
import { Loader } from "@/components/shared/Loader";
import type { ProductCreateInput } from "@/types/admin-product";
import type { Brand, Category, PhoneModel, ProductCondition, ProductType } from "@/types/product";

const TYPES = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[];
const CONDITIONS = Object.keys(PRODUCT_CONDITION_LABELS) as ProductCondition[];

type Props = {
  productId?: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductForm({ productId }: Props) {
  const router = useRouter();
  const { accessToken } = useAdminAuth();
  const isEdit = Boolean(productId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [models, setModels] = useState<PhoneModel[]>([]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [stock, setStock] = useState("0");
  const [minStock, setMinStock] = useState("0");
  const [type, setType] = useState<ProductType>("NEW");
  const [condition, setCondition] = useState<ProductCondition>("NEW");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [modelId, setModelId] = useState("");
  const [storage, setStorage] = useState("");
  const [color, setColor] = useState("");
  const [batteryHealth, setBatteryHealth] = useState("");
  const [grade, setGrade] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const loadRefs = useCallback(async () => {
    if (!accessToken) return;
    try {
      const [b, c, m] = await Promise.all([
        adminListBrands(accessToken),
        adminListCategories(accessToken),
        getPhoneModels().catch(() => emptyListResponse<PhoneModel>()),
      ]);
      setBrands(b.data);
      setCategories(c.data);
      setModels(m.data);
    } catch {
      /* empty */
    }
  }, [accessToken]);

  useEffect(() => {
    void loadRefs();
  }, [loadRefs]);

  useEffect(() => {
    if (!isEdit || !accessToken || !productId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const p = await adminGetProduct(accessToken, productId);
        if (cancelled) return;
        setName(p.name);
        setSlug(p.slug);
        setSku(p.sku);
        setDescription(p.description ?? "");
        setPrice(String(p.price));
        setComparePrice(p.comparePrice != null ? String(p.comparePrice) : "");
        setStock(String(p.stock));
        setMinStock(String(p.minStock));
        setType(p.type);
        setCondition(p.condition);
        setBrandId(p.brandId);
        setCategoryId(p.categoryId);
        setModelId(p.modelId ?? "");
        setStorage(p.storage ?? "");
        setColor(p.color ?? "");
        setBatteryHealth(p.batteryHealth != null ? String(p.batteryHealth) : "");
        setGrade(p.grade ?? "");
        setIsFeatured(p.isFeatured);
        setIsPublished(p.isPublished);
        setSeoTitle(p.seoTitle ?? "");
        setSeoDescription(p.seoDescription ?? "");
      } catch (e) {
        if (!cancelled) setError(getApiErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, accessToken, productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    setError(null);
    try {
      const payload: ProductCreateInput = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        sku: sku.trim(),
        description: description.trim() || null,
        price: Number(price) || 0,
        comparePrice: comparePrice === "" ? null : Number(comparePrice),
        type,
        condition,
        stock: Math.max(0, Number(stock) || 0),
        minStock: Math.max(0, Number(minStock) || 0),
        brandId,
        categoryId,
        modelId: modelId || null,
        storage: storage.trim() || null,
        color: color.trim() || null,
        batteryHealth: batteryHealth === "" ? null : Number(batteryHealth),
        grade: grade.trim() || null,
        isFeatured,
        isPublished,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
      };

      if (!payload.brandId || !payload.categoryId) {
        throw new Error("Selecciona marca y categoría.");
      }

      if (isEdit && productId) {
        await adminUpdateProduct(accessToken, productId, payload);
      } else {
        await adminCreateProduct(accessToken, payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader label="Cargando producto…" />
      </div>
    );
  }

  const input =
    "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl space-y-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Información básica
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Nombre</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={input}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto desde nombre"
              className={input}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">SKU</span>
            <input required value={sku} onChange={(e) => setSku(e.target.value)} className={input} />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Descripción</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={input}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Precio</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-zinc-700">Precio</span>
            <input
              required
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={input}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Precio comparación</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              className={input}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Inventario</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-zinc-700">Stock</span>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={input}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Stock mínimo</span>
            <input
              type="number"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              className={input}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Clasificación
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-zinc-700">Tipo</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProductType)}
              className={input}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {PRODUCT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Condición</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ProductCondition)}
              className={input}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {PRODUCT_CONDITION_LABELS[c]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Marca</span>
            <select
              required
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className={input}
            >
              <option value="">Seleccionar</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Categoría</span>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={input}
            >
              <option value="">Seleccionar</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Modelo (teléfono)</span>
            <select value={modelId} onChange={(e) => setModelId(e.target.value)} className={input}>
              <option value="">Ninguno</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Especificaciones
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-zinc-700">Almacenamiento</span>
            <input value={storage} onChange={(e) => setStorage(e.target.value)} className={input} />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Color</span>
            <input value={color} onChange={(e) => setColor(e.target.value)} className={input} />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Salud batería (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={batteryHealth}
              onChange={(e) => setBatteryHealth(e.target.value)}
              className={input}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">Grado</span>
            <input value={grade} onChange={(e) => setGrade(e.target.value)} className={input} />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Marketing</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded border-zinc-300 accent-primary-600"
            />
            Destacado
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded border-zinc-300 accent-primary-600"
            />
            Publicado
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">SEO</h2>
        <div className="grid gap-4">
          <label>
            <span className="text-sm font-medium text-zinc-700">SEO título</span>
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={input} />
          </label>
          <label>
            <span className="text-sm font-medium text-zinc-700">SEO descripción</span>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              className={input}
            />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-zinc-100 pt-8">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
