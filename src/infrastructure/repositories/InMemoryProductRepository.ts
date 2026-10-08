import type { Product, ProductRepository } from "@/domain";
import { productImages } from "../data/images";
import { PRODUCT_GROUPS, PRODUCT_SIZES, RAW_PRODUCTS, type RawProduct } from "../data/products.data";
import { slugify } from "../lib/slugify";

function toProduct(p: RawProduct): Product {
  return {
    id: p.id,
    slug: slugify(p.name),
    name: p.name,
    category: p.category,
    group: p.group,
    basePrice: p.price,
    badge: p.badge,
    rating: p.rating,
    reviewCount: p.reviews,
    description: p.description,
    ingredients: p.ingredients,
    howToUse: p.use,
    images: productImages(p.id, p.name),
  };
}

export class InMemoryProductRepository implements ProductRepository {
  private readonly products = RAW_PRODUCTS.map(toProduct);

  async listGroups() {
    return PRODUCT_GROUPS;
  }

  async listProducts() {
    return this.products;
  }

  async listSizes() {
    return PRODUCT_SIZES;
  }

  async findById(id: number) {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async findBySlug(slug: string) {
    return this.products.find((p) => p.slug === slug) ?? null;
  }
}
