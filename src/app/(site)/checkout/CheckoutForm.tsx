"use client";

import { useState, useTransition } from "react";
import { notifyError, notifyInfo } from "@/lib/toast";
import { submitWhatsAppCheckout } from "@/app/(site)/checkout/actions";
import { useCart } from "@/store/cart-context";
import { buildWhatsAppCartMessage, formatPrice, whatsappHref } from "@/lib/utils";

export function CheckoutForm() {
  const { lines, subtotal, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      const msg = "El carrito está vacío.";
      setError(msg);
      notifyError(msg);
      return;
    }
    const items = lines.map((l) => ({
      productId: l.productId,
      name: l.name,
      slug: l.slug,
      price: l.unitPrice,
      quantity: l.quantity,
      storage: l.storage,
      color: l.color,
      condition: l.condition,
    }));

    startTransition(async () => {
      const result = await submitWhatsAppCheckout({
        items,
        total: subtotal,
        phone: phone.trim() || undefined,
      });
      if (result.ok) {
        notifyInfo("Abriendo WhatsApp para confirmar tu pedido…");
        const fallbackUrl = whatsappHref(buildWhatsAppCartMessage(lines, subtotal));
        const url = resolveSafeWhatsAppUrl(result.whatsappUrl, fallbackUrl);
        clear();
        window.location.href = url;
        return;
      }
      const errMsg =
        result.error ??
        "No se pudo registrar el pedido. Intenta de nuevo o escríbenos por WhatsApp.";
      setError(errMsg);
      notifyError(errMsg);
    });
  }

  if (lines.length === 0) {
    return (
      <p className="text-sm text-zinc-600">
        No hay artículos en el carrito.{" "}
        <a href="/catalogo" className="font-medium text-primary-700 underline">
          Ir a la tienda
        </a>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary-950">Checkout por WhatsApp</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Enviamos tu carrito al sistema y te redirigimos a WhatsApp para
            confirmar pago y entrega.
          </p>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">
            Teléfono (opcional)
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+51 999 999 999"
            className="mt-2 w-full rounded-2xl border border-primary-200 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </label>
      </div>
      <div className="rounded-3xl border border-primary-100 bg-primary-50/40 p-6">
        <h2 className="text-lg font-semibold text-primary-950">Resumen</h2>
        <ul className="mt-4 space-y-3 text-sm text-zinc-600">
          {lines.map((l) => (
            <li
              key={`${l.productId}-${l.condition}-${l.storage}-${l.color}`}
              className="flex justify-between gap-4 border-b border-zinc-100 pb-3 last:border-0"
            >
              <span className="min-w-0">
                <span className="font-medium text-zinc-800">{l.name}</span>
                <span className="block text-xs text-zinc-400">
                  ×{l.quantity}
                  {l.storage ? ` · ${l.storage}` : ""}
                  {l.color ? ` · ${l.color}` : ""}
                </span>
              </span>
              <span className="shrink-0 font-medium text-zinc-800">
                {formatPrice(l.unitPrice * l.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-primary-200 pt-6 text-lg font-semibold text-primary-950">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-8 w-full rounded-full bg-primary-600 py-4 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Confirmar y abrir WhatsApp"}
        </button>
      </div>
    </form>
  );
}

function resolveSafeWhatsAppUrl(
  rawUrl: string | undefined,
  fallbackUrl: string
): string {
  if (!rawUrl) return fallbackUrl;
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    const isWhatsAppHost = host === "wa.me" || host.endsWith(".whatsapp.com");
    return isWhatsAppHost ? parsed.toString() : fallbackUrl;
  } catch {
    return fallbackUrl;
  }
}
