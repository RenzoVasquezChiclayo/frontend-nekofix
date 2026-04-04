"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/lib/api-errors";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import { adminMoveInventory } from "@/services/admin/inventory.service";
import { INVENTORY_MOVE_LABELS, type InventoryMoveType } from "@/types/inventory";
import type { Product } from "@/types/product";

const TYPES: InventoryMoveType[] = ["IN", "OUT", "ADJUSTMENT", "SALE", "RETURN"];

type Props = {
  accessToken: string;
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
};

export function InventoryModal({ accessToken, product, onClose, onSuccess }: Props) {
  const [moveType, setMoveType] = useState<InventoryMoveType>("IN");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await adminMoveInventory(accessToken, {
        productId: product.id,
        type: moveType,
        quantity,
        notes: notes.trim() || undefined,
      });
      const prev = res.previousStock ?? "—";
      const next = res.newStock ?? res.stock ?? "—";
      setResult(`Stock anterior: ${prev} → nuevo: ${next}`);
      notifySuccess("Inventario actualizado correctamente");
      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err));
      notifyApiError(err, "No se pudo actualizar el inventario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[min(90dvh,800px)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-zinc-200 bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
        <h2 className="text-lg font-semibold text-primary-950">Mover inventario</h2>
        <p className="mt-1 text-sm text-zinc-600">
          <span className="font-medium text-zinc-800">{product.name}</span>
          <span className="ml-2 font-mono text-xs text-zinc-500">SKU {product.sku}</span>
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Stock actual:{" "}
          <span className="font-semibold text-primary-800">{product.stock}</span> · Mínimo:{" "}
          {product.minStock}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Tipo de movimiento</span>
            <select
              value={moveType}
              onChange={(e) => setMoveType(e.target.value as InventoryMoveType)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {INVENTORY_MOVE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Cantidad</span>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Notas (opcional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
              placeholder="Motivo del ajuste, referencia interna…"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {result ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{result}</p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="touch-manipulation rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 sm:py-2"
            >
              Cerrar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="touch-manipulation rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 sm:py-2"
            >
              {loading ? "Aplicando…" : "Registrar movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
