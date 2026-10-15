import Image from "next/image";
import { routes } from "@/presentation/lib/routes";
import { CtaPair } from "../../ui/CtaPair";
import { Eyebrow } from "../../ui/Eyebrow";
import { Reveal } from "../../ui/Reveal";

const PILLARS = [
  {
    title: "Therapeutic Spa & Massage",
    text: "Relaxation and recovery through expert hands.",
    src: "/images/slots/about-photo-left.webp",
    alt: "Therapist giving a calming facial massage",
    from: "left" as const,
  },
  {
    title: "Holistic Naturopathy Care",
    text: "Natural treatments tailored to your well-being.",
    src: "/images/slots/about-photo-right.webp",
    alt: "Herbal oils prepared for naturopathy treatment",
    from: "right" as const,
  },
];

export function AboutIntro() {
  return (
    <>
      <div className="mx-auto max-w-content px-gutter-wide">
        <div className="h-0.5 bg-[color-mix(in_srgb,#072E34_35%,transparent)]" />
      </div>
      <section id="about" className="relative box-border bg-white px-gutter-wide py-section">
        <div className="mx-auto mb-3xl max-w-[720px] text-center animate-[chy-about-float_6s_ease-in-out_infinite]">
          <Eyebrow align="center" className="mb-md">
            About Chaitanya
          </Eyebrow>
          <h2 className="mt-0 mb-md font-bold text-ink">Nurturing Wellness, Naturally</h2>
          <p className="mt-0 mb-lg font-body text-[16px] leading-[1.7] text-ink-3 max-md:text-[15px]">
            We combine naturopathy, therapeutic massage, spa rituals, &amp; holistic <br />
            care to help you restore balance, relieve stress, &amp; feel your best.
          </p>
          <CtaPair label="More About Us" href={routes.page("about")} className="justify-center" />
        </div>

        <div className="flex w-full flex-wrap gap-x-lg gap-y-2xl">
          {PILLARS.map((p) => (
            <Reveal key={p.title} as="figure" variant={p.from} className="m-0 flex min-w-0 flex-[1_1_340px] flex-col">
              <figcaption className="mb-md text-center">
                <span className="mb-xs block font-heading text-[18px] font-bold text-ink max-md:text-[16px]">{p.title}</span>
                <span className="block font-body text-[13.5px] text-muted">{p.text}</span>
              </figcaption>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card min-[1300px]:rounded-panel">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 760px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
