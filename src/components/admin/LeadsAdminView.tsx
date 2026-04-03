"use client";

import { AdminHeader } from "@/components/admin/Header";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export function LeadsAdminView() {
  return (
    <>
      <AdminHeader
        title="Leads WhatsApp"
        description="Consultas entrantes y seguimiento comercial."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <AdminPlaceholder
            embedded
            title="Leads WhatsApp"
            description="Integra formularios y webhooks para listar leads y estados."
          />
        </div>
      </div>
    </>
  );
}
