"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/presentation/hooks/useReveal";
import { cn } from "@/presentation/lib/cn";
import { Eyebrow } from "../../ui/Eyebrow";

const STAGES = [
  {
    eyebrow: "Arrive",
    title: "Leave the Outside World Behind",
    desc: "Step into a peaceful environment where you can pause, breathe, and leave the day’s distractions behind.",
    src: "/images/slots/ritual-1.webp",
    alt: "Guests in robes arriving into a calm spa",
  },
  {
    eyebrow: "Unwind",
    title: "Settle Into Stillness",
    desc: "Take a moment to relax as your surroundings, calming aromas, and thoughtful details create a sense of complete ease.",
    src: "/images/slots/ritual-2.webp",
    alt: "Guest settling into stillness on a lounger",
  },
  {
    eyebrow: "Restore",
    title: "Care That Meets Your Needs",
    desc: "Experience thoughtfully selected treatments designed to ease tension, restore balance, and support your natural well-being.",
    src: "/images/slots/ritual-3.webp",
    alt: "Therapist providing a restorative treatment",
  },
  {
    eyebrow: "Rejuvenate",
    title: "Leave Feeling Renewed",
    desc: "Step back into your day feeling lighter, refreshed, and more connected to yourself.",
    src: "/images/slots/ritual-4.webp",
    alt: "Guest in a robe looking out at the morning light",
  },
];

/** "A Ritual Designed Around You": four alternating stages with a scroll-linked step counter. */
export function RitualStory() {
  const stagesRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [state, setState] = useState({ active: 0, progress: 0 });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let active = 0;
      rowRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) active = i;
      });
      let progress = 0;
      const box = stagesRef.current?.getBoundingClientRect();
      if (box) {
        const total = box.height - window.innerHeight;
        progress = total > 0 ? Math.min(1, Math.max(0, -box.top / total)) : 0;
      }
      setState((s) => (s.active === active && Math.abs(s.progress - progress) <= 0.004 ? s : { active, progress }));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="ritual" aria-labelledby="ritual-title" className="bg-cream py-section">
      <div className="mx-auto mb-lg max-w-wide px-gutter-wide">
        <div className="flex flex-wrap items-end justify-between gap-md">
          <div>
            <Eyebrow className="mb-md">The Experience</Eyebrow>
            <h2 id="ritual-title" className="m-0 font-medium text-ink">
              A Ritual Designed Around You
            </h2>
          </div>
          <div className="flex min-w-[180px] items-center gap-md" aria-hidden>
            <span className="font-body text-[13px] whitespace-nowrap text-subtle">0{state.active + 1} / 04</span>
            <div className="relative h-px min-w-[120px] flex-1 bg-[#e4e0d5]">
              <div className="absolute top-0 left-0 h-px bg-brand" style={{ width: `${Math.round(state.progress * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div ref={stagesRef} className="mx-auto max-w-wide px-gutter-wide">
        {STAGES.map((s, i) => (
          <RitualStage
            key={s.title}
            index={i}
            stage={s}
            reverse={i % 2 === 1}
            rowRef={(el) => {
              rowRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}

function RitualStage({
  index,
  stage,
  reverse,
  rowRef,
}: {
  index: number;
  stage: (typeof STAGES)[number];
  reverse: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="w-full">
      <div
        ref={rowRef}
        className={cn(
          "relative flex items-center gap-2xl py-xl transition-[transform,opacity] duration-900 ease-chy motion-reduce:translate-x-0 motion-reduce:opacity-100",
          reverse ? "flex-row-reverse" : "flex-row",
          "max-tablet:flex-col max-tablet:items-stretch max-tablet:gap-lg max-tablet:py-[28px]",
          shown ? "translate-x-0 opacity-100" : "-translate-x-[60px] opacity-0",
        )}
      >
        <div className="min-w-0 flex-[1_1_0] max-tablet:w-full max-tablet:flex-none">
          <span className="mb-md block font-body text-[13px] tracking-[0.1em] text-brand">
            0{index + 1} — {stage.eyebrow}
          </span>
          <h3 className="mt-0 mb-md font-heading text-[clamp(24px,2.8vw,32px)] font-medium text-ink max-md:text-[22px]">
            {stage.title}
          </h3>
          <p className="max-h-[220px] max-w-[44ch] overflow-hidden font-body text-[15.5px] leading-[1.7] text-ink-3 max-md:text-[15px]">
            {stage.desc}
          </p>
        </div>
        <div className="relative h-[60vh] min-w-0 flex-[1_1_0] overflow-hidden rounded-card min-[1101px]:rounded-panel max-tablet:h-[clamp(240px,70vw,420px)] max-tablet:w-full max-tablet:flex-none">
          <Image src={stage.src} alt={stage.alt} fill sizes="(max-width: 760px) 100vw, 45vw" className="object-cover" />
        </div>
      </div>
    </div>
  );
}
