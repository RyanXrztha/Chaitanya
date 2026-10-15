"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { submitEnquiryAction, type EnquiryFormState } from "@/presentation/actions/enquiry";
import { useFormAction } from "@/presentation/hooks/useFormAction";
import { CLINIC } from "@/presentation/lib/clinic";
import { cn } from "@/presentation/lib/cn";
import { ArrowSolidIcon } from "../../ui/Icon";
import { Eyebrow } from "../../ui/Eyebrow";
import { ContactChip } from "../../ui/ContactChip";
import { Select } from "../../ui/Select";


const labelClass = "mb-sm block font-body text-[12px] font-bold tracking-[0.04em] text-ink uppercase";
const inputClass =
  "box-border h-12 w-full rounded-control border border-line-2 bg-white px-md font-body text-[14px] text-ink placeholder:text-subtle";

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "Have Questions or Want to Visit?" — photo with contact details beside an enquiry form. */
export function VisitEnquiry({ treatments }: { treatments: string[] }) {
  const { state, pending, onSubmit } = useFormAction<EnquiryFormState>(submitEnquiryAction, { status: "idle" });
  const [treatment, setTreatment] = useState("");
  const options = useMemo(
    () => [{ value: "", label: "Select one...", disabled: true }, ...treatments.map((t) => ({ value: t, label: t }))],
    [treatments],
  );
  const error = state.status === "error" ? state : null;

  return (
    <section
      id="contact"
      aria-labelledby="visit-title"
      className="bg-white pr-[clamp(24px,6vw,128px)] max-lg:p-0"
    >
      <div className="grid grid-cols-[1.5fr_1fr] items-stretch gap-[clamp(32px,5vw,64px)] max-lg:grid-cols-1 max-lg:gap-0">
        <div className="relative h-full min-h-[680px] overflow-hidden rounded-r-panel max-lg:min-h-[clamp(260px,62vw,440px)] max-lg:rounded-none">
          <Image
            src="/images/slots/contact-photo.webp"
            alt="Guest unwinding in a sunlit treatment room"
            fill
            sizes="(max-width: 960px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute right-lg bottom-xl left-[clamp(24px,6vw,128px)] flex flex-wrap gap-md">
            <ContactChip label="Call Us" value={CLINIC.phone.display} href={`tel:${CLINIC.phone.tel}`} icon="phone" />
            <ContactChip label="Email Us" value={CLINIC.email} href={`mailto:${CLINIC.email}`} icon="mail" />
          </div>
        </div>

        <div className="flex flex-col justify-center py-section max-lg:px-lg max-lg:py-2xl">
          <Eyebrow className="mb-md">Get In Touch</Eyebrow>
          <h2 id="visit-title" className="mt-0 mb-lg leading-[1.15] font-bold text-ink">
            Have Questions or Want to Visit?
          </h2>

          {state.status === "success" ? (
            <p role="status" className="m-0 font-body text-[15px] text-ink">
              Thank you, {state.firstName} — we’ll reach out shortly to confirm. Your reference is{" "}
              <strong>{state.reference}</strong>.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-md">
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-md">
                <div>
                  <label htmlFor="enq-first" className={labelClass}>
                    First Name *
                  </label>
                  <input id="enq-first" name="firstName" type="text" autoComplete="given-name" placeholder="Enter your first name" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="enq-last" className={labelClass}>
                    Last Name *
                  </label>
                  <input id="enq-last" name="lastName" type="text" autoComplete="family-name" placeholder="Enter your last name" required className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-md">
                <div>
                  <label htmlFor="enq-email" className={labelClass}>
                    Email Address *
                  </label>
                  <input id="enq-email" name="email" type="email" autoComplete="email" placeholder="Enter your email" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="enq-phone" className={labelClass}>
                    Phone *
                  </label>
                  <input id="enq-phone" name="phone" type="tel" autoComplete="tel" placeholder="+977" required className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="enq-treatment" className={labelClass}>
                  Select Treatment *
                </label>
                <div className="relative">
                  <Select
                    id="enq-treatment"
                    name="treatment"
                    label="Select treatment"
                    required
                    value={treatment}
                    onValueChange={setTreatment}
                    options={options}
                    className={cn(inputClass, "pr-10", !treatment && "text-subtle")}
                  />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="pointer-events-none absolute top-1/2 right-md -translate-y-1/2 text-ink">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-md">
                <div>
                  <label htmlFor="enq-location" className={labelClass}>
                    Location
                  </label>
                  <input id="enq-location" name="location" type="text" defaultValue={CLINIC.shortAddress} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="enq-date" className={labelClass}>
                    Preferred Date
                  </label>
                  <input id="enq-date" name="date" type="date" min={todayIso()} className={inputClass} suppressHydrationWarning />
                </div>
              </div>

              {error && (
                <p role="alert" className="m-0 font-body text-[13.5px] text-danger">
                  {error.message}
                </p>
              )}

              <div className="mt-sm flex gap-sm">
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-sweep flex h-[52px] flex-1 items-center justify-center rounded-control border-0 bg-brand px-[28px] font-body text-[15px] font-medium text-white hover:bg-brand-600 disabled:opacity-70"
                >
                  {pending ? "Sending…" : "Book Your Appointment"}
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  aria-label="Book Your Appointment"
                  className="btn-sweep flex size-[52px] flex-none items-center justify-center rounded-control border-0 bg-brand text-white hover:bg-brand-600 disabled:opacity-70"
                >
                  <ArrowSolidIcon />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
