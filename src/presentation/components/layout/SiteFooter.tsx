import Image from "next/image";
import Link from "next/link";
import { CLINIC } from "@/presentation/lib/clinic";
import { PAGE_PATHS } from "@/presentation/lib/routes";
import { Eyebrow } from "../ui/Eyebrow";
import { ArrowUpRightIcon, FacebookIcon, InstagramIcon, LinkedInIcon, PhoneIcon, PinIcon } from "../ui/Icon";
import { BackToTopButton } from "./BackToTop";
import { NewsletterForm } from "./NewsletterForm";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: PAGE_PATHS.home },
      { label: "About Us", href: PAGE_PATHS.about },
      { label: "Services", href: PAGE_PATHS.services },
      { label: "Products", href: PAGE_PATHS.products },
      { label: "Reviews", href: PAGE_PATHS.reviews },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "Book Appointment", href: PAGE_PATHS.booking },
      { label: "Membership", href: PAGE_PATHS.membership },
      { label: "Contact", href: PAGE_PATHS.contact },
      { label: "FAQs", href: PAGE_PATHS.faqs },
      { label: "Careers", href: PAGE_PATHS.careers },
    ],
  },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/", Icon: LinkedInIcon },
];

const { phone: PHONE, mobile: MOBILE, email: EMAIL } = CLINIC;

const columnHeading = "mt-0 mb-lg font-body text-[12px] font-bold tracking-[0.18em] text-brand-400 uppercase";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-800 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-320px] left-1/2 h-[640px] w-[1100px] bg-[radial-gradient(closest-side,rgba(0,125,103,0.42),rgba(0,125,103,0))] animate-[chy-footer-drift_14s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:linear-gradient(180deg,#000_0%,transparent_70%)]"
      />

      <div className="relative mx-auto box-border max-w-site px-gutter pt-[clamp(64px,8vw,96px)]">
        {/* CTA band */}
        <div className="flex flex-wrap items-end justify-between gap-x-2xl gap-y-xl pb-section">
          <div className="min-w-0 flex-[1_1_520px]">
            <Eyebrow tone="dark" className="mb-md font-bold">
              Chaitanya Health &amp; Wellness
            </Eyebrow>
            <h2 className="m-0 max-w-[16ch] font-heading text-h2 max-md:max-w-none leading-[1.08] font-semibold tracking-[-0.005em] text-balance text-white">
              Restore your balance, <span className="text-brand-400">naturally.</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-sm">
            <Link
              href={PAGE_PATHS.booking}
              className="btn-sweep flex h-[52px] items-center gap-sm rounded-control bg-brand px-lg font-body text-[15px] font-medium whitespace-nowrap text-white no-underline transition-[background-color,translate] duration-250 hover:-translate-y-0.5 hover:bg-[#0a9a80]"
            >
              Book a Treatment
              <ArrowUpRightIcon />
            </Link>
            <a
              href={`tel:${PHONE.tel}`}
              className="btn-sweep flex h-[52px] items-center gap-sm rounded-control border border-white/28 px-lg font-body text-[15px] font-medium whitespace-nowrap text-white no-underline transition-[background-color,border-color] duration-250 hover:border-brand-400 hover:bg-white/8"
            >
              <PhoneIcon />
              Call the Clinic
            </a>
          </div>
        </div>

        <div className="h-px bg-[linear-gradient(90deg,rgba(79,187,165,0.6),rgba(255,255,255,0.12)_40%,rgba(255,255,255,0.12))]" />

        {/* Brand · link columns · contact */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-xl gap-y-2xl py-section sm:max-desktop:grid-cols-2">
          <div className="min-w-0">
            <Link href={PAGE_PATHS.home} aria-label="Chaitanya home" className="mb-lg inline-flex no-underline">
              <Image
                src="/images/logos/chaitanya-logo-white.svg"
                alt="Chaitanya Health & Wellness"
                width={326}
                height={203}
                className="block h-[clamp(72px,7vw,92px)] w-auto"
              />
            </Link>
            <p className="mt-0 mb-lg max-w-[30ch] font-body text-[15px] leading-[1.7] text-white/72">
              Naturopathy, therapeutic massage and holistic care in the heart of Lalitpur.
            </p>
            <div className="flex gap-sm">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-11 items-center justify-center rounded-chip border border-white/20 text-white transition-[background-color,border-color,translate] duration-250 hover:-translate-y-0.5 hover:border-brand hover:bg-brand"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="min-w-0">
              <h4 className={columnHeading}>{col.title}</h4>
              <div className="flex flex-col gap-md">
                {col.links.map((lk) => (
                  <Link
                    key={lk.label}
                    href={lk.href}
                    className="inline-flex items-center gap-sm self-start font-heading text-[18px] leading-[1.2] font-medium text-white/86 no-underline transition-[color,translate] duration-300 ease-chy hover:translate-x-1 hover:text-brand-400 max-md:text-[16px]"
                  >
                    {lk.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}

          <div className="min-w-0">
            <h4 className={columnHeading}>Get in Touch</h4>
            <a
              href={`tel:${PHONE.tel}`}
              className="mt-0 mb-xs block font-heading text-[24px] leading-[1.2] font-semibold text-white no-underline hover:text-brand-400 max-md:text-[20px]"
            >
              {PHONE.display}
            </a>
            <a
              href={`tel:${MOBILE.tel}`}
              className="mb-md block font-body text-[15px] text-white/72 no-underline hover:text-white"
            >
              {MOBILE.display}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="mb-md block font-body text-[15px] wrap-anywhere text-white/86 no-underline hover:text-brand-400"
            >
              {EMAIL}
            </a>
            <Link
              href={PAGE_PATHS.contact}
              className="flex items-start gap-sm font-body text-[15px] leading-[1.6] text-white/72 no-underline hover:text-white"
            >
              <PinIcon className="mt-1 shrink-0 text-brand-400" />
              <span>{CLINIC.address}</span>
            </Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-x-2xl gap-y-lg border-y border-white/12 py-xl">
          <div>
            <p className="mt-0 mb-xs font-heading text-[22px] font-semibold text-white max-md:text-[18px]">
              The Wellness Letter
            </p>
            <p className="m-0 font-body text-[15px] text-white/72">Seasonal rituals and member-only offers, once a month.</p>
          </div>
          <NewsletterForm />
        </div>

        <div
          aria-hidden
          className="mb-[-0.08em] bg-[linear-gradient(180deg,rgba(79,187,165,0.32)_0%,rgba(79,187,165,0.04)_85%)] bg-clip-text pt-xl text-center font-heading text-[clamp(72px,17.5vw,248px)] leading-[0.78] font-bold tracking-[-0.01em] whitespace-nowrap text-transparent select-none max-md:text-[18vw]"
        >
          Chaitanya
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/8 bg-[#062a2f]">
        <div className="mx-auto box-border flex max-w-site flex-wrap items-center justify-between gap-x-lg gap-y-md px-gutter py-md">
          <p className="m-0 font-body text-[13px] text-white/60">© {year} {CLINIC.legalName}</p>
          <div className="flex flex-wrap items-center gap-lg">
            <Link href={PAGE_PATHS.terms} className="font-body text-[13px] text-white/72 no-underline hover:text-brand-400">
              Terms
            </Link>
            <Link href={PAGE_PATHS.privacy} className="font-body text-[13px] text-white/72 no-underline hover:text-brand-400">
              Privacy
            </Link>
            <BackToTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
