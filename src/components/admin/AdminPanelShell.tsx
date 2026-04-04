"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { cn } from "@/lib/utils";

type Props = { children: React.ReactNode };

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

export function AdminPanelShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RequireAdmin>
      <div className="flex min-h-screen bg-zinc-50/50">
        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-zinc-900/45 backdrop-blur-[1px] lg:hidden"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <AdminSidebar
          className={cn(
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:static lg:z-auto",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
          onNavigate={() => setMobileOpen(false)}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 lg:hidden">
            <button
              type="button"
              className="touch-manipulation rounded-xl border border-zinc-200 p-2 text-zinc-800 hover:bg-zinc-50"
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon open={false} />
            </button>
            <span className="min-w-0 truncate text-sm font-semibold text-primary-950">Panel admin</span>
          </header>

          <main className="flex-1 overflow-x-auto overflow-y-auto">{children}</main>
        </div>
      </div>
    </RequireAdmin>
  );
}
