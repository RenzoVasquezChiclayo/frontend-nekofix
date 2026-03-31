import type { Metadata } from "next";
import Link from "next/link";
import { AboutHero } from "@/components/about/AboutHero";
import { MissionVision } from "@/components/about/MissionVision";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutSchedule } from "@/components/about/AboutSchedule";
import { AboutContactCards } from "@/components/about/AboutContactCards";
import { SITE_NAME } from "@/lib/constants";
import { SITE_TAGLINE } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `${SITE_TAGLINE}. Misión, visión y contacto de ${SITE_NAME} en el Perú.`,
  openGraph: {
    title: `Nosotros · ${SITE_NAME}`,
    description: SITE_TAGLINE,
  },
};

export default function NosotrosPage() {
  return (
    <div className="pb-8">
      <AboutHero />
      <MissionVision />
      <AboutStory />
      <AboutSchedule />
      <AboutContactCards />
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary-700/30 bg-gradient-to-r from-primary-600 to-primary-900 px-8 py-10 text-center text-white shadow-lg sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-medium text-white/85">¿Listo para el siguiente paso?</p>
            <p className="mt-1 text-lg font-semibold">
              Cotiza una reparación o revisa equipos certificados en tienda.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-3">
            <Link
              href="/contacto"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-900 shadow-sm transition hover:bg-accent-cool/15"
            >
              Contacto
            </Link>
            <Link
              href="/catalogo"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
