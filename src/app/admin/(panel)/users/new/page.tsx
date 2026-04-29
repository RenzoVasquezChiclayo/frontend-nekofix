import type { Metadata } from "next";
import { UserForm } from "@/components/admin/UserForm";
import { AdminHeader } from "@/components/admin/Header";

export const metadata: Metadata = {
  title: "Nuevo usuario",
};

export default function AdminNewUserPage() {
  return (
    <>
      <AdminHeader
        title="Nuevo usuario"
        description="Alta de cuenta para el panel. Asigna rol y estado."
      />
      <div className="p-4 sm:p-6">
        <UserForm />
      </div>
    </>
  );
}
