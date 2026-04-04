"use client";

import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import { adminCreateCategory, adminUpdateCategory } from "@/services/admin/category.service";
import type { Category } from "@/types/product";
import type { CategoryInput } from "@/services/admin/category.service";

type Props = {
  open: boolean;
  accessToken: string;
  category: Category | null;
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

export function CategoryModal({ open, accessToken, category, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setIcon(category.icon ?? "");
    } else {
      setName("");
      setSlug("");
      setIcon("");
    }
  }, [open, category]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: CategoryInput = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        icon: icon.trim() || null,
      };
      if (category) {
        await adminUpdateCategory(accessToken, category.id, body);
        notifySuccess("Categoría actualizada correctamente");
      } else {
        await adminCreateCategory(accessToken, body);
        notifySuccess("Categoría creada correctamente");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
      notifyApiError(err);
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
          {category ? "Editar categoría" : "Nueva categoría"}
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
            <span className="text-sm font-medium text-zinc-700">Icono (URL o emoji)</span>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="📱 o https://…"
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
