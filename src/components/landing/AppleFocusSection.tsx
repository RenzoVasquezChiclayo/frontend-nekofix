import { SectionTitle } from "@/components/shared/SectionTitle";

const PILLARS = [
  {
    title: "Solo Apple",
    desc: "Reparación y venta centrada en el ecosistema Apple: diagnóstico claro y piezas acordes a cada equipo.",
  },
  {
    title: "Laboratorio técnico",
    desc: "Procesos controlados y herramientas profesionales para iPhone, iPad, Mac y accesorios.",
  },
  {
    title: "Stock y garantía",
    desc: "Equipos seminuevos certificados y accesorios; respaldo que puedes comprobar en tienda.",
  },
] as const;

/**
 * Franja de posicionamiento: negocio enfocado en marca Apple (no multimarca).
 */
export function AppleFocusSection() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Nekofix"
          title="Especialistas en Apple"
          subtitle="Trabajamos exclusivamente con productos Apple: iPhone, iPad, Mac y accesorios — reparación, compra y venta con el mismo estándar de calidad."
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
