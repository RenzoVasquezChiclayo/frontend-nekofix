"use client";

import { AdminHeader } from "@/components/admin/Header";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export function SettingsAdminView() {
  return (
    <>
      <AdminHeader
        title="Configuración"
        description="Datos del negocio, integraciones y preferencias del panel."
      />
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <AdminPlaceholder
            embedded
            title="Configuración"
            description="Variables de entorno sensibles viven en el servidor; aquí solo ajustes persistidos en BD."
          />
        </div>
      </div>
    </>
  );
}
