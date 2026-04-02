import type { Metadata } from "next";
import { ProductsAdminView } from "@/components/admin/ProductsAdminView";

export const metadata: Metadata = {
  title: "Productos",
};

export default function AdminProductsPage() {
  return <ProductsAdminView />;
}
