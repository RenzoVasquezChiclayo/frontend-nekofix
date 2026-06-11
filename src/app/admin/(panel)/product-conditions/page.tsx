import type { Metadata } from "next";
import { ProductConditionsAdminView } from "@/components/admin/ProductConditionsAdminView";

export const metadata: Metadata = {
  title: "Condiciones",
};

export default function AdminProductConditionsPage() {
  return <ProductConditionsAdminView />;
}
