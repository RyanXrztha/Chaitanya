"use client";

import Image from "next/image";
import { useMemo, type CSSProperties } from "react";
import { useFitText } from "@/presentation/hooks/useFitText";
import { useReveal } from "@/presentation/hooks/useReveal";
import { Eyebrow } from "../../ui/Eyebrow";

const GOLDS = ["#D4AF37", "#E9CE7A", "#F3E3AE", "#B8912C"];

/** Deterministic pseudo-random so server and client agree (no hydration drift). */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s / 4294967296;
  };
}

function useConfetti(count = 46): CSSProperties[] {
  return useMemo(() => {
    const rnd = seeded(2022);
    return Array.from({ length: count }, (_, i) => {
      const size = 2 + rnd() * 5;
      const color = GOLDS[i % GOLDS.length];
      const spark = rnd() > 0.6;
      return {
        left: `${30 + rnd() * 40}%`,
        width: size,
        height: size,
        background: color,
        boxShadow: spark ? `0 0 6px 1px ${color}` : "none",
        ["--dx" as string]: `${(rnd() - 0.5) * 260}px`,
        ["--dy" as string]: `${-60 - rnd() * 140}px`,
        ["--rot" as string]: `${180 + rnd() * 360}deg`,
        animation: `chy-confetti-burst ${1.5 + rnd() * 0.5}s ${rnd() * 0.5}s cubic-bezier(.12,.7,.3,1) forwards`,
      };
    });
  }, [count]);
}

/** Travelers' Choice award band with a gold shimmer and a confetti burst on first view. */
export function AwardBand() {
  const { ref, shown } = useReveal<HTMLElement>();
  const titleRef = useFitText<HTMLHeadingElement>(16);
  const confetti = useConfetti();

  return (
    <section
      ref={ref}
      id="trust-strip"
      aria-labelledby="award-title"
      className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(212,175,55,0.14)_0%,transparent_60%),linear-gradient(180deg,#111111_0%,#0B0B0C_100%)] py-[clamp(80px,10vw,128px)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#fff_0.5px,transparent_0.5px),radial-gradient(circle_at_70%_60%,#fff_0.5px,transparent_0.5px)] bg-size-[3px_3px,4px_4px] opacity-5"
      />
      {shown && (
        <div aria-hidden className="motion-reduce:hidden">
          {confetti.map((style, i) => (
            <span key={i} className="pointer-events-none absolute top-[42%] z-[2] opacity-0" style={style} />
          ))}
        </div>
      )}

      <div className="relative z-[1] mx-auto w-full max-w-[900px] px-[clamp(24px,5vw,48px)] text-center">
        <div className="relative box-border inline-block w-[402px] max-w-full overflow-hidden px-[clamp(24px,5vw,64px)] animate-[chy-award-card-in_1s_var(--ease-zoom)_both]">
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 h-full w-[60%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.16),transparent)] animate-[chy-gold-shimmer_1.8s_.8s_ease-in-out_both]"
          />
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.3"
            aria-hidden
            className="mx-auto mb-md block drop-shadow-[0_2px_6px_rgba(212,175,55,0.4)]"
          >
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
            <path d="M7 5H4a2 2 0 0 0 0 4c.6 1.6 1.6 2.8 3 3.6" />
            <path d="M17 5h3a2 2 0 0 1 0 4c-.6 1.6-1.6 2.8-3 3.6" />
          </svg>
          <div className="relative mx-auto mb-xs h-[180px] w-[280px] max-w-full overflow-hidden rounded-card">
            <Image
              src="/images/slots/award-badge.webp"
              alt="Tripadvisor Travelers’ Choice 2022 badge"
              fill
              sizes="280px"
              className="object-contain"
            />
          </div>
          <p className="m-0 font-body text-[12px] tracking-[0.14em] text-[#D4AF37] uppercase">Travelers’ Choice Award · 2022</p>
        </div>

        <Eyebrow tone="dark" align="center" className="mt-xl">
          Awards &amp; Recognition
        </Eyebrow>
        <h2
          ref={titleRef}
          id="award-title"
          className="mx-auto mt-md mb-sm w-fit max-w-full font-semibold tracking-[0.01em] text-balance whitespace-nowrap text-white animate-[chy-award-fade-up_1s_.15s_var(--ease-zoom)_both] max-md:whitespace-normal"
        >
          A Wellness Experience Worth Remembering
        </h2>
        <p className="mx-auto my-0 max-w-[56ch] font-body text-[17px] leading-[1.75] text-white/68 animate-[chy-award-fade-up_1s_.3s_var(--ease-zoom)_both] max-md:text-[15px]">
          Recognized with the Travelers’ Choice Award 2022, Chaitanya combines thoughtful care, peaceful surroundings, and
          rejuvenating experiences.
        </p>
      </div>
    </section>
  );
}
