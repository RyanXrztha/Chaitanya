"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/presentation/lib/cn";

/**
 * Drifts its content down at `speed` × the scroll offset (the page heroes'
 * translateY(scrollY × 0.25)). Updates once per frame and stops once the content
 * is far off screen; does nothing with reduced motion.
 */
export function Parallax({ children, speed = 0.25, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.5) return;
      el.style.transform = y > 0 ? `translate3d(0, ${y * speed}px, 0)` : "";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
