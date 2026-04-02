import Link from "next/link";
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
            <p className="font-semibold text-zinc-900">{SITE_NAME}</p>
            <p className="mt-2 text-sm text-zinc-600">{SITE_TAGLINE}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">Enlaces</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <Link href="/nosotros" className="hover:text-zinc-900">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-zinc-900">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="hover:text-zinc-900">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-zinc-900">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-zinc-900">
                  Panel admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">Contacto</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li>
                <a href={telHref} className="hover:text-zinc-900">
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
                <a href={mailHref} className="break-all hover:text-zinc-900">
                  {SITE_CONTACT.email}
                </a>
              </li>
            </ul>
            <ul className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-zinc-500">
              {SITE_CONTACT.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-800"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
