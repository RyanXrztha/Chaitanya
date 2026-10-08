import type { BookingFlow, PageKey, SearchTarget } from "@/domain";

export const PAGE_PATHS: Record<PageKey | "privacy", string> = {
  home: "/",
  about: "/about",
  services: "/services",
  products: "/products",
  booking: "/booking",
  membership: "/membership",
  reviews: "/reviews",
  contact: "/contact",
  "sign-in": "/sign-in",
  faqs: "/info/faqs",
  careers: "/info/careers",
  terms: "/info/terms",
  privacy: "/info/privacy",
};

function withQuery(path: string, params: Record<string, string | null | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

export const routes = {
  page: (key: keyof typeof PAGE_PATHS) => PAGE_PATHS[key],
  services: (p: { cat?: string; sub?: string; tab?: string; q?: string } = {}) => withQuery("/services", p),
  service: (slug: string) => `/services/${slug}`,
  products: (p: { cat?: string; q?: string } = {}) => withQuery("/products", p),
  product: (slug: string) => `/products/${slug}`,
  booking: (p: { service?: string; flow?: BookingFlow; duration?: string } = {}) => withQuery("/booking", p),
  /** Contact form, optionally pre-filled (e.g. from a membership plan). */
  contact: (p: { subject?: string; plan?: string } = {}) => withQuery("/contact", p) + (p.subject || p.plan ? "#message" : ""),
  signIn: (p: { mode?: "signup" } = {}) => withQuery("/sign-in", p),
};

export const INFO_PAGES = ["faqs", "careers", "terms", "privacy"] as const;
export type InfoPageKey = (typeof INFO_PAGES)[number];

export function searchTargetHref(target: SearchTarget): string {
  switch (target.type) {
    case "service":
      return routes.service(target.slug);
    case "product":
      return routes.product(target.slug);
    case "page":
      return PAGE_PATHS[target.page];
  }
}

export type NavKey = "home" | "about" | "services" | "products" | "membership" | "reviews" | "contact";

export const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: PAGE_PATHS.home },
  { key: "about", label: "About Us", href: PAGE_PATHS.about },
  { key: "services", label: "Services", href: PAGE_PATHS.services },
  { key: "products", label: "Products", href: PAGE_PATHS.products },
  { key: "membership", label: "Membership", href: PAGE_PATHS.membership },
  { key: "reviews", label: "Reviews", href: PAGE_PATHS.reviews },
  { key: "contact", label: "Contact", href: PAGE_PATHS.contact },
];

/** Which nav item is current for a pathname (booking belongs to Services). */
export function navKeyForPath(pathname: string): NavKey | null {
  if (pathname === "/") return "home";
  const seg = pathname.split("/")[1];
  if (seg === "booking") return "services";
  return NAV_ITEMS.some((i) => i.key === seg) ? (seg as NavKey) : null;
}
