"use client";

import Image from "next/image";
import { useState } from "react";
import { BRAND_LOGO_PATH, BRAND_WORDMARK_PATH } from "@/config/theme";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: number;
  /** Si hay texto visible al lado (p. ej. nombre del sitio), el logo es decorativo para lectores de pantalla. */
  decorative?: boolean;
};

/**
 * Muestra el logo en `public/brand/logo.png` si existe; si falla la carga, muestra iniciales en bloque de marca.
 */
export function BrandLogo({ className, size = 36, decorative }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-primary-600 text-sm font-black text-white",
          className
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        NF
      </span>
    );
  }

  return (
    <Image
      src={BRAND_LOGO_PATH}
      alt={decorative ? "" : SITE_NAME}
      width={size}
      height={size}
      className={cn("h-9 w-9 shrink-0 object-contain", className)}
      priority
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}
export function BrandLogoWithTitle({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <BrandLogo decorative />
      <span className="font-display font-black tracking-tight text-ink">{SITE_NAME}</span>
    </span>
  );
}

type WordmarkProps = {
  className?: string;
  priority?: boolean;
};

/**
 * Título gráfico (`public/brand/logo2.png`). Si falla la carga, muestra el nombre en texto.
 */
export function BrandWordmark({ className, priority = false }: WordmarkProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={cn("font-display font-black tracking-tight text-ink", className)}>
        {SITE_NAME}
      </span>
    );
  }

  return (
    <Image
      src={BRAND_WORDMARK_PATH}
      alt={SITE_NAME}
      width={240}
      height={64}
      className={cn(
        "h-9 w-auto max-w-[min(240px,100%)] object-contain object-left sm:h-10",
        className
      )}
      priority={priority}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}

