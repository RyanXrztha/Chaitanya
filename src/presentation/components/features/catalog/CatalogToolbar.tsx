"use client";

import { useRef, type FormEvent } from "react";
import { cn } from "@/presentation/lib/cn";
import { CloseIcon, SearchIcon } from "../../ui/Icon";
import { Select, type SelectOption } from "../../ui/Select";

interface CatalogToolbarProps {
  filtersOpen: boolean;
  onOpenFilters: () => void;
  activeFilterCount: number;
  resultCount: number;
  sort: string;
  sortOptions: SelectOption[];
  onSortChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  searchPlaceholder: string;
  searchLabel: string;
}

/** Sticky toolbar: Categories (opens the drawer) · result count · Sort by · search. */
export function CatalogToolbar(props: CatalogToolbarProps) {
  const sortRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!props.query.trim()) {
      inputRef.current?.focus();
      return;
    }
    inputRef.current?.blur();
    props.onSearchSubmit();
  };

  return (
    <div className="sticky top-[76px] z-[5] mb-xl flex flex-wrap items-center justify-between gap-x-xl gap-y-md rounded-card bg-white/96 py-md backdrop-blur-[8px] max-lg:top-[68px] max-lg:mb-lg max-md:gap-x-md max-md:gap-y-sm max-md:py-sm">
      <div className="flex min-w-0 items-center gap-md max-md:flex-auto">
        <button
          type="button"
          onClick={props.onOpenFilters}
          aria-controls="catalog-filters"
          aria-expanded={props.filtersOpen}
          className="group inline-flex h-11 cursor-pointer items-center gap-3 border-0 bg-transparent p-0 font-body text-[16px] font-medium whitespace-nowrap text-brand transition-colors duration-300 hover:text-brand-700 max-md:text-[14px]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-450 ease-chy group-hover:-scale-x-100">
            <path d="M3 7h10" />
            <path d="M17 7h4" />
            <circle cx="15" cy="7" r="2" />
            <path d="M3 17h4" />
            <path d="M11 17h10" />
            <circle cx="9" cy="17" r="2" />
          </svg>
          <span>Categories</span>
          {props.activeFilterCount > 0 && (
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-brand text-[11px] text-white">
              {props.activeFilterCount}
            </span>
          )}
        </button>
        <span aria-hidden className="h-4 w-px bg-line-3" />
        <span role="status" className="font-body text-[15px] whitespace-nowrap text-muted max-md:text-[14px]">
          {props.resultCount} Results
        </span>
      </div>

      <div className="ml-auto flex min-w-0 flex-[0_1_auto] items-center gap-3 max-desktop:ml-0 max-md:w-full max-md:flex-wrap max-md:gap-md">
        <label
          ref={sortRef}
          className="group relative inline-flex h-11 flex-none cursor-pointer items-center gap-sm rounded-control border border-line-2 bg-white pr-10 pl-md transition-[border-color,box-shadow] duration-250 select-none hover:border-[#b9c9c4] focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(0,125,103,0.12)] active:bg-[#f5faf8] max-md:h-[42px] max-md:flex-auto"
        >
          <span className="font-body text-[14px] whitespace-nowrap text-muted">Sort by</span>
          <Select
            label="Sort by"
            value={props.sort}
            onValueChange={props.onSortChange}
            options={props.sortOptions}
            anchorRef={sortRef}
            className="h-[42px] border-0 bg-transparent p-0 font-body text-[15px] font-semibold text-ink-dark shadow-none! outline-none hover:border-0 data-open:shadow-none max-md:text-[14px]"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#072E34"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="pointer-events-none absolute top-[13px] right-[14px] transition-transform duration-300 group-focus-within:rotate-180"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </label>

        <form
          role="search"
          onSubmit={submit}
          onMouseDown={(e) => {
            const t = e.target as HTMLElement;
            if (t.closest("button") || t.tagName === "INPUT") return;
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className="flex h-11 w-[300px] min-w-0 flex-[0_1_300px] cursor-text items-center gap-1 rounded-control border border-line-2 bg-white pr-1 pl-md transition-[border-color,box-shadow,background-color] duration-250 hover:border-[#b9c9c4] focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(0,125,103,0.12)] active:bg-[#f5faf8] max-md:order-first max-md:w-full max-md:flex-[1_1_100%]"
        >
          <input
            ref={inputRef}
            type="search"
            value={props.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder={props.searchPlaceholder}
            aria-label={props.searchLabel}
            enterKeyHint="search"
            className="h-10 min-w-0 flex-1 border-0 bg-transparent p-0 font-body text-[16px] text-ink shadow-none! outline-none placeholder:text-subtle focus:shadow-none"
          />
          {props.query && (
            <button
              type="button"
              onClick={() => {
                props.onQueryChange("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="flex size-8 flex-none items-center justify-center rounded-control border-0 bg-transparent p-0 text-subtle transition-colors hover:text-ink"
            >
              <CloseIcon size={14} strokeWidth={2.4} />
            </button>
          )}
          <button
            type="submit"
            aria-label="Search"
            className={cn(
              "flex size-9 flex-none items-center justify-center rounded-control border-0 bg-transparent p-0 text-brand transition-colors hover:bg-brand-100 hover:text-brand-700 active:bg-[#cdeee6]",
            )}
          >
            <SearchIcon />
          </button>
        </form>
      </div>
    </div>
  );
}
