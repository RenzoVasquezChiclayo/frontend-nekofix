"use client";

import { useEffect, useState } from "react";
import { ADMIN_PHONE_SERIES_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";
import { ApiError } from "@/services/api";
import {
  adminCreateSeries,
  adminUpdateSeries,
  type SeriesInput,
} from "@/services/admin/series.service";
import type { Brand } from "@/types/product";
import type { PhoneSeries } from "@/types/catalog-admin";

type Props = {
  open: boolean;
  accessToken: string;
  series: PhoneSeries | null;
  brands: Brand[];
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

export function SeriesModal({ open, accessToken, series, brands, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brandId, setBrandId] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (series) {
      setName(series.name);
      setSlug(series.slug);
      setBrandId(series.brandId);
      setDescription(series.description ?? "");
      setIsActive(series.isActive);
    } else {
      setName("");
      setSlug("");
      setBrandId(brands[0]?.id ?? "");
      setDescription("");
      setIsActive(true);
    }
  }, [open, series, brands]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: SeriesInput = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        brandId,
        description: description.trim() || null,
        isActive,
      };
      if (!body.name || !body.brandId) throw new Error("Completa nombre y marca.");
      if (series) {
        await adminUpdateSeries(accessToken, series.id, body);
        notifySuccess("Serie actualizada correctamente");
      } else {
        await adminCreateSeries(accessToken, body);
        notifySuccess("Serie creada correctamente");
      }
      onSaved();
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError(ADMIN_PHONE_SERIES_NOT_FOUND_MESSAGE);
        notifyError(ADMIN_PHONE_SERIES_NOT_FOUND_MESSAGE);
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
          {series ? "Editar serie" : "Nueva serie"}
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
              placeholder="auto desde nombre"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Marca</span>
            <select
              required
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="">Seleccionar</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Descripción</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-zinc-300 accent-primary-600"
            />
            Activo
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
