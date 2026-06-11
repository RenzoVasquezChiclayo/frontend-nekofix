"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { sortCatalogByName, sortSeriesByName } from "@/lib/product-field-resolvers";
import { ADMIN_SELECT_PAGE_SIZE, fetchAllAdminPages } from "@/lib/admin-paginate-list";
import { adminListProductConditions } from "@/services/admin/product-conditions.service";
import { adminListProductGrades } from "@/services/admin/product-grades.service";
import { adminListSeries } from "@/services/admin/series.service";
import type {
  PhoneSeries,
  ProductConditionCatalog,
  ProductGradeCatalog,
} from "@/types/catalog-admin";
import type { ProductCatalogType } from "@/types/product";

type Options = {
  accessToken: string | null | undefined;
  catalogType: ProductCatalogType;
  brandId?: string;
  /** Si false, no carga series (p. ej. catálogo distinto de DEVICE). */
  loadSeries?: boolean;
};

type Result = {
  conditions: ProductConditionCatalog[];
  grades: ProductGradeCatalog[];
  series: PhoneSeries[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  activeConditions: ProductConditionCatalog[];
  activeGrades: ProductGradeCatalog[];
  seriesForBrand: PhoneSeries[];
};

/**
 * Catálogos administrables para formularios admin (condiciones, grados, series).
 * Filtra por `catalogType` e `isActive` desde el API.
 */
export function useAdminCatalogOptions({
  accessToken,
  catalogType,
  brandId = "",
  loadSeries = true,
}: Options): Result {
  const [conditions, setConditions] = useState<ProductConditionCatalog[]>([]);
  const [grades, setGrades] = useState<ProductGradeCatalog[]>([]);
  const [series, setSeries] = useState<PhoneSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const [condRes, gradeRes, seriesRes] = await Promise.all([
        fetchAllAdminPages((p) =>
          adminListProductConditions(accessToken, {
            page: p,
            limit: ADMIN_SELECT_PAGE_SIZE,
            catalogType,
            isActive: true,
          })
        ),
        fetchAllAdminPages((p) =>
          adminListProductGrades(accessToken, {
            page: p,
            limit: ADMIN_SELECT_PAGE_SIZE,
            catalogType,
            isActive: true,
          })
        ),
        loadSeries && catalogType === "DEVICE"
          ? fetchAllAdminPages((p) =>
              adminListSeries(accessToken, {
                page: p,
                limit: ADMIN_SELECT_PAGE_SIZE,
                isActive: true,
              })
            )
          : Promise.resolve([] as PhoneSeries[]),
      ]);
      setConditions(sortCatalogByName(condRes));
      setGrades(sortCatalogByName(gradeRes));
      setSeries(sortSeriesByName(seriesRes));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los catálogos.");
      setConditions([]);
      setGrades([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, catalogType, loadSeries]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const activeConditions = useMemo(
    () => conditions.filter((c) => c.isActive !== false),
    [conditions]
  );

  const activeGrades = useMemo(
    () => grades.filter((g) => g.isActive !== false),
    [grades]
  );

  const seriesForBrand = useMemo(() => {
    const active = series.filter((s) => s.isActive !== false);
    if (!brandId) return active;
    return active.filter((s) => s.brandId === brandId);
  }, [series, brandId]);

  return {
    conditions,
    grades,
    series,
    loading,
    error,
    reload,
    activeConditions,
    activeGrades,
    seriesForBrand,
  };
}
