"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useEscapeKey } from "@/presentation/hooks/useEscapeKey";
import { useScrollLock } from "@/presentation/hooks/useScrollLock";
import { cn } from "@/presentation/lib/cn";
import { CloseIcon } from "../../ui/Icon";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  label: string;
  resultCount: number;
  children: ReactNode;
}

/** Left slide-in filter drawer (min(420px, 100vw)) with a scrim; Escape or scrim click closes. */
export function FilterDrawer({ open, onClose, label, resultCount, children }: FilterDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  useScrollLock(open);
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
  }, [open]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[70] bg-[rgba(7,46,52,0.42)] transition-opacity duration-450",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        ref={panelRef}
        id="catalog-filters"
        aria-label={label}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-[80] flex w-[min(420px,100vw)] flex-col rounded-r-panel bg-white shadow-drawer",
          "transition-[transform,visibility] duration-550 ease-chy",
          open ? "visible translate-x-0" : "invisible -translate-x-full delay-[0s,550ms]",
        )}
      >
        <div className="flex flex-none items-center justify-between gap-md border-b border-line px-xl py-lg">
          <span className="font-heading text-[24px] font-semibold text-ink max-md:text-[20px]">Filters</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="-mr-3 flex size-11 flex-none items-center justify-center rounded-control border-0 bg-transparent text-ink hover:text-brand"
          >
            <CloseIcon size={20} strokeWidth={1.8} />
          </button>
        </div>
        <div className="flex min-h-0 flex-auto flex-col overflow-y-auto overscroll-contain p-xl max-md:p-lg">{children}</div>
        <div className="flex-none border-t border-line px-xl pt-md pb-lg">
          <button
            type="button"
            onClick={onClose}
            className="h-[52px] w-full rounded-control border-0 bg-brand font-body text-[15px] font-medium text-white transition-colors duration-250 hover:bg-brand-700"
          >
            Show {resultCount} Results
          </button>
        </div>
      </aside>
    </>
  );
}

export function DrawerHeading({ children, first }: { children: ReactNode; first?: boolean }) {
  return (
    <span
      className={cn(
        "block font-body text-[12px] font-bold tracking-[0.14em] text-muted uppercase",
        first ? "mb-md" : "mt-xl mb-md",
      )}
    >
      {children}
    </span>
  );
}
