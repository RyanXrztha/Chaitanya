"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { routes } from "@/presentation/lib/routes";
import { CtaPair } from "../../ui/CtaPair";
import { Eyebrow } from "../../ui/Eyebrow";

const STACK_QUERY = "(max-width: 1024px)";

const BENEFITS: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Exclusive Treatments",
    text: "Access members-only therapies and signature experiences.",
    icon: (
      <path d="M19.5 9.5h-.75V6.75a6.75 6.75 0 0 0-13.5 0 1 1 0 0 0 2 0 4.75 4.75 0 0 1 9.5 0V9.5H4.5a2 2 0 0 0-2 2V22a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2V11.5a2 2 0 0 0-2-2zm-9.5 6a2 2 0 1 1 3 1.723V19.5a1 1 0 0 1-2 0v-2.277A1.994 1.994 0 0 1 10 15.5z" />
    ),
  },
  {
    title: "Special Pricing",
    text: "Enjoy discounted rates on all services year-round.",
    icon: (
      <path d="M23.555 8.729a1.505 1.505 0 0 0-1.406-.98h-6.087a.5.5 0 0 1-.472-.334l-2.185-6.193a1.5 1.5 0 0 0-2.81 0l-.005.016-2.18 6.177a.5.5 0 0 1-.471.334H1.85A1.5 1.5 0 0 0 .887 10.4l5.184 4.3a.5.5 0 0 1 .155.543l-2.178 6.531a1.5 1.5 0 0 0 2.31 1.684l5.346-3.92a.5.5 0 0 1 .591 0l5.344 3.919a1.5 1.5 0 0 0 2.312-1.683l-2.178-6.535a.5.5 0 0 1 .155-.543l5.194-4.306a1.5 1.5 0 0 0 .433-1.661z" />
    ),
  },
  {
    title: "Priority Booking",
    text: "Skip the wait with fast-track reservations anytime.",
    icon: (
      <>
        <path d="M21.5 3H19V1.5a1 1 0 0 0-2 0V3H7V1.5a1 1 0 0 0-2 0V3H2.5A1.5 1.5 0 0 0 1 4.5v18A1.5 1.5 0 0 0 2.5 24h19a1.5 1.5 0 0 0 1.5-1.5v-18A1.5 1.5 0 0 0 21.5 3zM21 21.5a.5.5 0 0 1-.5.5h-17a.5.5 0 0 1-.5-.5V9.5a.5.5 0 0 1 .5-.5h17a.5.5 0 0 1 .5.5z" />
        <path d="M10.5 18.5a1 1 0 0 1-.707-.293l-2.5-2.5a1 1 0 0 1 1.414-1.414l1.793 1.793 4.293-4.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-.707.293z" />
      </>
    ),
  },
  {
    title: "Member Rewards",
    text: "Earn points, gifts, and exclusive perks.",
    icon: (
      <path d="M12 0a12 12 0 1 0 12 12A12.014 12.014 0 0 0 12 0zm6.927 8.2-6.845 9.289a1.011 1.011 0 0 1-1.43.188l-4.888-3.908a1 1 0 1 1 1.25-1.562l4.076 3.261 6.227-8.451A1 1 0 1 1 18.927 8.2z" />
    ),
  },
];

/**
 * Scroll-pinned membership band (desktop): as the 220vh section scrolls, the benefits
 * panel slides out, the video wipes in from the right and the CTA slides into place.
 * ≤1024px it stacks as a normal text block above the video.
 */
