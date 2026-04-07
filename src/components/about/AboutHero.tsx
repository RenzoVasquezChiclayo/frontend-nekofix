import { SITE_NAME } from "@/lib/constants";
import { SITE_TAGLINE } from "@/lib/site-contact";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(49,89,135,0.35),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-t from-zinc-950 to-transparent" />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-100/95">
          {SITE_NAME}
        </p>
        <h1 className="font-display mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          {SITE_TAGLINE}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-primary-100/88">
          Ingeniería, certificación y transparencia. Así trabajamos cada
          dispositivo que pasa por nuestro laboratorio.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary-100/90 backdrop-blur">
            Perú
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-primary-100/90 backdrop-blur">
            Apple · Reparación avanzada
          </span>
          <span className="rounded-full border border-accent-warm/35 bg-accent-warm/10 px-4 py-2 text-sm text-accent-warm">
            Equipos certificados
          </span>
        </div>
      </div>
    </section>
  );
}
