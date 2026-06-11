"use client";

import { useEffect, useState } from "react";
import { CATALOG_TYPE_LABELS } from "@/lib/catalog-labels";
import { PRODUCT_CATALOG_TYPES } from "@/lib/product-catalog-type";
import { ADMIN_PRODUCT_CONDITION_NOT_FOUND_MESSAGE } from "@/lib/admin-resource-messages";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";
import { ApiError } from "@/services/api";
import {
  adminCreateProductCondition,
  adminUpdateProductCondition,
  type ProductConditionInput,
} from "@/services/admin/product-conditions.service";
import type { ProductConditionCatalog } from "@/types/catalog-admin";
import type { ProductCatalogType } from "@/types/product";

type Props = {
  open: boolean;
  accessToken: string;
  condition: ProductConditionCatalog | null;
  onClose: () => void;
  onSaved: () => void;
};

export function ProductConditionModal({ open, accessToken, condition, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [catalogType, setCatalogType] = useState<ProductCatalogType>("DEVICE");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (condition) {
      setName(condition.name);
      setDescription(condition.description ?? "");
      setCatalogType(condition.catalogType);
      setIsActive(condition.isActive);
    } else {
      setName("");
      setDescription("");
      setCatalogType("DEVICE");
      setIsActive(true);
    }
  }, [open, condition]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body: ProductConditionInput = {
        name: name.trim(),
        description: description.trim() || null,
        catalogType,
        isActive,
      };
      if (!body.name) throw new Error("Indica un nombre.");
      if (condition) {
        await adminUpdateProductCondition(accessToken, condition.id, body);
        notifySuccess("Condición actualizada correctamente");
      } else {
        await adminCreateProductCondition(accessToken, body);
        notifySuccess("Condición creada correctamente");
      }
      onSaved();
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError(ADMIN_PRODUCT_CONDITION_NOT_FOUND_MESSAGE);
        notifyError(ADMIN_PRODUCT_CONDITION_NOT_FOUND_MESSAGE);
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
          {condition ? "Editar condición" : "Nueva condición"}
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
            <span className="text-sm font-medium text-zinc-700">Descripción</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Catálogo</span>
            <select
              value={catalogType}
              onChange={(e) => setCatalogType(e.target.value as ProductCatalogType)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            >
              {PRODUCT_CATALOG_TYPES.map((ct) => (
                <option key={ct} value={ct}>
                  {CATALOG_TYPE_LABELS[ct]}
                </option>
              ))}
            </select>
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
