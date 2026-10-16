"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useEscapeKey } from "@/presentation/hooks/useEscapeKey";
import { useScrollLock } from "@/presentation/hooks/useScrollLock";
import { CloseIcon } from "../../ui/Icon";

interface BookingPathModalProps {
  category: string;
  name: string;
  durationLabel: string;
  priceLabel: string;
  therapistHref: string;
  availabilityHref: string;
  onClose: () => void;
}

/** "How would you like to book?" — Choose by Therapist or Choose by Availability. */
export function BookingPathModal(props: BookingPathModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useScrollLock(true);
  useEscapeKey(true, props.onClose);
  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
  }, []);

  const pathClass =
    "flex flex-col items-start gap-sm rounded-card border border-line-2 px-md py-[18px] text-ink no-underline transition-[border-color,background-color] duration-200 hover:border-brand hover:bg-surface hover:text-ink max-md:px-3 max-md:py-[14px]";

  return (
    <div
      onClick={props.onClose}
      className="fixed inset-0 z-50 box-border flex items-center justify-center bg-[rgba(7,46,52,0.55)] p-5 animate-[chy-fade-in_.2s_ease_both]"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-path-title"
        onClick={(e) => e.stopPropagation()}
        className="relative box-border max-h-[calc(100dvh-40px)] w-full max-w-[480px] overflow-y-auto rounded-menu bg-white p-[clamp(24px,6vw,48px)] animate-[chy-menu-in_.3s_var(--ease-chy)_both]"
      >
        <button
          type="button"
          onClick={props.onClose}
          aria-label="Close"
          className="absolute top-md right-md border-0 bg-transparent p-1 text-subtle hover:text-ink"
        >
          <CloseIcon size={20} strokeWidth={2} />
        </button>
        <span className="mb-sm block font-body text-[12px] tracking-[0.1em] text-brand uppercase">{props.category}</span>
        <h3
          id="booking-path-title"
          className="mt-0 mb-md pr-8 font-heading text-[24px] leading-[1.25] font-bold text-balance text-ink max-md:text-[20px]"
        >
          {props.name}
        </h3>
        <div className="mb-xl flex flex-wrap items-center gap-md font-body text-[13.5px] text-ink-2">
          <span className="inline-flex items-center gap-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007D67" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {props.durationLabel}
          </span>
          <span className="h-4 w-px bg-line-2" aria-hidden />
          <span className="font-bold text-brand">{props.priceLabel}</span>
        </div>
        <p className="mt-0 mb-md font-body text-[14px] font-bold text-ink">How would you like to book?</p>
        <div className="grid grid-cols-2 gap-md max-md:grid-cols-1 max-md:gap-sm">
          <Link href={props.therapistHref} className={pathClass}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007D67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C7.56 3.99 9.54 2 12 2a4.435 4.435 0 0 1 .16 8.87Z" />
              <path d="M7.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z" />
              <path d="m16.5 17.5 1.2 1.2 2.4-2.4" />
            </svg>
            <span>
              <span className="block font-heading text-[15.5px] font-semibold">Choose by Therapist</span>
              <span className="mt-0.5 block font-body text-[13px] text-muted">Pick who treats you</span>
            </span>
          </Link>
          <Link href={props.availabilityHref} className={pathClass}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007D67" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M8 2v3" />
              <path d="M16 2v3" />
              <path d="M3.5 9.09h17" />
              <path d="M21 8.5v8.5c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" />
              <path d="m9 15.5 2 2 4-4" />
            </svg>
            <span>
              <span className="block font-heading text-[15.5px] font-semibold">Choose by Availability</span>
              <span className="mt-0.5 block font-body text-[13px] text-muted">Pick a date &amp; time</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
