import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/presentation/lib/cn";

export type ButtonVariant =
  /** Teal fill — the default CTA. */
  | "primary"
  /** White fill, teal text — CTAs on dark/photo backgrounds. */
  | "light"
  /** Hairline white border — secondary CTA on dark backgrounds. */
  | "ghost-dark"
  /** Dark-teal outline that fills on hover — "Load more". */
  | "outline"
  /** 1.5px teal outline — secondary CTA on white. */
  | "outline-brand"
  /** Quiet grey square — icon buttons (search, close). */
  | "quiet";

export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-600",
  light: "bg-white text-brand hover:bg-brand-100",
  "ghost-dark": "border border-white/28 text-white hover:border-brand-400 hover:bg-white/8",
  outline: "border border-ink-dark bg-white text-ink-dark hover:bg-ink-dark hover:text-white",
  "outline-brand": "border-[1.5px] border-brand text-brand hover:bg-brand-100",
  quiet: "bg-surface-3 text-ink hover:bg-brand-100 hover:text-brand",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-11 px-[22px] text-[14px] gap-sm",
  md: "h-12 px-xl text-[14.5px] gap-sm",
  lg: "h-[52px] px-lg text-[15px] gap-sm",
  icon: "size-11 justify-center",
  "icon-sm": "size-10 justify-center",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Fill-sweep hover effect (motion.js › data-chy-btn). */
  sweep?: boolean;
  className?: string;
  children: ReactNode;
}

export function buttonClasses({
  variant = "primary",
  size = "sm",
  sweep = true,
  className,
}: Omit<CommonProps, "children">): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-control font-body font-medium leading-none no-underline",
    "transition-[background-color,color,border-color,scale] duration-300 ease-chy active:scale-[0.98]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    "disabled:pointer-events-none disabled:opacity-50",
    sweep && "btn-sweep",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant, size, sweep, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, sweep, className })} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** A link styled as a button. Internal paths use next/link; tel:/mailto:/http(s) use <a>. */
export function ButtonLink({ variant, size, sweep, className, children, href, ...rest }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, sweep, className });
  if (/^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
