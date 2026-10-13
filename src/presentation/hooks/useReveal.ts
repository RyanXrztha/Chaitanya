"use client";

import { useEffect, useRef, useState } from "react";

export type RevealVariant = "up" | "left" | "right" | "slide-left" | "slide-right" | "scale" | "blur" | "line";

/**
 * Scroll-reveal (motion.js › data-chy): elements start hidden and fade/rise in when
 * they enter the viewport. With reduced motion the CSS keeps them visible.
 */
export function useReveal<T extends Element>(options: { once?: boolean } = {}) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  const once = options.once ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            if (once) io.disconnect();
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return { ref, shown };
}
