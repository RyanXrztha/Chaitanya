"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "../ui/Icon";

/** Footer "Wellness Letter" sign-up (no mailing backend yet — confirms locally). */
export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <div role="status" className="flex items-center gap-md">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-chip bg-brand">
          <CheckIcon size={18} strokeWidth={3} className="text-white" />
        </span>
        <span className="font-body text-[15px] text-white">Thank you — you’re on the list.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubscribed(true);
      }}
      className="flex min-w-0 items-center gap-md border-b border-white/35 pb-sm transition-colors focus-within:border-brand-400"
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        aria-label="Email address"
        className="h-12 min-w-0 flex-1 border-0 bg-transparent font-heading text-[20px] text-white outline-none placeholder:text-white/50 focus:shadow-none max-md:text-[18px]"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex size-12 shrink-0 items-center justify-center rounded-control border-0 bg-white text-brand-800 transition-[background-color,color,rotate] duration-250 hover:-rotate-45 hover:bg-brand hover:text-white"
      >
        <ArrowRightIcon size={18} strokeWidth={2.2} />
      </button>
    </form>
  );
}
