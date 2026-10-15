"use client";

import { useEffect, useState } from "react";
import { cn } from "@/presentation/lib/cn";

const SESSION_KEY = "chy-intro";
/** Phase timeline (ms) from index.html: logo → tagline/bar → fill → slide away → gone. */
const PHASES = [100, 600, 1200, 1900, 2400];

/**
 * Home-page intro: dark panel with the white logo, tagline and a progress bar that
 * slides away. Runs once per session on first landing; skipped with reduced motion.
 * An inline script hides it before hydration for returning visitors.
 */
export function HomeLoader() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-home-intro-skip")) return;
    document.body.style.overflow = "hidden";
    const timers = PHASES.map((ms, i) =>
      setTimeout(() => {
        setPhase(i + 1);
        if (i + 1 === PHASES.length) document.body.style.overflow = "";
      }, ms),
    );
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase >= 5) return null;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('${SESSION_KEY}')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-home-intro-skip','')}catch(e){}`,
        }}
      />
      <div
        aria-hidden
        className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center bg-brand-800 transition-[opacity,transform] duration-[1000ms,1100ms] ease-[ease,var(--ease-bar)] [[data-home-intro-skip]_&]:hidden",
          phase >= 4 ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <div className="flex flex-col items-center gap-xl px-lg text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logos/chaitanya-logo-white.svg"
            alt=""
            className={cn(
              "h-[120px] w-auto transition-[opacity,transform] duration-700 ease-in-out",
              phase >= 1 ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.94] opacity-0",
            )}
          />
          <p
            className={cn(
              "m-0 max-w-[36ch] font-heading text-[24px] leading-[1.5] tracking-[0.02em] text-[#f7f1de] transition-[opacity,transform] duration-600",
              phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            Begin your journey to relaxation,
            <br />
            balance, and renewed well-being.
          </p>
          <div
            className={cn(
              "relative h-0.5 w-[180px] overflow-hidden bg-[#f7f1de]/25 transition-opacity duration-400",
              phase >= 2 ? "opacity-100" : "opacity-0",
            )}
          >
            <div
              className={cn(
                "relative h-full overflow-hidden bg-brand transition-[width] duration-[1100ms] ease-[cubic-bezier(.4,0,.2,1)]",
                phase >= 3 ? "w-full" : "w-0",
              )}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] animate-[chy-bar-shine_1.1s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
