"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/presentation/lib/cn";
import { routes } from "@/presentation/lib/routes";
import { Eyebrow } from "../../ui/Eyebrow";
import { Select } from "../../ui/Select";

export interface TreatmentTab {
  key: string;
  label: string;
  items: { slug: string; title: string; category: string; price: string; image: { src: string; alt: string } }[];
}

const ctrlBorder = "border border-[#0C3F47]";

/** "Signature Treatments": category tabs (a select ≤760px) over a horizontally scrolling card row. */
export function SignatureTreatments({ tabs }: { tabs: TreatmentTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");
  const rowRef = useRef<HTMLDivElement>(null);
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];

  const choose = (key: string) => {
    setActive(key);
    rowRef.current?.scrollTo({ left: 0 });
  };

  const scrollBy = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.firstElementChild as HTMLElement | null;
    row.scrollBy({ left: dir * (card ? card.offsetWidth + 16 : 360), behavior: "smooth" });
  };

  return (
    <section
      id="featured-services"
      aria-labelledby="signature-title"
      className="box-border flex min-h-screen flex-col overflow-hidden bg-[#262524] py-section text-white"
    >
      <div className="mx-auto box-border flex min-h-0 w-full max-w-wide flex-1 flex-col px-[clamp(24px,5vw,48px)]">
        <div className="mb-lg text-left">
          <Eyebrow tone="dark" className="mb-md">
            Our Services
          </Eyebrow>
          <h2 id="signature-title" className="mt-0 mb-sm leading-[1.1] font-semibold text-white">
            Signature Treatments
          </h2>
          <p className="m-0 max-w-full font-body text-[16px] leading-[1.6] text-pretty text-white/75 max-md:text-[15px]">
            Thoughtfully crafted treatments to restore balance and reveal your natural glow.
          </p>
        </div>

        <div className="mb-xl flex flex-wrap items-center gap-md max-tablet:flex-nowrap max-tablet:gap-sm">
          <div role="tablist" aria-label="Treatment category" className="flex flex-wrap items-center gap-md max-tablet:hidden">
            {tabs.map((t) => {
              const on = t.key === tab.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => choose(t.key)}
                  className={cn(
                    "rounded-control border px-[20px] py-[10px] font-body text-[13.5px] font-medium whitespace-nowrap text-white transition-colors duration-250",
                    on ? "border-brand bg-brand" : "border-[#0C3F47] bg-transparent hover:border-brand-400",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="relative hidden min-w-0 flex-1 max-tablet:block">
            <Select
              label="Treatment category"
              value={tab.key}
              onValueChange={choose}
              options={tabs.map((t) => ({ value: t.key, label: t.label }))}
              className={cn(
                "box-border h-11 w-full rounded-control bg-brand-800 pr-12 pl-[18px] font-body text-[16px] font-semibold text-white",
                ctrlBorder,
              )}
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="pointer-events-none absolute top-[14px] right-md"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-md max-tablet:ml-0 max-tablet:gap-sm">
            <Link
              href={routes.services({ cat: tab.key })}
              className={cn(
                "box-border inline-flex items-center rounded-chip px-[20px] py-[10px] font-body text-[13.5px] whitespace-nowrap text-white no-underline transition-colors duration-250 hover:border-brand-400 hover:text-white max-tablet:h-10 max-tablet:px-[14px] max-tablet:py-0 max-tablet:text-[13px]",
                ctrlBorder,
              )}
            >
              View All
            </Link>
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollBy(dir)}
                aria-label={dir < 0 ? "Previous" : "Next"}
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-control bg-transparent text-white transition-colors duration-250 hover:border-brand-400",
                  ctrlBorder,
                )}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {dir < 0 ? (
                    <>
                      <path d="M19 12H5" />
                      <path d="m12 19-7-7 7-7" />
                    </>
                  ) : (
                    <>
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </>
                  )}
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={rowRef}
          role="tabpanel"
          aria-label={tab.label}
          className="grid min-h-0 flex-1 auto-cols-[calc((100%-32px)/3.2)] grid-flow-col gap-md overflow-x-auto scroll-smooth pb-1 scrollbar-none max-lg:auto-cols-[calc((100%-16px)/2.15)] max-md:min-h-[460px] max-md:auto-cols-[86%] max-md:snap-x max-md:snap-mandatory max-md:overscroll-x-contain"
        >
          {tab.items.map((svc) => (
            <Link
              key={svc.slug}
              href={routes.service(svc.slug)}
              aria-label={`${svc.title} — view details`}
              className="group relative flex h-full cursor-pointer flex-col text-inherit no-underline hover:text-inherit max-md:snap-start"
            >
              <figure className="relative m-0 min-h-0 flex-1 overflow-hidden rounded-card">
                <Image
                  src={svc.image.src}
                  alt={svc.image.alt}
                  fill
                  sizes="(max-width: 640px) 86vw, (max-width: 960px) 46vw, 31vw"
                  className="object-cover transition-transform duration-600 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.08] group-focus-visible:scale-[1.08]"
                />
                <span className="absolute top-md left-md bg-transparent p-0 font-body text-[13px] font-bold tracking-[0.04em] text-white uppercase [text-shadow:0_1px_6px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.5)]">
                  {svc.category}
                </span>
              </figure>
              <div className="flex flex-none items-center justify-between gap-md px-1 pt-[14px]">
                <div className="relative h-6 min-w-0 flex-1">
                  <div className="absolute inset-0 flex items-center transition-[opacity,transform] duration-300 group-hover:-translate-y-1.5 group-hover:opacity-0 group-focus-visible:-translate-y-1.5 group-focus-visible:opacity-0">
                    <h3 className="m-0 truncate font-heading text-[16px] font-normal tracking-[0.03em] text-white uppercase max-md:text-[15px]">
                      {svc.title}
                    </h3>
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex translate-y-1.5 items-center opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  >
                    <span className="font-heading text-[16px] font-semibold tracking-[0.03em] whitespace-nowrap text-white uppercase max-md:text-[15px]">
                      View Details →
                    </span>
                  </div>
                </div>
                <span className="flex-none font-body text-[14px] font-semibold text-white">{svc.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
