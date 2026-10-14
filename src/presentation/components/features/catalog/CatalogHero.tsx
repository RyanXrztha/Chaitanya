import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

/** Centred breadcrumb + large page title used by the Services and Products lists. */
export function CatalogHero({ crumbs, title }: { crumbs: Crumb[]; title: string }) {
  return (
    <section className="flex flex-col items-center bg-white px-[clamp(24px,6vw,64px)] pt-[clamp(48px,6vw,80px)] pb-[clamp(24px,4vw,48px)] text-center">
      <nav
        aria-label="Breadcrumb"
        className="mb-md flex flex-wrap items-center justify-center gap-sm font-body text-[14px] text-muted"
      >
        {crumbs.map((c, i) => (
          <Fragment key={`${c.label}-${i}`}>
            {i > 0 && <span aria-hidden>/</span>}
            {c.href ? (
              <Link href={c.href} className="text-inherit no-underline hover:text-brand">
                {c.label}
              </Link>
            ) : (
              <span className="font-semibold text-ink-dark" aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                {c.label}
              </span>
            )}
          </Fragment>
        ))}
      </nav>
      <h1 className="m-0 font-heading text-[clamp(36px,5vw,64px)] leading-[1.1] font-medium text-balance text-ink max-md:text-[31px]">
        {title}
      </h1>
    </section>
  );
}
