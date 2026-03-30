import { SectionTitle } from "@/components/shared/SectionTitle";

const ITEMS = [
  {
    title: "Pantalla y batería",
    desc: "Cambio de display original o compatible, baterías certificadas.",
  },
  {
    title: "Placa y carga",
    desc: "Diagnóstico de fallos de encendido, Face ID, conector y audio.",
  },
  {
    title: "Software",
    desc: "Respaldo, migración y recuperación sin perder tus datos.",
  },
  {
    title: "Compra y venta",
    desc: "Seminuevos certificados y accesorios para el día a día.",
  },
] as const;

export function Services() {
  return (
    <section className="border-b border-zinc-200 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Servicios"
          title="Reparación profesional de móviles"
          subtitle="Técnicos especializados en Apple y Android. Cotiza por WhatsApp o en tienda."
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 transition hover:border-emerald-200 hover:shadow-md"
            >
              <h3 className="font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