export function MembershipShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stacked = window.matchMedia(STACK_QUERY);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = 0;
    let current: number | null = null;
    let raf = 0;

    const apply = (c: number) => {
      const T = textRef.current, V = videoRef.current, C = ctaRef.current;
      if (stacked.matches) {
        if (T) Object.assign(T.style, { transform: "", opacity: "", pointerEvents: "" });
        if (V) V.style.clipPath = "";
        if (C) C.style.transform = "";
        return;
      }
      if (T) {
        T.style.transform = `translate3d(${-c * 18}%,0,0)`;
        T.style.opacity = String(Math.max(0, 1 - c * 1.35));
        T.style.pointerEvents = c > 0.6 ? "none" : "";
      }
      if (V) V.style.clipPath = `inset(0 0 0 ${(1 - c) * 50}%)`;
      if (C) C.style.transform = `translate3d(${(1 - c) * 50}%,0,0)`;
    };

    const step = () => {
      raf = 0;
      let c = current ?? target;
      c += (target - c) * (reduce.matches ? 1 : 0.16);
      if (Math.abs(target - c) < 0.0008) c = target;
      current = c;
      apply(c);
      if (c !== target) raf = requestAnimationFrame(step);
    };

    const measure = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const scrollable = r.height - window.innerHeight;
      const raw = scrollable > 0 ? Math.min(1, Math.max(0, -r.top / scrollable)) : 0;
      const x = Math.min(1, Math.max(0, (raw - 0.08) / 0.8));
      target = x * x * (3 - 2 * x); // smoothstep
      if (!raf) raf = requestAnimationFrame(step);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    stacked.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      stacked.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="membership"
      aria-labelledby="membership-title"
      className="relative h-[220vh] max-xl:h-auto"
    >
      <div className="sticky top-0 flex h-screen flex-nowrap overflow-hidden max-xl:relative max-xl:h-auto max-xl:flex-col max-xl:overflow-visible">
        <div
          ref={textRef}
          className="relative z-[1] box-border flex h-full w-1/2 flex-none flex-col justify-center bg-[#eaddba] px-[clamp(48px,8vw,128px)] py-3xl will-change-[transform,opacity] max-xl:w-full max-xl:px-2xl max-tablet:px-[clamp(24px,6vw,48px)]"
        >
          <Eyebrow className="mb-md">Membership Benefits</Eyebrow>
          <h2 id="membership-title" className="mt-0 mb-xl leading-[1.35] font-bold text-ink">
            Experience Premium Benefits of Membership
          </h2>
          <div className="flex flex-col gap-lg">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className="flex items-start gap-md">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#007D67" aria-hidden className="mt-0.5 size-7 flex-none">
                  {b.icon}
                </svg>
                <div>
                  <h4
                    className={
                      i === 0
                        ? "mt-0 mb-sm font-heading text-[20px] font-bold max-md:text-[18px]"
                        : "mt-0 mb-xs font-heading text-[20px] font-bold tracking-[0.02em] text-[#4e6b39] normal-case max-md:text-[18px]"
                    }
                  >
                    {b.title}
                  </h4>
                  <p className="m-0 font-body text-[16px] text-ink-3 max-md:text-[15px]">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={videoRef}
          className="absolute inset-0 z-[2] overflow-hidden [clip-path:inset(0_0_0_50%)] will-change-[clip-path] max-xl:relative max-xl:inset-auto max-xl:min-h-[72vh] max-xl:[clip-path:none] min-[761px]:max-xl:min-h-[56vh]"
        >
          <video
            className="absolute inset-0 size-full object-cover"
            src="/video/hero-spa.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 w-full bg-[linear-gradient(180deg,rgba(7,46,52,0.05),rgba(7,46,52,0.65))]">
            <div
              ref={ctaRef}
              className="pointer-events-auto absolute inset-x-0 bottom-0 box-border px-[clamp(24px,5vw,64px)] py-2xl [transform:translate3d(50%,0,0)] will-change-transform max-xl:[transform:none]"
            >
              <h3 className="mt-0 mb-md max-w-[26ch] font-heading text-[clamp(24px,2.3vw,27px)] leading-[1.3] font-bold text-white max-md:text-[22px]">
                Join Today and Experience Exclusive Membership Benefits
              </h3>
              <CtaPair label="Join Now" href={routes.page("membership")} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
