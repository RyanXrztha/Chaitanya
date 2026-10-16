import Image from "next/image";
import { container } from "@/infrastructure/container";
import { StatsGrid } from "@/presentation/components/features/about/StatsGrid";
import { PartnerLogos } from "@/presentation/components/features/home/PartnerLogos";
import { PreFooterCta } from "@/presentation/components/layout/PreFooterCta";
import { CtaPair } from "@/presentation/components/ui/CtaPair";
import { Eyebrow } from "@/presentation/components/ui/Eyebrow";
import { Reveal } from "@/presentation/components/ui/Reveal";
import { ABOUT_VALUES, aboutStats } from "@/presentation/lib/about-content";
import { cn } from "@/presentation/lib/cn";
import { routes } from "@/presentation/lib/routes";

/** About Us (AboutUs.dc.html): intro, numbers, story, values, partners and the "Begin Your Journey" band. */
export async function AboutScreen() {
  const { count } = await container.getReviews.stats();

  return (
    <>
      <section className="grid min-h-[600px] grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-stretch gap-2xl bg-[#f7f1de] max-lg:min-h-[clamp(260px,62vw,440px)]">
        <div className="self-center py-3xl pl-gutter-wide max-[688px]:pr-lg">
          <Eyebrow className="mb-md">About Chaitanya</Eyebrow>
          <h1 className="mt-0 mb-md text-[clamp(30px,4vw,48px)] leading-[1.15] font-bold text-ink max-md:text-[26px]">
            Naturopathy care for a modern life
          </h1>
          <p className="m-0 font-body text-[16px] leading-[1.7] text-[#2F4A47] max-md:text-[15px]">
            Chaitanya Health &amp; Wellness Center is a naturopathy clinic in Bakhundole, Lalitpur, offering holistic solutions for the
            well-being of your body, mind, and soul — with customized wellness packages for arthritis, migraines, stress, insomnia,
            musculoskeletal and lifestyle disorders.
          </p>
        </div>
        <figure className="relative m-0 min-h-[260px] overflow-hidden min-[688px]:rounded-panel">
          <Image
            src="/images/slots/about-hero.webp"
            alt="Two guests in robes walking through the clinic"
            fill
            sizes="(max-width: 688px) 100vw, 50vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </figure>
      </section>

      <section aria-labelledby="numbers-title" className="bg-white px-gutter-wide py-section">
        <div className="mx-auto mb-2xl flex max-w-content flex-wrap items-end justify-between gap-lg">
          <div className="max-w-[64ch]">
            <Eyebrow className="mb-md">Chaitanya By The Numbers</Eyebrow>
            <h2 id="numbers-title" className="m-0 leading-[1.2] font-bold text-ink">
              Fifteen years of consistent, personalized care — measured in the people who trust us with it.
            </h2>
          </div>
          <CtaPair label="Book Appointment" href={routes.services()} className="flex-none" />
        </div>
        <StatsGrid stats={aboutStats(count)} />
      </section>

      <section
        aria-labelledby="story-title"
        className="grid min-h-[560px] grid-cols-[repeat(auto-fit,minmax(340px,1fr))] bg-surface max-lg:min-h-[clamp(260px,62vw,440px)]"
      >
        <figure className="relative m-0 min-h-[320px] overflow-hidden min-[680px]:rounded-panel">
          <Image
            src="/images/slots/our-story-photo.webp"
            alt="Guest wrapped in a towel looking out over the hills at sunrise"
            fill
            sizes="(max-width: 680px) 100vw, 50vw"
            className="object-cover"
          />
        </figure>
        <div className="flex flex-col justify-center px-[clamp(28px,6vw,96px)] py-3xl">
          <Eyebrow className="mb-md">Our Journey</Eyebrow>
          <h2 id="story-title" className="mt-0 mb-md font-bold text-ink">
            Our Story
          </h2>
          <p className="mt-0 mb-md max-w-[48ch] font-body text-[15.5px] leading-[1.75] text-ink-2 max-md:text-[15px]">
            Founded on the belief that healing begins with balance, Chaitanya brings together classical naturopathy, Ayurvedic protocols,
            and modern clinical care under one roof. Every plan starts with an honest assessment of your constitution — never a
            one-size-fits-all prescription.
          </p>
          <p className="m-0 max-w-[48ch] font-body text-[15.5px] leading-[1.75] text-ink-2 max-md:text-[15px]">
            Our therapists and physicians work as one team, so the therapy you receive in the treatment room is exactly what was
            prescribed for you — nothing more, nothing generic.
          </p>
        </div>
      </section>

      <section aria-labelledby="values-title" className="bg-white py-section">
        <div className="mx-auto mb-lg max-w-wide px-gutter-wide">
          <Eyebrow className="mb-md">Our Values</Eyebrow>
          <h2 id="values-title" className="m-0 font-medium text-ink">
            What We Stand For
          </h2>
        </div>
        <div className="mx-auto max-w-wide px-gutter-wide">
          {ABOUT_VALUES.map((v, i) => (
            <Reveal
              key={v.title}
              variant={i % 2 === 0 ? "slide-left" : "slide-right"}
              className={cn(
                "flex items-center gap-2xl py-xl max-tablet:flex-col max-tablet:items-stretch max-tablet:gap-lg max-tablet:py-[28px]",
                i % 2 === 1 && "flex-row-reverse",
              )}
            >
              <div className="min-w-0 flex-1 max-tablet:flex-none">
                <h3 className="mt-0 mb-md text-[clamp(24px,2.8vw,32px)] font-medium text-ink max-md:text-[22px]">{v.title}</h3>
                <p className="m-0 max-w-[46ch] font-body text-[15.5px] leading-[1.7] text-ink-3 max-md:text-[15px]">{v.desc}</p>
              </div>
              <div className="relative h-[60vh] w-full min-w-0 flex-1 overflow-hidden rounded-panel max-tablet:h-[clamp(240px,70vw,420px)] max-tablet:flex-none max-sm:rounded-card">
                <Image src={v.image.src} alt={v.image.alt} fill sizes="(max-width: 760px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <PartnerLogos tone="plain" />

      <PreFooterCta expandOnReveal className="pt-section" />
    </>
  );
}
