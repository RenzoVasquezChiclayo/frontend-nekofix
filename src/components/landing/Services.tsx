import { SectionTitle } from "@/components/shared/SectionTitle";

const ITEMS = [
  {
    title: "Pantalla y batería",
    desc: "Display y batería en iPhone, iPad y MacBook, con piezas acordes a cada modelo.",
  },
  {
    title: "Placa y carga",
    desc: "Diagnóstico de encendido, Face ID/Touch ID, puertos, audio y carga en toda la gama Apple.",
  },
  {
    title: "Software",
    desc: "Respaldo, migración y recuperación en iOS, iPadOS y macOS sin perder tus datos.",
  },
  {
    title: "Compra y venta",
    desc: "Equipos Apple seminuevos certificados y accesorios originales o compatibles.",
  },
] as const;

export function Services() {
  return (
    <section className="border-b border-zinc-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Servicios"
          title="Reparación profesional Apple"
          subtitle="Técnicos especializados en iPhone, iPad y Mac. Cotiza por WhatsApp o en tienda."
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 transition hover:border-primary-200 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
