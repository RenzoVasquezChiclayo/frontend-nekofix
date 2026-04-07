"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { GoogleReviewPublic } from "@/types/google-reviews-public";
import { cn } from "@/lib/utils";

const SCROLL_EPS = 8;

function CardStars({ rating }: { rating: number }) {
  const r = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <p className="text-sm text-amber-500" aria-label={`${rating} de 5`}>
      <span className="tracking-tighter">{"★".repeat(r)}</span>
      <span className="text-primary-200/60">{"★".repeat(5 - r)}</span>
    </p>
  );
}

function GoogleMiniBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-soft ring-1 ring-primary-100">
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Google
    </span>
  );
}

function ReviewCard({ review }: { review: GoogleReviewPublic }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm ring-1 ring-zinc-100 transition hover:border-primary-200/80 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {review.authorPhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.authorPhotoUrl}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-zinc-100"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-800 ring-2 ring-primary-200/50"
              aria-hidden
            >
              {review.authorName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-display font-semibold text-ink">{review.authorName}</p>
            <CardStars rating={review.rating} />
          </div>
        </div>
        <GoogleMiniBadge />
      </div>
      <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-body">
        &ldquo;{review.text}&rdquo;
      </p>
      {review.relativeTime ? (
        <p className="mt-4 text-xs font-medium text-ink-caption">{review.relativeTime}</p>
      ) : null}
    </article>
  );
}

/** 1 card móvil · 2 tablet · 3 desktop — snap + flechas en md+. */
export function GoogleReviewsCarousel({ reviews }: { reviews: GoogleReviewPublic[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > SCROLL_EPS);
    setCanNext(scrollLeft + clientWidth < scrollWidth - SCROLL_EPS);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateArrows]);

  useEffect(() => {
    updateArrows();
  }, [reviews, updateArrows]);

  const scrollByPage = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(260, el.clientWidth * 0.72) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative mt-10">
      <button
        type="button"
        aria-label="Anterior"
        disabled={!canPrev}
        onClick={() => scrollByPage(-1)}
        className={cn(
          "absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-200/80 bg-white/95 text-primary-800 shadow-lg backdrop-blur-sm transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-950 md:flex",
          !canPrev && "pointer-events-none opacity-0"
        )}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        disabled={!canNext}
        onClick={() => scrollByPage(1)}
        className={cn(
          "absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-200/80 bg-white/95 text-primary-800 shadow-lg backdrop-blur-sm transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-950 md:flex",
          !canNext && "pointer-events-none opacity-0"
        )}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Reseñas de clientes"
        aria-roledescription="carrusel"
        onScroll={updateArrows}
        className={cn(
          "snap-x snap-mandatory scroll-smooth pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "flex flex-nowrap gap-4 overflow-x-auto px-1 md:px-12",
          "motion-reduce:scroll-auto"
        )}
      >
        {reviews.map((review, index) => (
          <div
            key={`google-review-${index}-${review.authorName.slice(0, 20)}`}
            className={cn(
              "snap-start transition duration-300 ease-out",
              "flex-[0_0_100%]",
              "sm:flex-[0_0_calc((100%-1rem)/2)]",
              "lg:flex-[0_0_calc((100%-2rem)/3)]"
            )}
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}
