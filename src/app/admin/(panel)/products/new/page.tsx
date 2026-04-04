import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminHeader } from "@/components/admin/Header";

export const metadata: Metadata = {
  title: "Nuevo producto",
};

export default function AdminNewProductPage() {
  return (
    <>
      <AdminHeader title="Nuevo producto" description="Alta completa alineada a Prisma." />
      <div className="p-6">
        <ProductForm />
      </div>
    </>
  );
}
