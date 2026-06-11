import type { PhoneModel } from "@/types/product";
import type { PhoneSeries } from "@/types/catalog-admin";

/** Series visibles según marca seleccionada. */
export function filterSeriesForBrand(
  series: PhoneSeries[],
  brandId: string
): PhoneSeries[] {
  const active = series.filter((s) => s.isActive !== false);
  if (!brandId) return active;
  return active.filter((s) => s.brandId === brandId);
}

/** Modelos filtrados por marca y, si aplica, serie. */
export function filterModelsForCatalog(
  models: PhoneModel[],
  opts: { brandId?: string; seriesId?: string }
): PhoneModel[] {
  const brandId = opts.brandId?.trim() ?? "";
  const seriesId = opts.seriesId?.trim() ?? "";

  return models.filter((m) => {
    if (brandId && m.brandId && m.brandId !== brandId) return false;
    if (brandId && !m.brandId && m.brand?.id && m.brand.id !== brandId) return false;
    if (seriesId && m.seriesId && m.seriesId !== seriesId) return false;
    return true;
  });
}
