/**
 * Colores de producto (nombre comercial Apple / tienda).
 * El campo `color` en API guarda el nombre; el hex y labels de UI son solo para tienda.
 * Soporta aliases en inglés y español (legacy) sin cambiar cómo guarda el admin.
 */

export const PRODUCT_COLOR_OPTIONS = [
  "Midnight",
  "Starlight",
  "Sierra Blue",
  "Space Black",
  "Silver",
  "Gold",
  "Purple",
  "Green",
  "Red",
  "Pink",
] as const;

export type ProductColorOption = (typeof PRODUCT_COLOR_OPTIONS)[number];

/** Círculo neutro solo cuando no hay coincidencia válida. */
export const PRODUCT_COLOR_UNKNOWN_HEX = "#9ca3af";

/** Definición única: hex Apple, label comercial en inglés (tienda), aliases EN+ES+variantes. */
type ColorDefinition = {
  hex: string;
  /** Nombre mostrado en UI (estilo Apple / catálogo en inglés). */
  display: string;
  aliases: string[];
};

const COLOR_DEFINITIONS: ColorDefinition[] = [
  {
    hex: "#1f2937",
    display: "Midnight",
    aliases: ["Midnight", "Medianoche", "Azul marino"],
  },
  {
    hex: "#f5f5dc",
    display: "Starlight",
    aliases: ["Starlight", "Blanco estrella"],
  },
  {
    hex: "#7fa7c9",
    display: "Sierra Blue",
    aliases: ["Sierra Blue", "SierraBlue", "sierra-blue", "Azul Sierra", "Azul sierra"],
  },
  {
    hex: "#111827",
    display: "Space Black",
    aliases: ["Space Black", "SpaceBlack", "space black", "Negro espacial", "Negro"],
  },
  {
    hex: "#d1d5db",
    display: "Silver",
    aliases: ["Silver", "Plata"],
  },
  {
    hex: "#d4af37",
    display: "Gold",
    aliases: ["Gold", "Dorado"],
  },
  {
    hex: "#8b5cf6",
    display: "Purple",
    aliases: ["Purple", "Morado", "Púrpura", "Purpura"],
  },
  {
    hex: "#10b981",
    display: "Green",
    aliases: ["Green", "Verde"],
  },
  {
    hex: "#ef4444",
    display: "Red",
    aliases: ["Red", "Rojo"],
  },
  {
    hex: "#ec4899",
    display: "Pink",
    aliases: ["Pink", "Rosado"],
  },
  {
    hex: "#3b82f6",
    display: "Blue",
    aliases: ["Blue", "Azul"],
  },
  {
    hex: "#ffffff",
    display: "White",
    aliases: ["White", "Blanco"],
  },
  {
    hex: "#000000",
    display: "Black",
    aliases: ["Black", "Negro mate"],
  },
];

const { HEX_LOOKUP, LABEL_LOOKUP } = buildColorMaps();

function buildColorMaps(): {
  HEX_LOOKUP: Map<string, string>;
  LABEL_LOOKUP: Map<string, string>;
} {
  const hexMap = new Map<string, string>();
  const labelMap = new Map<string, string>();

  for (const row of COLOR_DEFINITIONS) {
    const { hex, display, aliases } = row;
    for (const a of aliases) {
      const k = normalizeColorKeyForLookup(a);
      if (!k) continue;
      hexMap.set(k, hex);
      hexMap.set(k.replace(/\s/g, ""), hex);
      labelMap.set(k, display);
      labelMap.set(k.replace(/\s/g, ""), display);
    }
  }

  return { HEX_LOOKUP: hexMap, LABEL_LOOKUP: labelMap };
}

/**
 * Normaliza para comparar nombres de color: trim, lower, espacios únicos,
 * NBSP / espacios unicode → espacio ASCII, NFKC, sin caracteres invisibles.
 */
export function normalizeColorKeyForLookup(raw: string): string {
  let s = String(raw).normalize("NFKC");
  s = s.replace(/[\u200B-\u200D\uFEFF]/g, "");
  s = s.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ");
  s = s.trim().toLowerCase();
  s = s.replace(/\s+/g, " ");
  return s;
}

function warnMissingColor(original: string): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console -- solo dev para depurar mapeos faltantes
    console.warn("[product-color] Sin hex en mapa para:", original);
  }
}

/**
 * Hex para pintar el swatch. Nombres equivalentes (inglés / español / variantes)
 * resuelven al mismo valor.
 */
export function getProductColorHex(color: string | null | undefined): string {
  if (color == null) {
    return PRODUCT_COLOR_UNKNOWN_HEX;
  }

  const raw = typeof color === "string" ? color : String(color);
  const trimmed = raw.trim();
  if (!trimmed) {
    return PRODUCT_COLOR_UNKNOWN_HEX;
  }

  if (/^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/.test(trimmed)) {
    return trimmed;
  }

  const key = normalizeColorKeyForLookup(trimmed);
  if (!key) {
    warnMissingColor(raw);
    return PRODUCT_COLOR_UNKNOWN_HEX;
  }

  const compact = key.replace(/\s/g, "");
  const hex = HEX_LOOKUP.get(key) ?? HEX_LOOKUP.get(compact);

  if (hex) {
    return hex;
  }

  warnMissingColor(raw);
  return PRODUCT_COLOR_UNKNOWN_HEX;
}

/**
 * Label comercial unificado (inglés estilo Apple) cuando el valor coincide con el mapa;
 * si no, devuelve el texto original recortado.
 */
export function resolveProductColorLabel(color: string | null | undefined): string | null {
  if (color == null || !String(color).trim()) return null;

  const t = normalizeColorKeyForLookup(String(color));

  for (const opt of PRODUCT_COLOR_OPTIONS) {
    if (normalizeColorKeyForLookup(opt) === t) return opt;
  }

  const fromAlias = LABEL_LOOKUP.get(t) ?? LABEL_LOOKUP.get(t.replace(/\s/g, ""));
  if (fromAlias) return fromAlias;

  return String(color).trim();
}

/** Indica si el valor coincide con una opción del catálogo admin (picker). */
export function isCatalogProductColor(color: string | null | undefined): boolean {
  if (color == null || !String(color).trim()) return false;
  const t = normalizeColorKeyForLookup(String(color));
  return PRODUCT_COLOR_OPTIONS.some((opt) => normalizeColorKeyForLookup(opt) === t);
}
