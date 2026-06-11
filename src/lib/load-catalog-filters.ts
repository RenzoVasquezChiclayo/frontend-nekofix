import { cache } from "react";
import { API_MAX_LIST_LIMIT } from "@/lib/mappers/base-query.mapper";
import { sortCatalogByName, sortSeriesByName } from "@/lib/product-field-resolvers";
import {
  filterCategoriesByCatalogType,
  resolveCategoryCatalogType,
} from "@/lib/product-catalog-type";
import { emptyListResponse } from "@/lib/normalize-api-list";
import type { ApiListResponse } from "@/types/api";
import { getBrands } from "@/services/brand.service";
import { getCategories } from "@/services/category.service";
import { getPhoneModels } from "@/services/phone-model.service";
import { getPhoneSeries } from "@/services/series.service";
import { getProductConditions } from "@/services/product-conditions.service";
import { getProductGrades } from "@/services/product-grades.service";
import type {
  PhoneSeries,
  ProductConditionCatalog,
  ProductGradeCatalog,
} from "@/types/catalog-admin";
import type { Brand, Category, PhoneModel } from "@/types/product";

const LIST_LIMIT = API_MAX_LIST_LIMIT;

function catchCatalogListError<T>(label: string) {
  return (err: unknown): ApiListResponse<T> => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[catalog-filters] ${label}:`, err);
    }
    return emptyListResponse<T>();
  };
}

export type CatalogFilterMode = "store" | "spare_parts";

export type CatalogFilterOptions = {
  brands: Brand[];
  categories: Category[];
  models: PhoneModel[];
  series: PhoneSeries[];
  conditions: ProductConditionCatalog[];
  grades: ProductGradeCatalog[];
};

async function fetchAllCategoriesForStore(): Promise<Category[]> {
  const [deviceRes, accessoryRes] = await Promise.all([
    getCategories({ catalogType: "DEVICE", limit: LIST_LIMIT }).catch(
      catchCatalogListError<Category>("categories DEVICE")
    ),
    getCategories({ catalogType: "ACCESSORY", limit: LIST_LIMIT }).catch(
      catchCatalogListError<Category>("categories ACCESSORY")
    ),
  ]);
  const merged = [...deviceRes.data, ...accessoryRes.data];
  const unique = new Map<string, Category>();
  for (const c of merged) {
    if (resolveCategoryCatalogType(c) === "SPARE_PART") continue;
    unique.set(c.id, c);
  }
  return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

async function loadStoreFilterOptions(): Promise<CatalogFilterOptions> {
  const [brandsRes, categories, modelsRes, seriesRes, conditionsRes, gradesRes] =
    await Promise.all([
      getBrands().catch(catchCatalogListError<Brand>("brands")),
      fetchAllCategoriesForStore(),
      getPhoneModels({ limit: LIST_LIMIT }).catch(catchCatalogListError<PhoneModel>("models")),
      getPhoneSeries({ limit: LIST_LIMIT, isActive: true }).catch(
        catchCatalogListError<PhoneSeries>("phone-series")
      ),
      getProductConditions({ catalogType: "DEVICE", limit: LIST_LIMIT, isActive: true }).catch(
        catchCatalogListError<ProductConditionCatalog>("conditions DEVICE")
      ),
      getProductGrades({ catalogType: "DEVICE", limit: LIST_LIMIT, isActive: true }).catch(
        catchCatalogListError<ProductGradeCatalog>("grades DEVICE")
      ),
    ]);

  return {
    brands: brandsRes.data.sort((a, b) => a.name.localeCompare(b.name, "es")),
    categories,
    models: modelsRes.data.sort((a, b) => a.name.localeCompare(b.name, "es")),
    series: sortSeriesByName(seriesRes.data),
    conditions: sortCatalogByName(conditionsRes.data),
    grades: sortCatalogByName(gradesRes.data),
  };
}

async function loadSparePartsFilterOptions(): Promise<CatalogFilterOptions> {
  const [brandsRes, categoriesRes, modelsRes, conditionsRes] = await Promise.all([
    getBrands().catch(catchCatalogListError<Brand>("brands")),
    getCategories({ catalogType: "SPARE_PART", limit: LIST_LIMIT }).catch(
      catchCatalogListError<Category>("categories SPARE_PART")
    ),
    getPhoneModels({ limit: LIST_LIMIT }).catch(catchCatalogListError<PhoneModel>("models")),
    getProductConditions({
      catalogType: "SPARE_PART",
      limit: LIST_LIMIT,
      isActive: true,
    }).catch(catchCatalogListError<ProductConditionCatalog>("conditions SPARE_PART")),
  ]);

  const categories = filterCategoriesByCatalogType(categoriesRes.data, "SPARE_PART");

  return {
    brands: brandsRes.data.sort((a, b) => a.name.localeCompare(b.name, "es")),
    categories: categories.sort((a, b) => a.name.localeCompare(b.name, "es")),
    models: modelsRes.data.sort((a, b) => a.name.localeCompare(b.name, "es")),
    series: [],
    conditions: sortCatalogByName(conditionsRes.data),
    grades: [],
  };
}

/** Carga deduplicada por request (React `cache`) de opciones de filtros del catálogo. */
export const loadCatalogFilterOptions = cache(
  async (mode: CatalogFilterMode): Promise<CatalogFilterOptions> => {
    if (mode === "spare_parts") return loadSparePartsFilterOptions();
    return loadStoreFilterOptions();
  }
);
