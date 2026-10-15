import { routes } from "@/presentation/lib/routes";
import { CtaPair } from "../../ui/CtaPair";
import { Eyebrow } from "../../ui/Eyebrow";

/** Full-bleed video band inviting guests to visit. */
export function RoomTour() {
  return (
    <section
      id="room-tour"
      aria-labelledby="room-tour-title"
      className="relative flex min-h-[800px] items-center justify-center overflow-hidden text-white max-lg:min-h-[clamp(260px,62vw,440px)]"
    >
      <video
        className="absolute inset-0 size-full object-cover brightness-[0.55] saturate-[0.95]"
        src="/video/hero-spa.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,46,52,0.35),rgba(7,46,52,0.55))]" />
      <div className="relative z-[1] flex max-w-[980px] flex-col items-center px-[clamp(24px,5vw,64px)] py-4xl text-center">
        <Eyebrow tone="dark" align="center" className="mb-md">
          Room Tour
        </Eyebrow>
        <h2 id="room-tour-title" className="m-0 leading-[1.15] font-bold text-white">
          Step Into Our Luxury Spa Sanctuary
        </h2>
        <p className="mt-sm mb-0 max-w-[52ch] font-body text-[16px] leading-[1.65] text-white/88 max-md:text-[15px]">
          A glimpse inside our serene spa spaces, designed for comfort, relaxation, and rejuvenation.
        </p>
        <CtaPair label="Relax With Us Today" href={routes.services()} className="mt-xl flex-wrap justify-center [&>a:first-child]:text-[15px]" />
      </div>
    </section>
  );
}
