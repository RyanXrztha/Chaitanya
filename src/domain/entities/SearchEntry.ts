import type { ImageRef } from "../value-objects/Image";

export type SearchKind = "Services" | "Products" | "Pages";

/** Site pages addressable from search; the presentation layer maps them to routes. */
export type PageKey =
  | "home"
  | "about"
  | "services"
  | "products"
  | "booking"
  | "membership"
  | "reviews"
  | "contact"
  | "sign-in"
  | "faqs"
  | "careers"
  | "terms";

export type SearchTarget =
  | { type: "service"; slug: string }
  | { type: "product"; slug: string }
  | { type: "page"; page: PageKey };

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** e.g. "Relaxation Therapy · NPR 4,000" or "Our story, values and team". */
  subtitle: string;
  category: string | null;
  priceLabel: string | null;
  thumbnail: ImageRef | null;
  target: SearchTarget;
  /** Extra words that should match (category names, synonyms). */
  keywords: string;
}
