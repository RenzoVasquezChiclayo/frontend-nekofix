import Link from "next/link";
import { BrandWordmark } from "@/components/shared/BrandLogo";
import { SITE_NAME } from "@/lib/constants";
import { SITE_CONTACT, SITE_TAGLINE } from "@/lib/site-contact";

export function Footer() {
  const telHref = `tel:+${SITE_CONTACT.phoneDigits}`;
  const waHref = `https://wa.me/${SITE_CONTACT.phoneDigits}`;
  const mailHref = `mailto:${SITE_CONTACT.email}`;

  return (
    <footer className="border-t border-zinc-200/80 bg-accent-cool/10">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <BrandWordmark className="object-left" />
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{SITE_TAGLINE}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Enlaces</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <Link href="/nosotros" className="transition hover:text-ink">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="transition hover:text-ink">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/reparaciones" className="transition hover:text-ink">
                  Reparaciones
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="transition hover:text-ink">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="transition hover:text-ink">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="transition hover:text-ink">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/admin" className="transition hover:text-ink">
                  Panel admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Contacto</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li>
                <a href={telHref} className="transition hover:text-ink">
                  {SITE_CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={waHref}
                  className="text-primary-700 underline hover:text-primary-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={mailHref} className="break-all transition hover:text-ink">
                  {SITE_CONTACT.email}
                </a>
              </li>
            </ul>
            <ul className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-ink-caption">
              {SITE_CONTACT.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-ink-soft"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-ink-caption">
          © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
