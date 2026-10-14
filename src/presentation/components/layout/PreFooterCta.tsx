"use client";

import Link from "next/link";
import { useFitText } from "@/presentation/hooks/useFitText";
import { useReveal } from "@/presentation/hooks/useReveal";
import { cn } from "@/presentation/lib/cn";
import { routes } from "@/presentation/lib/routes";
import { Eyebrow } from "../ui/Eyebrow";
import { ArrowSolidIcon } from "../ui/Icon";

interface PreFooterCtaProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Paragraph measure: Membership uses 52ch, Home/About 48ch. */
  descriptionWidth?: "48ch" | "52ch";
  /** Card grows from 78% to full width as it scrolls into view (home page). */
  expandOnReveal?: boolean;
  className?: string;
}

/**
 * Dark band with a slowly drifting spa photo that sits directly above the footer.
 * The title always stays on one line, shrinking to fit.
 */
export function PreFooterCta({
  eyebrow = "Chaitanya Health & Wellness",
  title = "Begin Your Journey to Relaxation",
  description = "Take a moment for yourself with personalized care designed to restore, relax, and rejuvenate.",
  ctaLabel = "Book Your Appointment",
  ctaHref = routes.services(),
  descriptionWidth = "48ch",
  expandOnReveal = false,
  className,
}: PreFooterCtaProps) {
  const titleRef = useFitText<HTMLHeadingElement>(16);
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section className={cn("bg-white", className)} aria-label={title}>
      <div
        ref={ref}
        className={cn(
          "relative mx-auto box-border flex min-h-[clamp(380px,48vw,520px)] flex-col items-center justify-center overflow-hidden bg-brand-800 px-[clamp(24px,6vw,96px)] py-[clamp(64px,8vw,96px)] text-center",
          expandOnReveal
            ? "rounded-panel transition-[width] duration-[1400ms] ease-zoom motion-reduce:w-full max-sm:rounded-card"
            : "w-full",
          expandOnReveal && (shown ? "w-full" : "w-[78%]"),
        )}
      >
        <div
          aria-hidden
          className="absolute -inset-[4%] bg-[url('/images/photos/spa-tea-robes.jpg')] bg-cover bg-[center_40%] bg-no-repeat will-change-transform animate-[chy-ken-burns_28s_ease-in-out_infinite_alternate]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,46,52,0.72)_0%,rgba(7,46,52,0.6)_40%,rgba(7,46,52,0.92)_80%,#072E34_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_48%,rgba(0,125,103,0.45)_0%,rgba(0,125,103,0)_70%),radial-gradient(ellipse_45%_40%_at_85%_0%,rgba(79,187,165,0.18)_0%,rgba(79,187,165,0)_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:linear-gradient(180deg,transparent_0%,#000_60%,transparent_100%)]"
        />

        <div className="relative z-[1] flex w-full flex-col items-center">
          <Eyebrow tone="dark" align="center" className="mb-md">
            {eyebrow}
          </Eyebrow>
          <h3
            ref={titleRef}
            className={cn(
              "mx-auto mt-0 mb-sm w-fit max-w-full font-heading text-h2 leading-[1.15] font-bold tracking-[0.006em] whitespace-nowrap text-white",
            )}
          >
            {title}
          </h3>
          <p className={cn("mx-auto my-0 font-body text-[clamp(15px,1.3vw,17px)] leading-[1.65] text-pretty text-white/86", descriptionWidth === "52ch" ? "max-w-[52ch]" : "max-w-[48ch]")}>
            {description}
          </p>
          <div className="mt-lg flex justify-center gap-sm">
            <Link
              href={ctaHref}
              className="btn-sweep box-border flex h-11 items-center rounded-control bg-brand px-[28px] font-body text-[14px] font-medium whitespace-nowrap text-white no-underline hover:bg-brand-600"
            >
              {ctaLabel}
            </Link>
            <Link
              href={ctaHref}
              aria-label={ctaLabel}
              className="btn-sweep flex size-11 items-center justify-center rounded-control bg-brand text-white no-underline hover:bg-brand-600"
            >
              <ArrowSolidIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
