import { env } from "@/config/env";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number, currency = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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
