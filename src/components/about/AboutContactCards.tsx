import Link from "next/link";
import { SITE_CONTACT } from "@/lib/site-contact";

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 5.5C3 4.12 4.12 3 5.5 3h2.09c.57 0 1.08.36 1.28.9l1.2 3.6a1.5 1.5 0 01-.37 1.55l-1.1 1.1a11 11 0 006.36 6.36l1.1-1.1a1.5 1.5 0 011.55-.37l3.6 1.2c.54.2.9.71.9 1.28V18.5c0 1.38-1.12 2.5-2.5 2.5h-1C9.16 21 3 14.84 3 7.5v-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SocialIcon({ label }: { label: string }) {
  const common = "h-6 w-6";
  if (label === "Instagram") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (label === "Facebook") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (label === "TikTok") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    );
  }
  return null;
}

export function AboutContactCards() {
  const telHref = `tel:+${SITE_CONTACT.phoneDigits}`;
  const waHref = `https://wa.me/${SITE_CONTACT.phoneDigits}`;
  const mailHref = `mailto:${SITE_CONTACT.email}`;

  return (
    <section className="bg-zinc-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Contacto directo
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-zinc-600">
          Escríbenos o llámanos; también estamos en redes con contenido y
          novedades.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={telHref}
            className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
              <IconPhone className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900">Celular / teléfono</h3>
            <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-800">
              {SITE_CONTACT.phoneDisplay}
            </p>
            <span className="mt-3 text-sm font-medium text-emerald-700 group-hover:underline">
              Llamar ahora
            </span>
          </a>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-[#25D366]/50 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#128C7E]">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900">WhatsApp</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Mismo número para mensajes rápidos y cotizaciones.
            </p>
            <span className="mt-auto pt-4 text-sm font-medium text-[#128C7E] group-hover:underline">
              Abrir chat
            </span>
          </a>

          <a
            href={mailHref}
            className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:col-span-2 lg:col-span-1"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-900 group-hover:text-white">
              <IconMail className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900">Correo</h3>
            <p className="mt-2 break-all text-base font-medium text-zinc-800">
              {SITE_CONTACT.email}
            </p>
            <span className="mt-3 text-sm font-medium text-emerald-700 group-hover:underline">
              Enviar correo
            </span>
          </a>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Redes sociales
          </h3>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {SITE_CONTACT.social.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-[140px] items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-sm font-medium text-zinc-800 transition hover:border-emerald-300 hover:bg-white hover:shadow-sm"
                >
                  <span className="text-zinc-700">
                    <SocialIcon label={s.label} />
                  </span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
