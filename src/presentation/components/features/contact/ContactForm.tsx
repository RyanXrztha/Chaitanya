"use client";

import { useState } from "react";
import { CONTACT_SUBJECTS } from "@/domain";
import { sendContactMessageAction, type ContactFormState } from "@/presentation/actions/contact";
import { useFormAction } from "@/presentation/hooks/useFormAction";
import { cn } from "@/presentation/lib/cn";
import { ArrowSolidIcon, ChevronDownIcon } from "../../ui/Icon";
import { Select } from "../../ui/Select";

const SUBJECT_OPTIONS = CONTACT_SUBJECTS.map((s) => ({ value: s, label: s }));

const labelClass = "mb-[5px] block font-body text-[12px] leading-[1.55] text-ink-dark/70";
const inputClass =
  "box-border block h-12 w-full rounded-control border border-line-2 bg-surface-2 px-[10px] py-[6px] font-body text-[16px] text-ink aria-invalid:border-danger";

interface ContactFormProps {
  defaultSubject?: string;
  defaultMessage?: string;
}

/** "Send us a message" — name, phone, optional email, subject and message. */
export function ContactForm({ defaultSubject = CONTACT_SUBJECTS[0], defaultMessage = "" }: ContactFormProps) {
  const { state, pending, onSubmit } = useFormAction<ContactFormState>(sendContactMessageAction, { status: "idle" });
  const [subject, setSubject] = useState(defaultSubject);
  const error = state.status === "error" ? state : null;
  const invalid = (field: string) => (error?.field === field ? true : undefined);

  if (state.status === "success") {
    return (
      <div role="status" className="bg-surface p-lg animate-[chy-success-in_.5s_var(--ease-chy)_both]">
        <p className="m-0 font-heading text-[18px] font-bold text-ink">Thank you, {state.name.split(" ")[0]}.</p>
        <p className="mt-sm mb-0 font-body text-[14.5px] text-muted">
          We’ve received your message and will get back to you shortly. Your reference is <strong className="text-ink">{state.reference}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form id="message" onSubmit={onSubmit} className="flex scroll-mt-28 flex-col gap-md">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-md">
        <div>
          <label htmlFor="ct-name" className={labelClass}>
            Full name
          </label>
          <input id="ct-name" name="name" type="text" autoComplete="name" required aria-invalid={invalid("name")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="ct-phone" className={labelClass}>
            Phone
          </label>
          <input id="ct-phone" name="phone" type="tel" autoComplete="tel" required aria-invalid={invalid("phone")} className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="ct-email" className={labelClass}>
          Email
        </label>
        <input id="ct-email" name="email" type="email" autoComplete="email" aria-invalid={invalid("email")} className={inputClass} />
      </div>
      <div>
        <label htmlFor="ct-subject" className={labelClass}>
          Subject
        </label>
        <div className="relative">
          <Select
            id="ct-subject"
            name="subject"
            label="Subject"
            value={subject}
            onValueChange={setSubject}
            options={SUBJECT_OPTIONS}
            className={cn(inputClass, "pr-9")}
          />
          <ChevronDownIcon size={14} strokeWidth={2.4} className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 text-ink" />
        </div>
      </div>
      <div>
        <label htmlFor="ct-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="ct-message"
          name="message"
          rows={4}
          required
          maxLength={2000}
          defaultValue={defaultMessage}
          aria-invalid={invalid("message")}
          className={cn(inputClass, "mb-1.5 h-[101px] min-h-[101px] resize-y leading-[1.4]")}
        />
      </div>

      {error && (
        <p role="alert" className="m-0 font-body text-[13.5px] text-danger">
          {error.message}
        </p>
      )}

      <div className="flex gap-sm">
        <button
          type="submit"
          disabled={pending}
          className="btn-sweep flex h-11 items-center rounded-control border-0 bg-brand px-[28px] text-[14px] text-white hover:bg-brand-600 disabled:opacity-70"
        >
          {pending ? "Sending…" : "Send Message"}
        </button>
        <button
          type="submit"
          disabled={pending}
          aria-label="Send Message"
          className="btn-sweep flex size-11 items-center justify-center rounded-control border-0 bg-brand text-white hover:bg-brand-600 disabled:opacity-70"
        >
          <ArrowSolidIcon size={18} />
        </button>
      </div>
    </form>
  );
}
