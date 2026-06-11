import {
  mapBaseListQuery,
  toQueryParams,
  type BaseListQueryInput,
} from "@/lib/mappers/base-query.mapper";
import type { ProductCatalogType } from "@/types/product";

export type CategoryListFiltersInput = BaseListQueryInput & {
  catalogType?: ProductCatalogType;
};

export function mapCategoryFiltersToQuery(
  filters: CategoryListFiltersInput
): Record<string, string | number | boolean | undefined> {
  return {
    ...mapBaseListQuery(filters),
    ...toQueryParams({ catalogType: filters.catalogType }),
  };
}
