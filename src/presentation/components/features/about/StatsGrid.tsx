"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/presentation/lib/cn";
import type { AboutStat } from "@/presentation/lib/about-content";

const DURATION = 1400;
const format = (n: number) => n.toLocaleString("en-US");

/**
 * Four stat tiles whose numbers count up each time the grid scrolls into view
 * and rewind when it leaves (as in the prototype). The server renders the final
 * values; frames are written straight to the DOM.
 */
export function StatsGrid({ stats }: { stats: AboutStat[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = [...el.querySelectorAll<HTMLElement>("[data-stat]")];
    const paint = (t: number) => nodes.forEach((n, i) => (n.textContent = format(Math.round(stats[i].value * t)) + stats[i].suffix));
    let frame = 0;
    const play = () => {
      cancelAnimationFrame(frame);
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / DURATION);
        paint(1 - Math.pow(1 - p, 3));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else {
          cancelAnimationFrame(frame);
          paint(0);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stats]);

  return (
    <div ref={ref} className="mx-auto grid max-w-content grid-cols-[repeat(auto-fit,minmax(220px,1fr))] sm:max-desktop:grid-cols-2">
      {stats.map((s, i) => {
        const dark = i % 2 === 1;
        return (
          <div key={s.label} className={cn("flex h-[280px] flex-col justify-center rounded-card p-lg", dark ? "bg-brand-800" : "bg-brand-100")}>
            <div className="flex flex-wrap items-baseline gap-sm">
              <span className={cn("font-heading text-[clamp(32px,4vw,46px)] leading-none font-bold max-md:text-[27px]", dark ? "text-white" : "text-ink-dark")}>
                <span data-stat>{format(s.value) + s.suffix}</span>
              </span>
              <span className={cn("font-body text-[14px] font-semibold", dark ? "text-white/85" : "text-[#2F4A47]")}>{s.label}</span>
            </div>
            <div aria-hidden className={cn("my-md h-px", dark ? "bg-white/25" : "bg-ink-dark/25")} />
            <p className={cn("m-0 font-body text-[13.5px] leading-[1.6]", dark ? "text-white/85" : "text-[#2F4A47]")}>{s.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
