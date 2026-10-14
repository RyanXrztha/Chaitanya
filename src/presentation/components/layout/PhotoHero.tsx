import Image from "next/image";
import type { ReactNode } from "react";
import type { ImageRef } from "@/domain";
import { cn } from "@/presentation/lib/cn";
import { Parallax } from "../ui/Parallax";

interface PhotoHeroProps {
  image: ImageRef;
  /** Teal overlay strength: 0.45 (Contact, Reviews) or 0.55 (Membership). */
  overlay?: 0.45 | 0.55;
  children: ReactNode;
  contentClassName?: string;
}

/**
 * 450px photo band that opens downwards on load, with a teal wash and content that
 * drifts as the page scrolls (Contact, Reviews and Membership heroes). On phones it
 * shrinks to clamp(240px, 70vw, 420px) like the prototypes.
 */
export function PhotoHero({ image, overlay = 0.45, children, contentClassName }: PhotoHeroProps) {
  return (
    <section className="relative box-border flex h-[450px] flex-col items-start justify-center overflow-hidden px-gutter-wide py-[clamp(48px,6vw,64px)] animate-[chy-hero-expand-down_.9s_var(--ease-chy)_both] max-md:h-auto max-md:min-h-[clamp(240px,70vw,420px)]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className="object-cover"
      />
      <div aria-hidden className={cn("pointer-events-none absolute inset-0", overlay === 0.55 ? "bg-brand-800/55" : "bg-brand-800/45")} />
      <Parallax className={cn("relative z-[2]", contentClassName)}>{children}</Parallax>
    </section>
  );
}
