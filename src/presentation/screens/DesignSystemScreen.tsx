import { PreFooterCta } from "@/presentation/components/layout/PreFooterCta";
import { cn } from "@/presentation/lib/cn";
import { PrimitivesDemo } from "./PrimitivesDemo";

const brand = [
  ["100", "bg-brand-100"],
  ["200", "bg-brand-200"],
  ["300", "bg-brand-300"],
  ["400", "bg-brand-400"],
  ["500", "bg-brand-500"],
  ["600", "bg-brand-600"],
  ["700", "bg-brand-700"],
  ["800", "bg-brand-800"],
  ["900", "bg-brand-900"],
] as const;

const neutrals = [
  ["ink", "bg-ink"],
  ["ink-dark", "bg-ink-dark"],
  ["ink-2", "bg-ink-2"],
  ["ink-3", "bg-ink-3"],
  ["muted", "bg-muted"],
  ["subtle", "bg-subtle"],
  ["line", "bg-line"],
  ["line-2", "bg-line-2"],
  ["line-3", "bg-line-3"],
  ["surface", "bg-surface"],
  ["surface-2", "bg-surface-2"],
  ["cream", "bg-cream"],
] as const;

const spacing = [
  ["xs", "w-xs"],
  ["sm", "w-sm"],
  ["md", "w-md"],
  ["lg", "w-lg"],
  ["xl", "w-xl"],
  ["2xl", "w-2xl"],
  ["3xl", "w-3xl"],
  ["4xl", "w-4xl"],
  ["5xl", "w-5xl"],
] as const;

function Swatch({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex flex-col gap-sm">
      <div className={cn("h-16 rounded-card border border-line", className)} />
      <span className="text-[12px] text-muted">{label}</span>
    </div>
  );
}

/** Internal token & primitive reference (/design-system, not indexed). */
export function DesignSystemScreen() {
  return (
    <>
    <div className="mx-auto max-w-content px-gutter py-section-lg text-ink">
      <p className="eyebrow text-brand">Design System</p>
      <h1 className="mt-md text-display font-medium">Chaitanya Health &amp; Wellness</h1>
      <p className="mt-md max-w-[640px] text-body-lg text-ink-2">
        Tokens from the design handoff: brand teal, El Messiri + Lato, 8pt spacing, radii and
        motion. This page exists only to verify the Tailwind theme.
      </p>

      <section className="mt-3xl">
        <h2 className="text-h2">Colour</h2>
        <div className="mt-lg grid grid-cols-9 gap-md max-tablet:grid-cols-3">
          {brand.map(([l, c]) => (
            <Swatch key={l} label={`brand-${l}`} className={c} />
          ))}
        </div>
        <div className="mt-lg grid grid-cols-6 gap-md max-tablet:grid-cols-3">
          {neutrals.map(([l, c]) => (
            <Swatch key={l} label={l} className={c} />
          ))}
        </div>
      </section>

      <section className="mt-3xl">
        <h2 className="text-h2">Typography</h2>
        <div className="mt-lg flex flex-col gap-md">
          <p className="eyebrow text-brand">Pre-header on light</p>
          <div className="rounded-card bg-brand-800 p-lg">
            <p className="eyebrow text-brand-400">Pre-header on dark</p>
            <h3 className="mt-sm text-h2 text-white">Section heading on dark</h3>
          </div>
          <h3 className="font-heading text-[24px] font-bold">Card title — El Messiri 700</h3>
          <p className="text-body text-ink-2">
            Body copy — Lato 400, 15px / 1.6. Nestled in Bakhundol, Lalitpur, Chaitanya blends
            Ayurvedic tradition with modern therapy.
          </p>
          <p className="font-medium">Lato 500 (Medium) — buttons & nav</p>
          <p className="font-bold">Lato 700 (Bold)</p>
        </div>
      </section>

      <section className="mt-3xl">
        <h2 className="text-h2">Buttons & Inputs</h2>
        <div className="mt-lg flex flex-wrap items-center gap-md">
          <button className="btn-sweep h-11 rounded-control bg-brand px-lg text-[15px] text-white hover:bg-brand-700">
            Join Membership
          </button>
          <button className="btn-sweep h-11 rounded-control border border-line-3 bg-white px-lg text-[15px] text-ink">
            Explore Services
          </button>
          <a href="#" className="link-grow text-brand">
            Text link
          </a>
          <input
            placeholder="Your email"
            className="h-11 rounded-control border border-line-3 px-md text-[15px]"
          />
        </div>
      </section>

      <section className="mt-3xl">
        <h2 className="text-h2">Spacing & Radius</h2>
        <div className="mt-lg flex flex-col gap-sm">
          {spacing.map(([l, c]) => (
            <div key={l} className="flex items-center gap-md">
              <span className="w-10 text-[12px] text-muted">{l}</span>
              <div className={cn("h-3 rounded-full bg-brand-300", c)} />
            </div>
          ))}
        </div>
        <div className="mt-lg flex flex-wrap gap-md">
          {["rounded-chip", "rounded-control", "rounded-card", "rounded-panel", "rounded-tile", "rounded-full"].map(
            (r) => (
              <div key={r} className={cn("grid h-20 w-28 place-items-center bg-brand-100 text-[12px] text-brand-700", r)}>
                {r}
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mt-3xl">
        <h2 className="text-h2">Card hover</h2>
        <div className="group mt-lg w-[280px] cursor-pointer">
          <div className="zoom-frame aspect-[4/5] rounded-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/photos/spa-woman-flower.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <h3 className="mt-md text-[18px] font-semibold transition-colors duration-450 ease-chy group-hover:text-brand">
            Ayurvedic Signature Relaxation
          </h3>
        </div>
      </section>

      <section className="mt-3xl">
        <h2 className="text-h2">Primitives</h2>
        <PrimitivesDemo />
      </section>
    </div>
    <PreFooterCta descriptionWidth="52ch" eyebrow="Chaitanya Wellness Circle" title="Ready to Become a Member?" description="Join our wellness circle and enjoy members-only treatments, special pricing, and priority booking all year round." ctaLabel="Join Membership" ctaHref="/membership" />
    </>
  );
}
