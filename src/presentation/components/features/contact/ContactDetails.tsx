import type { ReactNode } from "react";
import { CLINIC } from "@/presentation/lib/clinic";
import { ClockIcon, PhoneIcon, PinIcon } from "../../ui/Icon";

function Item({ icon, title, children, last }: { icon: ReactNode; title: string; children: ReactNode; last?: boolean }) {
  return (
    <div className={last ? "flex flex-col gap-md py-lg" : "flex flex-col gap-md border-b border-[#e6e6de] py-lg"}>
      <span className="text-brand">{icon}</span>
      <div>
        <h3 className="mt-0 mb-[2px] font-heading text-[15px] leading-[1.55] font-semibold tracking-normal text-ink">{title}</h3>
        {children}
      </div>
    </div>
  );
}

const text = "m-0 font-body text-[13.5px] leading-[1.55] text-muted";
const link = "text-muted no-underline hover:text-brand";

/** Phone, address and opening hours beside the contact form. */
export function ContactDetails() {
  return (
    <div className="mb-lg flex flex-col">
      <Item icon={<PhoneIcon size={22} strokeWidth={2} />} title="Call or WhatsApp">
        <p className={text}>
          <a href={`tel:${CLINIC.phone.tel}`} className={link}>
            {CLINIC.phone.display}
          </a>{" "}
          · Clinic
          <br />
          <a href={`tel:${CLINIC.mobile.tel}`} className={link}>
            {CLINIC.mobile.display}
          </a>{" "}
          · Mobile &amp; WhatsApp
        </p>
      </Item>
      <Item icon={<PinIcon size={22} strokeWidth={2} />} title="Visit Us">
        <p className={text}>
          {CLINIC.address}
          <br />
          Map code: {CLINIC.mapCode}
        </p>
        <a href={CLINIC.map.directions} target="_blank" rel="noopener noreferrer" className="font-body text-[13px] font-semibold no-underline">
          Get Directions →
        </a>
      </Item>
      <Item icon={<ClockIcon size={22} />} title="Opening Hours" last>
        <p className={text}>
          Clinic Hour: {CLINIC.openingHours}
          <br />
          {CLINIC.bookingNotice}
        </p>
      </Item>
    </div>
  );
}
