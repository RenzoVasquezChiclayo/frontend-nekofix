import type { Metadata } from "next";
import { InventoryAdminView } from "@/components/admin/InventoryAdminView";

export const metadata: Metadata = {
  title: "Inventario",
};

export default function AdminInventoryPage() {
  return <InventoryAdminView />;
}
