"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/**
 * True once the page has scrolled past `threshold` px. Only re-renders when the
 * boolean flips, so it is cheap to use for sticky/docked states.
 */
export function useScrolledPast(threshold: number | (() => number)): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > (typeof threshold === "function" ? threshold() : threshold),
    () => false,
  );
}
