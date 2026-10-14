"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageRef } from "@/domain";
import { cn } from "@/presentation/lib/cn";

interface DetailGalleryProps {
  photos: ImageRef[];
  /** "service": tall 4:5 stage with a captioned counter. "product": square stage, badge, swipe carousel ≤640px. */
  variant: "service" | "product";
  badge?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Detail-page gallery: cross-fading stage with prev/next, counter and thumbnails.
 * Sticky beside the info column on desktop; stacks ≤1024px. Arrow keys change photo.
 */
export function DetailGallery({ photos, variant, badge }: DetailGalleryProps) {
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const n = photos.length;
  const product = variant === "product";

  const go = useCallback(
    (i: number) => {
      const k = (i + n) % n;
      setActive(k);
      const c = carouselRef.current;
      if (c && c.offsetParent !== null && Math.round(c.scrollLeft / c.clientWidth) !== k) {
        c.scrollTo({ left: k * c.clientWidth, behavior: "smooth" });
      }
    },
    [n],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement | null)?.tagName;
      if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT" || document.querySelector("[aria-modal=true]")) return;
      if (e.key === "ArrowLeft") go(active - 1);
      if (e.key === "ArrowRight") go(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  const counter = `${pad(active + 1)} / ${pad(n)}`;
  const arrowClass = cn(
    "flex size-10 items-center justify-center rounded-control border-0 bg-white/92 text-ink-dark shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-colors duration-200 hover:bg-white",
    !product && "max-md:size-9",
  );

  return (
    <div
      className={cn(
        "sticky top-24 flex min-h-[420px] flex-col gap-md",
        product ? "h-[calc(100vh-180px)] max-h-[680px]" : "h-[calc(100vh-180px)] max-h-[720px]",
        "max-xl:relative max-xl:top-auto max-xl:h-auto max-xl:max-h-none max-xl:min-h-0",
        product && "max-md:-mx-lg max-md:gap-sm",
      )}
    >
      {product && (
        <>
          <div
            ref={carouselRef}
            onScroll={(e) => {
              const c = e.currentTarget;
              const k = Math.round(c.scrollLeft / Math.max(1, c.clientWidth));
              if (k !== active) setActive(k);
            }}
            className="hidden snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-none max-md:flex"
          >
            {photos.map((p, i) => (
              <div key={p.src + i} className="relative aspect-square flex-[0_0_100%] snap-center bg-surface">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 640px) 100vw, 1px" loading="lazy" className="object-cover" />
              </div>
            ))}
          </div>
          {badge && (
            <div className="pointer-events-none absolute top-3 left-3 z-[3] hidden rounded-chip bg-brand px-2.5 py-[5px] font-body text-[11px] font-bold tracking-[0.06em] text-white uppercase max-md:block">
              {badge}
            </div>
          )}
          <div className="pointer-events-none absolute top-3 right-3 z-[3] hidden rounded-chip bg-white/92 px-2.5 py-[5px] font-body text-[12px] font-bold text-ink-dark max-md:block">
            {counter}
          </div>
        </>
      )}

      <div
        className={cn(
          "relative min-h-0 w-full flex-auto overflow-hidden rounded-panel bg-surface",
          product
            ? "max-xl:aspect-square max-xl:max-h-[72vh] max-xl:flex-none max-md:hidden"
            : "max-xl:aspect-[4/5] max-xl:max-h-[72vh] max-xl:flex-none max-md:-mx-lg max-md:aspect-square max-md:max-h-none max-md:w-[calc(100%+48px)] max-md:rounded-none",
        )}
      >
        {photos.map((p, i) => {
          const on = i === active;
          return (
            <div
              key={p.src + i}
              aria-hidden={!on}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-[600ms,900ms] ease-[ease,var(--ease-chy)]",
                on ? "pointer-events-auto z-[2] scale-100 opacity-100" : "pointer-events-none z-[1] scale-[1.04] opacity-0",
              )}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes={product ? "(max-width: 640px) 1px, (max-width: 1024px) 100vw, 45vw" : "(max-width: 1024px) 100vw, 45vw"}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 && !product ? "high" : undefined}
                className="object-cover"
              />
            </div>
          );
        })}
        {product && badge && (
          <span className="pointer-events-none absolute top-md left-md z-[3] rounded-chip bg-brand px-3 py-1.5 font-body text-[12px] font-bold tracking-[0.06em] text-white uppercase">
            {badge}
          </span>
        )}
        <div
          className={cn(
            "pointer-events-none absolute bottom-md left-md z-[3] flex items-center gap-sm rounded-chip bg-[rgba(7,46,52,0.72)] px-3 py-[7px] font-body text-[12.5px] font-bold tracking-[0.06em] text-white",
            !product && "backdrop-blur-[6px]",
          )}
          aria-live="polite"
        >
          <span>{counter}</span>
          {!product && photos[active]?.caption && (
            <>
              <span className="h-3 w-px bg-white/40" />
              <span className="font-medium tracking-normal">{photos[active].caption}</span>
            </>
          )}
        </div>
        <div className="absolute right-md bottom-md z-[3] flex gap-sm">
          <button type="button" onClick={() => go(active - 1)} aria-label="Previous photo" className={arrowClass}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button type="button" onClick={() => go(active + 1)} aria-label="Next photo" className={arrowClass}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-none gap-sm",
          product
            ? "h-[clamp(64px,10vh,88px)] max-md:h-16 max-md:overflow-x-auto max-md:px-lg max-md:scrollbar-none"
            : "h-[clamp(56px,9vh,84px)] max-md:h-[60px]",
        )}
      >
        {photos.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.src + i}
              type="button"
              onClick={() => go(i)}
              aria-label={p.caption ?? `Photo ${i + 1}`}
              aria-pressed={on}
              className={cn(
                "relative h-full min-w-0 flex-[1_1_0] overflow-hidden rounded-control border-0 bg-surface p-0 outline-2 outline-offset-2 transition-[opacity,outline-color] duration-250",
                on ? "opacity-100 outline-brand" : "opacity-55 outline-transparent hover:opacity-80",
                product && "max-md:flex-[0_0_64px]",
              )}
            >
              <Image src={p.src} alt="" fill sizes="120px" className="pointer-events-none object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
