import type { Metadata } from "next";
import { CatalogLayout } from "@/components/catalog/CatalogLayout";
import { parseProductListQuery } from "@/lib/catalog-query";
import { emptyListResponse } from "@/lib/normalize-api-list";
import { getBrands } from "@/services/brand.service";
import { getCategories } from "@/services/category.service";
import { getPhoneModels } from "@/services/phone-model.service";
import { getProducts } from "@/services/product.service";
import type { Brand, Category, PhoneModel, Product } from "@/types/product";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Catálogo · ${SITE_NAME}`,
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = parseProductListQuery(sp);

  const [brandsRes, categoriesRes, modelsRes, result] = await Promise.all([
    getBrands().catch(() => emptyListResponse<Brand>()),
    getCategories().catch(() => emptyListResponse<Category>()),
    getPhoneModels().catch(() => emptyListResponse<PhoneModel>()),
    getProducts(query).catch(() => emptyListResponse<Product>()),
  ]);
  const brands = brandsRes.data;
  const categories = categoriesRes.data;
  const models = modelsRes.data;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-primary-950 sm:text-4xl">
          Tienda
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
          Equipos y accesorios alineados a nuestro inventario. Filtra por marca,
          categoría, condición y más.
        </p>
      </header>
      <CatalogLayout
        products={result.data}
        total={result.meta.total}
        brands={brands}
        categories={categories}
        models={models}
      />
    </div>
  );
}
