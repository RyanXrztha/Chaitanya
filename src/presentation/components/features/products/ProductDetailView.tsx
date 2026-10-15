"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MAX_ORDER_QUANTITY, formatAmount, formatNpr, priceForSize, type Product, type ProductSize } from "@/domain";
import { cn } from "@/presentation/lib/cn";
import { routes } from "@/presentation/lib/routes";
import { Eyebrow } from "../../ui/Eyebrow";
import { CheckIcon } from "../../ui/Icon";
import { DetailGallery } from "../catalog/DetailGallery";
import { CheckoutModal } from "./CheckoutModal";

interface ProductDetailViewProps {
  product: Product;
  sizes: ProductSize[];
  related: Product[];
}

const optLabel = "mb-sm block font-body text-[12px] font-bold tracking-[0.06em] text-ink uppercase";

function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-0.5 text-brand", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

const PERKS: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: (
      <>
        <path d="M1 3h15v13H1z" />
        <path d="M16 8h4l3 3v5h-7z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
    title: "Free delivery",
    text: "Inside Kathmandu Valley",
  },
  {
    icon: (
      <>
        <path d="M12 22c5.5-2.4 8-6.6 8-12V5l-8-3-8 3v5c0 5.4 2.5 9.6 8 12z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    title: "100% natural",
    text: "No additives",
  },
  {
    icon: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    title: "Easy returns",
    text: "Within 7 days",
  },
];

