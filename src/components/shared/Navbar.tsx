"use client";

import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CartBadge } from "@/components/shared/CartBadge";
import { useAuth } from "@/store/auth-context";

type Props = { className?: string };

function NavbarAuth({ className }: { className?: string }) {
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
          className="hidden max-w-[140px] truncate text-sm font-medium text-zinc-700 hover:text-zinc-900 sm:inline"
          title={user.email}
        >
          {user.name || user.email}
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50"
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
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
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

export function Navbar({ className }: Props) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm text-white">
            NF
          </span>
          <span>{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-800"
          >
            Admin
          </Link>
        </nav>
        <div className="flex min-w-0 items-center gap-3">
          <NavbarAuth />
          <CartBadge />
          <Link
            href="/catalogo"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Tienda
          </Link>
        </div>
      </div>
    </header>
  );
}
