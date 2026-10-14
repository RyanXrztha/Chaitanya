"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "chy-intro";
const MIN_VISIBLE_MS = 1600;
const FADE_MS = 800;

/**
 * Brand intro (logo + 120×2 progress bar) shown once per browser session, on first
 * landing only. Skipped with reduced motion. The home page runs its own hero loader,
 * so this only renders for other entry pages.
 *
 * Rendered as a static overlay in the server HTML so it covers the first paint; an
 * inline script removes it immediately for returning visitors before React hydrates.
 */
export function Preloader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"show" | "out" | "gone">("show");
  /** Decided once per page load, so re-running the effect (Strict Mode) is safe. */
  const showIntro = useRef<boolean | null>(null);

  useEffect(() => {
    if (showIntro.current === null) {
      let seen = false;
      try {
        seen = sessionStorage.getItem(SESSION_KEY) === "1";
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      showIntro.current = !seen && !reduce && pathname !== "/";
    }
    // Skipped visits are already hidden by the inline script (data-intro-skip).
    if (!showIntro.current) return;
    let outTimer: ReturnType<typeof setTimeout>;
    const hide = () => {
      // performance.now() is measured from navigation start.
      outTimer = setTimeout(() => setPhase("out"), Math.max(0, MIN_VISIBLE_MS - performance.now()));
    };
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });
    return () => {
      clearTimeout(outTimer);
      window.removeEventListener("load", hide);
    };
    // Only on first mount — later client navigations never show the intro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "out") return;
    const t = setTimeout(() => setPhase("gone"), FADE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <>
      <script
        // Runs before hydration: hide instantly for returning visitors / home / reduced motion.
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('${SESSION_KEY}')==='1'||location.pathname==='/'||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-intro-skip','')}catch(e){}`,
        }}
      />
      <div
        id="chy-intro"
        aria-hidden
        className={
          "fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-xl bg-white transition-[opacity,visibility] duration-700 ease-chy [[data-intro-skip]_&]:hidden " +
          (phase === "out" ? "invisible opacity-0" : "")
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logos/chaitanya-logo-color.png"
          alt=""
          className={
            "h-[72px] w-auto translate-y-2 opacity-0 animate-[chy-intro-logo_.9s_var(--ease-chy)_.1s_forwards] transition-[translate] duration-700 ease-chy " +
            (phase === "out" ? "-translate-y-2" : "")
          }
        />
        <i className="relative block h-0.5 w-[120px] overflow-hidden bg-brand-100 after:absolute after:inset-0 after:origin-left after:scale-x-0 after:bg-brand after:content-[''] after:animate-[chy-intro-bar_1.3s_var(--ease-bar)_.2s_forwards]" />
      </div>
    </>
  );
}
