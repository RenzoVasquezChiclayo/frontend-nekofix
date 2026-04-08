import { cn } from "@/lib/utils";
import { getProductColorHex, resolveProductColorLabel } from "@/lib/product-color-map";

type Props = {
  color: string | null | undefined;
  /** Destacado estilo “seleccionado” (borde / ring). */
  selected?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-4 w-4",
  md: "h-9 w-9",
  lg: "h-11 w-11",
} as const;

/**
 * Círculo de color para ficha y cards; nombre resuelto vía `resolveProductColorLabel`.
 */
export function ProductColorSwatch({
  color,
  selected = true,
  size = "md",
  className,
}: Props) {
  const label = resolveProductColorLabel(color);
  if (!label) return null;
  const hex = getProductColorHex(color);
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full border border-black/15 shadow-inner",
        sizeClass[size],
        selected
          ? "ring-2 ring-primary-600 ring-offset-2 ring-offset-white"
          : "ring-2 ring-zinc-200 ring-offset-2 ring-offset-white",
        className
      )}
      style={{ backgroundColor: hex }}
      title={label}
      aria-hidden
    />
  );
}

type RowProps = {
  color: string | null | undefined;
  className?: string;
};

/** Fila estilo tienda: swatch + nombre; siempre muestra estado “seleccionado” en un solo color. */
export function ProductColorPickerRow({ color, className }: RowProps) {
  const label = resolveProductColorLabel(color);
  if (!label) return null;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Color</p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <ProductColorSwatch color={color} selected size="lg" />
          <span className="max-w-[7rem] text-center text-xs font-medium text-ink">{label}</span>
        </div>
      </div>
    </div>
  );
}

/** Swatch compacto para cards de catálogo (debajo del nombre). */
export function ProductColorMiniSwatch({
  color,
  className,
}: {
  color: string | null | undefined;
  className?: string;
}) {
  const label = resolveProductColorLabel(color);
  if (!label) return null;
  const hex = getProductColorHex(color);
  return (
    <span className={cn("mt-2 inline-flex items-center gap-2", className)} title={label}>
      <span
        className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/15 shadow-sm"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <span className="text-[11px] font-medium text-ink-soft">{label}</span>
    </span>
  );
}
