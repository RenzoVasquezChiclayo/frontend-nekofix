import { GoogleReviewsCarousel } from "@/components/landing/GoogleReviewsCarousel";
import { env } from "@/config/env";
import { getPublicGoogleReviews } from "@/services/google-reviews-public.service";

function StarDisplay({ value }: { value: number }) {
  const v = Math.min(5, Math.max(0, Math.round(value)));
  return (
    <p
      className="text-center text-3xl leading-none tracking-tighter text-amber-500 sm:text-left sm:text-4xl"
      role="img"
      aria-label={`Valoración media ${value.toFixed(1)} de 5 estrellas`}
    >
      <span aria-hidden>{"★".repeat(v)}</span>
      <span className="text-zinc-200" aria-hidden>
        {"★".repeat(5 - v)}
      </span>
    </p>
  );
}

/**
 * Reseñas reales vía `GET /public/google-reviews` (Nest).
 * Si falla o no hay datos, no renderiza nada (fallback silencioso).
 */
export async function GoogleReviewsSection() {
  const data = await getPublicGoogleReviews();
  if (!data?.reviews.length) return null;

  const mapsUrl = (data.mapsUrl ?? "").trim() || env.googleReviewsListingUrl.trim();

  return (
    <section className="border-t border-zinc-200/80 bg-gradient-to-b from-zinc-50/90 via-white to-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">
              Google
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-outfit)] text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Lo que opinan nuestros clientes
            </h2>
          </div>

          <div className="mt-10 flex w-full max-w-md flex-col items-center gap-4 sm:mt-8 lg:mt-0 lg:max-w-none lg:flex-row lg:items-end lg:justify-end lg:gap-8">
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <span className="font-[family-name:var(--font-outfit)] text-5xl font-black tabular-nums tracking-tight text-primary-900 sm:text-6xl">
                {data.averageRating.toFixed(1)}
              </span>
              <StarDisplay value={data.averageRating} />
              <p className="text-sm font-medium text-zinc-600">
                {data.totalReviews.toLocaleString("es-PE")} reseñas en Google
              </p>
            </div>

            {mapsUrl ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-semibold text-primary-900 shadow-sm transition hover:border-primary-300 hover:bg-primary-50"
              >
                Ver en Google
                <span className="ml-1.5 text-primary-600" aria-hidden>
                  ↗
                </span>
              </a>
            ) : null}
          </div>
        </header>

        <GoogleReviewsCarousel reviews={data.reviews} />

        {mapsUrl ? (
          <p className="mt-12 text-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800 underline-offset-4 transition hover:text-primary-950 hover:underline"
            >
              Ver todas las reseñas en Google Maps
              <span aria-hidden className="text-primary-600">
                ↗
              </span>
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
