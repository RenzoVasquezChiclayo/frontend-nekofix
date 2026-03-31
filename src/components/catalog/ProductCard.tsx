import Link from "next/link";
import Image from "next/image";
import { PRODUCT_KIND_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

type Props = { product: Product };

export function ProductCard({ product: p }: Props) {
  return (
    <Link
      href={`/producto/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
    >
      <div className="relative aspect-square bg-zinc-100">
        <Image
          src={p.images[0] ?? "/placeholder-phone.svg"}
          alt={p.name}
          fill
          className="object-contain p-4 transition group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-zinc-900/85 px-2 py-0.5 text-xs text-white">
          {PRODUCT_KIND_LABELS[p.kind]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-zinc-500">{p.brand}</p>
        <h2 className="mt-1 flex-1 font-semibold text-zinc-900 line-clamp-2">
          {p.name}
        </h2>
        <p className="mt-2 text-lg font-bold text-primary-700">
          {formatPrice(p.price, p.currency)}
        </p>
        {p.stock <= 3 && p.stock > 0 ? (
          <p className="mt-1 text-xs text-amber-700">Últimas piezas</p>
        ) : null}
      </div>
    </Link>
  );
}
