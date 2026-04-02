"use client";

import { AdminHeader } from "@/components/admin/Header";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export function LandingAdminView() {
  return (
    <>
      <AdminHeader
        title="Landing CMS"
        description="Bloques de la página de inicio: textos, promos y secciones."
      />
      <div className="space-y-6 p-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <AdminPlaceholder
            embedded
            title="Landing CMS"
            description="Edita contenido modular de la home sin tocar código (cuando el API esté listo)."
          />
        </div>
      </div>
    </>
  );
}
