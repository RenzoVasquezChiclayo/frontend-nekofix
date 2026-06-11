import {
  mapBaseListQuery,
  toQueryParams,
  type BaseListQueryInput,
} from "@/lib/mappers/base-query.mapper";
import type { ProductCatalogType } from "@/types/product";

export type CatalogAdminListFilters = BaseListQueryInput & {
  brandId?: string;
  catalogType?: ProductCatalogType;
  isActive?: boolean;
};

export function mapCatalogAdminListQuery(
  filters: CatalogAdminListFilters
): Record<string, string | number | boolean | undefined> {
  return {
    ...mapBaseListQuery(filters),
    ...toQueryParams({
      brandId: filters.brandId,
      catalogType: filters.catalogType,
      isActive: filters.isActive,
    }),
  };
}
