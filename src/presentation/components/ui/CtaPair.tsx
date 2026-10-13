import Link from "next/link";
import { cn } from "@/presentation/lib/cn";
import { ArrowSolidIcon } from "./Icon";

interface CtaPairProps {
  label: string;
  href: string;
  /** 44 (default) · 48 (hero) */
  size?: 44 | 48;
  className?: string;
}

/** The signature CTA: a teal label button followed by a square arrow button. */
export function CtaPair({ label, href, size = 44, className }: CtaPairProps) {
  const h = size === 48 ? "h-12" : "h-11";
  const base =
    "btn-sweep flex items-center rounded-control bg-brand font-body font-medium whitespace-nowrap text-white no-underline transition-[background-color,translate] duration-250 hover:bg-brand-600 hover:text-white";
  return (
    <div className={cn("flex gap-sm", className)}>
      <Link
        href={href}
        className={cn(base, h, size === 48 ? "px-[30px] text-[15px] tracking-[0.01em] hover:-translate-y-px" : "px-[28px] text-[14px]")}
      >
        {label}
      </Link>
      <Link
        href={href}
        aria-label={label}
        className={cn(base, "justify-center", size === 48 ? "size-12 hover:-translate-y-px" : "size-11")}
      >
        <ArrowSolidIcon />
      </Link>
    </div>
  );
}
