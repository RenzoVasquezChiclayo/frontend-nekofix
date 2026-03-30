"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart-context";
import { formatPrice } from "@/lib/utils";
import { validateCoupon } from "@/services/coupon.service";
import { submitCheckout } from "@/app/(site)/checkout/actions";
export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const total = Math.max(0, subtotal - discount);

  async function applyCoupon() {
    setCouponMsg(null);
    if (!coupon.trim()) {
      setDiscount(0);
      return;
    }
    try {
      const res = await validateCoupon(coupon.trim(), subtotal);
      if (!res.valid || res.discountValue == null) {
        setDiscount(0);
        setCouponMsg(res.message ?? "Cupón no válido");
        return;
      }
      if (res.discountType === "percent") {
        setDiscount(Math.round((subtotal * res.discountValue) / 100));
      } else {
        setDiscount(res.discountValue);
      }
      setCouponMsg("Cupón aplicado");
    } catch {
      setDiscount(0);
      setCouponMsg(
        "No se pudo validar el cupón (¿API conectada?). Continúa sin descuento."
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("El carrito está vacío.");
      return;
    }
    const payloadLines = lines.map((l) => ({ ...l }));
    startTransition(async () => {
      const result = await submitCheckout(
        { ok: false },
        {
          lines: payloadLines,
          customerName: name,
          email,
          phone,
          address: address || undefined,
          notes: notes || undefined,
          couponCode: coupon.trim() || undefined,
        }
      );
      if (result.ok) {
        clear();
        router.push(`/checkout/exito?id=${result.orderId ?? ""}`);
      } else {
        setError(
          result.error ??
            "El servidor de pedidos no está disponible. Configura el backend NestJS."
        );
      }
    });
  }

  if (lines.length === 0) {
    return (
      <p className="text-zinc-600">
        No hay artículos en el carrito.{" "}
        <a href="/catalogo" className="text-emerald-700 underline">
          Ir al catálogo
        </a>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Datos de contacto</h2>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Nombre</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Teléfono</span>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">
            Dirección (opcional)
          </span>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Notas</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Resumen</h2>
        <ul className="mt-4 space-y-2 text-sm text-zinc-600">
          {lines.map((l) => (
            <li key={`${l.productId}-${l.color}-${l.storageGb}`} className="flex justify-between gap-4">
              <span>
                {l.name} × {l.quantity}
              </span>
              <span>{formatPrice(l.unitPrice * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-200 pt-6">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Código de cupón"
            className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void applyCoupon()}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Aplicar
          </button>
        </div>
        {couponMsg ? (
          <p className="mt-2 text-sm text-zinc-500">{couponMsg}</p>
        ) : null}
        <div className="mt-6 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between text-emerald-700">
              <span>Descuento</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-lg font-bold text-zinc-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-8 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Confirmar pedido"}
        </button>
        <p className="mt-4 text-xs text-zinc-500">
          La pasarela de pago se integrará contra tu backend NestJS cuando esté
          lista.
        </p>
      </div>
    </form>
  );
}
