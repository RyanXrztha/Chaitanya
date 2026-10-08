import type { ProductGroup, ProductGroupKey, ProductSize } from "@/domain";

// Merged from Products.dc.html (group, badge) and ProductDetail.dc.html (copy, rating, sizes).

export interface RawProduct {
  id: number;
  name: string;
  category: string;
  group: ProductGroupKey;
  price: number;
  badge: string;
  rating: number;
  reviews: number;
  description: string;
  ingredients: string;
  use: string;
}

export const RAW_PRODUCTS: RawProduct[] = [
  {
    id: 1,
    name: "Beetroot Powder",
    category: "Superfood Powder",
    group: "Powders",
    price: 250,
    badge: "Bestseller",
    rating: 4.8,
    reviews: 64,
    description:
      "Sun-dried, stone-milled beetroot rich in natural nitrates and iron. Stir into smoothies, juices or warm water for everyday energy and healthy circulation.",
    ingredients: "100% organic beetroot, dried at low temperature and finely milled. Nothing added.",
    use: "Mix 1 teaspoon (5g) into water, juice or a smoothie once a day. Best taken in the morning.",
  },
  {
    id: 2,
    name: "Flax Seed Oil",
    category: "Cold-Pressed Oil",
    group: "Oils",
    price: 250,
    badge: "Cold-pressed",
    rating: 4.7,
    reviews: 41,
    description:
      "Cold-pressed flax seed oil, a plant source of omega-3 that supports heart health, digestion and glowing skin.",
    ingredients: "Pure cold-pressed flax (linseed) oil. Unrefined and unfiltered.",
    use: "Take 1 teaspoon daily or drizzle over salads. Do not heat. Refrigerate after opening.",
  },
  {
    id: 3,
    name: "Hibiscus Powder",
    category: "Herbal Powder",
    group: "Powders",
    price: 250,
    badge: "New",
    rating: 4.6,
    reviews: 28,
    description:
      "Vibrant hibiscus petal powder for hair masks, face packs and calming herbal teas, naturally rich in antioxidants.",
    ingredients: "100% hibiscus flower petals, shade-dried and powdered.",
    use: "For hair: mix with water or yogurt, apply for 30 minutes. For tea: steep ½ teaspoon in hot water.",
  },
  {
    id: 4,
    name: "Kodali Pancake Mix",
    category: "Healthy Kitchen",
    group: "Kitchen",
    price: 250,
    badge: "Millet-based",
    rating: 4.7,
    reviews: 35,
    description: "A wholesome pancake mix made with kodo millet — high in fibre, gluten-light and ready in minutes.",
    ingredients: "Kodo millet flour, whole wheat flour, jaggery, baking soda, rock salt.",
    use: "Whisk 1 cup mix with ¾ cup milk or water. Cook on a lightly oiled pan for 2 minutes per side.",
  },
  {
    id: 5,
    name: "Milk Thistle Powder",
    category: "Herbal Powder",
    group: "Powders",
    price: 250,
    badge: "Liver care",
    rating: 4.8,
    reviews: 22,
    description:
      "Traditionally used to support liver function and gentle detoxification, finely ground from whole milk thistle seeds.",
    ingredients: "100% milk thistle seeds, ground.",
    use: "Take ½ teaspoon with warm water after meals, once or twice a day. Consult a physician if pregnant.",
  },
  {
    id: 6,
    name: "Multani Mitti",
    category: "Natural Skincare",
    group: "Skincare",
    price: 250,
    badge: "Skincare",
    rating: 4.9,
    reviews: 57,
    description:
      "Pure fuller’s earth clay that draws out impurities, controls oil and leaves skin soft and refreshed.",
    ingredients: "100% natural fuller’s earth (multani mitti), sieved and sun-dried.",
    use: "Mix with rose water to a smooth paste. Apply for 10–15 minutes, then rinse with lukewarm water.",
  },
];

export const PRODUCT_GROUPS: ProductGroup[] = [
  { key: "Powders", label: "Powders", blurb: "Superfood and herbal powders for everyday nourishment." },
  { key: "Oils", label: "Oils", blurb: "Cold-pressed oils, rich in natural nutrients." },
  { key: "Skincare", label: "Skincare", blurb: "Gentle, natural care for your skin." },
  { key: "Kitchen", label: "Kitchen", blurb: "Wholesome, millet-based kitchen staples." },
];

export const PRODUCT_SIZES: ProductSize[] = [
  { label: "100 g", multiplier: 1 },
  { label: "250 g", multiplier: 2.2 },
  { label: "500 g", multiplier: 4 },
];
