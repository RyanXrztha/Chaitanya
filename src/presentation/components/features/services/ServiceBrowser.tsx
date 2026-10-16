"use client";

import { useEffect, useRef, useState } from "react";
import {
  DURATION_FACET_LIMIT,
  SERVICE_PAGE_SIZE,
  SERVICE_PRICE_MAX,
  SERVICE_SORT_OPTIONS,
  type ServiceBrowseCriteria,
  type ServiceBrowseResult,
  type ServiceCategorySummary,
  type ServiceSort,
} from "@/application";
import { basePrice, formatMinutes, formatNpr, type Service } from "@/domain";
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

export type ServiceCriteria = Required<Omit<ServiceBrowseCriteria, "subCategory">> & { subCategory: string | null };

function toCard(s: Service): CatalogCardData {
  return {
    id: String(s.id),
    href: routes.service(s.slug),
    ctaHref: routes.booking({ service: s.slug }),
    ctaLabel: "Book Now",
    label: s.categoryLabel,
    name: s.name,
    priceLabel: formatNpr(basePrice(s)),
    image: s.images[0],
  };
}

interface ServiceBrowserProps {
  categories: ServiceCategorySummary[];
  initialCriteria: ServiceCriteria;
  initialResult: ServiceBrowseResult;
}

/** Services list: hero, sticky toolbar, filter drawer and the paginated card grid. */
export function ServiceBrowser({ categories, initialCriteria, initialResult }: ServiceBrowserProps) {
  const [criteria, setCriteria] = useState<ServiceCriteria>(initialCriteria);
  const [result, setResult] = useState(initialResult);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [durMore, setDurMore] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ [initialCriteria.category]: true });
  /** Bumped when the result set changes so cards replay their entrance. */
  const [epoch, setEpoch] = useState(0);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    let live = true;
    container.browseServices.execute(criteria).then((r) => live && setResult(r));
    return () => {
      live = false;
    };
  }, [criteria]);

  useReplaceQuery("/services", {
    cat: criteria.category,
    sub: criteria.subCategory,
    tab: criteria.category === "package" ? criteria.packageTab : null,
    q: criteria.query.trim() || null,
  });

  const update = (patch: Partial<ServiceCriteria>, replay = true) => {
    setCriteria((c) => ({ ...c, limit: SERVICE_PAGE_SIZE, ...patch }));
    if (replay) setEpoch((e) => e + 1);
  };

  const pick = (category: string, subCategory: string | null) => {
    update({ category, subCategory, query: "", searchAll: false });
    setExpanded((x) => ({ ...x, [category]: true }));
    setFiltersOpen(false);
    if (window.matchMedia("(max-width: 960px)").matches) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { category, subCategory } = result;
  const title = subCategory?.label ?? category.label;
  const durationFacets = result.durationFacets;
  const visibleFacets =
    durationFacets.length > DURATION_FACET_LIMIT && !durMore
      ? [...durationFacets.slice(0, DURATION_FACET_LIMIT), ...durationFacets.slice(DURATION_FACET_LIMIT).filter((f) => f.selected)]
      : durationFacets;
  const hasQuery = criteria.query.trim().length > 0;
  const resetFilters = () => update({ durations: [], priceMin: 0, priceMax: SERVICE_PRICE_MAX });

  return (
    <>
      <CatalogHero
        crumbs={[
          { label: "Home", href: routes.page("home") },
          { label: "Services", href: routes.services() },
          { label: category.label },
          ...(subCategory ? [{ label: subCategory.label }] : []),
        ]}
        title={title}
      />

      <section className="bg-white px-[clamp(24px,6vw,64px)] pb-[clamp(64px,8vw,96px)]">
        <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} label="Service categories" resultCount={result.total}>
          <DrawerHeading first>Categories</DrawerHeading>
          {categories.map((c) => {
            const on = c.key === category.key;
            const exp = !!expanded[c.key] && c.subCategories.length > 0;
            return (
              <div key={c.key} className="border-b border-line">
                <div className="flex items-center gap-sm">
                  <a
                    href={routes.services({ cat: c.key })}
                    onClick={(e) => {
                      e.preventDefault();
                      pick(c.key, null);
                    }}
                    aria-current={on && !subCategory ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-[52px] min-w-0 flex-1 items-center py-sm pl-md font-heading text-[17px] leading-[1.3] no-underline transition-colors duration-250 hover:text-brand",
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
                    {c.label}
                  </a>
                  {c.subCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((x) => ({ ...x, [c.key]: !x[c.key] }))}
                      aria-label={`${exp ? "Collapse" : "Expand"} ${c.label}`}
                      aria-expanded={exp}
                      className="flex size-10 flex-none items-center justify-center rounded-control border-0 bg-transparent text-ink-dark hover:bg-brand-100 hover:text-brand"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("transition-transform duration-350 ease-chy", exp && "rotate-180")}>
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  )}
                </div>
                {c.subCategories.length > 0 && (
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-[400ms,300ms] ease-chy",
                      exp ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden" inert={!exp}>
                      <div className="flex flex-col gap-1 pb-md pl-md">
                        {c.subCategories.map((s) => {
                          const son = on && subCategory?.key === s.key;
                          return (
                            <a
                              key={s.key}
                              href={routes.services({ cat: c.key, sub: s.key })}
                              onClick={(e) => {
                                e.preventDefault();
                                pick(c.key, s.key);
                              }}
                              aria-current={son ? "page" : undefined}
                              className={cn(
                                "flex min-h-10 items-center gap-sm rounded-chip px-md font-body text-[14.5px] no-underline transition-colors duration-250",
                                son ? "bg-brand font-bold text-white hover:text-white" : "font-medium text-ink-2 hover:bg-brand-100 hover:text-brand",
                              )}
                            >
                              {s.label}
                              <span className={cn("ml-auto text-[12px]", son ? "text-white/80" : "text-subtle")}>{s.count}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <DrawerHeading>Duration</DrawerHeading>
          <div className="flex flex-wrap gap-sm">
            {visibleFacets.map((f) => (
              <button
                key={f.minutes}
                type="button"
                role="checkbox"
                aria-checked={f.selected}
                onClick={() =>
                  update({
                    durations: f.selected
                      ? criteria.durations.filter((m) => m !== f.minutes)
                      : [...criteria.durations, f.minutes],
                  })
                }
                className={cn(
                  "inline-flex h-10 items-center gap-sm rounded-control border px-md font-body text-[14px] font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-200 hover:border-brand",
                  f.selected ? "border-brand bg-brand text-white" : "border-line-3 bg-white text-ink",
                  !f.selected && f.count === 0 && "opacity-45",
                )}
              >
                {formatMinutes(f.minutes)}
                <span className={cn("text-[12px] font-semibold", f.selected ? "text-white/80" : "text-subtle")}>{f.count}</span>
              </button>
            ))}
          </div>
          {durationFacets.length > DURATION_FACET_LIMIT && (
            <button
              type="button"
              onClick={() => setDurMore((m) => !m)}
              className="mt-sm inline-flex items-center gap-1 self-start border-0 bg-transparent p-0 font-body text-[13.5px] font-medium text-brand"
            >
              {durMore ? "Show fewer" : `Show ${durationFacets.length - DURATION_FACET_LIMIT} more`}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("transition-transform duration-300", durMore && "rotate-180")}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}

          <DrawerHeading>Price Range</DrawerHeading>
          <PriceRange
            min={criteria.priceMin}
            max={criteria.priceMax}
            limit={SERVICE_PRICE_MAX}
            step={250}
            minGap={250}
            onChange={(priceMin, priceMax) => update({ priceMin, priceMax }, false)}
          />
          {result.activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-md mb-sm self-start border-0 bg-transparent p-0 font-body text-[14px] font-medium text-brand underline underline-offset-3"
            >
              Reset filters ({result.activeFilterCount})
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
            sortOptions={SERVICE_SORT_OPTIONS}
            onSortChange={(v) => update({ sort: v as ServiceSort })}
            query={criteria.query}
            onQueryChange={(query) => update({ query }, false)}
            onSearchSubmit={() => document.getElementById("catalog-grid")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            searchPlaceholder={criteria.searchAll && hasQuery ? "Search all services" : `Search in ${category.label}`}
            searchLabel="Search services"
          />

          {result.showPackageTabs && (
            <div role="tablist" aria-label="Package type" className="mb-xl flex flex-wrap gap-sm">
              {category.packageTabs.map((t) => {
                const sel = t.key === result.packageTab;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={sel}
                    onClick={() => update({ packageTab: t.key })}
                    className={cn(
                      "h-11 rounded-control border px-lg font-body text-[14.5px] font-medium transition-[background-color,color,border-color] duration-300",
                      sel ? "border-ink-dark bg-ink-dark text-white" : "border-line-3 bg-white text-ink-dark hover:border-ink-dark",
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}

          {result.total === 0 && (
            <EmptyResults
              title={hasQuery ? `No services match “${criteria.query.trim()}”` : "No services match these filters"}
              text="Try a broader term like “facial”, “scrub” or “Ayurvedic”, or search across every category."
              actions={
                <>
                  <Button
                    onClick={() =>
                      update({ query: "", searchAll: false, durations: [], priceMin: 0, priceMax: SERVICE_PRICE_MAX })
                    }
                  >
                    Clear search &amp; filters
                  </Button>
                  <Button variant="outline-brand" onClick={() => update({ searchAll: true })}>
                    Search all categories
                  </Button>
                </>
              }
            />
          )}

          <div id="catalog-grid" className="grid w-full scroll-mt-40 grid-cols-3 gap-x-3 gap-y-10 max-desktop:grid-cols-2 max-sm:gap-y-lg">
            {result.items.map((s, i) => (
              <CatalogCard
                key={`${epoch}-${s.id}`}
                card={toCard(s)}
                eager={i < 6}
                style={{ animationDelay: `${Math.min(i % SERVICE_PAGE_SIZE, 11) * 0.05}s` }}
              />
            ))}
          </div>

          {result.hasMore && (
            <div className="mt-2xl flex flex-col items-center gap-md">
              <span className="font-body text-[13px] text-muted">
                Showing {result.items.length} of {result.total}
              </span>
              <Button variant="outline" size="md" onClick={() => update({ limit: criteria.limit + SERVICE_PAGE_SIZE }, false)}>
                Load more
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
