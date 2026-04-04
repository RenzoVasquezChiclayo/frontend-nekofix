import { SITE_CONTACT } from "@/lib/site-contact";

export function AboutSchedule() {
  const { hours } = SITE_CONTACT;
  return (
    <section className="border-y border-zinc-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-primary-950 text-white shadow-xl shadow-primary-950/20">
          <div className="grid md:grid-cols-2">
            <div className="relative p-8 sm:p-10 md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(125,207,181,0.18),transparent_55%)]" />
              <div className="relative flex items-start gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-cool/90 text-2xl text-primary-950"
                  aria-hidden
                >
                  🕒
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-accent-cool/95">
                    {hours.title}
                  </h2>
                  <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    {hours.schedule}
                  </p>
                  <p className="mt-2 text-lg text-zinc-300">{hours.timeRange}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center border-t border-white/10 bg-zinc-800/50 p-8 sm:p-10 md:border-l md:border-t-0 md:p-12">
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden>
                  🔬
                </span>
                <p className="text-base font-medium leading-snug text-zinc-200">
                  {hours.appointment}
                </p>
              </div>
              <p className="mt-4 text-sm text-zinc-400">
                Agenda tu visita para diagnósticos complejos o entregas
                verificadas con el tiempo que tu equipo merece.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
