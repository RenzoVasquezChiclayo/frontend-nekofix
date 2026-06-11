import { OutOfStockBadge } from "@/components/store/OutOfStockBadge";

export function ProductOutOfStockNotice() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      Producto temporalmente agotado.
    </div>
  );
}

export { OutOfStockBadge };
