"use client";

import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { ADMIN_SELECT_PAGE_SIZE, fetchAllAdminPages } from "@/lib/admin-paginate-list";
import { adminListBrands } from "@/services/admin/brand.service";
import {
  adminCreatePhoneModel,
  adminUpdatePhoneModel,
  type AdminPhoneModel,
  type PhoneModelInput,
} from "@/services/admin/phone-model.service";
import type { Brand } from "@/types/product";

type Props = {
  open: boolean;
  accessToken: string;
  phoneModel: AdminPhoneModel | null;
  onClose: () => void;
  onSaved: () => void;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PhoneModelModal({ open, accessToken, phoneModel, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (phoneModel) {
      setName(phoneModel.name);
      setSlug(phoneModel.slug);
      setBrandId(phoneModel.brandId ?? phoneModel.brand?.id ?? "");
    } else {
      setName("");
      setSlug("");
      setBrandId("");
    }
  }, [open, phoneModel]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function loadBrands() {
      setLoadingBrands(true);
      try {
        const rows = await fetchAllAdminPages((p) =>
          adminListBrands(accessToken, {
            page: p,
            limit: ADMIN_SELECT_PAGE_SIZE,
            sort: "newest",
          })
        );
        if (!cancelled) {
          setBrands(rows.sort((a, b) => a.name.localeCompare(b.name, "es")));
        }
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoadingBrands(false);
      }
    }
    void loadBrands();
    return () => {
      cancelled = true;
    };
  }, [open, accessToken]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: PhoneModelInput = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        brandId,
      };
      if (phoneModel) {
        await adminUpdatePhoneModel(accessToken, phoneModel.id, body);
      } else {
        await adminCreatePhoneModel(accessToken, body);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-primary-950">
          {phoneModel ? "Editar modelo" : "Nuevo modelo"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Nombre</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Marca</span>
            <select
              required
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              disabled={loadingBrands}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="">{loadingBrands ? "Cargando marcas..." : "Selecciona marca"}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || loadingBrands}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
