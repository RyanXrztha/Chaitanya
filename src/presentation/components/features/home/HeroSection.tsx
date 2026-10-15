import { routes } from "@/presentation/lib/routes";
import { CtaPair } from "../../ui/CtaPair";
import { Eyebrow } from "../../ui/Eyebrow";

// Literal class names so Tailwind can generate them (staggered hero entrance).
const FADE_UP = {
  eyebrow: "opacity-0 animate-[chy-hero-fade-up_.9s_ease_.1s_forwards]",
  title: "opacity-0 animate-[chy-hero-fade-up_.9s_ease_.3s_forwards]",
  text: "opacity-0 animate-[chy-hero-fade-up_.9s_ease_.5s_forwards]",
  cta: "opacity-0 animate-[chy-hero-fade-up_.9s_ease_.7s_forwards]",
};

/** Full-viewport video hero. The overlay header floats above it (see SiteHeader). */
export function HeroSection() {
  return (
    <section
      data-hero
      className="relative flex h-screen min-h-[560px] w-full flex-col overflow-hidden text-[#f7f1de] supports-[height:100dvh]:h-dvh"
    >
      <video
        className="absolute inset-0 size-full object-cover brightness-[0.55] saturate-[0.9]"
        src="/video/hero-spa.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,46,52,0.5)_0%,rgba(7,46,52,0.35)_40%,rgba(7,46,52,0.65)_100%)]">
        <div className="absolute inset-0 z-[2] flex items-end justify-center pb-[10vh]">
          <div className="relative z-[1] box-border flex max-w-[980px] flex-col items-center px-[clamp(24px,6vw,128px)] py-[clamp(32px,10vw,128px)] text-center">
            <Eyebrow tone="white" align="center" className={`mb-md ${FADE_UP.eyebrow}`}>
              Ayurveda · Lalitpur, Nepal
            </Eyebrow>
            <h1
              className={`m-0 text-[clamp(36px,5vw,62px)] leading-[1.15] tracking-[0.005em] max-md:text-[31px] ${FADE_UP.title}`}
            >
              <span className="block text-[clamp(32px,5vw,58px)] max-md:text-[27px]">
                CHAITANYA
                <br />
                HEALTH &amp; WELLNESS
              </span>
            </h1>
            <p
              className={`mt-sm mb-0 max-w-[46ch] font-body text-[clamp(15px,2.6vw,17px)] leading-[1.7] font-normal text-white/82 ${FADE_UP.text}`}
            >
              Experience personalized naturopathy and holistic wellness designed to restore balance, vitality, and inner
              peace.
            </p>
            <CtaPair label="Reserve Now" href={routes.services()} size={48} className={`mt-xl flex-wrap justify-center ${FADE_UP.cta}`} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-[28px] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-sm max-[768px]:hidden">
        <span className="font-body text-[11px] tracking-[0.18em] text-white/85 uppercase">Scroll</span>
        <a href="#about" aria-label="Scroll down" className="relative block h-10 w-[26px] text-white no-underline hover:text-white hover:opacity-85">
          <svg width="26" height="40" viewBox="0 0 26 40" fill="none" aria-hidden className="block">
            <rect x="1" y="1" width="24" height="38" rx="12" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.5" />
            <line x1="13" y1="1.5" x2="13" y2="13" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
          </svg>
          <span className="absolute top-[9px] left-1/2 -ml-[1.5px] h-2 w-[3px] bg-white animate-[chy-mouse-dot_1.8s_var(--ease-bar)_infinite]" />
        </a>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="animate-[chy-scroll-bounce_1.8s_ease-in-out_infinite]"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
