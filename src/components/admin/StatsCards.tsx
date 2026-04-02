import { cn } from "@/lib/utils";

export type StatItem = {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "warning" | "success";
};

type Props = {
  items: StatItem[];
  className?: string;
};

export function StatsCards({ items, className }: Props) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {items.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            {c.label}
          </p>
          <p
            className={cn(
              "mt-2 text-3xl font-bold tabular-nums tracking-tight text-primary-950",
              c.tone === "warning" && "text-amber-700",
              c.tone === "success" && "text-emerald-700"
            )}
          >
            {c.value}
          </p>
          {c.hint ? <p className="mt-1 text-xs text-zinc-500">{c.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}
