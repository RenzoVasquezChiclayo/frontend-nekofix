import Link from "next/link";
import { SectionTitle } from "@/components/shared/SectionTitle";

export function Promotions() {
  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-900 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Promociones"
          title="Ofertas del mes"
          subtitle="Stock real y condiciones publicadas en la tienda."
          className="[&_h2]:text-white [&_p]:text-white/85"
        />
        <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur sm:flex-row">
          <div>
            <p className="text-sm uppercase tracking-wider text-accent-cool/90">
              Apple seminuevo certificado
            </p>
            <p className="mt-2 text-2xl font-bold">Hasta 12 MSI en seleccionados</p>
            <p className="mt-1 text-sm text-white/80">
              Sujeto a existencias. Consulta términos en tienda.
            </p>
          </div>
          <Link
            href="/catalogo?condition=SEMINUEVO"
            className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-900 transition hover:bg-accent-cool/20"
          >
            Ver seminuevos
          </Link>
        </div>
      </div>
    </section>
  );
}
