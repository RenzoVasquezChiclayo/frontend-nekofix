"use client";

import Link from "next/link";
import { useCart } from "@/store/cart-context";

export function CartBadge() {
  const { itemCount } = useCart();
  return (
    <Link
      href="/carrito"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 transition hover:border-zinc-300"
      aria-label={`Carrito, ${itemCount} artículos`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.17 1.243H5.25c-.72 0-1.24-.578-1.17-1.243l1.263-12A1.125 1.125 0 016.62 7.5h10.76a1.125 1.125 0 011.069.743z"
        />
      </svg>
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
