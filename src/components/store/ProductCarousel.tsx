"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const SCROLL_EPS = 8;

type Props = {
  children: ReactNode;
  /** Clase extra en el contenedor exterior (relativo, para flechas) */
  className?: string;
  /** Etiqueta accesible del carrusel */
  "aria-label"?: string;
};

/**
 * Carrusel horizontal con scroll-snap, flechas en desktop/tablet
 * y anchos responsive (~2 / 3 / 4 / 5 ítems visibles).
 */
export function ProductCarousel({
  children,
  className,
  "aria-label": ariaLabel = "Carrusel de productos",
}: Props) {
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
  }, [children, updateArrows]);

  const scrollByPage = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.max(240, el.clientWidth * 0.75) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Anterior"
        disabled={!canPrev}
        onClick={() => scrollByPage(-1)}
        className={cn(
          "absolute left-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-zinc-800 shadow-lg backdrop-blur-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-900 md:flex",
          !canPrev && "pointer-events-none opacity-0"
        )}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        disabled={!canNext}
        onClick={() => scrollByPage(1)}
        className={cn(
          "absolute right-1 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-zinc-800 shadow-lg backdrop-blur-sm transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-900 md:flex",
          !canNext && "pointer-events-none opacity-0"
        )}
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        aria-roledescription="carrusel"
        onScroll={updateArrows}
        className={cn(
          "snap-x snap-mandatory scroll-smooth pb-1 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "flex flex-nowrap gap-4 overflow-x-auto px-1 md:px-14",
          "motion-reduce:scroll-auto"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Wrapper de cada ítem del carrusel: anchos ~2 / 3 / 4 / 5 visibles + snap + hover lift */
export function ProductCarouselItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "snap-start transition duration-300 ease-out",
        /* gap-4 = 1rem entre ítems: (N-1) gaps para N columnas visibles */
        "flex-[0_0_calc((100%-1rem)/2)]",
        "md:flex-[0_0_calc((100%-2rem)/3)]",
        "lg:flex-[0_0_calc((100%-3rem)/4)]",
        "xl:flex-[0_0_calc((100%-4rem)/5)]",
        "hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
