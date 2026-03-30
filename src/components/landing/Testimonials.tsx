import { SectionTitle } from "@/components/shared/SectionTitle";

const REVIEWS = [
  {
    name: "María G.",
    text: "Cambiaron la pantalla de mi iPhone en el día. Muy profesionales.",
    role: "Cliente",
  },
  {
    name: "Luis R.",
    text: "Compré un seminuevo con garantía. El equipo llegó impecable.",
    role: "Cliente",
  },
  {
    name: "Ana P.",
    text: "Accesorios originales y buen precio. Recomiendo el servicio.",
    role: "Cliente",
  },
] as const;

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Testimonios"
          title="Lo que dicen nuestros clientes"
        />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <li
              key={r.name}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6"
            >
              <p className="text-zinc-700">&ldquo;{r.text}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-zinc-900">{r.name}</p>
              <p className="text-xs text-zinc-500">{r.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
