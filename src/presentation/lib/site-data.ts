import "server-only";
import { basePrice, formatNpr, type ImageRef } from "@/domain";
import { container } from "@/infrastructure/container";
import { routes } from "./routes";

export interface MegaMenuCategory {
  key: string;
  label: string;
  blurb: string;
  href: string;
  count: number;
  image: ImageRef;
  /** Sub-category chips (or package tabs). */
  chips: { label: string; href: string }[];
  /** First six services in featured order. */
  items: { name: string; href: string; priceLabel: string }[];
}

/** Data for the header's Services mega-menu and mobile accordion. */
export async function getMegaMenu(): Promise<MegaMenuCategory[]> {
  const categories = await container.getServiceCategories.execute();
  return Promise.all(
    categories.map(async (c) => {
      const services = await container.getFeaturedServices.execute(c.key);
      return {
        key: c.key,
        label: c.label,
        blurb: c.blurb,
        href: routes.services({ cat: c.key }),
        count: c.count,
        image: c.image,
        chips: [
          ...c.subCategories.map((s) => ({ label: s.label, href: routes.services({ cat: c.key, sub: s.key }) })),
          ...c.packageTabs.map((t) => ({ label: t.label, href: routes.services({ cat: c.key, tab: t.key }) })),
        ],
        items: services.slice(0, 6).map((s) => ({
          name: s.name,
          href: routes.service(s.slug),
          priceLabel: formatNpr(basePrice(s)),
        })),
      };
    }),
  );
}
