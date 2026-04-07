/**
 * Placeholder mientras `GoogleReviewsSection` resuelve el fetch en el servidor (Suspense).
 */
export function GoogleReviewsSkeleton() {
  const block = "animate-pulse rounded-xl bg-zinc-200/80";
  return (
    <section
      className="border-t border-zinc-200/80 bg-gradient-to-b from-zinc-50/90 to-white py-16 sm:py-20"
      aria-busy="true"
      aria-label="Cargando reseñas"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className={`mx-auto h-3 w-24 ${block}`} />
          <div className={`mx-auto mt-4 h-9 w-72 max-w-full ${block}`} />
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
            <div className={`h-14 w-20 ${block}`} />
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`h-7 w-7 rounded ${block}`} />
                ))}
              </div>
              <div className={`h-4 w-40 ${block}`} />
            </div>
          </div>
          <div className={`mx-auto mt-8 h-11 w-44 rounded-full ${block}`} />
        </div>
        <div className="mt-12 flex gap-4 overflow-hidden md:px-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`min-h-[220px] min-w-[min(100%,320px)] flex-1 shrink-0 sm:min-w-[calc(50%-0.5rem)] lg:min-w-[calc(33.333%-0.67rem)] ${block}`}
            />
          ))}
        </div>
        <div className={`mx-auto mt-10 h-5 w-64 max-w-full ${block}`} />
      </div>
    </section>
  );
}
