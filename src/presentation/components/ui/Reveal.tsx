"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal, type RevealVariant } from "@/presentation/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  /** Stagger delay in ms. */
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/** Fades and rises its content in when scrolled into view (respects reduced motion via CSS). */
export function Reveal({ children, variant = "up", delay = 0, as: Tag = "div", className, style }: RevealProps) {
  const { ref, shown } = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      data-reveal={shown ? "in" : "hide"}
      data-reveal-v={variant}
      className={className}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
