"use client";

import { formatRs } from "@/domain";

interface PriceRangeProps {
  min: number;
  max: number;
  /** Upper bound of the slider; values at the bound read "Rs N+". */
  limit: number;
  step: number;
  /** Smallest gap between the two thumbs. */
  minGap: number;
  onChange: (min: number, max: number) => void;
}

/** Two-thumb price slider with Min / Max read-outs. */
export function PriceRange({ min, max, limit, step, minGap, onChange }: PriceRangeProps) {
  return (
    <>
      <div className="range-dual relative mx-sm h-8 max-md:mx-3">
        <span className="absolute inset-x-0 top-[14px] block h-1 bg-[#e6e3d8]" />
        <span
          className="absolute top-[14px] block h-1 bg-brand"
          style={{ left: `${(min / limit) * 100}%`, right: `${100 - (max / limit) * 100}%` }}
        />
        <input
          type="range"
          min={0}
          max={limit}
          step={step}
          value={min}
          aria-label="Minimum price"
          onChange={(e) => onChange(Math.min(Number(e.target.value), max - minGap), max)}
          className="absolute top-0 -right-2 -left-2 m-0 h-8 w-[calc(100%+16px)]"
        />
        <input
          type="range"
          min={0}
          max={limit}
          step={step}
          value={max}
          aria-label="Maximum price"
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min + minGap))}
          className="absolute top-0 -right-2 -left-2 m-0 h-8 w-[calc(100%+16px)]"
        />
      </div>
      <div className="mt-md flex items-baseline justify-between gap-sm font-body">
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] tracking-[0.08em] text-subtle uppercase">Min</span>
          <span className="text-[14px] font-bold whitespace-nowrap text-ink-dark">{formatRs(min)}</span>
        </span>
        <span className="flex min-w-0 flex-col items-end gap-0.5">
          <span className="text-[11px] tracking-[0.08em] text-subtle uppercase">Max</span>
          <span className="text-[14px] font-bold whitespace-nowrap text-ink-dark">
            {formatRs(max)}
            {max >= limit ? "+" : ""}
          </span>
        </span>
      </div>
    </>
  );
}
