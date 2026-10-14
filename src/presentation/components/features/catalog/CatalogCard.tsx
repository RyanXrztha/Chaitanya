import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

export interface CatalogCardData {
  id: string;
  href: string;
  /** "Book Now" (services → booking) or "Buy Now" (products → detail). */
  ctaHref: string;
  ctaLabel: string;
  label: string;
  name: string;
  priceLabel: string;
  image: { src: string; alt: string };
}

/**
 * Service / product card: rounded image tile that zooms on hover, label, name and a
 * price that swaps for "Book Now →" / "Buy Now →" on hover.
 */
export function CatalogCard({ card, style, eager }: { card: CatalogCardData; style?: CSSProperties; eager?: boolean }) {
  return (
    <article
      style={style}
      className="group relative flex min-w-0 flex-col gap-md bg-transparent motion-safe:animate-[chy-sv-in_.6s_var(--ease-chy)_both] max-sm:gap-sm"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-surface max-sm:rounded-[14px]">
        <div className="absolute inset-0 transition-transform duration-1000 ease-chy group-hover:scale-[1.045]">
          <Image
            src={card.image.src}
            alt={card.image.alt}
            fill
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            sizes="(max-width: 1100px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <Link href={card.href} aria-label={card.name} className="absolute inset-0 z-[1]" />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 px-3">
        <span className="truncate font-body text-[13px] tracking-[0.04em] text-muted uppercase">{card.label}</span>
        <div className="flex min-w-0 items-baseline justify-between gap-md max-sm:flex-col max-sm:gap-1">
          <Link href={card.href} className="min-w-0 text-inherit no-underline hover:text-inherit">
            <h3 className="m-0 line-clamp-2 font-body text-[18px] leading-[1.35] font-medium text-pretty text-ink transition-colors duration-300 group-hover:text-brand max-sm:text-[14.5px] max-sm:leading-[1.3]">
              {card.name}
            </h3>
          </Link>
          <Link
            href={card.ctaHref}
            aria-label={`${card.ctaLabel} – ${card.name}`}
            className="group/cta inline-grid flex-none items-center justify-items-end whitespace-nowrap no-underline max-sm:justify-items-start"
          >
            <span className="[grid-area:1/1] font-body text-[17px] font-medium text-ink transition-[opacity,transform] duration-[300ms,450ms] ease-chy group-focus-visible/cta:opacity-0 max-sm:text-[14px] [@media(hover:hover)]:group-hover:-translate-y-2 [@media(hover:hover)]:group-hover:opacity-0">
              {card.priceLabel}
            </span>
            <span className="pointer-events-none inline-flex translate-y-2 items-center gap-1.5 font-body text-[16px] font-semibold text-brand opacity-0 transition-[opacity,transform] duration-[300ms,450ms] ease-chy [grid-area:1/1] group-focus-visible/cta:translate-y-0 group-focus-visible/cta:opacity-100 max-sm:text-[14px] [@media(hover:hover)]:group-hover:pointer-events-auto [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
              {card.ctaLabel}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 group-hover/cta:translate-x-1">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
