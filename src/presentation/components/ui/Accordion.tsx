"use client";

import { useId, useState } from "react";
import { cn } from "@/presentation/lib/cn";
import { ChevronDownIcon } from "./Icon";

export interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** "chevron": Info FAQs (18px questions). "plus": Membership FAQs (compact, + turns to ×). */
  variant?: "chevron" | "plus";
  /** Index open on first render; -1 for none. */
  defaultOpen?: number;
  className?: string;
}

/** Single-open FAQ list. Answers slide open; closed answers are inert. */
export function Accordion({ items, variant = "chevron", defaultOpen = 0, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const plus = variant === "plus";

  return (
    <div className={cn("flex flex-col", plus && "gap-[2px]", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={cn("border-b", plus ? "border-[#e6e6de]" : "border-[#eceae0]")}>
            <h3 className="m-0 text-[length:inherit] font-[inherit] leading-[inherit] tracking-normal">
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={cn(
                  "flex w-full items-center justify-between gap-md border-0 bg-transparent text-left text-ink",
                  plus ? "px-xs py-[18px] text-[15.5px] max-md:text-[15px]" : "py-[22px] text-[18px] max-md:text-[16px]",
                )}
              >
                <span>{item.q}</span>
                {plus ? (
                  <span
                    aria-hidden
                    className={cn("inline-block flex-none text-[20px] text-brand max-md:text-[18px] transition-transform duration-250", isOpen && "rotate-45")}
                  >
                    +
                  </span>
                ) : (
                  <ChevronDownIcon size={18} className={cn("flex-none transition-transform duration-300", isOpen && "rotate-180")} />
                )}
              </button>
            </h3>
            <div
              id={`${id}-a${i}`}
              role="region"
              aria-labelledby={`${id}-q${i}`}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-400 ease-chy",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "font-body",
                    plus ? "mx-xs mt-0 mb-md text-[14px] leading-[1.65] text-muted" : "mt-0 mb-lg text-[16px] leading-[1.7] text-ink-2 max-md:text-[15px]",
                  )}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
