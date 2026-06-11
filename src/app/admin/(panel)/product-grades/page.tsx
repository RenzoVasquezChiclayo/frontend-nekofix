import type { Metadata } from "next";
import { ProductGradesAdminView } from "@/components/admin/ProductGradesAdminView";

export const metadata: Metadata = {
  title: "Grados",
};

export default function AdminProductGradesPage() {
  return <ProductGradesAdminView />;
}
