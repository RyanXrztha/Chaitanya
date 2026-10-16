"use client";

import Link from "next/link";
import { useState } from "react";
import { formatNpr, type Service } from "@/domain";
import { cn } from "@/presentation/lib/cn";
import { routes } from "@/presentation/lib/routes";
import { Eyebrow } from "../../ui/Eyebrow";
import { ArrowSolidIcon } from "../../ui/Icon";
import { DetailGallery } from "../catalog/DetailGallery";
import { BookingPathModal } from "./BookingPathModal";

/** Service detail: sticky gallery | info (duration options, price, description, Book CTA → modal). */
export function ServiceDetailView({ service }: { service: Service }) {
  const [durationIdx, setDurationIdx] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const duration = service.durations[durationIdx];
  const priceLabel = formatNpr(duration.price);
  const multi = service.durations.length > 1;
  const bookParams = { service: service.slug, duration: multi ? String(duration.minutes) : undefined };

  return (
    <section className="bg-white px-gutter-wide pt-lg pb-section">
      <p className="mt-0 mb-lg font-body text-[13px] text-[#5c6a4a]">
        <Link href={routes.page("home")} className="text-inherit no-underline hover:text-brand">
          Home
        </Link>{" "}
        &nbsp;/&nbsp;{" "}
        <Link href={routes.services()} className="text-inherit no-underline hover:text-brand">
          Services
        </Link>{" "}
        &nbsp;/&nbsp; <span className="text-ink-dark">{service.name}</span>
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-[clamp(32px,5vw,64px)] max-xl:grid-cols-1 max-xl:gap-xl max-md:gap-lg">
        <DetailGallery photos={service.images} variant="service" />

        <div className="sticky top-24 box-border max-h-[calc(100vh-120px)] overflow-y-auto py-sm pr-sm [scrollbar-color:#d8d9d1_transparent] [scrollbar-width:thin] max-xl:static max-xl:max-h-none max-xl:overflow-visible">
          <Eyebrow className="mb-md">{service.categoryLabel}</Eyebrow>
          <h1 className="mt-0 mb-md font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.15] font-bold text-ink max-md:text-[24px]">
            {service.name}
          </h1>

          {multi ? (
            <div className="mb-lg border-y border-[#eceae0] py-md">
              <span className="mb-sm block font-body text-[11px] tracking-[0.06em] text-subtle uppercase">Duration</span>
              <div role="radiogroup" aria-label="Duration" className="mb-md flex flex-wrap gap-sm">
                {service.durations.map((d, i) => (
                  <button
                    key={d.minutes}
                    type="button"
                    role="radio"
                    aria-checked={i === durationIdx}
                    onClick={() => setDurationIdx(i)}
                    className={cn(
                      "h-10 rounded-control border px-md font-body text-[14px] font-medium transition-colors duration-200",
                      i === durationIdx ? "border-brand bg-brand-100 text-brand" : "border-line-2 bg-surface-2 text-ink hover:border-brand",
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <span className="mb-0.5 block font-body text-[11px] tracking-[0.06em] text-subtle uppercase">Price</span>
              <span className="font-heading text-[16px] font-semibold text-brand max-md:text-[15px]">{priceLabel}</span>
            </div>
          ) : (
            <div className="mb-lg flex items-center gap-lg border-y border-[#eceae0] py-md">
              <div>
                <span className="mb-0.5 block font-body text-[11px] tracking-[0.06em] text-subtle uppercase">Duration</span>
                <span className="font-heading text-[16px] font-semibold text-ink max-md:text-[15px]">{duration.label}</span>
              </div>
              <div className="h-8 w-px bg-line-2" aria-hidden />
              <div>
                <span className="mb-0.5 block font-body text-[11px] tracking-[0.06em] text-subtle uppercase">Price</span>
                <span className="font-heading text-[16px] font-semibold text-brand max-md:text-[15px]">{priceLabel}</span>
              </div>
            </div>
          )}

          <p className="mt-0 mb-2xl max-w-[48ch] font-body text-[15.5px] leading-[1.75] text-ink-2 max-md:text-[15px]">
            {service.description}
          </p>

          <div className="flex gap-sm max-md:sticky max-md:bottom-3 max-md:z-[6] max-md:drop-shadow-[0_10px_18px_rgba(7,46,52,0.22)]">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-sweep box-border flex h-12 items-center justify-center rounded-control border-0 bg-brand px-[30px] font-body text-[15px] font-medium text-white hover:bg-brand-600 max-md:flex-auto"
            >
              Book Now
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              aria-label="Book Now"
              className="btn-sweep flex size-12 items-center justify-center rounded-control border-0 bg-brand text-white hover:bg-brand-600"
            >
              <ArrowSolidIcon />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <BookingPathModal
          category={service.categoryLabel}
          name={service.name}
          durationLabel={duration.label}
          priceLabel={priceLabel}
          therapistHref={routes.booking({ ...bookParams, flow: "therapist" })}
          availabilityHref={routes.booking({ ...bookParams, flow: "availability" })}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
