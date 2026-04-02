import type { Metadata } from "next";
import { CategoriesAdminView } from "@/components/admin/CategoriesAdminView";

export const metadata: Metadata = {
  title: "Categorías",
};

export default function AdminCategoriesPage() {
  return <CategoriesAdminView />;
}
