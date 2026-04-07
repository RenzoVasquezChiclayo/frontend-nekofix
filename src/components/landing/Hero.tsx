import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(49,89,135,0.45),transparent)]" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-accent-cool/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-100/95">
            Reparación & venta
          </p>
          <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Tu ecosistema Apple en las mejores manos
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-primary-100/90">
            Especialistas en Apple: iPhone, iPad, Mac y accesorios. Reparación, equipos
            nuevos y seminuevos, y servicio técnico con garantía. {SITE_NAME} combina
            experiencia y stock actualizado.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-500"
            >
              Ver tienda
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full border border-zinc-600 px-8 py-3 text-sm font-semibold text-white transition hover:border-accent-warm/50 hover:bg-accent-warm/10"
            >
              Cotizar reparación
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
