import type { PageKey, SearchEntry } from "@/domain";

// Page entries of the site search (from search-index.js).

const page = (page: PageKey, title: string, subtitle: string, keywords: string): SearchEntry => ({
  kind: "Pages",
  title,
  subtitle,
  category: null,
  priceLabel: null,
  thumbnail: null,
  target: { type: "page", page },
  keywords,
});

export const PAGE_ENTRIES: SearchEntry[] = [
  page("home", "Home", "Chaitanya Health & Wellness", "home landing start"),
  page("about", "About Us", "Our story, values and team", "about story team values mission"),
  page("services", "All Services", "Browse every treatment", "services treatments massage facial"),
  page("products", "All Products", "Natural wellness products", "products shop store"),
  page("booking", "Book an Appointment", "Choose therapist, date and time", "book booking appointment reserve schedule"),
  page("membership", "Membership", "Plans, pricing and benefits", "membership plans tiers pricing member"),
  page("reviews", "Reviews", "What our guests say", "reviews testimonials feedback rating"),
  page("contact", "Contact Us", "Location, phone and hours", "contact phone email address map location hours"),
  page("sign-in", "Sign In", "Access your account", "sign in login account register"),
  page("faqs", "FAQs", "Frequently asked questions", "faq questions help"),
  page("careers", "Careers", "Join our team", "careers jobs hiring work"),
  page("terms", "Terms & Privacy", "Policies", "terms privacy policy legal"),
];
