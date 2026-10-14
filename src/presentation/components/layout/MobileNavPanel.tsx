"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/presentation/lib/cn";
import { NAV_ITEMS, PAGE_PATHS, type NavKey } from "@/presentation/lib/routes";
import type { MegaMenuCategory } from "@/presentation/lib/site-data";
import { ArrowUpRightIcon, UserIcon } from "../ui/Icon";
import { AccountLabel } from "./AccountProvider";

interface MobileNavPanelProps {
  id: string;
  /** Over the home hero the panel floats as an inset card; otherwise it spans the width. */
  floating: boolean;
  current: NavKey | null;
  categories: MegaMenuCategory[];
  onNavigate: () => void;
}

/** ≤1100px menu below the header, with a Services accordion. */
export function MobileNavPanel({ id, floating, current, categories, onNavigate }: MobileNavPanelProps) {
  const [servicesOpen, setServicesOpen] = useState(false);

  const itemClass = (on: boolean) =>
    cn("font-body text-[17px] max-md:text-[15px]", on ? "font-bold text-brand" : "font-medium text-ink");

  return (
    <div
      id={id}
      className={cn(
        "absolute flex flex-col bg-white text-ink animate-[chy-menu-in_.28s_var(--ease-chy)_both] desktop:hidden",
        floating
          ? "top-[calc(100%+8px)] right-[clamp(12px,3vw,24px)] left-[clamp(12px,3vw,24px)] rounded-menu px-[20px] pt-sm pb-[20px] shadow-[0_24px_40px_rgba(7,46,52,0.25)]"
          : "inset-x-0 top-full max-h-[calc(100dvh-70px)] overflow-y-auto border-t border-[#eceee9] px-[clamp(24px,4vw,48px)] pt-sm pb-[20px] shadow-[0_18px_30px_rgba(7,46,52,0.14)]",
      )}
    >
      {NAV_ITEMS.map((item) => {
        const on = item.key === current;
        if (item.key !== "services") {
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onNavigate}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex min-h-[52px] items-center justify-between border-b border-[#eceee9] no-underline",
                itemClass(on),
              )}
            >
              {item.label}
              <ArrowUpRightIcon />
            </Link>
          );
        }
        return (
          <div key={item.key} className="border-b border-[#eceee9]">
            <button
              type="button"
              onClick={() => setServicesOpen((o) => !o)}
              aria-expanded={servicesOpen}
              className={cn(
                "flex min-h-[52px] w-full items-center justify-between border-0 bg-transparent p-0 text-left font-body text-[17px] font-medium max-md:text-[15px]",
                on ? "text-brand" : "text-ink",
              )}
            >
              {item.label}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={cn("transition-transform duration-300", servicesOpen && "rotate-180")}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-350 ease-chy",
                servicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden" inert={!servicesOpen}>
                <div className="flex flex-col pb-md">
                  {categories.map((c) => (
                    <Link
                      key={c.key}
                      href={c.href}
                      onClick={onNavigate}
                      className="flex min-h-11 items-center px-md font-body text-[15px] text-[#2F4A47] no-underline hover:bg-brand-100 hover:text-brand"
                    >
                      {c.label}
                    </Link>
                  ))}
                  <Link
                    href={PAGE_PATHS.services}
                    onClick={onNavigate}
                    className="flex min-h-11 items-center px-md font-body text-[15px] font-bold text-brand no-underline"
                  >
                    View all services →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <Link
        href={PAGE_PATHS["sign-in"]}
        onClick={onNavigate}
        className="mt-md flex h-11 items-center justify-center gap-sm rounded-control bg-brand font-body text-[15px] font-medium text-white no-underline"
      >
        <UserIcon />
        <AccountLabel />
      </Link>
      <Link
        href={PAGE_PATHS.booking}
        onClick={onNavigate}
        className="mt-sm flex h-11 items-center justify-center rounded-control border-[1.5px] border-brand font-body text-[15px] font-medium text-brand no-underline"
      >
        Book a Treatment
      </Link>
    </div>
  );
}
