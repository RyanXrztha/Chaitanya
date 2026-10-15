import Image from "next/image";
import Link from "next/link";
import { routes } from "@/presentation/lib/routes";
import { CtaPair } from "../../ui/CtaPair";
import { Eyebrow } from "../../ui/Eyebrow";
import { Reveal } from "../../ui/Reveal";

export interface ShowcaseProduct {
  slug: string;
  name: string;
  price: string;
  image: { src: string; alt: string };
}

/** Home page product grid (3 → 2 → 1 columns) with zoom + underline-bar hover. */
export function ProductShowcase({ products }: { products: ShowcaseProduct[] }) {
  return (
    <section id="products" aria-labelledby="products-title" className="bg-white py-section text-ink">
      <div className="mx-auto box-border max-w-wide px-gutter-wide">
        <Eyebrow className="mb-md">Our Products</Eyebrow>
        <h2 id="products-title" className="mt-0 mb-xl leading-[1.2] font-bold text-ink">
          Personalized Wellness
          <br />
          &amp; Healing Services
        </h2>

        <div className="grid grid-cols-3 items-stretch gap-lg max-lg:grid-cols-2 max-md:grid-cols-1">
          {products.map((p, i) => (
            <Reveal key={p.slug} variant="scale" delay={(i % 3) * 80} className="group relative flex h-full flex-col">
              <Link href={routes.product(p.slug)} aria-label={p.name} className="absolute inset-0 z-[1]" />
              <figure className="relative m-0 mb-md overflow-hidden rounded-card after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-right after:scale-x-0 after:bg-brand after:transition-transform after:duration-700 after:ease-chy group-hover:after:origin-left group-hover:after:scale-x-100 [@media(hover:none)]:group-hover:after:scale-x-0">
                <div className="relative aspect-square w-full">
                  <Image
                    src={p.image.src}
                    alt={p.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    className="object-cover transition-[scale,filter] duration-[1200ms,800ms] ease-zoom group-hover:scale-105 group-hover:brightness-[1.03] [@media(hover:none)]:group-hover:scale-100"
                  />
                </div>
              </figure>
              <h3 className="mt-0 mb-sm font-body text-[13.5px] font-bold tracking-[0.03em] text-ink uppercase transition-colors duration-450 ease-chy group-hover:text-brand">
                {p.name}
              </h3>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-body text-[13px] text-muted">
                  NPR <strong className="text-ink">{p.price}</strong>
                </span>
                <Link
                  href={routes.product(p.slug)}
                  className="relative z-[2] flex items-center gap-sm p-0 font-body text-[12.5px] font-medium tracking-[0.03em] text-ink uppercase no-underline transition-colors duration-400 group-hover:text-brand"
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-500 ease-chy group-hover:bg-[length:100%_1px]">
                    Buy Now
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="transition-transform duration-600 ease-chy group-hover:rotate-90"
                  >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <CtaPair label="View All" href={routes.products()} className="mt-xl justify-center" />
      </div>
    </section>
  );
}
