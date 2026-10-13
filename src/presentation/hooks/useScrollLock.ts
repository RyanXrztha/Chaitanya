"use client";

import { useEffect } from "react";

let locks = 0;

/** Locks page scroll while `active` (drawers, modals, search). Nested locks are counted. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    if (locks++ === 0) root.style.overflow = "hidden";
    return () => {
      if (--locks === 0) root.style.overflow = "";
    };
  }, [active]);
}
