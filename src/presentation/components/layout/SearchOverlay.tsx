"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { POPULAR_SEARCHES, type SearchResultGroup } from "@/application";
import { container } from "@/infrastructure/container";
import { useEscapeKey } from "@/presentation/hooks/useEscapeKey";
import { useScrollLock } from "@/presentation/hooks/useScrollLock";
import { cn } from "@/presentation/lib/cn";
import { routes, searchTargetHref } from "@/presentation/lib/routes";
import { ArrowUpRightIcon, CloseIcon, SearchIcon } from "../ui/Icon";

const RESULT_LIMIT = 40;
const PER_GROUP = 5;

const SEE_ALL: Partial<Record<SearchResultGroup["kind"], (q: string) => string>> = {
  Services: (q) => routes.services({ q }),
  Products: (q) => routes.products({ q }),
};

interface SearchOverlayProps {
  initialQuery: string;
  onClose: () => void;
}

export function SearchOverlay({ initialQuery, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const deferred = useDeferredValue(query.trim());
  const [groups, setGroups] = useState<SearchResultGroup[]>([]);
  const [resultsFor, setResultsFor] = useState("");

  useScrollLock(true);
  useEscapeKey(true, onClose);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let live = true;
    if (!deferred) return;
    container.searchSite.grouped(deferred, RESULT_LIMIT).then((g) => {
      if (!live) return;
      setGroups(g);
      setResultsFor(deferred);
    });
    return () => {
      live = false;
    };
  }, [deferred]);

  const q = query.trim();
  const visible = q && resultsFor === deferred ? groups : [];
  const first = visible[0]?.entries[0];
  const noResults = !!q && resultsFor === deferred && deferred === q && groups.length === 0;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={onClose}
      className="fixed inset-0 z-[300] box-border flex items-start justify-center bg-[rgba(7,46,52,0.55)] px-[clamp(0px,4vw,24px)] pt-[clamp(0px,6vh,64px)] backdrop-blur-[4px] animate-[chy-fade-in_.2s_ease_both]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[min(100dvh,720px)] w-full max-w-[720px] flex-col overflow-hidden bg-white shadow-[0_30px_60px_rgba(7,46,52,0.3)] animate-[chy-menu-in_.3s_var(--ease-chy)_both] tablet:rounded-menu"
      >
        <div className="flex items-center gap-md border-b border-[#eceee9] px-[clamp(14px,3vw,22px)] py-[14px]">
          <SearchIcon size={20} strokeWidth={2.2} className="shrink-0 text-brand" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && first) go(searchTargetHref(first.target));
            }}
            placeholder="Search treatments, products and pages"
            aria-label="Search treatments, products and pages"
            autoComplete="off"
            className="h-12 min-w-0 flex-1 rounded-control border-0 bg-transparent px-1 font-body text-[17px] text-ink"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex size-10 shrink-0 items-center justify-center rounded-control bg-surface-3 p-0 text-ink transition-colors duration-250 hover:bg-brand-100 hover:text-brand"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[clamp(14px,3vw,22px)] pt-sm pb-[20px]">
          {!q && (
            <>
              <p className="my-md font-body text-[12px] tracking-[0.1em] text-muted uppercase">Popular searches</p>
              <div className="flex flex-wrap gap-sm">
                {POPULAR_SEARCHES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setQuery(p);
                      inputRef.current?.focus();
                    }}
                    className="h-[38px] rounded-control border border-line-2 bg-white px-md font-body text-[14px] font-medium text-ink-dark transition-colors duration-250 hover:border-brand hover:bg-brand-100 hover:text-brand"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}

          {noResults && (
            <p className="mt-lg mb-0 font-body text-[15px] text-muted">
              No matches for “{q}”. Try a treatment name like “massage” or a product like “oil”.
            </p>
          )}

          {visible.map((g) => {
            const seeAll = SEE_ALL[g.kind];
            return (
              <div key={g.kind} className="mt-md">
                <div className="mb-xs flex items-center justify-between gap-md">
                  <span className="font-body text-[12px] tracking-[0.1em] text-muted uppercase">
                    {g.kind} · {g.entries.length}
                  </span>
                  {seeAll && g.entries.length > PER_GROUP && (
                    <Link
                      href={seeAll(q)}
                      prefetch={false}
                      onClick={onClose}
                      className="font-body text-[13px] font-bold text-brand no-underline"
                    >
                      See all
                    </Link>
                  )}
                </div>
                {g.entries.slice(0, PER_GROUP).map((r) => (
                  <Link
                    key={`${r.kind}-${r.title}`}
                    href={searchTargetHref(r.target)}
                    prefetch={false}
                    onClick={onClose}
                    className={cn(
                      "-mx-3 flex min-h-14 items-center justify-between gap-md rounded-control px-3 py-sm text-ink no-underline transition-colors duration-200 hover:bg-brand-100",
                      r === first && "bg-surface",
                    )}
                  >
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-heading text-[16px] font-semibold text-ink">{r.title}</span>
                      <span className="truncate font-body text-[13px] text-muted">{r.subtitle}</span>
                    </span>
                    <ArrowUpRightIcon className="shrink-0 text-brand" />
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
