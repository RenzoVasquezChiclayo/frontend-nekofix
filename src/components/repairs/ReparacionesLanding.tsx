import type { ReactNode } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { WHATSAPP_REPAIR_MESSAGE } from "@/lib/repairs";
import { cn, whatsappHref } from "@/lib/utils";

const waRepair = whatsappHref(WHATSAPP_REPAIR_MESSAGE);

const HERO_POINTS = [
  "Cambio de pantalla",
  "Batería",
  "Puerto de carga",
  "Cámaras",
  "Placa",
  "Face ID",
  "Diagnóstico avanzado",
] as const;

const STEPS = [
  {
    n: "1",
    title: "Diagnóstico",
    desc: "Evaluamos tu equipo y detectamos la falla con precisión antes de cualquier intervención.",
  },
  {
    n: "2",
    title: "Presupuesto",
    desc: "Te damos costo y tiempo estimado. Sin sorpresas: apruebas antes de que iniciemos la reparación.",
  },
  {
    n: "3",
    title: "Reparación",
    desc: "Trabajo en laboratorio con procesos controlados y repuestos acordes al estándar del servicio.",
  },
  {
    n: "4",
    title: "Entrega con garantía",
    desc: "Retiras tu dispositivo con respaldo por la intervención realizada, según lo acordado.",
  },
] as const;

const FREQUENT = [
  "Cambio de pantalla",
  "Cambio de batería",
  "Puerto de carga",
  "Cámara",
  "Face ID",
  "Micrófono",
  "Parlante",
  "Placa lógica",
] as const;

const WARRANTY = [
  {
    title: "Repuestos de calidad",
    body: "Componentes seleccionados para un resultado fiable y duradero.",
  },
  {
    title: "Garantía por reparación",
    body: "Respaldamos el trabajo realizado según el tipo de servicio acordado.",
  },
  {
    title: "Técnicos especializados",
    body: "Experiencia en Apple: diagnóstico y reparación con criterio técnico.",
  },
  {
    title: "Atención rápida",
    body: "Cotización por WhatsApp y seguimiento claro de tu caso.",
  },
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function WaButton({
  href,
  children,
  className,
  size = "md",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-white shadow-lg shadow-primary-900/20 transition hover:bg-[#20bd5a] hover:shadow-xl",
        size === "lg" ? "min-h-[52px] px-8 py-4 text-base sm:min-h-[56px] sm:text-lg" : "px-6 py-3 text-sm",
        className
      )}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
      {children}
    </a>
  );
}

export function ReparacionesLanding() {
  return (
    <div className="pb-28 md:pb-16">
      {/* A) Hero */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-25%,rgba(49,89,135,0.5),transparent)]" />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-accent-cool/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-100/95">
            Servicio técnico · {SITE_NAME}
          </p>
          <h1 className="font-display mt-4 max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Reparación especializada de iPhone y dispositivos Apple
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-100/90 sm:text-lg">
            En {SITE_NAME} resolvemos fallas comunes y complejas con diagnóstico profesional en{" "}
            <span className="font-semibold text-white">Trujillo</span>. Incluye:
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 sm:gap-2.5">
            {HERO_POINTS.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-primary-50 backdrop-blur-sm sm:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <WaButton href={waRepair} size="lg">
              Cotizar por WhatsApp
            </WaButton>
            <Link
              href="/contacto"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/25 px-8 text-sm font-semibold text-white transition hover:border-accent-warm/50 hover:bg-white/10 sm:min-h-[56px] sm:text-base"
            >
              Ver ubicación y horario
            </Link>
          </div>
        </div>
      </section>

      {/* B) Cómo trabajamos */}
      <section className="border-b border-primary-100/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Cómo trabajamos
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Proceso claro de principio a fin para que sepas qué esperar en cada etapa.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <li
                key={step.title}
                className="rounded-2xl border border-primary-100/90 bg-gradient-to-b from-primary-50/40 to-white p-6 shadow-sm ring-1 ring-primary-900/5"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-lg font-black text-white shadow-md shadow-primary-900/15"
                    aria-hidden
                  >
                    {step.n}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* C) Reparaciones frecuentes */}
      <section className="bg-primary-50/35 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Reparaciones frecuentes
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Cubrimos la mayoría de intervenciones en iPhone y equipo Apple. Si no ves tu falla,
              escríbenos igual.
            </p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FREQUENT.map((label) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-primary-100/80 bg-white px-5 py-4 shadow-sm transition hover:border-primary-200 hover:shadow-md"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-primary-800"
                  aria-hidden
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="font-display font-semibold text-ink">{label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <WaButton href={waRepair} size="md">
              Consultar mi caso por WhatsApp
            </WaButton>
          </div>
        </div>
      </section>

      {/* D) Garantía */}
      <section className="border-y border-primary-100/80 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-primary-200/60 bg-gradient-to-br from-primary-600 to-primary-950 px-6 py-10 text-white shadow-xl shadow-primary-950/20 sm:px-10 sm:py-12">
            <h2 className="text-center font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Confianza y respaldo
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-primary-100/90 sm:text-base">
              Tu equipo se trata con el mismo nivel de exigencia que esperas de un laboratorio Apple.
            </p>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {WARRANTY.map((w) => (
                <li
                  key={w.title}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <h3 className="font-display text-base font-bold text-white">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-100/85">{w.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* E) CTA final */}
      <section className="bg-zinc-50/80 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            ¿Tu equipo necesita reparación?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            Envíanos modelo y síntoma por WhatsApp y te orientamos con tiempo y opciones.
          </p>
          <div className="mt-8 flex justify-center">
            <WaButton href={waRepair} size="lg" className="w-full max-w-md sm:w-auto">
              Escríbenos por WhatsApp
            </WaButton>
          </div>
        </div>
      </section>
    </div>
  );
}
