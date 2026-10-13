"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Keeps a single-line title on one line by shrinking its font-size until it fits
 * its container (the pre-footer title "stays on one line at every width").
 * The CSS size acts as the maximum; `min` is the floor in px.
 */
export function useFitText<T extends HTMLElement>(min = 18) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      el.style.fontSize = "";
      const ps = getComputedStyle(parent);
      const available = parent.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight);
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollWidth > available && size > min) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [min]);

  return ref;
}
