import Link from "next/link";
import { SectionTitle } from "@/components/shared/SectionTitle";

export function Promotions() {
  return (
    <section className="bg-gradient-to-br from-emerald-600 to-teal-700 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Promociones"
          title="Ofertas del mes"
          subtitle="Cupones aplicables en checkout cuando el backend esté conectado."
          className="[&_h2]:text-white [&_p]:text-emerald-50"
        />
        <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-2xl bg-white/10 p-8 backdrop-blur sm:flex-row">
          <div>
            <p className="text-sm uppercase tracking-wider text-emerald-100">
              Seminuevos certificados
            </p>
            <p className="mt-2 text-2xl font-bold">Hasta 12 MSI en seleccionados</p>
            <p className="mt-1 text-sm text-emerald-100">
              Sujeto a existencias. Consulta términos en tienda.
            </p>
          </div>
          <Link
            href="/catalogo?kind=seminuevo"
            className="shrink-0 rounded-full bg-white px-8 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            Ver seminuevos
          </Link>
        </div>
      </div>
    </section>
  );
}
