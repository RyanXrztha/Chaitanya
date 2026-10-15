import "server-only";
import { basePrice, formatAmount, formatNpr } from "@/domain";
import { container } from "@/infrastructure/container";
import type { ShowcaseProduct } from "../components/features/home/ProductShowcase";
import type { TreatmentTab } from "../components/features/home/SignatureTreatments";
import type { TestimonialCard } from "../components/features/home/Testimonials";

/** Categories shown as tabs in "Signature Treatments" (prototype had placeholder tabs). */
const TREATMENT_TAB_KEYS = ["featured", "relax", "wellness", "beauty"];
const TREATMENTS_PER_TAB = 10;

export interface HomeData {
  treatmentTabs: TreatmentTab[];
  products: ShowcaseProduct[];
  testimonials: TestimonialCard[];
  enquiryTreatments: string[];
}

export async function getHomeData(): Promise<HomeData> {
  const [categories, products, reviews] = await Promise.all([
    container.getServiceCategories.execute(),
    container.getProducts.execute(),
    container.getFeaturedReviews.execute(),
  ]);

  const treatmentTabs = await Promise.all(
    TREATMENT_TAB_KEYS.map(async (key) => {
      const category = categories.find((c) => c.key === key);
      const services = await container.getFeaturedServices.execute(key, TREATMENTS_PER_TAB);
      return {
        key,
        label: category?.label ?? key,
        items: services.map((s) => ({
          slug: s.slug,
          title: s.name,
          category: s.subLabel,
          price: formatNpr(basePrice(s)),
          image: s.images[0],
        })),
      };
    }),
  );

  return {
    treatmentTabs,
    products: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: formatAmount(p.basePrice, { decimals: true }),
      image: p.images[0],
    })),
    testimonials: reviews.map(({ id, author, role, rating, quote, avatar }) => ({ id, author, role, rating, quote, avatar })),
    enquiryTreatments: ["Free Consultation", ...categories.filter((c) => c.key !== "featured").map((c) => c.label)],
  };
}
