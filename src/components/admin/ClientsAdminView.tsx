"use client";

import { AdminHeader } from "@/components/admin/Header";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export function ClientsAdminView() {
  return (
    <>
      <AdminHeader
        title="Clientes"
        description="Usuarios registrados y datos de contacto."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <AdminPlaceholder
            embedded
            title="Clientes"
            description="Listado desde el módulo de usuarios del backend; exportación opcional."
          />
        </div>
      </div>
    </>
  );
}
