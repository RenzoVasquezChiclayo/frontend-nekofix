import type { Metadata } from "next";
import { BrandsAdminView } from "@/components/admin/BrandsAdminView";

export const metadata: Metadata = {
  title: "Marcas",
};

export default function AdminBrandsPage() {
  return <BrandsAdminView />;
}
