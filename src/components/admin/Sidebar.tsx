"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_NAV_ENTRIES } from "@/lib/admin-nav";
import { isSuperAdmin } from "@/lib/roles";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { notifyInfo } from "@/lib/toast";
import { useAdminAuth } from "@/store/admin-auth-context";

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

function isPathActive(pathname: string, href: string): boolean {
  if (href === "/admin/dashboard") {
    return pathname === href || pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuth();
  const catalogActive = ADMIN_NAV_ENTRIES.some(
    (entry) =>
      entry.type === "group" &&
      entry.children.some((child) => isPathActive(pathname, child.href))
  );
  const [catalogOpen, setCatalogOpen] = useState(catalogActive);

  useEffect(() => {
    if (catalogActive) setCatalogOpen(true);
  }, [catalogActive]);

  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col border-r border-zinc-200 bg-white",
        className
      )}
    >
      <div className="border-b border-zinc-100 px-4 py-5">
        <Link
          href="/admin/dashboard"
          onClick={() => onNavigate?.()}
          className="font-semibold tracking-tight text-primary-900"
        >
          Admin · {SITE_NAME}
        </Link>
        <p className="mt-1 text-xs text-zinc-500">Panel de gestión</p>
        {user?.email ? (
          <p className="mt-2 truncate text-xs text-zinc-600" title={user.email}>
            {user.email}
          </p>
        ) : null}
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Secciones del panel">
        {ADMIN_NAV_ENTRIES.map((entry) => {
          if (entry.type === "link") {
            if (entry.superAdminOnly && !isSuperAdmin(user?.role)) return null;
            const { href, label, Icon } = entry;
            const active = isPathActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => onNavigate?.()}
                className={cn(
                  "touch-manipulation flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition sm:py-2.5",
                  active
                    ? "bg-primary-50 text-primary-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-80" />
                {label}
              </Link>
            );
          }

          const { label, Icon, children } = entry;
          const groupActive = children.some((child) => isPathActive(pathname, child.href));
          return (
            <div key={label} className="space-y-0.5">
              <button
                type="button"
                onClick={() => setCatalogOpen((o) => !o)}
                className={cn(
                  "touch-manipulation flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition sm:py-2.5",
                  groupActive
                    ? "bg-primary-50 text-primary-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
                aria-expanded={catalogOpen}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-80" />
                <span className="flex-1 text-left">{label}</span>
                <span className="text-xs text-zinc-400">{catalogOpen ? "▾" : "▸"}</span>
              </button>
              {catalogOpen ? (
                <div className="ml-4 space-y-0.5 border-l border-zinc-100 pl-2">
                  {children.map((child) => {
                    const active = isPathActive(pathname, child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => onNavigate?.()}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition",
                          active
                            ? "bg-primary-50 font-medium text-primary-900"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-zinc-100 p-3">
        <Link
          href="/"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-800"
        >
          ← Ver sitio público
        </Link>
        <button
          type="button"
          onClick={() => {
            logout();
            notifyInfo("Sesión cerrada correctamente");
            router.replace("/admin/login");
          }}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export const Sidebar = AdminSidebar;
