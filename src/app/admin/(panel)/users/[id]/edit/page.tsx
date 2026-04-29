import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserForm } from "@/components/admin/UserForm";
import { AdminHeader } from "@/components/admin/Header";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const id = raw?.trim() ?? "";
  if (!id) return { title: "Usuarios" };
  return { title: `Editar usuario · ${id.slice(0, 8)}…` };
}

export default async function AdminEditUserPage({ params }: Props) {
  const { id: raw } = await params;
  const id = raw?.trim() ?? "";
  if (!id) redirect("/admin/users");

  return (
    <>
      <AdminHeader
        title="Editar usuario"
        description="Actualiza datos, rol y estado de la cuenta."
      />
      <div className="p-4 sm:p-6">
        <UserForm userId={id} key={id} />
      </div>
    </>
  );
}
