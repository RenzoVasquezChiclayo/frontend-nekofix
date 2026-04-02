import { env } from "@/config/env";
import type { CartLine } from "@/types/order";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number, currency = "PEN"): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Mensaje de texto para WhatsApp si el backend no devuelve `whatsappUrl`. */
export function buildWhatsAppCartMessage(lines: CartLine[], total: number): string {
  const rows = lines.map((l) => {
    const bits = [l.name];
    if (l.color) bits.push(l.color);
    if (l.storage) bits.push(l.storage);
    bits.push(`×${l.quantity}`);
    bits.push(formatPrice(l.unitPrice * l.quantity));
    return `• ${bits.join(" · ")}`;
  });
  return `Hola, quiero confirmar este pedido:\n${rows.join("\n")}\n\nTotal: ${formatPrice(total)}`;
}

/** Construye URL de WhatsApp con mensaje por defecto */
export function whatsappHref(message?: string): string {
  const text = encodeURIComponent(message ?? env.whatsappDefaultMessage);
  return `https://wa.me/${env.whatsappNumber.replace(/\D/g, "")}?text=${text}`;
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
