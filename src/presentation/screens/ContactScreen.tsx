import { formatAmount, isContactSubject } from "@/domain";
import { container } from "@/infrastructure/container";
import { ContactDetails } from "@/presentation/components/features/contact/ContactDetails";
import { ContactForm } from "@/presentation/components/features/contact/ContactForm";
import { LocationMap } from "@/presentation/components/features/contact/LocationMap";
import { PhotoHero } from "@/presentation/components/layout/PhotoHero";
import { Eyebrow } from "@/presentation/components/ui/Eyebrow";

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Contact (ContactUs.dc.html). `?subject=Membership&plan=gold` pre-fills the form from a membership plan. */
export async function ContactScreen({ searchParams }: { searchParams: Params }) {
  const subject = one(searchParams.subject);
  const tier = await container.getMembershipTiers.find(one(searchParams.plan));
  const defaultMessage = tier
    ? `Hello, I’d like to join the ${tier.name} membership (NPR ${formatAmount(tier.annualPrice)}/year). Please let me know the next steps.`
    : "";

  return (
    <>
      <PhotoHero image={{ src: "/images/photos/spa-woman-flower.jpg", alt: "Guest resting during a spa treatment" }}>
        <Eyebrow tone="dark" className="mb-md">
          Get in Touch
        </Eyebrow>
        <h1 className="m-0 text-[clamp(30px,4vw,46px)] font-bold text-white max-md:text-[26px]">We’d Love to Hear From You</h1>
      </PhotoHero>

      <section className="bg-white px-gutter-wide py-section">
        <div className="mx-auto grid max-w-content grid-cols-[1.1fr_1fr] items-start gap-3xl max-lg:grid-cols-1">
          <div>
            <Eyebrow className="mb-md">Write to Us</Eyebrow>
            <h2 className="mt-0 mb-md font-semibold text-ink">Send us a message</h2>
            <ContactForm
              defaultSubject={tier ? "Membership" : isContactSubject(subject) ? subject : undefined}
              defaultMessage={defaultMessage}
            />
          </div>
          <ContactDetails />
        </div>
      </section>

      <LocationMap />
    </>
  );
}
