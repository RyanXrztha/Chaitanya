import type { Service, ServiceCategory, ServiceRepository } from "@/domain";
import { categoryImage, serviceImages } from "../data/images";
import { FEATURED_ORDER, RAW_CATEGORIES, RAW_SERVICES, type RawCategory, type RawService } from "../data/services.data";
import { slugify } from "../lib/slugify";

const PACKAGE_TAB_LABELS: Record<string, string> = {
  beauty: "Beauty & Salon",
  relax: "Relax & Revitalize",
  wellness: "Wellness Therapies",
};

function toCategory(c: RawCategory): ServiceCategory {
  return {
    key: c.key,
    label: c.label,
    blurb: c.blurb,
    subCategories: c.subs ?? [],
    packageTabs: c.tabs ?? [],
    image: categoryImage(c.key, c.label),
  };
}

function toService(s: RawService, categories: Map<string, RawCategory>, subLabels: Map<string, string>): Service {
  const categoryLabel = categories.get(s.cat)?.label ?? s.cat;
  const subLabel = s.sub
    ? (subLabels.get(s.sub) ?? s.sub)
    : (s.group ?? (s.pkgTab ? `Package · ${PACKAGE_TAB_LABELS[s.pkgTab]}` : categoryLabel));
  const rank = FEATURED_ORDER.indexOf(s.id);
  return {
    id: s.id,
    slug: slugify(s.name),
    name: s.name,
    categoryKey: s.cat,
    categoryLabel,
    subCategoryKey: s.sub,
    subLabel,
    packageTab: s.pkgTab ?? null,
    categoryKeys: s.cats,
    featuredRank: rank < 0 ? null : rank,
    durations: [{ minutes: s.mins, label: s.duration, price: s.price }],
    description: `Part of our ${subLabel} offering. Your therapist will tailor pressure, oils and pacing to your needs during a short consultation before the session.`,
    images: serviceImages(s.id, s.name),
  };
}

/** Service catalogue backed by the static data ported from services-data.js. */
export class InMemoryServiceRepository implements ServiceRepository {
  private readonly categories: ServiceCategory[];
  private readonly services: Service[];
  private readonly byId: Map<number, Service>;
  private readonly bySlug: Map<string, Service>;

  constructor(rawCategories: RawCategory[] = RAW_CATEGORIES, rawServices: RawService[] = RAW_SERVICES) {
    const catMap = new Map(rawCategories.map((c) => [c.key, c]));
    const subLabels = new Map(rawCategories.flatMap((c) => (c.subs ?? []).map((s) => [s.key, s.label] as const)));
    this.categories = rawCategories.map(toCategory);
    this.services = rawServices.map((s) => toService(s, catMap, subLabels));
    this.byId = new Map(this.services.map((s) => [s.id, s]));
    this.bySlug = new Map(this.services.map((s) => [s.slug, s]));
  }

  async listCategories() {
    return this.categories;
  }

  async listServices() {
    return this.services;
  }

  async findById(id: number) {
    return this.byId.get(id) ?? null;
  }

  async findBySlug(slug: string) {
    return this.bySlug.get(slug) ?? null;
  }
}
