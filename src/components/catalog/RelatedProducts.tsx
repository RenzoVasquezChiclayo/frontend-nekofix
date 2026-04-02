import Link from "next/link";
import Image from "next/image";
import { ProductBadges } from "@/components/store/ProductBadges";
import { isLowStock, PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-ui";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

type Props = { products: Product[] };

export function RelatedProducts({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 border-t border-primary-100 pt-14">
      <h2 className="text-lg font-semibold tracking-tight text-primary-950">
        También te puede interesar
      </h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const low = isLowStock(p.stock, p.minStock) && p.stock > 0;
          return (
            <li key={p.id}>
              <Link
                href={`/producto/${p.slug}`}
                className="group flex gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 transition hover:border-primary-200 hover:shadow-sm"
              >
                <div className="relative h-24 w-24 shrink-0 bg-zinc-50">
                  <Image
                    src={PRODUCT_PLACEHOLDER_IMAGE}
                    alt=""
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <ProductBadges
                    type={p.type}
                    condition={p.condition}
                    lowStock={low}
                    className="scale-90 origin-top-left"
                  />
                  <p className="mt-1 line-clamp-2 text-sm font-medium text-zinc-900">
                    {p.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-primary-800">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
