import { FEATURED_BRANDS } from "@/lib/constants";
import { SectionTitle } from "@/components/shared/SectionTitle";

export function Brands() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Marcas"
          title="Trabajamos con las principales marcas"
          subtitle="Apple, Samsung, Google y más. Piezas y equipos según disponibilidad."
        />
        <ul className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {FEATURED_BRANDS.map((b) => (
            <li
              key={b}
              className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
