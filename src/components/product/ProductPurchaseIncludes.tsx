"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { cn } from "@/lib/utils";

const ICON_STROKE = 1.75;

function IconBase({ className, children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={ICON_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

function IconCable(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M6 7h12v2a6 6 0 0 1-6 6 6 6 0 0 1-6-6V7z" />
      <path d="M12 15v4" />
      <path d="M9 19h6" />
    </IconBase>
  );
}

function IconPlugZap(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </IconBase>
  );
}

function IconShield(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </IconBase>
  );
}

function IconSmartphone(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </IconBase>
  );
}

function IconBattery(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 11v2" />
      <path d="M6 11v2" />
      <path d="M10 11v2" />
      <path d="M14 11v2" />
    </IconBase>
  );
}

type PurchaseInclude = {
  id: string;
  title: string;
  description: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const PURCHASE_INCLUDES: PurchaseInclude[] = [
  {
    id: "cable",
    title: "Cable de carga",
    description: "Compatible con tu equipo",
    Icon: IconCable,
  },
  {
    id: "charger",
    title: "Cargador compatible",
    description: "Carga rápida compatible",
    Icon: IconPlugZap,
  },
  {
    id: "case",
    title: "Case transparente",
    description: "Protección básica incluida",
    Icon: IconShield,
  },
  {
    id: "glass",
    title: "Vidrio templado",
    description: "Protección de pantalla incluida",
    Icon: IconSmartphone,
  },
  {
    id: "battery",
    title: "Batería garantizada",
    description: "80% – 100% de vida útil",
    Icon: IconBattery,
  },
];

type ItemProps = {
  item: PurchaseInclude;
  compact?: boolean;
  className?: string;
};

function IncludeItem({ item, compact, className }: ItemProps) {
  const { Icon } = item;
  return (
    <article
      className={cn(
        "flex flex-col items-center text-center transition duration-300",
        compact
          ? "min-h-[11.5rem] justify-center rounded-2xl border border-zinc-200/90 bg-zinc-50/60 px-4 py-6"
          : "px-2 py-1 md:rounded-2xl md:border md:border-zinc-200/80 md:bg-zinc-50/50 md:px-4 md:py-8 md:hover:border-primary-200/80 md:hover:shadow-sm",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border border-zinc-200/90 bg-white shadow-sm",
          compact ? "h-12 w-12" : "h-14 w-14"
        )}
      >
        <Icon className={cn("text-primary-700", compact ? "h-6 w-6" : "h-7 w-7")} />
      </div>
      <h3
        className={cn(
          "font-display font-bold tracking-tight text-ink",
          compact ? "mt-3 text-sm" : "mt-4 text-sm sm:text-[0.9375rem]"
        )}
      >
        {item.title}
      </h3>
      <p
        className={cn(
          "mt-1.5 max-w-[11.5rem] leading-relaxed text-ink-muted",
          compact ? "text-[11px]" : "text-xs"
        )}
      >
        {item.description}
      </p>
    </article>
  );
}

function MobileIncludesCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncIndexFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    setActiveIndex(nearest);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncIndexFromScroll();
    const ro = new ResizeObserver(() => syncIndexFromScroll());
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncIndexFromScroll]);

  function scrollToIndex(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    setActiveIndex(index);
  }

  return (
    <div className="mt-8 md:hidden">
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Beneficios incluidos en tu compra"
        aria-roledescription="carrusel"
        onScroll={syncIndexFromScroll}
        className={cn(
          "flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 pt-0.5",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "motion-reduce:scroll-auto"
        )}
      >
        {PURCHASE_INCLUDES.map((item) => (
          <div
            key={item.id}
            className="w-[min(78vw,17.5rem)] shrink-0 snap-center sm:w-[min(62vw,16.5rem)]"
          >
            <IncludeItem item={item} compact />
          </div>
        ))}
      </div>

      <div
        className="mt-5 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Indicador de beneficios"
      >
        {PURCHASE_INCLUDES.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`${item.title}, beneficio ${index + 1} de ${PURCHASE_INCLUDES.length}`}
            onClick={() => scrollToIndex(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              activeIndex === index
                ? "w-6 bg-primary-600"
                : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function ProductPurchaseIncludes({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "border-t border-primary-100 pt-12 sm:pt-14",
        className
      )}
      aria-labelledby="purchase-includes-heading"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-600/90">
          Incluido en tu compra
        </p>
        <h2
          id="purchase-includes-heading"
          className="font-display mt-2 text-xl font-extrabold tracking-tight text-ink sm:text-2xl"
        >
          ¿Qué incluye tu compra?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
          Equipamos tu smartphone con lo esencial para usarlo desde el primer día, con calidad
          verificada en tienda.
        </p>
      </div>

      <MobileIncludesCarousel />

      <ul className="mt-10 hidden gap-6 md:grid md:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-5">
        {PURCHASE_INCLUDES.map((item) => (
          <li key={item.id}>
            <IncludeItem item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
