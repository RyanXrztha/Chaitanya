import { ALL_PRODUCTS, PRODUCT_PRICE_MAX, PRODUCT_SORT_OPTIONS, type ProductSort } from "@/application";
import { container } from "@/infrastructure/container";
import { ProductBrowser, type ProductCriteria } from "@/presentation/components/features/products/ProductBrowser";

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export async function ProductsScreen({ searchParams }: { searchParams: Params }) {
  const sort = one(searchParams.sort) as ProductSort;
  const criteria: ProductCriteria = {
    group: one(searchParams.cat) || ALL_PRODUCTS,
    query: one(searchParams.q),
    priceMin: 0,
    priceMax: PRODUCT_PRICE_MAX,
    sort: PRODUCT_SORT_OPTIONS.some((o) => o.value === sort) ? sort : "featured",
  };
  const result = await container.browseProducts.execute(criteria);
  return (
    <ProductBrowser
      key={JSON.stringify(criteria)}
      initialCriteria={{ ...criteria, group: result.group.key }}
      initialResult={result}
    />
  );
}
