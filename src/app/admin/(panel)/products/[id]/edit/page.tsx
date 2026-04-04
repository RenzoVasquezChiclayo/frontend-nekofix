import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminHeader } from "@/components/admin/Header";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Editar · ${id.slice(0, 8)}…` };
}

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <AdminHeader title="Editar producto" description="Actualiza datos e inventario del producto." />
      <div className="p-6">
        <ProductForm productId={id} />
      </div>
    </>
  );
}
