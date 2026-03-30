import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  label?: string;
};

export function Loader({ className, label = "Cargando…" }: Props) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3 py-12", className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-emerald-600"
        aria-hidden
      />
      <span className="text-sm text-zinc-500">{label}</span>
    </div>
  );
}
