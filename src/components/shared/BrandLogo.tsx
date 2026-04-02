"use client";

import Image from "next/image";
import { useState } from "react";
import { BRAND_LOGO_PATH } from "@/config/theme";
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
      <span className="font-black tracking-tight text-zinc-900">{SITE_NAME}</span>
    </span>
  );
}

