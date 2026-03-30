import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductFilters } from "@/components/catalog/ProductFilters";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { Loader } from "@/components/shared/Loader";
import { getProductsWithFallback } from "@/services/product.service";
import type { ProductKind, DeviceWearGrade } from "@/types/product";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `Catálogo de equipos nuevos, seminuevos y accesorios · ${SITE_NAME}`,
};

function parseKind(v: string | string[] | undefined): ProductKind | undefined {
  const s = typeof v === "string" ? v : undefined;
  if (s === "nuevo" || s === "seminuevo" || s === "accesorio") return s;
  return undefined;
}

function parseWear(
  v: string | string[] | undefined
): DeviceWearGrade | undefined {
  const s = typeof v === "string" ? v : undefined;
  if (
    s === "excelente" ||
    s === "muy_bueno" ||
    s === "bueno" ||
    s === "aceptable"
  )
    return s;
  return undefined;
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : undefined;
  const kind = parseKind(sp.kind);
  const wearGrade = parseWear(sp.wearGrade);
  const color = typeof sp.color === "string" ? sp.color : undefined;
  const storageRaw = typeof sp.storageGb === "string" ? sp.storageGb : undefined;
  const storageGb = storageRaw ? Number(storageRaw) : undefined;

  const result = await getProductsWithFallback({
    search,
    kind,
    wearGrade,
    color,
    storageGb: Number.isFinite(storageGb) ? storageGb : undefined,
    page: 1,
    limit: 48,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Catálogo
        </h1>
        <p className="mt-2 text-zinc-600">
          Filtra por tipo, estado, color y almacenamiento. Los datos provienen del
          API NestJS o de datos demo en desarrollo.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-6">
          <Suspense fallback={<Loader label="Cargando búsqueda…" />}>
            <ProductSearch />
          </Suspense>
          {result.data.length === 0 ? (
            <p className="py-16 text-center text-zinc-500">
              No hay productos con estos filtros.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {result.data.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside className="lg:order-first">
          <Suspense fallback={<Loader label="Cargando filtros…" />}>
            <ProductFilters />
          </Suspense>
        </aside>
      </div>
    </div>
  );
}
