import type { ImageRef } from "../value-objects/Image";
import type { Npr } from "../value-objects/Money";

export type ProductGroupKey = "Powders" | "Oils" | "Skincare" | "Kitchen";

export interface ProductGroup {
  key: ProductGroupKey;
  label: string;
  blurb: string;
}

/** Pack size; price scales from the 100 g base price by `multiplier`. */
export interface ProductSize {
  label: string;
  multiplier: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  /** Descriptive category, e.g. "Superfood Powder". */
  category: string;
  group: ProductGroupKey;
  /** Price of the smallest pack size. */
  basePrice: Npr;
  badge: string;
  rating: number;
  reviewCount: number;
  /** Shown under the "Benefits" tab. */
  description: string;
  ingredients: string;
  howToUse: string;
  /** Gallery images; the first is the card / main image. */
  images: ImageRef[];
}

export function priceForSize(product: Product, size: ProductSize): Npr {
  return Math.round(product.basePrice * size.multiplier);
}
