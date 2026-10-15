import Image from "next/image";
import type { Rating } from "@/domain";
import { cn } from "@/presentation/lib/cn";
import { Eyebrow } from "../../ui/Eyebrow";

export interface TestimonialCard {
  id: string;
  author: string;
  role: string;
  rating: Rating;
  quote: string;
  avatar: { src: string; alt: string } | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mb-md flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < rating ? "#201e1d" : "#d7d6cf"} aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Client feedback: an endless marquee on desktop; a swipeable snap row on tablet
 * (two cards) and mobile (one full-width card).
 */
export function Testimonials({ reviews }: { reviews: TestimonialCard[] }) {
  // The list is rendered twice so the marquee can loop seamlessly; the copy is hidden from AT
  // and dropped entirely in the snap layouts.
  const loop = [...reviews.map((r) => ({ r, copy: false })), ...reviews.map((r) => ({ r, copy: true }))];

  return (
    <section id="client-feedback" aria-labelledby="feedback-title" className="box-border overflow-hidden bg-white py-section">
      <div className="mb-3xl px-gutter-wide text-center">
        <Eyebrow align="center" className="mb-md">
          Testimonials
        </Eyebrow>
        <h2 id="feedback-title" className="mt-0 mb-md font-bold text-ink">
          What Our Clients are Saying
        </h2>
        <p className="mx-auto my-0 max-w-[52ch] font-body text-[16px] leading-[1.6] text-muted max-md:text-[15px]">
          Hear directly from our guests about their experiences and the results we’ve delivered. Explore client feedback.
        </p>
      </div>

      <div className="w-full overflow-hidden max-xl:snap-x max-xl:snap-mandatory max-xl:overflow-x-auto max-xl:overscroll-x-contain max-xl:scrollbar-none">
        <div className="flex w-max gap-lg animate-[chy-marquee_45s_linear_infinite] max-xl:animate-none max-xl:px-xl max-md:gap-md max-md:px-lg">
          {loop.map(({ r, copy }, i) => (
            <article
              key={`${r.id}-${i}`}
              aria-hidden={copy || undefined}
              className={cn(
                "box-border flex-[0_0_min(360px,82vw)] rounded-card bg-surface p-xl text-left",
                "max-xl:flex-[0_0_calc((100vw-88px)/2)] max-xl:snap-start max-xl:scroll-ml-8",
                "max-md:flex-[0_0_calc(100vw-48px)] max-md:snap-center",
                copy && "max-xl:hidden",
              )}
            >
              <Stars rating={r.rating} />
              <p className="mt-0 mb-lg min-h-24 font-body text-[15px] leading-[1.65] text-[#3a3833]">{r.quote}</p>
              <div className="mb-lg h-px border-t border-dashed border-[#d6d5cf]" />
              <div className="flex items-center gap-md">
                {r.avatar && (
                  <Image
                    src={r.avatar.src}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 flex-none rounded-card object-cover"
                  />
                )}
                <div>
                  <p className="m-0 font-heading text-[15px] font-bold text-ink">{r.author}</p>
                  <p className="mt-0.5 mb-0 font-body text-[13px] text-[#8a8a80]">{r.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
