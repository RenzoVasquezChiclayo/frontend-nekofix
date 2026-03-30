import type { Metadata } from "next";
import { ContactForm } from "@/app/(site)/contacto/ContactForm";
import { whatsappHref } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Cotización y soporte · ${SITE_NAME}`,
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Contacto
          </h1>
          <p className="mt-3 text-zinc-600">
            Cotizaciones de reparación, dudas sobre stock o pedidos web. Responderemos
            por el canal que prefieras.
          </p>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-[#25D366] px-8 py-3 text-sm font-semibold text-white hover:bg-[#20bd5a]"
          >
            WhatsApp directo
          </a>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
