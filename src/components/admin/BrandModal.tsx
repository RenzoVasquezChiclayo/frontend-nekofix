"use client";

import { useEffect, useState } from "react";
import { ADMIN_BRAND_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";
import { ApiError } from "@/services/api";
import { adminCreateBrand, adminUpdateBrand } from "@/services/admin/brand.service";
import type { Brand } from "@/types/product";
import type { BrandInput } from "@/services/admin/brand.service";

type Props = {
  open: boolean;
  accessToken: string;
  brand: Brand | null;
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

export function BrandModal({ open, accessToken, brand, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (brand) {
      setName(brand.name);
      setSlug(brand.slug);
      setLogo(brand.logo ?? "");
    } else {
      setName("");
      setSlug("");
      setLogo("");
    }
  }, [open, brand]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: BrandInput = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        logo: logo.trim() || null,
      };
      if (brand) {
        await adminUpdateBrand(accessToken, brand.id, body);
        notifySuccess("Marca actualizada correctamente");
      } else {
        await adminCreateBrand(accessToken, body);
        notifySuccess("Marca creada correctamente");
      }
      onSaved();
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError(ADMIN_BRAND_NOT_FOUND_MESSAGE);
        notifyError(ADMIN_BRAND_NOT_FOUND_MESSAGE);
      } else {
        setError(getApiErrorMessage(err));
        notifyApiError(err);
      }
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
          {brand ? "Editar marca" : "Nueva marca"}
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
            <span className="text-sm font-medium text-zinc-700">Logo (URL)</span>
            <input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://…"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
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
              disabled={loading}
              className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
