import type { Metadata } from "next";
import { SettingsAdminView } from "@/components/admin/SettingsAdminView";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function AdminSettingsPage() {
  return <SettingsAdminView />;
}
