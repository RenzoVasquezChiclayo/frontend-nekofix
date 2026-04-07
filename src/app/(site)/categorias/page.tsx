import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { emptyListResponse } from "@/lib/normalize-api-list";
import { getCategories } from "@/services/category.service";
import type { Category } from "@/types/product";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Categorías",
  description: `Explora por categoría · ${SITE_NAME}`,
};

export default async function CategoriasPage() {
  const categories = (
    await getCategories().catch(() => emptyListResponse<Category>())
  ).data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Categorías</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Elige una categoría para ver productos filtrados en el catálogo.
      </p>
      {categories.length === 0 ? (
        <p className="mt-12 text-center text-sm text-ink-soft">
          No hay categorías disponibles.
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = c._count?.products;
            return (
              <li key={c.id}>
                <Link
                  href={`/catalogo?categoryId=${encodeURIComponent(c.id)}`}
                  className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
                >
                  {c.icon?.startsWith("http") ? (
                    <Image
                      src={c.icon}
                      alt=""
                      width={40}
                      height={40}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="text-2xl" aria-hidden>
                      {c.icon || "📁"}
                    </span>
                  )}
                  <span className="font-display mt-3 text-lg font-bold text-ink">{c.name}</span>
                  {count != null ? (
                    <span className="mt-1 text-sm text-ink-soft">
                      {count} producto{count === 1 ? "" : "s"}
                    </span>
                  ) : (
                    <span className="mt-1 text-sm text-ink-caption">Ver catálogo</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
