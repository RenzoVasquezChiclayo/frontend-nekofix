/**
 * Esqueleto de carga para el formulario de producto (modo edición).
 */
export function ProductFormSkeleton() {
  const block = "animate-pulse rounded-lg bg-zinc-100";
  return (
    <div
      className="mx-auto max-w-4xl space-y-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
      aria-busy="true"
      aria-label="Cargando formulario de producto"
    >
      <div className="space-y-3">
        <div className={`h-3 w-40 ${block}`} />
        <div className={`h-10 w-full ${block}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`h-10 ${block}`} />
          <div className={`h-10 ${block}`} />
        </div>
        <div className={`h-24 w-full ${block}`} />
      </div>
      <div className="space-y-3">
        <div className={`h-3 w-24 ${block}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`h-10 ${block}`} />
          <div className={`h-10 ${block}`} />
        </div>
      </div>
      <div className="space-y-3">
        <div className={`h-3 w-28 ${block}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`h-10 ${block}`} />
          <div className={`h-10 ${block}`} />
        </div>
      </div>
      <div className="space-y-3">
        <div className={`h-3 w-32 ${block}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`h-10 ${block}`} />
          <div className={`h-10 ${block}`} />
          <div className={`h-10 sm:col-span-2 ${block}`} />
        </div>
      </div>
      <div className={`h-32 w-full ${block}`} />
      <div className="flex gap-3 border-t border-zinc-100 pt-8">
        <div className={`h-10 w-36 ${block}`} />
        <div className={`h-10 w-28 ${block}`} />
      </div>
    </div>
  );
}
