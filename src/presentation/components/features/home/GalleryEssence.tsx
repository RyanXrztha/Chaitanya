import Image from "next/image";
import { Eyebrow } from "../../ui/Eyebrow";

const STATS = [
  { value: "126+", label: "Wellness Services" },
  { value: "92+", label: "Guest Reviews" },
  { value: "8 AM – 8 PM", label: "Daily Wellness Hours" },
];

const PHOTOS = [
  { src: "/images/slots/essence-1.webp", alt: "Guest relaxing during treatment" },
  { src: "/images/slots/essence-2.webp", alt: "Foot therapy with herbal petals" },
  { src: "/images/slots/essence-3.webp", alt: "Back massage close-up" },
];

/** "A Glimpse Into the Chaitanya Experience": intro, stats and a three-photo strip. */
export function GalleryEssence() {
  return (
    <section id="essence-gallery" aria-labelledby="gallery-title" className="bg-cream pt-section">
      <div className="mb-3xl px-gutter-wide">
        <div className="grid grid-cols-[0.8fr_2fr] items-start gap-[clamp(24px,5vw,96px)] max-lg:grid-cols-1">
          <Eyebrow>Our Gallery</Eyebrow>
          <div>
            <h2 id="gallery-title" className="mt-0 mb-md max-w-[34ch] leading-[1.15] font-bold text-black">
              A Glimpse Into the Chaitanya Experience
            </h2>
            <p className="m-0 max-w-[64ch] font-body text-[16px] leading-[1.75] text-[#5c5b55] max-md:text-[15px]">
              Explore the essence of Chaitanya through moments of care, relaxation, and rejuvenation. From soothing
              therapies and personalized wellness treatments to serene spaces designed for comfort, every detail is
              thoughtfully created to help you slow down, reconnect with yourself, and leave feeling refreshed and renewed.
            </p>
          </div>
        </div>
        <div className="mt-3xl grid grid-cols-[0.8fr_2fr] items-start gap-[clamp(24px,5vw,96px)] max-lg:grid-cols-1">
          <div />
          <dl className="m-0 flex flex-wrap gap-[clamp(32px,6vw,96px)]">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="font-body text-[14px] leading-[23.25px] text-muted">{s.label}</dt>
                <dd className="m-0 block font-heading text-[clamp(30px,4vw,44px)] font-semibold whitespace-nowrap text-black italic max-md:text-[26px]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="flex w-full items-stretch gap-0">
        {PHOTOS.map((p) => (
          <figure key={p.src} className="relative m-0 h-[clamp(280px,42vw,480px)] min-w-0 flex-[1_1_0] overflow-hidden rounded-card">
            <Image src={p.src} alt={p.alt} fill sizes="34vw" className="object-cover" />
          </figure>
        ))}
      </div>
    </section>
  );
}
