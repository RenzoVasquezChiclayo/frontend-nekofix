/**
 * Paleta y rutas de marca. Los valores hex se reflejan en `src/app/globals.css` (variables CSS).
 * Modifica aquí y sincroniza con `:root` / `@theme` para mantener una sola fuente de verdad legible en TS.
 */
export const BRAND_COLORS = {
  primary: {
    /** Tonos oscuros base */
    p950: "#273C54",
    p900: "#263C54",
    /** Tonos medios (acciones, enlaces) */
    p700: "#315987",
    p600: "#305987",
  },
  secondary: {
    /** Acentos cálidos — usar con opacidad baja en UI */
    warm: "#F89257",
    warmAlt: "#F28F55",
    /** Acentos fríos — fondos sutiles, chips */
    cool: "#7DCFB5",
    coolAlt: "#86C8B2",
  },
} as const;

/** Logo PNG en `public/brand/logo.png` (añadir el archivo en esa carpeta). */
export const BRAND_LOGO_PATH = "/brand/logo.png" as const;

/** Wordmark / título gráfico en `public/brand/logo2.png`. */
export const BRAND_WORDMARK_PATH = "/brand/logo2.png" as const;
