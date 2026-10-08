import {
  basePrice,
  baseMinutes,
  isInCategory,
  NotFoundError,
  type Minutes,
  type Service,
  type ServiceCategory,
  type ServiceRepository,
  type ServiceSubCategory,
} from "@/domain";

export const SERVICE_PAGE_SIZE = 12;
export const SERVICE_PRICE_MAX = 25_000;
export const DEFAULT_SERVICE_CATEGORY = "featured";
export const DEFAULT_PACKAGE_TAB = "beauty";
/** Duration filter shows this many chips before "Show N more". */
export const DURATION_FACET_LIMIT = 6;

export type ServiceSort = "featured" | "az" | "popular" | "newest";

export const SERVICE_SORT_OPTIONS: { value: ServiceSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "az", label: "A – Z" },
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
];

export interface ServiceBrowseCriteria {
  category?: string;
  subCategory?: string | null;
  packageTab?: string;
  query?: string;
  /** Search across all categories rather than within the current one. */
  searchAll?: boolean;
  durations?: Minutes[];
  priceMin?: number;
  priceMax?: number;
  sort?: ServiceSort;
  limit?: number;
}

export interface DurationFacet {
  minutes: Minutes;
  /** Matches in the current scope (ignoring the duration filter itself). */
  count: number;
  selected: boolean;
}

export interface ServiceBrowseResult {
  category: ServiceCategory;
  subCategory: ServiceSubCategory | null;
  packageTab: string;
  /** Package tabs are hidden while a search query is active. */
  showPackageTabs: boolean;
  items: Service[];
  total: number;
  hasMore: boolean;
  durationFacets: DurationFacet[];
  /** Number of active duration/price filters (for the badge on "Categories"). */
  activeFilterCount: number;
}

export interface ServiceCategorySummary extends ServiceCategory {
  count: number;
  subCategories: (ServiceSubCategory & { count: number })[];
}

function queryTerms(q: string | undefined): string[] {
  return (q ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);
}

/** Category tree with service counts, for the filter drawer and header menu. */
export class GetServiceCategoriesUseCase {
  constructor(private readonly services: ServiceRepository) {}

  async execute(): Promise<ServiceCategorySummary[]> {
    const [categories, services] = await Promise.all([this.services.listCategories(), this.services.listServices()]);
    return categories.map((c) => ({
      ...c,
      count: services.filter((s) => isInCategory(s, c.key)).length,
      subCategories: c.subCategories.map((sub) => ({
        ...sub,
        count: services.filter((s) => isInCategory(s, c.key) && s.subCategoryKey === sub.key).length,
      })),
    }));
  }
}

/** The Services list page: category scope, search, duration/price filters, sort, "Load more". */
export class BrowseServicesUseCase {
  constructor(private readonly services: ServiceRepository) {}

  async execute(criteria: ServiceBrowseCriteria = {}): Promise<ServiceBrowseResult> {
    const [categories, all] = await Promise.all([this.services.listCategories(), this.services.listServices()]);

    const category =
      categories.find((c) => c.key === criteria.category) ??
      categories.find((c) => c.key === DEFAULT_SERVICE_CATEGORY) ??
      categories[0];
    const subCategory = category.subCategories.find((s) => s.key === criteria.subCategory) ?? null;
    const packageTab = criteria.packageTab ?? DEFAULT_PACKAGE_TAB;
    const terms = queryTerms(criteria.query);
    const durations = criteria.durations ?? [];
    const priceMin = criteria.priceMin ?? 0;
    const priceMax = criteria.priceMax ?? SERVICE_PRICE_MAX;
    const limit = criteria.limit ?? SERVICE_PAGE_SIZE;
    const searchingAll = terms.length > 0 && !!criteria.searchAll;

    const inCategory = (s: Service) =>
      isInCategory(s, category.key) &&
      (!subCategory || s.subCategoryKey === subCategory.key) &&
      (category.key !== "package" || s.packageTab === packageTab);
    const inScope = (s: Service) => searchingAll || inCategory(s);
    const matchesQuery = (s: Service) => {
      const hay = `${s.name} ${s.subLabel} ${s.categoryLabel}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    };
    const priceOk = (s: Service) => basePrice(s) >= priceMin && basePrice(s) <= priceMax;
    const durationOk = (s: Service) => !durations.length || durations.includes(baseMinutes(s));

    const base = all.filter((s) => inScope(s) && matchesQuery(s));
    const list = sortServices(base.filter((s) => durationOk(s) && priceOk(s)), criteria.sort ?? "featured");

    const priceScoped = base.filter(priceOk);
    const facetMinutes = [...new Set(all.filter(inScope).map(baseMinutes))].sort((a, b) => a - b);

    return {
      category,
      subCategory,
      packageTab,
      showPackageTabs: category.key === "package" && terms.length === 0,
      items: list.slice(0, limit),
      total: list.length,
      hasMore: list.length > limit,
      durationFacets: facetMinutes.map((m) => ({
        minutes: m,
        count: priceScoped.filter((s) => baseMinutes(s) === m).length,
        selected: durations.includes(m),
      })),
      activeFilterCount: durations.length + (priceMin > 0 || priceMax < SERVICE_PRICE_MAX ? 1 : 0),
    };
  }
}

export function sortServices(list: Service[], sort: ServiceSort): Service[] {
  const rank = (s: Service) => s.featuredRank ?? 999;
  const out = [...list];
  switch (sort) {
    case "featured":
      return out.sort((a, b) => rank(a) - rank(b));
    case "az":
      return out.sort((a, b) => a.name.localeCompare(b.name));
    case "popular":
      return out.sort((a, b) => rank(a) - rank(b) || basePrice(b) - basePrice(a));
    case "newest":
      return out.sort((a, b) => b.id - a.id);
  }
}

export interface ServiceDetail {
  service: Service;
  category: ServiceCategory;
  related: Service[];
}

export class GetServiceDetailUseCase {
  constructor(private readonly services: ServiceRepository) {}

  async execute(slug: string): Promise<ServiceDetail> {
    const service = await this.services.findBySlug(slug);
    if (!service) throw new NotFoundError("Service", slug);
    const [categories, all] = await Promise.all([this.services.listCategories(), this.services.listServices()]);
    const category = categories.find((c) => c.key === service.categoryKey) ?? categories[0];
    const related = all
      .filter((s) => s.id !== service.id && s.categoryKey === service.categoryKey)
      .slice(0, 4);
    return { service, category, related };
  }

  /** Slugs for static generation of every detail page. */
  async slugs(): Promise<string[]> {
    return (await this.services.listServices()).map((s) => s.slug);
  }
}

/** Services in featured order — the home page "Signature Treatments" row. */
export class GetFeaturedServicesUseCase {
  constructor(private readonly services: ServiceRepository) {}

  async execute(categoryKey: string = DEFAULT_SERVICE_CATEGORY, limit?: number): Promise<Service[]> {
    const all = await this.services.listServices();
    const list = sortServices(
      all.filter((s) => isInCategory(s, categoryKey)),
      "featured",
    );
    return limit ? list.slice(0, limit) : list;
  }
}
