import {
  NotFoundError,
  type Product,
  type ProductGroup,
  type ProductGroupKey,
  type ProductRepository,
  type ProductSize,
} from "@/domain";

export const PRODUCT_PRICE_MAX = 1_000;
export const ALL_PRODUCTS = "All";

export type ProductSort = "featured" | "az" | "low" | "high";

export const PRODUCT_SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "az", label: "A – Z" },
  { value: "low", label: "Price Low – High" },
  { value: "high", label: "Price High – Low" },
];

/** The "All Products" pseudo-group shown first in the category list. */
export const ALL_PRODUCTS_GROUP: Omit<ProductGroup, "key"> & { key: typeof ALL_PRODUCTS } = {
  key: ALL_PRODUCTS,
  label: "All Products",
  blurb: "Herbal powders, cold-pressed oils and natural skincare — the same pure ingredients we use in our therapies.",
};

export type ProductGroupFilter = ProductGroupKey | typeof ALL_PRODUCTS;

export interface ProductBrowseCriteria {
  group?: string;
  query?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: ProductSort;
}

export interface ProductGroupSummary {
  key: ProductGroupFilter;
  label: string;
  blurb: string;
  count: number;
}

export interface ProductBrowseResult {
  group: ProductGroupSummary;
  groups: ProductGroupSummary[];
  /** "Natural Wellness Products" for All, otherwise the group label. */
  title: string;
  items: Product[];
  total: number;
  activeFilterCount: number;
}

export class BrowseProductsUseCase {
  constructor(private readonly products: ProductRepository) {}

  async execute(criteria: ProductBrowseCriteria = {}): Promise<ProductBrowseResult> {
    const [groupList, all] = await Promise.all([this.products.listGroups(), this.products.listProducts()]);
    const groups: ProductGroupSummary[] = [
      { ...ALL_PRODUCTS_GROUP, count: all.length },
      ...groupList.map((g) => ({ ...g, count: all.filter((p) => p.group === g.key).length })),
    ];
    const group = groups.find((g) => g.key === criteria.group) ?? groups[0];
    const terms = (criteria.query ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);
    const priceMin = criteria.priceMin ?? 0;
    const priceMax = criteria.priceMax ?? PRODUCT_PRICE_MAX;

    let items = all.filter(
      (p) =>
        (group.key === ALL_PRODUCTS || p.group === group.key) &&
        p.basePrice >= priceMin &&
        p.basePrice <= priceMax &&
        terms.every((t) => `${p.name} ${p.category} ${p.group}`.toLowerCase().includes(t)),
    );
    if (criteria.sort === "az") items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    if (criteria.sort === "low") items = [...items].sort((a, b) => a.basePrice - b.basePrice);
    if (criteria.sort === "high") items = [...items].sort((a, b) => b.basePrice - a.basePrice);

    return {
      group,
      groups,
      title: group.key === ALL_PRODUCTS ? "Natural Wellness Products" : group.label,
      items,
      total: items.length,
      activeFilterCount: priceMin > 0 || priceMax < PRODUCT_PRICE_MAX ? 1 : 0,
    };
  }
}

export interface ProductDetail {
  product: Product;
  sizes: ProductSize[];
  related: Product[];
}

export class GetProductDetailUseCase {
  constructor(private readonly products: ProductRepository) {}

  async execute(slug: string): Promise<ProductDetail> {
    const product = await this.products.findBySlug(slug);
    if (!product) throw new NotFoundError("Product", slug);
    const [sizes, all] = await Promise.all([this.products.listSizes(), this.products.listProducts()]);
    return { product, sizes, related: all.filter((p) => p.id !== product.id).slice(0, 4) };
  }

  async slugs(): Promise<string[]> {
    return (await this.products.listProducts()).map((p) => p.slug);
  }
}

/** Products for home page / cross-sell rows. */
export class GetProductsUseCase {
  constructor(private readonly products: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.products.listProducts();
  }
}
