import {
  mapBaseListQuery,
  type BaseListQueryInput,
} from "@/lib/mappers/base-query.mapper";

export type CategoryListFiltersInput = BaseListQueryInput;

export function mapCategoryFiltersToQuery(
  filters: CategoryListFiltersInput
): Record<string, string | number | boolean | undefined> {
  return mapBaseListQuery(filters);
}
