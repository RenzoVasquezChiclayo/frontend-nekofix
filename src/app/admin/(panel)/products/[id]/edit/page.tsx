import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminHeader } from "@/components/admin/Header";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: raw } = await params;
  const id = raw?.trim() ?? "";
  if (!id) return { title: "Productos" };
  return { title: `Editar · ${id.slice(0, 8)}…` };
}

export default async function AdminEditProductPage({ params }: Props) {
  const { id: raw } = await params;
  const id = raw?.trim() ?? "";
  if (!id) redirect("/admin/products");

  return (
    <>
      <AdminHeader title="Editar producto" description="Actualiza datos e inventario del producto." />
      <div className="p-6">
        <ProductForm productId={id} key={id} />
      </div>
    </>
  );
}
