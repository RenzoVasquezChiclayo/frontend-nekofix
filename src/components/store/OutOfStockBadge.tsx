import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Overlay sobre imagen vs badge inline. */
  variant?: "overlay" | "badge";
};

export function OutOfStockBadge({ className, variant = "overlay" }: Props) {
  if (variant === "badge") {
    return (
      <span
        className={cn(
          "rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white",
          className
        )}
      >
        Agotado
      </span>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-900/45",
        className
      )}
      aria-hidden
    >
      <span className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg sm:text-sm">
        Agotado
      </span>
    </div>
  );
}
