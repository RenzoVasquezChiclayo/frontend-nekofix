import type { Metadata } from "next";
import { ClientsAdminView } from "@/components/admin/ClientsAdminView";

export const metadata: Metadata = {
  title: "Clientes",
};

export default function AdminClientsPage() {
  return <ClientsAdminView />;
}
