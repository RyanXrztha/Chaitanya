"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/presentation/lib/cn";
import type { MegaMenuCategory } from "@/presentation/lib/site-data";
import { ArrowRightIcon } from "../ui/Icon";

interface MegaMenuProps {
  top: number;
  categories: MegaMenuCategory[];
  activeKey: string;
  onActivate: (key: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/** Desktop Services menu: categories | featured services of the hovered category | photo tile. */
export function MegaMenu({ top, categories, activeKey, onActivate, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const cat = categories.find((c) => c.key === activeKey) ?? categories[0];
  if (!cat) return null;

  return (
    <div
      role="menu"
      aria-label="Services"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ top }}
      className="fixed inset-x-0 z-[39] max-h-[calc(100vh-96px)] overflow-y-auto border-t border-[#eceee9] bg-white shadow-[0_32px_64px_-24px_rgba(7,46,52,0.28)] animate-[chy-menu-in_.28s_var(--ease-chy)_both] max-desktop:hidden"
    >
      <div className="mx-auto grid max-w-site grid-cols-[280px_minmax(0,1fr)_300px] items-start gap-2xl px-[clamp(24px,4vw,64px)] pt-xl pb-2xl">
        <div className="flex flex-col">
          <span className="mb-md font-body text-[12px] font-bold tracking-[0.14em] text-muted uppercase">
            Browse by category
          </span>
          {categories.map((c, i) => {
            const on = c.key === cat.key;
            return (
              <Link
                key={c.key}
                href={c.href}
                role="menuitem"
                onMouseEnter={() => onActivate(c.key)}
                onFocus={() => onActivate(c.key)}
                style={{ animationDelay: `${0.04 * i}s` }}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-sm rounded-control px-md font-heading text-[17px] no-underline transition-[background-color,color] duration-250 animate-[chy-mega-item_.35s_var(--ease-chy)_both] hover:text-brand",
                  on ? "bg-brand-100 font-bold text-brand" : "bg-transparent font-medium text-ink",
                )}
              >
                {c.label}
                <ArrowRightIcon
                  className={cn(
                    "transition-[opacity,transform] duration-250",
                    on ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0",
                  )}
                />
              </Link>
            );
          })}
        </div>

        <div className="min-w-0">
          <div className="mb-sm flex flex-wrap items-center gap-md">
            <h3 className="m-0 font-heading text-[28px] leading-[1.2] font-bold text-ink">{cat.label}</h3>
            <span className="inline-flex h-6 items-center rounded-chip bg-brand-100 px-sm font-body text-[12px] font-bold text-brand">
              {cat.count} services
            </span>
          </div>
          <p className="mt-0 mb-lg max-w-[52ch] font-body text-[15px] leading-[1.6] text-muted">{cat.blurb}</p>
          {cat.chips.length > 0 && (
            <div className="mb-md flex flex-wrap gap-sm">
              {cat.chips.map((chip) => (
                <Link
                  key={chip.href}
                  href={chip.href}
                  className="inline-flex h-9 items-center rounded-chip border border-line-3 px-md font-body text-[13.5px] font-semibold text-ink-dark no-underline transition-[border-color,background-color,color] duration-250 hover:border-brand hover:bg-brand-100 hover:text-brand"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-xl">
            {cat.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="box-border flex min-h-[76px] items-start justify-between gap-md border-b border-line py-md text-ink no-underline transition-colors duration-250 hover:text-brand"
              >
                <span className="line-clamp-2 min-w-0 flex-auto font-body text-[15px] leading-[1.4]">{item.name}</span>
                <span className="shrink-0 pt-0.5 font-body text-[13px] font-bold whitespace-nowrap text-brand">
                  {item.priceLabel}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href={cat.href}
            className="mt-lg inline-flex items-center gap-sm font-body text-[14.5px] font-bold text-brand no-underline hover:text-brand-700"
          >
            View all {cat.count} {cat.label} services
            <ArrowRightIcon />
          </Link>
        </div>

        <Link
          href={cat.href}
          className="group relative block aspect-[4/5] max-h-[420px] w-full overflow-hidden rounded-menu bg-brand-800 no-underline"
        >
          <Image
            key={cat.key}
            src={cat.image.src}
            alt=""
            fill
            sizes="300px"
            className="object-cover animate-fade-in"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-xs bg-[linear-gradient(0deg,rgba(7,46,52,0.92)_0%,rgba(7,46,52,0.6)_55%,rgba(7,46,52,0)_100%)] px-lg pt-2xl pb-lg">
            <span className="font-body text-[11.5px] font-bold tracking-[0.14em] text-white uppercase opacity-85">
              Explore
            </span>
            <span className="font-heading text-[20px] font-semibold text-white">{cat.label}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
