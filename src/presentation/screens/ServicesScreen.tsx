import {
  DEFAULT_PACKAGE_TAB,
  DEFAULT_SERVICE_CATEGORY,
  SERVICE_PAGE_SIZE,
  SERVICE_PRICE_MAX,
  SERVICE_SORT_OPTIONS,
  type ServiceSort,
} from "@/application";
import { container } from "@/infrastructure/container";
import { ServiceBrowser, type ServiceCriteria } from "@/presentation/components/features/services/ServiceBrowser";

export type ServiceSearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Reads ?cat=&sub=&tab=&q=&sort= into browse criteria. A bare ?q= searches all categories. */
export function criteriaFromParams(params: ServiceSearchParams): ServiceCriteria {
  const q = one(params.q);
  const cat = one(params.cat);
  const sort = one(params.sort) as ServiceSort;
  return {
    category: cat || DEFAULT_SERVICE_CATEGORY,
    subCategory: one(params.sub) || null,
    packageTab: one(params.tab) || DEFAULT_PACKAGE_TAB,
    query: q,
    searchAll: !!q && !cat,
    durations: [],
    priceMin: 0,
    priceMax: SERVICE_PRICE_MAX,
    sort: SERVICE_SORT_OPTIONS.some((o) => o.value === sort) ? sort : "featured",
    limit: SERVICE_PAGE_SIZE,
  };
}

export async function ServicesScreen({ searchParams }: { searchParams: ServiceSearchParams }) {
  const criteria = criteriaFromParams(searchParams);
  const [categories, result] = await Promise.all([
    container.getServiceCategories.execute(),
    container.browseServices.execute(criteria),
  ]);
  return (
    <ServiceBrowser
      key={JSON.stringify(criteria)}
      categories={categories}
      initialCriteria={{ ...criteria, category: result.category.key, subCategory: result.subCategory?.key ?? null }}
      initialResult={result}
    />
  );
}
