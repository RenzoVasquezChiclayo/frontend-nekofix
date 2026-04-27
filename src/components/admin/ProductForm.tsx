"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  PRODUCT_CONDITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/catalog-labels";
import { ADMIN_PRODUCT_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { coerceAdminProductForForm } from "@/lib/coerce-admin-product";
import { normalizeUsedGrade, USED_GRADE_ORDER } from "@/lib/used-grade";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError, notifyError, notifySuccess, notifyWarning } from "@/lib/toast";
import { ADMIN_SELECT_PAGE_SIZE, fetchAllAdminPages } from "@/lib/admin-paginate-list";
import {
  adminCreateProduct,
  adminGetProductById,
  adminUpdateProduct,
} from "@/services/admin/product.service";
import { adminListBrands } from "@/services/admin/brand.service";
import { adminListCategories } from "@/services/admin/category.service";
import { adminListPhoneModels } from "@/services/admin/phone-model.service";
import { ApiError } from "@/services/api";
import { useAdminAuth } from "@/store/admin-auth-context";
import {
  draftsFromProductImages,
  draftsToPayload,
  ProductImagesEditor,
  type ProductImageDraft,
} from "@/components/admin/ProductImagesEditor";
import { AdminProductColorPicker } from "@/components/admin/AdminProductColorPicker";
import { ProductFormSkeleton } from "@/components/admin/ProductFormSkeleton";
import type { ProductCreateInput } from "@/types/admin-product";
import type { Brand, Category, PhoneModel, ProductCondition, ProductType } from "@/types/product";

type EditLoadPhase = "loading" | "ready" | "not_found" | "load_error";

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

  const [editPhase, setEditPhase] = useState<EditLoadPhase>(() => (isEdit ? "loading" : "ready"));
  const [loadAttempt, setLoadAttempt] = useState(0);
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
  const [imageDrafts, setImageDrafts] = useState<ProductImageDraft[]>([]);

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
      setBrands(b.sort((a, z) => a.name.localeCompare(z.name, "es")));
      setCategories(c.sort((a, z) => a.name.localeCompare(z.name, "es")));
      setModels(m.sort((a, z) => a.name.localeCompare(z.name, "es")));
    } catch {
      /* empty */
    }
  }, [accessToken]);

  useEffect(() => {
    void loadRefs();
  }, [loadRefs]);

  useEffect(() => {
    if (!isEdit) {
      setEditPhase("ready");
      return;
    }
    if (!productId) {
      setEditPhase("not_found");
      return;
    }
    if (!accessToken) {
      setEditPhase("loading");
      return;
    }

    let cancelled = false;
    (async () => {
      setEditPhase("loading");
      setError(null);
      try {
        const raw = await adminGetProductById(accessToken, productId);
        if (cancelled) return;
        const p = coerceAdminProductForForm(raw);
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
        setGrade(normalizeUsedGrade(p.grade) ?? "");
        setIsFeatured(p.isFeatured);
        setIsPublished(p.isPublished);
        setSeoTitle(p.seoTitle ?? "");
        setSeoDescription(p.seoDescription ?? "");
        setImageDrafts(draftsFromProductImages(p.productImages));
        setEditPhase("ready");
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 404) {
          notifyError(ADMIN_PRODUCT_NOT_FOUND_MESSAGE);
          setEditPhase("not_found");
          return;
        }
        setError(getApiErrorMessage(e));
        notifyApiError(e);
        setEditPhase("load_error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, accessToken, productId, loadAttempt]);

  useEffect(() => {
    if (editPhase !== "not_found") return;
    const t = window.setTimeout(() => {
      router.replace("/admin/products");
    }, 2200);
    return () => window.clearTimeout(t);
  }, [editPhase, router]);

  /** `grade` solo aplica a `USED`; si el tipo deja de ser usado, limpiar. */
  useEffect(() => {
    if (type !== "USED") {
      setGrade("");
    }
  }, [type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    if (imageDrafts.some((d) => d.uploading)) {
      const msg = "Espera a que terminen las subidas de imágenes.";
      setError(msg);
      notifyWarning(msg);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const images = draftsToPayload(
        imageDrafts.filter((d) => d.url.trim() && !d.uploading && !d.error)
      );
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
        grade: type === "USED" ? (grade.trim() || null) : null,
        isFeatured,
        isPublished,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        images,
      };

      if (!payload.brandId || !payload.categoryId) {
        throw new Error("Selecciona marca y categoría.");
      }

      if (isEdit && productId) {
        await adminUpdateProduct(accessToken, productId, payload);
        notifySuccess("Producto guardado correctamente");
      } else {
        await adminCreateProduct(accessToken, payload);
        notifySuccess("Producto creado correctamente");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      if (isEdit && err instanceof ApiError && err.status === 404) {
        notifyError(ADMIN_PRODUCT_NOT_FOUND_MESSAGE);
        setEditPhase("not_found");
        return;
      }
      setError(getApiErrorMessage(err));
      notifyApiError(err);
    } finally {
      setSaving(false);
    }
  }

  if (isEdit && editPhase === "loading") {
    return <ProductFormSkeleton />;
  }

  if (isEdit && editPhase === "not_found") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-base font-medium text-zinc-900">{ADMIN_PRODUCT_NOT_FOUND_MESSAGE}</p>
        <p className="mt-2 text-sm text-zinc-500">
          Serás redirigido al listado de productos en unos segundos.
        </p>
        <button
          type="button"
          onClick={() => router.replace("/admin/products")}
          className="mt-6 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Ir al listado ahora
        </button>
      </div>
    );
  }

  if (isEdit && editPhase === "load_error") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50/80 p-8 shadow-sm">
        <p className="text-sm font-medium text-red-900">No se pudo cargar el producto</p>
        {error ? <p className="mt-2 text-sm text-red-800">{error}</p> : null}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setLoadAttempt((n) => n + 1)}
            className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Reintentar
          </button>
          <button
            type="button"
            onClick={() => router.replace("/admin/products")}
            className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Volver al listado
          </button>
        </div>
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
          {type === "USED" ? (
            <label className="sm:col-span-2">
              <span className="text-sm font-medium text-zinc-700">Grado del equipo</span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className={input}
              >
                <option value="">Seleccionar grado</option>
                {USED_GRADE_ORDER.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                {grade && !(USED_GRADE_ORDER as readonly string[]).includes(grade) ? (
                  <option value={grade}>{grade}</option>
                ) : null}
              </select>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                Estado cosmético del equipo usado. Solo aplica cuando el tipo es &quot;Usado&quot;.
              </p>
            </label>
          ) : null}
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
          <div className="sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Color</span>
            <p className="mt-1 text-xs text-zinc-500">
              Selecciona el acabado comercial; se guarda el nombre en el producto.
            </p>
            <div className="mt-3">
              <AdminProductColorPicker value={color} onChange={setColor} />
            </div>
          </div>
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

      {accessToken ? (
        <ProductImagesEditor
          accessToken={accessToken}
          defaultAltHint={name.trim() || "Producto"}
          drafts={imageDrafts}
          onChange={setImageDrafts}
        />
      ) : null}

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
          disabled={saving || imageDrafts.some((d) => d.uploading)}
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
