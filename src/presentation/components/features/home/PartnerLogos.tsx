import Image from "next/image";
import { cn } from "@/presentation/lib/cn";

const PARTNERS = [
  ["lotus", "Lotus Retreats"],
  ["evergreen", "Evergreen"],
  ["aurum", "Aurum"],
  ["himalaya", "Himalaya Travel"],
  ["saffron", "Saffron & Co"],
  ["stillwater", "Stillwater"],
  ["kinfolk", "Kinfolk Hotels"],
] as const;

/**
 * "Trusted by Leading Platforms & Events" — endless greyscale logo marquee.
 * "home": mint band (index.html) · "plain": white strip (About Us).
 */
export function PartnerLogos({ tone = "home" }: { tone?: "home" | "plain" }) {
  const loop = [...PARTNERS.map((p) => ({ p, copy: false })), ...PARTNERS.map((p) => ({ p, copy: true }))];
  return (
    <section
      aria-label="Partners"
      className={cn("overflow-hidden", tone === "home" ? "bg-[#F2F8F6] py-[clamp(64px,7vw,96px)]" : "bg-white py-2xl")}
    >
      <p className="mt-0 mb-xl text-center font-body text-[15px] text-muted">Trusted by Leading Platforms &amp; Events</p>
      <div className="w-full overflow-hidden">
        <ul className="m-0 flex w-max list-none items-center gap-3xl p-0 animate-[chy-marquee_32s_linear_infinite]">
          {loop.map(({ p: [file, name], copy }, i) => (
            <li key={`${file}-${i}`} aria-hidden={copy || undefined} className="relative h-10 w-[170px] flex-none">
              <Image
                src={`/images/logos/partners/${file}.svg`}
                alt={copy ? "" : name}
                fill
                sizes="170px"
                className="object-contain opacity-60 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
