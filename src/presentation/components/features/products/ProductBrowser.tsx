"use client";

import { useEffect, useRef, useState } from "react";
import {
  PRODUCT_PRICE_MAX,
  PRODUCT_SORT_OPTIONS,
  type ProductBrowseResult,
  type ProductSort,
} from "@/application";
import { formatNpr, type Product } from "@/domain";
import { container } from "@/infrastructure/container";
import { useReplaceQuery } from "@/presentation/hooks/useReplaceQuery";
import { cn } from "@/presentation/lib/cn";
import { routes } from "@/presentation/lib/routes";
import { Button } from "../../ui/Button";
import { CatalogCard, type CatalogCardData } from "../catalog/CatalogCard";
import { CatalogHero } from "../catalog/CatalogHero";
import { CatalogToolbar } from "../catalog/CatalogToolbar";
import { EmptyResults } from "../catalog/EmptyResults";
import { DrawerHeading, FilterDrawer } from "../catalog/FilterDrawer";
import { PriceRange } from "../catalog/PriceRange";

export interface ProductCriteria {
  group: string;
  query: string;
  priceMin: number;
  priceMax: number;
  sort: ProductSort;
}

function toCard(p: Product): CatalogCardData {
  const href = routes.product(p.slug);
  return {
    id: String(p.id),
    href,
    ctaHref: href,
    ctaLabel: "Buy Now",
    label: p.category,
    name: p.name,
    priceLabel: formatNpr(p.basePrice),
    image: p.images[0],
  };
}

/** Products list: same layout system as Services, with group filter, price range and search. */
export function ProductBrowser({ initialCriteria, initialResult }: { initialCriteria: ProductCriteria; initialResult: ProductBrowseResult }) {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [result, setResult] = useState(initialResult);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    let live = true;
    container.browseProducts.execute(criteria).then((r) => live && setResult(r));
    return () => {
      live = false;
    };
  }, [criteria]);

  useReplaceQuery("/products", {
    cat: criteria.group === "All" ? null : criteria.group,
    q: criteria.query.trim() || null,
  });

  const update = (patch: Partial<ProductCriteria>, replay = true) => {
    setCriteria((c) => ({ ...c, ...patch }));
    if (replay) setEpoch((e) => e + 1);
  };

  const { group } = result;

  return (
    <>
      <CatalogHero
        crumbs={[{ label: "Home", href: routes.page("home") }, { label: "Products", href: routes.products() }, { label: group.label }]}
        title={result.title}
      />

      <section className="bg-white px-[clamp(24px,6vw,64px)] pb-[clamp(64px,8vw,96px)]">
        <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} label="Product categories" resultCount={result.total}>
          <DrawerHeading first>Categories</DrawerHeading>
          {result.groups.map((g) => {
            const on = g.key === group.key;
            return (
              <div key={g.key} className="border-b border-line">
                <a
                  href={routes.products({ cat: g.key === "All" ? undefined : g.key })}
                  onClick={(e) => {
                    e.preventDefault();
                    update({ group: g.key });
                    setFiltersOpen(false);
                  }}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "relative flex min-h-[52px] items-center justify-between gap-sm py-sm pl-md font-heading text-[17px] leading-[1.3] no-underline transition-colors duration-250 hover:text-brand",
                    on ? "font-bold text-brand" : "font-medium text-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1/2 left-0 -mt-3 h-6 w-[3px] bg-brand transition-transform duration-350 ease-chy",
                      on ? "scale-y-100" : "scale-y-0",
                    )}
                  />
                  {g.label}
                  <span className="font-body text-[12px] font-medium text-subtle">{g.count}</span>
                </a>
              </div>
            );
          })}

          <DrawerHeading>Price Range</DrawerHeading>
          <PriceRange
            min={criteria.priceMin}
            max={criteria.priceMax}
            limit={PRODUCT_PRICE_MAX}
            step={50}
            minGap={50}
            onChange={(priceMin, priceMax) => update({ priceMin, priceMax }, false)}
          />
          {result.activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => update({ priceMin: 0, priceMax: PRODUCT_PRICE_MAX })}
              className="mt-md mb-sm self-start border-0 bg-transparent p-0 font-body text-[14px] font-medium text-brand underline underline-offset-3"
            >
              Reset filters
            </button>
          )}
        </FilterDrawer>

        <div className="min-w-0">
          <CatalogToolbar
            filtersOpen={filtersOpen}
            onOpenFilters={() => setFiltersOpen(true)}
            activeFilterCount={result.activeFilterCount}
            resultCount={result.total}
            sort={criteria.sort}
            sortOptions={PRODUCT_SORT_OPTIONS}
            onSortChange={(v) => update({ sort: v as ProductSort })}
            query={criteria.query}
            onQueryChange={(query) => update({ query }, false)}
            onSearchSubmit={() => document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            searchPlaceholder="Search products"
            searchLabel="Search products"
          />

          {result.total === 0 && (
            <EmptyResults
              icon={false}
              title="No products match your search"
              text="Try another name or category, or clear your filters."
              actions={
                <Button onClick={() => update({ query: "", priceMin: 0, priceMax: PRODUCT_PRICE_MAX, group: "All" })}>
                  Clear search &amp; filters
                </Button>
              }
            />
          )}

          <div id="catalog-grid" className="grid w-full scroll-mt-40 grid-cols-3 gap-x-3 gap-y-10 max-desktop:grid-cols-2 max-sm:gap-y-lg">
            {result.items.map((p, i) => (
              <CatalogCard key={`${epoch}-${p.id}`} card={toCard(p)} eager={i < 6} style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
