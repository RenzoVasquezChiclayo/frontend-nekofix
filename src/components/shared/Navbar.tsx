"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NAV_LINKS } from "@/lib/constants";
import { notifyInfo } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { CartBadge } from "@/components/shared/CartBadge";
import { BrandLogoWithTitle } from "@/components/shared/BrandLogo";
import { useAuth } from "@/store/auth-context";

type Props = { className?: string };

function NavbarAuth({
  className,
  variant = "desktop",
}: {
  className?: string;
  variant?: "desktop" | "drawer";
}) {
  const { user, isReady, logout } = useAuth();

  if (!isReady) {
    return (
      <div className={cn("h-9 w-9 shrink-0 animate-pulse rounded-full bg-zinc-100", className)} />
    );
  }

  if (user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Link
          href="/cuenta"
          className={cn(
            "truncate text-sm font-medium text-ink-muted hover:text-ink",
            variant === "desktop" && "hidden max-w-[140px] sm:inline",
            variant === "drawer" && "block max-w-[200px]"
          )}
          title={user.email}
        >
          {user.name || user.email}
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            notifyInfo("Sesión cerrada correctamente");
          }}
          className="touch-manipulation rounded-full border border-primary-200/80 px-3 py-2 text-xs font-medium text-ink-soft transition hover:border-primary-300 hover:bg-primary-50/80"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Link
        href="/iniciar-sesion"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-200/80 bg-white text-ink-soft transition hover:border-primary-300 hover:bg-primary-50/80 hover:text-ink"
        aria-label="Iniciar sesión"
        title="Iniciar sesión"
        data-nav-auth="login-icon"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </Link>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Navbar({ className }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-primary-900/10 bg-white/90 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="min-w-0 flex items-center gap-2 font-display font-black tracking-tight text-ink"
        >
          <BrandLogoWithTitle />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex lg:gap-8" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-muted transition hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="text-sm font-medium text-ink-caption transition hover:text-ink-soft"
          >
            Admin
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* <div className="hidden md:block">
            <NavbarAuth variant="desktop" />
          </div> */}
          <CartBadge />
          <Link
            href="/catalogo"
            className="hidden rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 md:inline-flex"
          >
            Tienda
          </Link>

          <button
            type="button"
            className="touch-manipulation rounded-xl border border-primary-200/80 p-2 text-ink-body transition hover:bg-primary-50/80 lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              <button
                type="button"
                className="absolute inset-0 z-0 bg-zinc-900/50"
                aria-label="Cerrar menú"
                onClick={() => setMobileOpen(false)}
              />
              <div className="absolute right-0 top-0 z-10 flex h-full w-[min(100%,20rem)] flex-col border-l border-zinc-200 bg-white shadow-2xl transition-transform duration-300 ease-out">
                <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Menú</p>
              <button
                type="button"
                className="touch-manipulation rounded-lg p-2 text-ink-muted hover:bg-primary-50/80"
                aria-label="Cerrar"
                onClick={() => setMobileOpen(false)}
              >
                <MenuIcon open />
              </button>
                </div>
                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Móvil">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="touch-manipulation rounded-xl px-4 py-3.5 text-base font-medium text-ink-body transition hover:bg-primary-50"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="touch-manipulation rounded-xl px-4 py-3.5 text-base font-medium text-ink-caption transition hover:bg-primary-50/50"
              >
                Admin
              </Link>
              <Link
                href="/catalogo"
                onClick={() => setMobileOpen(false)}
                className="mx-2 mt-2 inline-flex touch-manipulation items-center justify-center rounded-full bg-primary-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                Ir a la tienda
              </Link>
                </nav>
                {/* <div className="border-t border-zinc-100 p-4">
                  <NavbarAuth variant="drawer" className="justify-between" />
                </div> */}
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  );
}
