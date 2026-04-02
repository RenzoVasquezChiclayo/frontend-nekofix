"use client";

import { AdminSidebar } from "@/components/admin/Sidebar";
import { RequireAdmin } from "@/components/admin/RequireAdmin";

type Props = { children: React.ReactNode };

export function AdminPanelShell({ children }: Props) {
  return (
    <RequireAdmin>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-x-auto overflow-y-auto">{children}</main>
        </div>
      </div>
    </RequireAdmin>
  );
}
