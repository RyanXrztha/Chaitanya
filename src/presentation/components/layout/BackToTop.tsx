"use client";

import { useReducedMotion } from "@/presentation/hooks/useMediaQuery";
import { useScrolledPast } from "@/presentation/hooks/useScrollPosition";
import { cn } from "@/presentation/lib/cn";
import { ArrowUpIcon, ChevronUpIcon } from "../ui/Icon";

function useScrollToTop() {
  const reduce = useReducedMotion();
  return () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/** Floating round button that appears after 700px of scrolling (motion.js › #chy-top). */
export function BackToTopFab() {
  const visible = useScrolledPast(700);
  const toTop = useScrollToTop();
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={toTop}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "group fixed right-lg bottom-lg z-[60] flex size-12 items-center justify-center rounded-full border-0 bg-brand text-white shadow-fab transition-[opacity,translate,scale,background-color] duration-400 ease-chy hover:bg-brand-700 max-md:right-[14px] max-md:bottom-[14px]",
        visible ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-5 scale-80 opacity-0",
      )}
    >
      <ChevronUpIcon className="transition-transform duration-300 ease-chy group-hover:-translate-y-0.5" />
    </button>
  );
}

/** Square back-to-top button in the footer's bottom bar. */
export function BackToTopButton() {
  const toTop = useScrollToTop();
  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className="flex size-10 items-center justify-center rounded-control border border-white/24 bg-transparent text-white transition-[background-color,border-color,translate] duration-250 hover:-translate-y-0.5 hover:border-brand hover:bg-brand"
    >
      <ArrowUpIcon />
    </button>
  );
}
