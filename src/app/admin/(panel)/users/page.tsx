import type { Metadata } from "next";
import { UsersAdminView } from "@/components/admin/UsersAdminView";

export const metadata: Metadata = {
  title: "Usuarios",
};

export default function AdminUsersPage() {
  return <UsersAdminView />;
}
