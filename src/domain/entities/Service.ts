import type { ImageRef } from "../value-objects/Image";
import type { Minutes } from "../value-objects/Duration";
import type { Npr } from "../value-objects/Money";

export type ServiceCategoryKey = string;
export type ServiceSubCategoryKey = string;

export interface ServiceSubCategory {
  key: ServiceSubCategoryKey;
  label: string;
}

export interface ServiceCategory {
  key: ServiceCategoryKey;
  label: string;
  blurb: string;
  /** Sub-categories (e.g. Relax & Revitalize → Relaxation Therapy, Body Retreat). */
  subCategories: ServiceSubCategory[];
  /** Package tabs — only the "Lifestyle Wellness Package" category has these. */
  packageTabs: ServiceSubCategory[];
  /** Representative photo (header Services menu, category tiles). */
  image: ImageRef;
}

/** One bookable length/price variant of a service. */
export interface ServiceDuration {
  minutes: Minutes;
  /** As published, e.g. "60 mins", "2 hrs", "60 mins + steam". */
  label: string;
  price: Npr;
}

export interface Service {
  id: number;
  slug: string;
  name: string;
  /** Primary category. */
  categoryKey: ServiceCategoryKey;
  categoryLabel: string;
  subCategoryKey: ServiceSubCategoryKey | null;
  /** Sub-category, group or package label shown under the name on cards. */
  subLabel: string;
  /** Package tab key for package services. */
  packageTab: string | null;
  /** Every category the service is listed under (includes "featured"). */
  categoryKeys: ServiceCategoryKey[];
  /** Position in the featured order, or null when not featured. */
  featuredRank: number | null;
  /** At least one option; the first is the default. */
  durations: ServiceDuration[];
  description: string;
  /** Gallery images; the first is the card / main image. */
  images: ImageRef[];
}

export function defaultDuration(service: Service): ServiceDuration {
  return service.durations[0];
}

/** Starting price — used for sorting, filtering and card labels. */
export function basePrice(service: Service): Npr {
  return Math.min(...service.durations.map((d) => d.price));
}

export function baseMinutes(service: Service): Minutes {
  return defaultDuration(service).minutes;
}

export function isInCategory(service: Service, categoryKey: ServiceCategoryKey): boolean {
  return service.categoryKeys.includes(categoryKey);
}