/** Product detail (Nike-style on mobile): gallery, size/qty, Add to Cart / Buy Now, perks, accordion, related. */
export function ProductDetailView({ product, sizes, related }: ProductDetailViewProps) {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState(0);
  const [toast, setToast] = useState(false);
  const [openTab, setOpenTab] = useState(0);
  const [checkout, setCheckout] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const size = sizes[sizeIdx];
  const unit = priceForSize(product, size);
  const priceLabel = formatNpr(unit, { decimals: true });
  const total = unit * qty;
  const totalLabel = formatNpr(total, { decimals: true });
  const reviewsLabel = `${product.rating} · ${product.reviewCount} reviews`;

  const addToCart = () => {
    setCart((c) => c + qty);
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2600);
  };
  const onPlaced = useCallback(() => setCart(0), []);

  const tabs: [string, string][] = [
    ["Benefits", product.description],
    ["Ingredients", product.ingredients],
    ["How to Use", product.howToUse],
  ];

  return (
    <>
      <section className="bg-white px-gutter-wide pt-lg pb-section">
        <p className="mt-0 mb-lg font-body text-[13px] text-muted">
          <Link href={routes.page("home")} className="text-inherit no-underline hover:text-brand">
            Home
          </Link>{" "}
          &nbsp;/&nbsp;{" "}
          <Link href={routes.products()} className="text-inherit no-underline hover:text-brand">
            Products
          </Link>{" "}
          &nbsp;/&nbsp; <span className="text-ink-dark">{product.name}</span>
        </p>

        {/* Mobile header (≤640px) sits above the gallery. */}
        <div className="mb-md hidden max-md:block">
          <Eyebrow className="mb-sm">{product.category}</Eyebrow>
          <p className="mt-0 mb-sm font-heading text-[21px] leading-[1.2] font-bold text-ink" aria-hidden>
            {product.name}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-md">
            <span className="font-heading text-[18px] font-bold text-ink">{priceLabel}</span>
            <span className="flex items-center gap-sm font-body text-[13px] text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#007D67" aria-hidden>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              {reviewsLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-[clamp(32px,5vw,64px)] max-xl:grid-cols-1 max-xl:gap-xl max-md:gap-lg">
          <DetailGallery photos={product.images} variant="product" badge={product.badge} />

          <div className="max-md:flex max-md:flex-col">
            <div className="max-md:hidden">
              <Eyebrow className="mb-md">{product.category}</Eyebrow>
              <h1 className="mt-0 mb-md font-heading text-[clamp(28px,3.6vw,40px)] leading-[1.15] font-bold text-ink">{product.name}</h1>
              <div className="mb-md flex items-center gap-sm">
                <Stars />
                <span className="font-body text-[13.5px] text-muted">{reviewsLabel}</span>
              </div>
              <div className="mb-md flex items-baseline gap-md">
                <span className="font-heading text-[30px] font-bold text-ink">{priceLabel}</span>
                <span className="font-body text-[13.5px] text-muted">Inclusive of taxes</span>
              </div>
            </div>
            <h1 className="sr-only md:hidden">{product.name}</h1>

            <p className="mt-0 mb-lg max-w-[52ch] font-body text-[16px] leading-[1.7] text-ink-2 max-md:order-3 max-md:mt-1 max-md:text-[15px]">
              {product.description}
            </p>

            <div className="mb-lg flex flex-col gap-md border-y border-[#eceae0] py-lg max-md:order-1 max-md:border-t-0 max-md:pt-1">
              <div>
                <span className={cn(optLabel, "flex justify-between")} id="size-label">
                  Select Size
                </span>
                <div role="radiogroup" aria-labelledby="size-label" className="flex flex-wrap gap-sm max-md:grid max-md:grid-cols-3">
                  {sizes.map((s, i) => {
                    const on = i === sizeIdx;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setSizeIdx(i)}
                        className={cn(
                          "h-11 rounded-control border-[1.5px] px-[18px] font-body text-[14px] font-medium transition-[background-color,border-color,color] duration-200 max-md:h-[52px] max-md:px-sm",
                          on ? "border-brand bg-brand-100 text-brand" : "border-line-2 bg-surface-2 text-ink hover:border-brand",
                        )}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-md">
                <div>
                  <span className={optLabel} id="qty-label">
                    Quantity
                  </span>
                  <div role="group" aria-labelledby="qty-label" className="inline-flex h-11 items-center rounded-chip border border-line-2 bg-surface-2">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      aria-label="Decrease quantity"
                      className="flex size-11 items-center justify-center border-0 bg-transparent text-ink disabled:opacity-40"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                    <span className="min-w-7 text-center font-body text-[15px] font-bold text-ink" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(MAX_ORDER_QUANTITY, q + 1))}
                      disabled={qty >= MAX_ORDER_QUANTITY}
                      aria-label="Increase quantity"
                      className="flex size-11 items-center justify-center border-0 bg-transparent text-ink disabled:opacity-40"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <span className="mb-sm block font-body text-[12px] tracking-[0.06em] text-subtle uppercase">Total</span>
                  <span className="font-heading text-[22px] font-bold text-brand max-md:text-[18px]">{totalLabel}</span>
                </div>
              </div>
            </div>

            <div className="mb-lg grid grid-cols-2 gap-sm max-md:order-2 max-md:grid-cols-1">
              <button
                type="button"
                onClick={addToCart}
                className="flex h-[52px] items-center justify-center gap-sm rounded-control border border-ink-dark bg-white font-body text-[15px] font-medium text-ink-dark transition-colors duration-250 hover:bg-ink-dark hover:text-white max-md:h-[50px] max-md:px-2.5 max-md:text-[14px]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
                {cart ? `In Cart (${cart})` : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={() => setCheckout(true)}
                className="btn-sweep flex h-[52px] items-center justify-center gap-sm rounded-control border-0 bg-brand font-body text-[15px] font-medium text-white hover:bg-brand-600 max-md:-order-1 max-md:h-[50px] max-md:px-2.5 max-md:text-[14px]"
              >
                Buy Now
              </button>
            </div>

            <div className="mb-lg grid grid-cols-3 gap-sm max-md:order-4 max-md:grid-cols-1 max-md:gap-0 max-md:border-t max-md:border-[#eceae0]">
              {PERKS.map((p) => (
                <div
                  key={p.title}
                  className="flex flex-col items-start gap-sm rounded-card bg-surface p-[14px] max-md:flex-row max-md:items-center max-md:gap-md max-md:rounded-none max-md:border-b max-md:border-[#eceae0] max-md:bg-transparent max-md:px-0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007D67" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="flex-none">
                    {p.icon}
                  </svg>
                  <span className="font-body text-[13px] leading-[1.4] text-ink max-md:text-[14px]">
                    <strong className="max-md:mr-sm">{p.title}</strong>
                    <br className="max-md:hidden" /> {p.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col max-md:order-5 max-md:border-t max-md:border-[#eceae0]">
              {tabs.map(([title, body], i) => {
                const open = openTab === i;
                return (
                  <div key={title} className="border-b border-[#eceae0]">
                    <button
                      type="button"
                      onClick={() => setOpenTab(open ? -1 : i)}
                      aria-expanded={open}
                      aria-controls={`pd-tab-${i}`}
                      className="flex w-full items-center justify-between gap-md border-0 bg-transparent py-[18px] text-left"
                    >
                      <span className="font-body text-[17px] font-medium text-ink max-md:text-[15px]">{title}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#201e1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={cn("flex-none transition-transform duration-300", open && "rotate-180")}>
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                    <div
                      id={`pd-tab-${i}`}
                      inert={!open}
                      className={cn(
                        "overflow-hidden transition-[max-height,opacity] duration-[400ms,300ms] ease-chy",
                        open ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0",
                      )}
                    >
                      <p className="mt-0 mb-md font-body text-[15px] leading-[1.7] text-ink-2">{body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-gutter-wide py-section">
        <div className="mb-lg flex flex-wrap items-end justify-between gap-md">
          <div className="flex flex-col">
            <Eyebrow className="mb-md">Related Products</Eyebrow>
            <h2 className="m-0 font-bold text-ink">You May Also Like</h2>
          </div>
          <Link href={routes.products()} className="font-body text-[14px] font-bold no-underline">
            View all products &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-lg sm:max-desktop:grid-cols-2 max-md:grid-cols-2 max-md:gap-md">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={routes.product(r.slug)}
              className="group flex flex-col overflow-hidden rounded-card bg-white text-ink no-underline hover:text-ink"
            >
              <figure className="relative m-0 aspect-square overflow-hidden">
                <Image
                  src={r.images[0].src}
                  alt={r.images[0].alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-[scale] duration-[1200ms] ease-zoom group-hover:scale-105"
                />
              </figure>
              <div className="px-md pt-[14px] pb-[18px]">
                <span className="mb-sm block font-body text-[13.5px] font-bold tracking-[0.03em] uppercase transition-colors group-hover:text-brand">
                  {r.name}
                </span>
                <span className="font-body text-[13.5px] text-muted">
                  NPR <strong className="text-ink">{formatAmount(r.basePrice, { decimals: true })}</strong>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {toast && (
        <div
          role="status"
          className="fixed bottom-[28px] left-1/2 z-[70] box-border flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-md rounded-chip bg-ink-dark px-5 py-[14px] font-body text-[14.5px] font-semibold text-white shadow-[0_16px_36px_-12px_rgba(7,46,52,0.5)] animate-[chy-pd-toast-in_.4s_var(--ease-chy)_both] max-md:bottom-md max-md:px-md max-md:py-3 max-md:text-[13.5px]"
        >
          <span className="flex size-[22px] items-center justify-center rounded-chip bg-brand">
            <CheckIcon size={13} strokeWidth={3} className="text-white" />
          </span>
          {product.name} added to cart
        </div>
      )}

      {checkout && (
        <CheckoutModal
          productId={product.id}
          name={product.name}
          image={product.images[0]}
          sizeIndex={sizeIdx}
          sizeLabel={size.label}
          quantity={qty}
          total={total}
          onClose={() => setCheckout(false)}
          onPlaced={onPlaced}
        />
      )}
    </>
  );
}
