"use client";

import { useState } from "react";
import { CLINIC } from "@/presentation/lib/clinic";
import { cn } from "@/presentation/lib/cn";
import { MapIcon, StreetViewIcon } from "../../ui/Icon";

type View = "map" | "street";

/** Full-width Google map of the clinic with a Map / Street View toggle. */
export function LocationMap() {
  const [view, setView] = useState<View>("map");
  const street = view === "street";
  const tab = (v: View) =>
    cn(
      "relative z-[1] flex h-10 items-center justify-center gap-sm border-0 bg-transparent px-md text-[13px] tracking-[0.01em] whitespace-nowrap transition-colors duration-400 ease-chy",
      view === v ? "text-white" : "text-ink-2",
    );

  return (
    <section aria-label="Clinic location" className="bg-white">
      <div className="relative h-[clamp(420px,62vh,600px)]">
        <iframe
          key={view}
          src={street ? CLINIC.map.streetView : CLINIC.map.embed}
          title={street ? "Street view outside Chaitanya Health & Wellness" : "Map showing Chaitanya Health & Wellness"}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block size-full border-0"
        />
        <div className="absolute top-[10px] right-[10px] z-[2] max-md:top-auto max-md:right-auto max-md:bottom-lg max-md:left-[10px]">
          <div role="group" aria-label="Map view" className="relative grid grid-cols-2 rounded-chip bg-white p-xs shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
            <span
              aria-hidden
              className={cn(
                "absolute top-xs bottom-xs left-xs w-[calc(50%-4px)] rounded-chip bg-brand transition-transform duration-500 ease-chy",
                street && "translate-x-full",
              )}
            />
            <button type="button" aria-pressed={!street} onClick={() => setView("map")} className={tab("map")}>
              <MapIcon />
              Map
            </button>
            <button type="button" aria-pressed={street} onClick={() => setView("street")} className={tab("street")}>
              <StreetViewIcon />
              Street View
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
