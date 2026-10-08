import {
  basePrice,
  formatNpr,
  type PageIndexRepository,
  type ProductRepository,
  type SearchEntry,
  type SearchKind,
  type ServiceRepository,
} from "@/domain";

/** Suggestion chips shown before the guest types. */
export const POPULAR_SEARCHES = ["Massage", "Facial", "Shirodhara", "Detox", "Beetroot", "Membership"];
export const SEARCH_KIND_ORDER: SearchKind[] = ["Services", "Products", "Pages"];
const DEFAULT_LIMIT = 30;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ");
}

interface IndexedEntry {
  entry: SearchEntry;
  title: string;
  haystack: string;
}

export interface SearchResultGroup {
  kind: SearchKind;
  entries: SearchEntry[];
}

/** Site-wide search across services, products and pages (header search overlay). */
export class SearchSiteUseCase {
  private index: Promise<IndexedEntry[]> | null = null;

  constructor(
    private readonly services: ServiceRepository,
    private readonly products: ProductRepository,
    private readonly pages: PageIndexRepository,
  ) {}

  /** Ranked results: title prefix > word prefix > title substring > keyword match. */
  async execute(query: string, limit = DEFAULT_LIMIT): Promise<SearchEntry[]> {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const scored: { entry: SearchEntry; score: number }[] = [];
    for (const it of await this.getIndex()) {
      let score = 0;
      let ok = true;
      for (const t of terms) {
        if (!it.haystack.includes(t)) {
          ok = false;
          break;
        }
        if (it.title.startsWith(t)) score += 6;
        else if (it.title.includes(" " + t)) score += 4;
        else if (it.title.includes(t)) score += 2;
        else score += 1;
      }
      if (ok) scored.push({ entry: it.entry, score });
    }
    scored.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
    return scored.slice(0, limit).map((s) => s.entry);
  }

  /** Same as execute, grouped by kind in display order (empty groups omitted). */
  async grouped(query: string, limit = DEFAULT_LIMIT): Promise<SearchResultGroup[]> {
    const results = await this.execute(query, limit);
    return SEARCH_KIND_ORDER.map((kind) => ({ kind, entries: results.filter((r) => r.kind === kind) })).filter(
      (g) => g.entries.length > 0,
    );
  }

  private getIndex(): Promise<IndexedEntry[]> {
    this.index ??= this.buildIndex().catch((e) => {
      this.index = null;
      throw e;
    });
    return this.index;
  }

  private async buildIndex(): Promise<IndexedEntry[]> {
    const [categories, services, products, pages] = await Promise.all([
      this.services.listCategories(),
      this.services.listServices(),
      this.products.listProducts(),
      this.pages.listPages(),
    ]);
    const catLabel = new Map(categories.map((c) => [c.key, c.label]));

    const entries: SearchEntry[] = [
      ...services.map<SearchEntry>((s) => {
        const price = formatNpr(basePrice(s));
        // Packages are labelled by their category in search ("Lifestyle Wellness
        // Package"), not by the card label ("Package · Relax & Revitalize").
        const category = s.packageTab ? s.categoryLabel : s.subLabel;
        return {
          kind: "Services",
          title: s.name,
          subtitle: `${category} · ${price}`,
          category,
          priceLabel: price,
          thumbnail: s.images[0] ?? null,
          target: { type: "service", slug: s.slug },
          keywords: `${s.categoryKeys.map((k) => catLabel.get(k) ?? k).join(" ")} treatment therapy spa`,
        };
      }),
      ...products.map<SearchEntry>((p) => {
        const price = formatNpr(p.basePrice, { decimals: true });
        return {
          kind: "Products",
          title: p.name,
          subtitle: `${p.category} · ${price}`,
          category: p.category,
          priceLabel: price,
          thumbnail: p.images[0] ?? null,
          target: { type: "product", slug: p.slug },
          keywords: `${p.category} shop buy product`,
        };
      }),
      ...pages,
    ];

    return entries.map((entry) => ({
      entry,
      title: normalize(entry.title),
      haystack: normalize(`${entry.title} ${entry.subtitle} ${entry.keywords}`),
    }));
  }
}
