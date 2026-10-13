"use client";

import { useSyncExternalStore } from "react";

/** Live match of a CSS media query; `serverValue` is used during SSR and hydration. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** ≤1100px — the header collapses to the hamburger menu. */
export const useCompactNav = () => useMediaQuery("(max-width: 1100px)");
