import type { Metadata } from "next";
import { CheckoutForm } from "@/app/(site)/checkout/CheckoutForm";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Checkout",
  description: `Finaliza tu compra · ${SITE_NAME}`,
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Checkout</h1>
      <p className="mt-2 text-zinc-600">
        Revisa tu pedido y datos. El pedido se enviará al API NestJS.
      </p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
